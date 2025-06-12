import { useEffect, useState } from "react";
import init, { damage_after_reduction } from "../../engine/pkg/engine";

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    init().then(() => setReady(true));
  }, []);

  return (
    <main style={{ padding: "1rem", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>HorizonForge MVP</h1>
      {ready ? (
        <p>Post-DR vs 10 000 armour ⇒ {damage_after_reduction(10_000)}</p>
      ) : (
        <p>loading WASM …</p>
      )}
    </main>
  );
}
