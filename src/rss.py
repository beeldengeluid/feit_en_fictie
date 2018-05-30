from dataknead import Knead
import requests
import xmltodict
import pdb

def get_feed(url):
    req = requests.get(url)

    if req.status_code == 429:
        raise Exception("Could not get feed, too many requests")

    try:
        rss = xmltodict.parse(req.text)
    except Exception as e:
        raise Exception(
            "Could not parse feed for <%s> with error %s" %
            (url, e.message)
        )

    # Atom
    if "feed" in rss:
        items = rss["feed"]["entry"]
    elif "rss" in rss:
        # RSS
        items = rss["rss"]["channel"]["item"]
    else:
        raise Exception("Neither an Atom or an RSS feed")

    # Do some magic for the thumbnails
    for item in items:
        item["thumb"] = get_thumb(item)

    if items and len(items) > 0:
        return items
    else:
        raise Exception("No items in feed")

def get_thumb(item):
    options = [
        Knead(item).query("media:content/@url").data(),
        Knead(item).query("enclosure/@url").data()
    ]

    for option in options:
        if option:
            return option

    return None