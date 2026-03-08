import { createSignal } from "solid-js";
import ResultBox from "../components/ResultBox";

export default function TextCheck() {
  const [text, setText] = createSignal("");
  const [loading, setLoading] = createSignal(false);
  const [result, setResult] = createSignal(null);

  const checkText = async () => {
    setLoading(true);
    setResult(null); // reset hasil sebelumnya

    const res = await fetch("http://127.0.0.1:5000/check-text", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: text() }),
    });

    const data = await res.json();

    setTimeout(() => {
      setResult({
        ...data,
        type: "text",
      });
      setLoading(false);
    }, 1200); // delay biar terasa "AI mikir"
  };

  return (
    <div class="page">
      <h1 class="title">📝 Cek Plagiarisme Teks</h1>
      <p class="subtitle">Masukkan teks tugas siswa</p>

      <textarea
        class="text-input"
        rows="8"
        placeholder="Tempel teks tugas di sini..."
        onInput={(e) => setText(e.target.value)}
      />

      <button
        class="main-btn"
        disabled={!text().trim() || loading()}
        onClick={checkText}
      >
        {loading() ? "AI Menganalisis..." : "Analisis"}
      </button>

      {(loading() || result()) && (
        <ResultBox loading={loading()} result={result()} />
      )}
    </div>
  );
}
