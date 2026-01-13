import { useEffect, useState } from "react";
import AIAvatar from "./three/AIAvatar";
import AICanvas from "./three/AICanvas";
import "./App.css";

function App() {
  const [aiState, setAiState] = useState("idle");
  // idle | thinking | responding

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initParticles();
  }, []);

  const sendMessage = async () => {
  if (!input.trim() || loading) return;

  const userMsg = { sender: "user", text: input };
  setMessages((prev) => [...prev, userMsg]);
  setInput("");
  setLoading(true);
  setAiState("thinking"); // 🔥

  try {
    const res = await fetch(import.meta.env.VITE_API_URL + "/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMsg.text }),
    });

    const data = await res.json();

    setAiState("responding"); // 🔥
    setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);

    // Return to idle after response animation
    setTimeout(() => setAiState("idle"), 1200);
  } catch {
    setMessages((prev) => [
      ...prev,
      { sender: "bot", text: "⚠️ Something went wrong." },
    ]);
    setAiState("idle");
  } finally {
    setLoading(false);
  }
};
  return (
    <>
      {/* 🔮 PARTICLES BACKGROUND */}
      <canvas id="particles"></canvas>

      {/* 🧠 FIXED 3D AI CANVAS */}
      <AICanvas>
        <AIAvatar state={aiState} />
      </AICanvas>

      {/* 🌌 HERO SECTION (PAGE 1) */}
      <section className="hero">
        <h1 className="title">🤖 ALPHA&apos;s Chatbot</h1>
        <p className="subtitle">AI-powered conversational assistant</p>
        <span className="scroll-hint">Scroll ↓</span>
      </section>

      {/* 💬 CHAT SECTION (PAGE 2) */}
      <section className="chat-section">
        <div className="chat-container">
          <div className="chat-box">
            {messages.map((m, i) => (
              <div key={i} className={`msg ${m.sender}`}>
                {m.text}
              </div>
            ))}
            {loading && (
              <div className="msg bot typing">AI is thinking…</div>
            )}
          </div>

          <div className="input-box">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask something intelligent..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      </section>
    </>
  );
}

/* 🔥 PARTICLES BACKGROUND (Lightweight) */
function initParticles() {
  const canvas = document.getElementById("particles");
  const ctx = canvas.getContext("2d");
  const scrollRatio = Math.min(window.scrollY / window.innerHeight, 1);

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = Array.from({ length: 70 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2 + 1,
    dx: (Math.random() - 0.5) * 0.6,
    dy: (Math.random() - 0.5) * 0.6,
  }));

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
      p.x += p.dx;
      p.y += p.dy;

      if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
     ctx.fillStyle = `rgba(${255}, ${40 - scrollRatio * 20}, ${40 - scrollRatio * 20}, 0.75)`;
      ctx.fill();
      ctx.shadowBlur = 10;
ctx.shadowColor = "rgba(255, 40, 40, 0.8)";

    });

    requestAnimationFrame(animate);
  }

  animate();
}

export default App;
