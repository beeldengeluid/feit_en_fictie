from flask import Flask, render_template, request, jsonify, abort
from api import parse_article, media_for_article
from spinque_api import ClariahSpinqueApi, ApiException
from logzero import logger
import opengraph
import yaml
import json

# This should probably be a decorator, but i don't know how
def check_params(*args):
    for arg in args:
        if arg not in request.args:
            response = jsonify(
                error = "Required argument not given: '%s'" % arg
            )
            response.status_code = 422
            abort(response)

app = Flask(__name__)
cache = {}
app.config.from_object('settings.Config')

with open("messages.yaml") as f:
    MESSAGES = yaml.load(f)

spinque_api = ClariahSpinqueApi(
    endpoint = app.config["SPINQUE_API"],
    user = app.config["SPINQUE_USER"],
    password = app.config["SPINQUE_PW"],
    config = app.config["SPINQUE_CONFIG_ID"]
)

USE_CACHE = app.config["CACHE_REQUESTS"]

@app.before_request
def check_cache():
    # Basic cache implementation
    if USE_CACHE:
        path = request.full_path
        if path in cache:
            logger.debug("Getting '%s' from cache" % path)
            return json_response(cache[path])

def json_response(data):
    # First save in cache if data is anything and we have a cache
    if USE_CACHE and data:
        path = request.full_path
        logger.debug("Saving '%s' in cache" % path)
        cache[path] = data

    return jsonify(data)

@app.route('/')
def home():
    return render_template('index.html',
       VIDEO_BASE_URL = app.config['VIDEO_BASE_URL'],
       AUDIO_BASE_URL = app.config['AUDIO_BASE_URL'],
       MESSAGES = json.dumps(MESSAGES)
    )


"""
Example: http://localhost:5000/api/extract_terms?title=Tientallen%20doden%20en%20honderden%20gewonden%20bij%20Palestijnse%20protesten%20Gazastrook&text=Volgens%20het%20Palestijnse%20ministerie%20van%20Gezondheid%20zijn%20er%202.410%20gewonden%20gevallen.%20Hulpverleners%20in%20de%20Gazastrook%20spreken%20van%20ruim%201.200%20gewonden.\n\nHet%20leger,%20dat%20claimt%20dat%20er%20meer%20dan%2035.000%20Palestijnen%20bij%20het%20grenshek%20staan,%20opende%20het%20vuur%20nadat%20de%20protesten%20op%20verschillende%20locaties%20van%20start%20gingen.\n\nDe%20protesten%20zijn%20al%20enkele%20weken%20gaande,%20maar%20hebben%20maandag%20een%20hoogtepunt%20bereikt.%20Het%20is%20zeventig%20jaar%20geleden%20dat%20de%20onafhankelijkheid%20van%20Isra%C3%ABl%20werd%20uitgeroepen,%20dat%20door%20de%20Palestijnen%20wordt%20gezien%20als%20een%20catastrofe.\n\nMaandagmiddag%20werd%20de%20Amerikaanse%20ambassade%20geopend%20in%20Jeruzalem.%20Dat%20gebeurde%20met%20een%20ceremonie%20waarop%20Jared%20Kushner,%20schoonzoon%20van%20de%20Amerikaanse%20president%20Donald%20Trump,%20namens%20de%20Verenigde%20Staten%20sprak.%20Namens%20Isra%C3%ABl%20hield%20premier%20Benjamin%20Netanyahu%20een%20toespraak.%20Hij%20sprak%20van%20een%20\%22prachtige%20dag\%22,%20die%20herinnerd%20zal%20worden%20als%20\%22historisch\%22.\n\nJeruzalem%20werd%20eerder%20door%20de%20Amerikaanse%20president%20Donald%20Trump%20erkend%20als%20hoofdstad%20van%20Isra%C3%ABl.%20Dit%20leidde%20op%20het%20moment%20van%20de%20bekendmaking%20in%20december%20tot%20veel%20woede%20bij%20de%20Palestijnen.\n\nIvanka%20Trump,%20de%20dochter%20van%20de%20president,%20is%20samen%20met%20haar%20echtgenoot%20Jared%20Kushner%20in%20Isra%C3%ABl%20aanwezig%20voor%20de%20opening%20van%20de%20ambassade.%20De%20Amerikaanse%20delegatie%20arriveerde%20zondag%20in%20het%20land%20en%20heeft%20al%20een%20receptie%20met%20premier%20Benjamin%20Netanyahu%20bijgewoond.\n\nTerugkeer\n\nDe%20Palestijnen%20zijn%20eind%20maart%20begonnen%20met%20de%20protestacties.%20Ze%20zijn%20bijeengebracht%20door%20onder%20meer%20Hamas.%20De%20protesten%20worden%20ook%20wel%20de%20%27Mars%20van%20de%20Terugkeer%27%20genoemd,%20omdat%20ze%20willen%20wonen%20in%20wat%20nu%20Isra%C3%ABl%20is.\n\nDe%20regering%20van%20Netanyahu%20ziet%20de%20Palestijnen%20die%20het%20hek%20willen%20forceren%20echter%20als%20terroristen.%20Er%20is%20in%20de%20afgelopen%20periode%20dan%20ook%20hard%20opgetreden.\n\nGewelddadig\n\nDe%20protesten%20verliepen%20de%20afgelopen%20weken%20gewelddadig.%20Sommige%20demonstranten%20gooien%20met%20molotovcocktails%20en%20stenen%20en%20steken%20autobanden%20in%20de%20brand.%20Er%20waren%20voor%20maandag%20al%20meer%20dan%20veertig%20doden%20gevallen%20aan%20de%20kant%20van%20de%20Palestijnen%20sinds%20de%20aanvang%20van%20de%20protesten.%20Of%20er%20slachtoffers%20aan%20de%20kant%20van%20Isra%C3%ABl%20zijn%20gevallen,%20is%20niet%20bekend.\n\nWil%20jij%20elke%20ochtend%20direct%20weten%20wat%20je%20%27s%20nachts%20gemist%20hebt%20en%20wat%20er%20die%20dag%20gaat%20gebeuren?%20Abonneer%20je%20dan%20nu%20op%20onze%20Dit%20wordt%20het%20nieuws-nieuwsbrief!
"""
@app.route('/api/extract_terms')
def extract_terms():
    check_params("title", "text")
    title = request.args.get("title")
    text = request.args.get("text")

    try:
        data = spinque_api.extract_terms(title = title, text = text)
    except ApiException:
        return json_response({ "error" : "Api exception" })

    return json_response(data)

