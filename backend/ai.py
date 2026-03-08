from PIL import Image
import imagehash
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def compare_image(img1_file, img2_file):
    img1 = Image.open(img1_file).convert("RGB")
    img2 = Image.open(img2_file).convert("RGB")

    hash1 = imagehash.phash(img1)
    hash2 = imagehash.phash(img2)

    distance = hash1 - hash2
    similarity = max(0, min(100, 100 - (distance * 6)))

    return {
        "similarity": similarity,
        "status": "Plagiarisme Tinggi" if similarity > 70 else "Aman"
    }

def analyze_text(text):
    if len(text.strip()) < 30:
        return {
            "score": 0,
            "status": "Teks terlalu pendek"
        }

    corpus = [text, text[::-1]]
    vectorizer = TfidfVectorizer()
    tfidf = vectorizer.fit_transform(corpus)

    similarity = cosine_similarity(tfidf[0:1], tfidf[1:2])[0][0]
    score = round(similarity * 100)

    return {
        "score": score,
        "status": "Terindikasi AI / Salin" if score > 60 else "Aman"
    }
