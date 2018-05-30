import requests
from bs4 import BeautifulSoup

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

        print(name, prop)

        # Check if one of the attributes have the 'og:' namespace
        if name and name[0:3] == "og:":
            key = name.replace("og:", "")
        elif prop and prop[0:3] == "og:":
            key = prop.replace("og:", "")
        else:
            # Nope, move on
            continue

        val = tag.get("content")
        data[key] = val

    return data

def parse_url(url):
    r = requests.get(url)
    return parse_html(r.content)