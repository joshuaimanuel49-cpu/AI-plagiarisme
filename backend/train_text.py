import pandas as pd
import joblib
import os

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression

# buat folder models kalau belum ada
os.makedirs("models", exist_ok=True)

# load dataset
data = pd.read_csv("dataset/text/Training_Essay_Data.csv")

# cek kolom dataset
print(data.columns)

# ganti sesuai nama kolom dataset
texts = data["text"]
labels = data["generated"]

# ubah text menjadi angka
vectorizer = TfidfVectorizer(stop_words="english")

X = vectorizer.fit_transform(texts)

# split data
X_train, X_test, y_train, y_test = train_test_split(
    X, labels, test_size=0.2, random_state=42
)

# training model
model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)

# simpan model
joblib.dump(model, "models/text_model.pkl")
joblib.dump(vectorizer, "models/vectorizer.pkl")

print("Model berhasil disimpan!")