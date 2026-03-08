import os
import webbrowser
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from backend.ai import compare_image, analyze_text

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIST = os.path.join(BASE_DIR, "frontend", "dist")

app = Flask(__name__, static_folder=FRONTEND_DIST, static_url_path="")
CORS(app)

# ===== FRONTEND =====
@app.route("/")
def index():
    return send_from_directory(FRONTEND_DIST, "index.html")

@app.route("/<path:path>")
def static_files(path):
    return send_from_directory(FRONTEND_DIST, path)

# ===== IMAGE AI =====
@app.route("/compare-image", methods=["POST"])
def compare_img():
    img1 = request.files.get("image1")
    img2 = request.files.get("image2")

    if not img1 or not img2:
        return jsonify({"error": "Image missing"}), 400

    return jsonify(compare_image(img1, img2))

# ===== TEXT AI =====
@app.route("/analyze-text", methods=["POST"])
def analyze_txt():
    data = request.json or {}
    return jsonify(analyze_text(data.get("text", "")))

if __name__ == "__main__":
    webbrowser.open("http://127.0.0.1:5000")
    app.run(host="127.0.0.1", port=5000, debug=False)
