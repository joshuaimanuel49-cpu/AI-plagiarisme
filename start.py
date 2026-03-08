import threading
import webbrowser
from backend.app import app

def run_backend():
    app.run(host="127.0.0.1", port=5000, debug=False)

if __name__ == "__main__":
    threading.Thread(target=run_backend).start()
    webbrowser.open("http://127.0.0.1:5000")

