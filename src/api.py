from bs4 import BeautifulSoup
from logzero import logger
from newspaper import Article
from util import strip_html
import opengraph
import json

def get_opengraph_data(url):
    return opengraph.load_by_url(url)

def parse_article(url):
    logger.debug(f"Parsing article with url <{url}>")

    article = Article(
        url=url,
        keep_article_html=True,
        MAX_TEXT = 2000,
        MAX_SUMMARY = 2000
    )

    article.download()
    article.parse()

    # The Spinque API barks over html in title or text, so let's fix that
    text = strip_html(article.text)
    title = strip_html(article.title)

    return {
        "authors" : article.authors,
        "html": article.html,
        "summary" : article.summary,
        "text" : text,
        "title" : title,
        "url" : url
    }

# This is basically doing three calls in one for better performance
# on the frontend or for lazy people
def media_for_article(spinque_api, tess_api, term_api, tess_genre, url, termstring=None):
    logger.debug("Getting media for article < %s >" % url)
    article = parse_article(url)
    ogp_data = opengraph.parse_html(article["html"])

    article.pop("html", None)

    if termstring:
        logger.debug("We already have terms")
        terms = termstring
    else:
        logger.debug("Now getting terms")
        text = article["text"]
        title = article["text"]

        if term_api == "spinque":
            terms = spinque_api.extract_terms(text = text, title = title)
        elif term_api == "tess":
            terms = tess_api.extract_terms(text = text, title = title, genre = tess_genre)
        else:
            raise ValueException("Unknown term extraction API")

        # Convert dict format to a string
        termstring = [f'{t["probability"]}({t["term"]})' for t in terms]
        termstring = "|".join(termstring)

    logger.debug("Getting the topic for these terms: %s" % termstring)
    result = spinque_api.search_media(termstring)

    # And add the results from the other API calls as well
    result.update({
        "article" : article,
        "opengraph" : ogp_data,
        "terms" : terms,
        "url" : url
    })

    return result