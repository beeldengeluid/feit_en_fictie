from bs4 import BeautifulSoup
from html import unescape

def get_stop_words(path):
    with open(path) as f:
        # Remove the stupid BOM as well
        stop_words = [w.replace("\ufeff", "") for w in f.read().splitlines()]

    return stop_words

def str_to_bool(s):
    # Why doesn't Python have something proper like this in the standard lib?
    return str(s).lower() in ("true", "1", "y", "yes")

def strip_html(html):
    # unescape barks over the 'None' value, so provide something for that
    if not html:
        html = ""

    html = unescape(html)
    soup = BeautifulSoup(html, "html5lib")
    return soup.get_text()