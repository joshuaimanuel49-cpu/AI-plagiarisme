import { createSignal } from "solid-js";
import ResultBox from "../components/ResultBox";

export default function ImageCompare() {
  const [mode, setMode] = createSignal("image");
  const [text, setText] = createSignal("");

  const [image1, setImage1] = createSignal(null);
  const [image2, setImage2] = createSignal(null);
  const [preview1, setPreview1] = createSignal(null);
  const [preview2, setPreview2] = createSignal(null);

  const [result, setResult] = createSignal(null);
  const [loading, setLoading] = createSignal(false);

  const API_URL = "http://127.0.0.1:5000";

  const handleImage = (e, setImage, setPreview) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const analyze = async () => {
    setLoading(true);
    setResult(null);

    try {
      if (mode() === "image") {
        const formData = new FormData();
        formData.append("image1", image1());
        formData.append("image2", image2());

        const res = await fetch(`${API_URL}/compare-image`, {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        setResult({ ...data, type: "image" });
      } else {
        const res = await fetch(`${API_URL}/analyze-text`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: text() }),
        });

        const data = await res.json();
        setResult({ ...data, type: "text" });
      }
    } catch {
      setResult({
        similarity: 0,
        status: "Gagal terhubung ke server AI",
        type: "error",
      });
    }

    setLoading(false);
  };

  return (
    <div class="page">
      <div class={`main-card ${loading() ? "scanning" : ""}`}>

        {/* === AI SCAN EFFECT === */}
        {loading() && (
          <div class="ai-scan-overlay">
            <div class="scan-line"></div>

            {/* PARTICLES */}
            <span class="scan-particle p1"></span>
            <span class="scan-particle p2"></span>
            <span class="scan-particle p3"></span>
            <span class="scan-particle p4"></span>
          </div>
        )}

        <h1 class="title">📚 AI Plagiarism Checker</h1>
        <p class="subtitle">Analisis plagiarisme tugas sekolah</p>

        {/* MODE SWITCH */}
        <div class="mode-switch">
          <button
            class={`mode ${mode() === "image" ? "active" : ""}`}
            onClick={() => setMode("image")}
          >
            📷 Gambar
          </button>
          <button
            class={`mode ${mode() === "text" ? "active" : ""}`}
            onClick={() => setMode("text")}
          >
            📝 Teks
          </button>
        </div>

        {mode() === "image" && (
          <div class="upload-grid">
            <label class="card">
              <p class="card-title">Tugas 1</p>
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => handleImage(e, setImage1, setPreview1)}
              />
              {preview1() ? (
                <img src={preview1()} class="preview" />
              ) : (
                <span class="hint">Klik untuk upload</span>
              )}
            </label>

            <label class="card">
              <p class="card-title">Tugas 2</p>
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => handleImage(e, setImage2, setPreview2)}
              />
              {preview2() ? (
                <img src={preview2()} class="preview" />
              ) : (
                <span class="hint">Klik untuk upload</span>
              )}
            </label>
          </div>
        )}

        {mode() === "text" && (
          <div class="text-grid">
            <textarea
              placeholder="Tempel teks tugas di sini..."
              value={text()}
              onInput={(e) => setText(e.target.value)}
            />
            <p class="text-info">
              Panjang teks: {text().length} karakter
            </p>
          </div>
        )}

        <button
          class="main-btn"
          disabled={
            loading() ||
            (mode() === "image" && (!image1() || !image2())) ||
            (mode() === "text" && !text().trim())
          }
          onClick={analyze}
        >
          {loading() ? "🤖 AI Menganalisis..." : "Analisis"}
        </button>

        {result() && <ResultBox result={result()} />}
      </div>
    </div>
  );
}
