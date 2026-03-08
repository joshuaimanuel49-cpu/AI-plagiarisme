export default function ResultBox(props) {
  /* ================= LOADING STATE ================= */
  if (props.loading) {
    return (
      <div class="result-box fade-in">
        <div class="loader"></div>
        <p style={{ marginTop: "12px", opacity: 0.7 }}>
          AI sedang menganalisis...
        </p>
      </div>
    );
  }

  /* ================= SAFETY ================= */
  if (!props.result) return null;

  const type = props.result.type || "image";

  /* ================= NORMALISASI SIMILARITY ================= */
  let similarity = 0;

  if (type === "image") {
    // IMAGE: backend 0–1 → UI 0–100
    similarity = Math.round((props.result.similarity || 0) * 100);
  }

  if (type === "text") {
    // TEXT: backend sudah 0–100
    similarity = Math.round(props.result.similarity || 0);
  }

  /* ================= STATUS LOGIC ================= */
  let statusColor = "#22c55e";
  let statusText = "Aman";

  if (similarity > 70) {
    statusColor = "#ef4444";
    statusText = "Plagiarisme Tinggi";
  } else if (similarity > 40) {
    statusColor = "#f59e0b";
    statusText = "Perlu Dicek";
  }

  return (
    <div class="result-box slide-up">
      <h3>📊 Hasil Analisis AI</h3>

      {/* ================= IMAGE MODE ================= */}
      {type === "image" && (
        <>
          <div class="progress-bar">
            <div
              class="progress-fill"
              style={{
                width: `${similarity}%`,
                background: statusColor,
              }}
            />
          </div>

          <p class="score">{similarity}% Kemiripan</p>
          <p class="status" style={{ color: statusColor }}>
            {statusText}
          </p>
        </>
      )}

      {/* ================= TEXT MODE ================= */}
      {type === "text" && (
        <>
          <p class="text-info">
            Panjang teks: <b>{props.result.length}</b> karakter
          </p>

          <p class="score">{similarity}% Kemiripan</p>

          <p class="status" style={{ color: statusColor }}>
            {statusText}
          </p>
        </>
      )}
    </div>
  );
}
