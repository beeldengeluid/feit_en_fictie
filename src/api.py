from newspaper import Article
from logzero import logger
import opengraph
import json

def get_opengraph_data(url):
    return opengraph.load_by_url(url)

def parse_article(url):
    logger.debug(f"Parsing article with url <{url}>")
    article = Article(url=url, keep_article_html=True)
    article.download()
    article.parse()

    return {
        "html": article.html,
        "text" : article.text,
        "title" : article.title,
        "url" : url
    }

# This is basically doing three calls in one for better performance
# on the frontend or for lazy people
def media_for_article(spinque_api, url):
    logger.debug("Getting topic for article < %s >" % url)
    article = parse_article(url)
    ogp_data = opengraph.parse_html(article["html"])

    article.pop("html", None)

    logger.debug("Now getting terms")
    terms = spinque_api.extract_terms(
        text = article["text"],
        title = article["title"]
    )

    # Convert dict format to a string
    termstring = [f'{i["probability"]}({i["tuple"][0]})' for i in terms["items"]]
    termstring = "|".join(termstring)

    logger.debug("And getting the topic for these terms: %s" % termstring)
    result = spinque_api.search_media(termstring)

    # And add the results from the other API calls as well
    result.update({
        "article" : article,
        "opengraph" : ogp_data,
        "terms" : terms,
        "url" : url
    })

    return result