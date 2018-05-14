from flask import Flask, render_template, request, jsonify
from api import parse_article, topic_for_article
from spinque_api import ClariahSpinqueApi
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
    path = request.full_path
    if path in cache:
        logger.debug("Getting '%s' from cache" % path)
        return json_response(cache[path])

def json_response(data):
    # First save in cache if data is anything
    if data:
        path = request.full_path
        logger.debug("Saving '%s' in cache" % path)
        cache[path] = data

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
    url = request.args["url"]
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

@app.route("/api/topic_for_article")
def topic_for_article_():
    url = request.args["url"]
    result_type = request.args["result_type"]

    data = topic_for_article(
        spinque_api = spinque_api,
        url = url,
        result_type = result_type
    )

    return json_response(data)