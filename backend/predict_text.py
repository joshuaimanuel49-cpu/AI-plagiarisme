import joblib

model = joblib.load("models/text_model.pkl")
vectorizer = joblib.load("models/vectorizer.pkl")

text = input("Masukkan teks: ")

X = vectorizer.transform([text])

prediction = model.predict(X)

if prediction[0] == 1:
    print("AI Generated")
else:
    print("Human Written")