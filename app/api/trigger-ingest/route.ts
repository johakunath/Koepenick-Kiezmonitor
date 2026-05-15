export async function POST() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return Response.json({ error: "GITHUB_TOKEN nicht gesetzt" }, { status: 500 });
  }

  const res = await fetch(
    "https://api.github.com/repos/johakunath/Koepenick-Kiezradar/actions/workflows/daily-ingest.yml/dispatches",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      body: JSON.stringify({ ref: "main" }),
    }
  );

  if (res.status === 204) {
    return Response.json({ ok: true });
  }

  const body = await res.text().catch(() => "");
  return Response.json({ error: `GitHub: ${res.status}`, detail: body }, { status: res.status });
}
