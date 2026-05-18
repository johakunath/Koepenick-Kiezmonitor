import { google } from "googleapis";
import { hashId, inferTags, inferLocation } from "../lib/shared.mjs";

export async function fetchTagespiegelLeuteEntries() {
  const { GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN } = process.env;
  if (!GMAIL_CLIENT_ID || !GMAIL_CLIENT_SECRET || !GMAIL_REFRESH_TOKEN) {
    throw new Error("Gmail-Zugangsdaten fehlen (GMAIL_CLIENT_ID / GMAIL_CLIENT_SECRET / GMAIL_REFRESH_TOKEN)");
  }

  const auth = new google.auth.OAuth2(GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET);
  auth.setCredentials({ refresh_token: GMAIL_REFRESH_TOKEN });
  const gmail = google.gmail({ version: "v1", auth });

  const listRes = await gmail.users.messages.list({
    userId: "me",
    q: "from:info@leute.tagesspiegel.de newer_than:8d",
    maxResults: 5,
  });

  const messages = listRes.data.messages ?? [];
  if (messages.length === 0) return [];

  const entries = [];

  for (const { id } of messages) {
    try {
      const msgRes = await gmail.users.messages.get({ userId: "me", id, format: "full" });
      const msg = msgRes.data;
      const headers = msg.payload?.headers ?? [];
      const subject = headers.find((h) => h.name === "Subject")?.value ?? "";
      const dateHeader = headers.find((h) => h.name === "Date")?.value;

      // Welcome and subscription confirmation emails contain no newsletter content
      if (/willkommen|best.tigung|abonnement|anmeldung/i.test(subject)) {
        console.log(`Tagesspiegel Leute: skipping non-content email — ${subject}`);
        continue;
      }

      const publishedAt = dateHeader ? new Date(dateHeader).toISOString() : new Date().toISOString();
      const htmlBody = extractHtmlBody(msg.payload);
      if (!htmlBody) continue;

      const browserUrl = extractBrowserUrl(htmlBody);
      let newsletterHtml = htmlBody;
      if (browserUrl) {
        try {
          const resp = await fetch(browserUrl, { signal: AbortSignal.timeout(10000) });
          if (resp.ok) {
            newsletterHtml = await resp.text();
            console.log(`Tagesspiegel Leute: fetched browser URL for message ${id}`);
          }
        } catch {
          console.log(`Tagesspiegel Leute: browser URL fetch failed for ${id}, using email HTML`);
        }
      }

      const sections = parseNewsletterHtml(newsletterHtml);
      console.log(`Tagesspiegel Leute: message ${id} — ${sections.length} sections parsed`);

      for (const [idx, section] of sections.entries()) {
        entries.push({
          id: hashId(["tagesspiegel-leute-tk", id, String(idx)]),
          source_id: "tagesspiegel-leute-tk",
          source: "Tagesspiegel Leute TK",
          source_url: browserUrl ?? "https://leute.tagesspiegel.de/treptow-koepenick/",
          title: section.title,
          published_at: publishedAt,
          ingested_at: new Date().toISOString(),
          raw_excerpt: section.excerpt,
          ai_summary: section.excerpt,
          tags: inferTags(`${section.title} ${section.excerpt}`, "tagesspiegel-leute-tk"),
          location: inferLocation(`${section.title} ${section.excerpt}`),
          location_relevant: true,
          local_relevance_score: 0.65,
          political_relevance_score: 0.3,
          election_relevant: /wahl|kandidat|wahlkreis/i.test(`${section.title} ${section.excerpt}`),
          ai_reasoning: "Eintrag aus Tagesspiegel Leute Treptow-Köpenick Newsletter.",
        });
      }
    } catch (err) {
      console.log(`Tagesspiegel Leute: message ${id} → ${err.message}`);
    }
  }

  return entries;
}

function extractHtmlBody(payload) {
  if (!payload) return null;
  if (payload.mimeType === "text/html" && payload.body?.data) {
    return Buffer.from(payload.body.data, "base64url").toString("utf8");
  }
  for (const part of payload.parts ?? []) {
    const result = extractHtmlBody(part);
    if (result) return result;
  }
  return null;
}

function extractBrowserUrl(html) {
  const m = html.match(/https:\/\/nl\.tagesspiegel\.de\/hplt\.html\?[^"'\s<>\\]+/);
  return m ? m[0] : null;
}

function stripHtml(s) {
  return s.replace(/<[^>]+>/g, " ").replace(/&[a-z#0-9]+;/gi, " ").replace(/\s+/g, " ").trim();
}

export function parseNewsletterHtml(html) {
  const sections = [];

  // Strategy 1: <h2>/<h3> as section headline, first <p> below as excerpt
  const h2Pattern = /<h[23][^>]*>([\s\S]*?)<\/h[23]>([\s\S]*?)(?=<h[23]|$)/gi;
  let m;
  while ((m = h2Pattern.exec(html)) !== null) {
    const title = stripHtml(m[1]).slice(0, 120);
    if (title.length < 5) continue;
    const pMatch = m[2].match(/<p[^>]*>([\s\S]*?)<\/p>/i);
    const excerpt = pMatch ? stripHtml(pMatch[1]).slice(0, 200) : "";
    if (excerpt.length < 20) continue;
    sections.push({ title, excerpt });
  }
  if (sections.length > 0) return sections;

  // Strategy 2: <strong> as title — typical for older Tagesspiegel newsletter format
  const strongPattern = /<strong[^>]*>([\s\S]*?)<\/strong>([\s\S]*?)(?=<strong|$)/gi;
  while ((m = strongPattern.exec(html)) !== null) {
    const title = stripHtml(m[1]).slice(0, 120);
    if (title.length < 10 || title.length > 100) continue;
    // Skip nav/footer strings
    if (/impressum|datenschutz|abmelden|browser lesen|tagesspiegel plus/i.test(title)) continue;
    const pMatch = m[2].match(/<p[^>]*>([\s\S]*?)<\/p>/i);
    const excerpt = pMatch ? stripHtml(pMatch[1]).slice(0, 200) : stripHtml(m[2].slice(0, 300));
    if (excerpt.length < 20) continue;
    sections.push({ title, excerpt });
  }

  return sections;
}
