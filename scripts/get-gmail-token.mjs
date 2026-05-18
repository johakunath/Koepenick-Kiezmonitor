/**
 * Einmaliges Hilfsskript: OAuth2 Refresh-Token für die Gmail API holen.
 *
 * Voraussetzung: Google Cloud Projekt mit aktivierter Gmail API + OAuth2-Zugangsdaten
 * (Typ: Desktop-App). Client-ID und Client-Secret aus der Google Console.
 *
 * Ausführen:
 *   GMAIL_CLIENT_ID=xxx GMAIL_CLIENT_SECRET=yyy node scripts/get-gmail-token.mjs
 *
 * Dann den Link im Browser öffnen, einloggen, den Code zurück ins Terminal kopieren.
 * Der Refresh-Token wird ausgegeben → als GitHub Secret GMAIL_REFRESH_TOKEN speichern.
 */

import { createInterface } from "node:readline";
import { google } from "googleapis";

const CLIENT_ID = process.env.GMAIL_CLIENT_ID;
const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error("Bitte GMAIL_CLIENT_ID und GMAIL_CLIENT_SECRET als Env-Vars setzen.");
  process.exit(1);
}

const auth = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, "urn:ietf:wg:oauth:2.0:oob");

const authUrl = auth.generateAuthUrl({
  access_type: "offline",
  scope: ["https://www.googleapis.com/auth/gmail.readonly"],
  prompt: "consent",
});

console.log("\n1. Diesen Link im Browser öffnen:\n");
console.log("   " + authUrl);
console.log("\n2. Mit dem Google-Konto einloggen, das den Newsletter empfängt.");
console.log("3. Den angezeigten Code hier einfügen.\n");

const rl = createInterface({ input: process.stdin, output: process.stdout });
rl.question("Auth-Code: ", async (code) => {
  rl.close();
  try {
    const { tokens } = await auth.getToken(code.trim());
    console.log("\nErfolgreich! Refresh-Token:\n");
    console.log(tokens.refresh_token);
    console.log("\n→ Als GitHub Secret GMAIL_REFRESH_TOKEN speichern.");
  } catch (err) {
    console.error("Fehler beim Token-Abruf:", err.message);
    process.exit(1);
  }
});