"""
Example: http://localhost:5000/api/media_for_article?url=https://www.nu.nl/midden-oostenconflict/5264750/25-doden-en-minstens-duizend-gewonden-bij-palestijnse-protesten-gazastrook.html
"""
@app.route("/api/media_for_article")
def media_for_article_():
    check_params("url")
    url = request.args.get("url")

    data = media_for_article(
        spinque_api = spinque_api,
        url = url
    )

    return json_response(data)

@app.route('/api/messages')
def messages():
    return json_response(MESSAGES)

@app.route("/api/opengraph")
def opengraph_():
    check_params("url")
    url = request.args.get("url")

    data = opengraph.parse_url(url = url)

    return json_response(data)

"""
Example: http://localhost:5000/api/parse_article?url=https://www.nu.nl/midden-oostenconflict/5264750/25-doden-en-minstens-duizend-gewonden-bij-palestijnse-protesten-gazastrook.html
"""
@app.route("/api/parse_article")
def parse_article_():
    check_params("url")
    url = request.args.get("url")
    data = parse_article(url)
    return json_response(data)

@app.route("/api/recommend_segments")
def recommend_segments_():
    check_params("query")
    query = request.args.get("query")

    try:
        data = spinque_api.recommend_segments(query = query)
    except ApiException:
        return json_response({ "error" : "Api exception"})

    return json_response(data)

"""
Example: http://localhost:5000/api/search_media?query=0.27597002(onderzoekers)|0.24492039(syri%C3%AB)|0.13638654(grote)|0.10364231(bronnen)|0.09170949(chemische)
"""
@app.route('/api/search_media')
def search_media():
    check_params("query")
    query = request.args.get("query")

    try:
        data = spinque_api.search_media(query = query)
    except ApiException:
        return json_response({ "error" : "Api exception"} )

    return json_response(data)