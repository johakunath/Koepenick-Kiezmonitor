"use client";

import { useState } from "react";

export default function TriggerButton() {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const trigger = async () => {
    setState("loading");
    try {
      const res = await fetch("/api/trigger-ingest", { method: "POST" });
      if (res.ok) {
        setState("done");
      } else {
        const body = await res.json().catch(() => ({}));
        setErrorMsg(body.error ?? `HTTP ${res.status}`);
        setState("error");
      }
    } catch {
      setErrorMsg("Netzwerkfehler");
      setState("error");
    }
  };

  if (state === "done") {
    return (
      <p className="text-sm" style={{ color: "var(--forest)" }}>
        Gestartet — läuft ca. 2 Min. auf GitHub Actions.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <button
        onClick={trigger}
        disabled={state === "loading"}
        className="px-4 py-2 rounded text-sm font-medium transition-opacity disabled:opacity-50"
        style={{ background: "var(--water-mid)", color: "#fff" }}
      >
        {state === "loading" ? "Wird gestartet…" : "Ingest jetzt starten"}
      </button>
      {state === "error" && (
        <p className="text-xs" style={{ color: "var(--brick)" }}>
          Fehler: {errorMsg}
        </p>
      )}
    </div>
  );
}
