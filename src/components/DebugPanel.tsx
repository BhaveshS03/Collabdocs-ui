import React, { useEffect, useMemo, useState } from "react";

type YProviderLike = {
  awareness: {
    getStates: () => Map<number, any>;
    on: (ev: string, cb: (...args: any[]) => void) => void;
    off: (ev: string, cb: (...args: any[]) => void) => void;
    setLocalStateField?: (field: string, value: any) => void;
  };
  wsconnected?: boolean;
  on?: (ev: string, cb: (...args: any[]) => void) => void;
  off?: (ev: string, cb: (...args: any[]) => void) => void;
};

export default function DebugPanel({
  provider,
  pollInterval = 1000,
  showRaw = false,
}: {
  provider?: YProviderLike | null;
  pollInterval?: number;
  showRaw?: boolean;
}) {
  // fallback to window.provider when prop not passed (helps debugging in prod)
  const prov = useMemo(() => provider ?? (typeof window !== "undefined" ? (window as any).provider : null), [provider]);

  const [connectedCount, setConnectedCount] = useState<number | null>(null);
  const [clientIds, setClientIds] = useState<number[]>([]);
  const [lastAwarenessUpdate, setLastAwarenessUpdate] = useState<number | null>(null);
  const [wsStatus, setWsStatus] = useState<string>("unknown");

  useEffect(() => {
    if (!prov) {
      setConnectedCount(null);
      setClientIds([]);
      setWsStatus("no-provider");
      return;
    }

    const readAwareness = () => {
      try {
        const states = prov.awareness.getStates();
        const ids: number[] = [];
        states.forEach((_, id) => ids.push(id));
        setConnectedCount(ids.length);
        setClientIds(ids);
        setLastAwarenessUpdate(Date.now());
      } catch (e) {
        console.error("Failed to read awareness", e);
      }
    };

    // initial read
    readAwareness();

    // subscribe to awareness changes (yjs awareness emits 'update' or 'change' depending on version)
    const awarenessHandler = () => readAwareness();
    prov.awareness.on("update", awarenessHandler);
    prov.awareness.on("change", awarenessHandler);

    // listen to provider status changes if available
    const statusHandler = (event: any) => {
      // some providers emit { status: 'connected' } or set boolean wsconnected
      if (event && event.status) setWsStatus(String(event.status));
      else if (typeof (prov as any).wsconnected === "boolean") setWsStatus((prov as any).wsconnected ? "connected" : "disconnected");
      else setWsStatus("unknown");
    };
    prov.on?.("status", statusHandler);

    // polling fallback (helps when provider doesn't emit events reliably)
    const poll = setInterval(readAwareness, pollInterval);

    return () => {
      prov.awareness.off("update", awarenessHandler);
      prov.awareness.off("change", awarenessHandler);
      prov.off?.("status", statusHandler);
      clearInterval(poll);
    };
  }, [prov, pollInterval]);

  return (
    <div style={{ fontFamily: "Inter, Roboto, sans-serif", fontSize: 13 }}>
      <div style={{ padding: 8, borderRadius: 8, background: "#0f172a", color: "#e6eef8" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
          <strong>Collab Debug Panel</strong>
          <div style={{ fontSize: 11, opacity: 0.8 }}>{new Date().toLocaleTimeString()}</div>
        </div>

        <div style={{ marginTop: 8 }}>
          <div>WebSocket status: <code>{wsStatus}</code></div>
          <div>Connected users count: <code>{connectedCount ?? "—"}</code></div>
          <div>Last awareness update: <code>{lastAwarenessUpdate ? new Date(lastAwarenessUpdate).toLocaleTimeString() : "—"}</code></div>
          <div style={{ marginTop: 6 }}>Client IDs: </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6 }}>
            {clientIds.length === 0 ? (
              <span style={{ opacity: 0.6 }}>none</span>
            ) : (
              clientIds.map((id) => (
                <span key={id} style={{ padding: "3px 6px", background: "#0b1220", borderRadius: 6, border: "1px solid #172036" }}>
                  {id}
                </span>
              ))
            )}
          </div>

          {showRaw && (
            <details style={{ marginTop: 8 }}>
              <summary>Raw awareness map</summary>
              <pre style={{ whiteSpace: "pre-wrap", marginTop: 8 }}>{JSON.stringify(Array.from(prov?.awareness.getStates?.() ?? []), null, 2)}</pre>
            </details>
          )}
        </div>
      </div>
    </div>
  );
}