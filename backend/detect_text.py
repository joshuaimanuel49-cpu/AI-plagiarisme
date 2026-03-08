import joblib

model = joblib.load("models/text_model.pkl")
vectorizer = joblib.load("models/vectorizer.pkl")

text = input("Masukkan teks: ")

X = vectorizer.transform([text])

prediction = model.predict(X)[0]

if prediction == 1:
    print("Teks kemungkinan dibuat AI")
else:
    print("Teks kemungkinan ditulis manusia")