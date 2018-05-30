from urllib.parse import urlparse
import requests
from bs4 import BeautifulSoup

def get_domain(url):
    parsed = urlparse(url)
    return parsed.netloc.replace("www.", "")

def strip_html(html):
    soup = BeautifulSoup(html)
    return soup.get_text()

def parse_html(html):
    soup = BeautifulSoup(html, "html5lib")
    tags = soup.select('meta')
    data = {}

    for tag in tags:
        # Some sites use the name attribute, some use property
        name = tag.get("name", None)
        prop = tag.get("property", None)

        if not name and not prop:
            continue

        # Check if one of the attributes have the 'og:' namespace
        if name and name[0:3] == "og:":
            key = name.replace("og:", "")
        elif prop and prop[0:3] == "og:":
            key = prop.replace("og:", "")
        else:
            # Nope, move on
            continue

        val = tag.get("content")
        data[key] = strip_html(val)

    # Not part of the spec, but handy to have nonetheless
    if "url" in data:
        data["domain"] = get_domain(data["url"])

    return data

def parse_url(url):
    r = requests.get(url)
    return parse_html(r.content)