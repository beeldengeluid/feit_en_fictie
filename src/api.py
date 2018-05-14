from newspaper import Article
from logzero import logger

def parse_article(url):
    logger.debug(f"Parsing article with url <{url}>")
    article = Article(url=url, keep_article_html=True)
    article.download()
    article.parse()

    return {
        "text" : article.text,
        "title" : article.title,
        "url" : url
    }

# This is basically doing three calls in one for better performance
# on the frontend
def topic_for_article(spinque_api, url, result_type):
    logger.debug("Getting topic for article < %s >" % url)
    article = parse_article(url)

    logger.debug("Now getting terms")
    terms = spinque_api.extract_terms(
        text = article["text"],
        title = article["title"]
    )

    # Convert dict format to a string
    termstring = [f'{i["probability"]}({i["tuple"][0]})' for i in terms["items"]]
    termstring = "|".join(terms)

    logger.debug("And getting the topic for these terms")
    result = spinque_api.topic(result_type, terms)

    # And add the results from the other API calls as well
    result.update({
        "article" : article,
        "terms" : terms
    })

    return result