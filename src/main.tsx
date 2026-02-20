import { createRoot } from "react-dom/client";

function App() {
  return (
    <div
      style={{
        background: "#111827",
        color: "white",
        padding: "16px",
        borderRadius: "12px",
        fontFamily: "system-ui"
      }}
    >
      🔥 Trustview React Widget MVP funcionando
    </div>
  );
}

function mount() {
  const container = document.getElementById("tv-widget-root");
  if (!container) return;

  const root = createRoot(container);
  root.render(<App />);
}

(window as any).Trustview = {
  mount
};