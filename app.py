from flask import Flask, send_from_directory, render_template_string
from threading import Thread

app = Flask(__name__, static_url_path='/', static_folder='/')

@app.route('/')
def index():
    with open('index.html') as f:
        return render_template_string(f.read())

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('.', path)

def run():
    app.run(host='0.0.0.0', port=8080)

if __name__ == '__main__':
    server = Thread(target=run)
    server.start()
