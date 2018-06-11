from bs4 import BeautifulSoup
from html import unescape

def strip_html(html):
    # unescape barks over the 'None' value, so provide something for that
    if not html:
        html = ""

    html = unescape(html)
    soup = BeautifulSoup(html, "html5lib")
    return soup.get_text()