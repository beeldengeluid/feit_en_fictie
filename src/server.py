from flask import Flask, render_template, request, jsonify
from api import parse_article, ClariahSpinqueApi

app = Flask(__name__)
app.config.from_object('settings.Config')

spinque_api = ClariahSpinqueApi(
    endpoint = app.config["SPINQUE_API"],
    user = app.config["SPINQUE_USER"],
    password = app.config["SPINQUE_PW"],
    config = app.config["SPINQUE_CONFIG_ID"]
)

@app.route('/')
def home():
	return render_template('index.html',
	   VIDEO_BASE_URL = app.config['VIDEO_BASE_URL'],
	   AUDIO_BASE_URL = app.config['AUDIO_BASE_URL'],
	   PROXY_BASE_URL = app.config['PROXY_BASE_URL']
	)

@app.route("/parse_article")
def parse_article_():
    url = request.args.get("url")
    data = parse_article(url)
    return jsonify(data)

@app.route('/extract_terms')
def extract_terms():
    title = request.args["title"]
    text = request.args["text"]
    data = spinque_api.extract_terms(title = title, text = text)
    return jsonify(data)

@app.route('/topic')
def recommend():
    tuple_list = request.args["tuple_list"]
    result_type = request.args["type"]
    data = spinque_api.topic(result_type = result_type, tuple_list = tuple_list)
    return jsonify(data)