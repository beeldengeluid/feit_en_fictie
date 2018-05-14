from flask import Flask, render_template, request, jsonify
from api import parse_article, ClariahSpinqueApi
from logzero import logger

app = Flask(__name__)
cache = {}
app.config.from_object('settings.Config')

spinque_api = ClariahSpinqueApi(
    endpoint = app.config["SPINQUE_API"],
    user = app.config["SPINQUE_USER"],
    password = app.config["SPINQUE_PW"],
    config = app.config["SPINQUE_CONFIG_ID"]
)

# Basic cache implementation
@app.before_request
def check_cache():
    if request.path in cache:
        logger.debug("Getting '%s' from cache" % request.path)
        return json_response(cache[request.path])

def json_response(data):
    # First save in cache if data is anything
    if data:
        logger.debug("Saving '%s' in cache" % request.path)
        cache[request.path] = data

    return jsonify(data)

@app.route('/')
def home():
	return render_template('index.html',
	   VIDEO_BASE_URL = app.config['VIDEO_BASE_URL'],
	   AUDIO_BASE_URL = app.config['AUDIO_BASE_URL'],
	   PROXY_BASE_URL = app.config['PROXY_BASE_URL']
	)

@app.route("/api/parse_article")
def parse_article_():
    url = request.args.get("url")
    data = parse_article(url)
    return json_response(data)

@app.route('/api/extract_terms')
def extract_terms():
    title = request.args["title"]
    text = request.args["text"]
    data = spinque_api.extract_terms(title = title, text = text)
    return json_response(data)

@app.route('/api/topic')
def topic():
    query = request.args["query"]
    result_type = request.args["result_type"]
    data = spinque_api.topic(result_type = result_type, query = query)
    return json_response(data)