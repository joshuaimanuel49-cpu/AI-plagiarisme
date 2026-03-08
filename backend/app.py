from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from PIL import Image
import imagehash
import os
import joblib

# =====================
# SETUP APP
# =====================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIST = os.path.join(BASE_DIR, "..", "frontend", "dist")

app = Flask(
    __name__,
    static_folder=FRONTEND_DIST,
    static_url_path=""
)

CORS(app)

# =====================
# LOAD AI MODEL
# =====================
MODEL_PATH = os.path.join(BASE_DIR, "models", "text_model.pkl")
VECTORIZER_PATH = os.path.join(BASE_DIR, "models", "vectorizer.pkl")

model = joblib.load(MODEL_PATH)
vectorizer = joblib.load(VECTORIZER_PATH)

# =====================
# ROUTE FRONTEND
# =====================
@app.route("/")
def serve_frontend():
    return send_from_directory(FRONTEND_DIST, "index.html")

# =====================
# IMAGE COMPARE (JANGAN DIUBAH)
# =====================
@app.route("/compare-image", methods=["POST"])
def compare_image():

    img1 = Image.open(request.files["image1"]).convert("RGB")
    img2 = Image.open(request.files["image2"]).convert("RGB")

    h1 = imagehash.phash(img1)
    h2 = imagehash.phash(img2)

    distance = h1 - h2
    similarity = max(0, min(100, 100 - distance * 6))

    return jsonify({
        "similarity": similarity,
        "status": "Plagiarisme Tinggi" if similarity > 70 else "Aman"
    })

# =====================
# TEXT ANALYZE (AI MODEL)
# =====================
@app.route("/analyze-text", methods=["POST"])
def analyze_text():

    text = request.json.get("text", "")

    if not text.strip():
        return jsonify({
            "similarity": 0,
            "status": "Tidak ada teks"
        })

    # ubah text jadi fitur
    X = vectorizer.transform([text])

    # prediksi
    prediction = model.predict(X)[0]

    # probabilitas AI
    probability = model.predict_proba(X)[0][1] * 100

    return jsonify({
        "similarity": round(probability, 2),
        "status": "Terindikasi AI" if prediction == 1 else "Tulisan Manusia"
    })

# =====================
# RUN
# =====================
if __name__ == "__main__":
    app.run(debug=True)