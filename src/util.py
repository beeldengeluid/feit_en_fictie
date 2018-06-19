from bs4 import BeautifulSoup
from html import unescape

def strip_html(html):
    # unescape barks over the 'None' value, so provide something for that
    if not html:
        html = ""

    html = unescape(html)
    soup = BeautifulSoup(html, "html5lib")
    return soup.get_text()

# This should probably be a decorator, but i don't know how
def check_params(*args):
    for arg in args:
        if arg not in request.args:
            response = jsonify(
                error = "Required argument not given: '%s'" % arg
            )
            response.status_code = 422
            abort(response)

def get_stop_words(path):
    with open(path) as f:
        # Remove the stupid BOM as well
        stop_words = [w.replace("\ufeff", "") for w in f.read().splitlines()]

    return stop_words