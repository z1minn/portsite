# app.py
from flask import Flask, send_from_directory

# static 폴더는 이미 /static 경로로 서빙됨
app = Flask(__name__, static_folder="static", static_url_path="/static")


@app.route("/")
def index():
  # 루트에 있는 index.html을 그대로 반환
  return send_from_directory(".", "index.html")


if __name__ == "__main__":
  app.run(debug=True)
