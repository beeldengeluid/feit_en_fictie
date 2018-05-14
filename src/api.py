from newspaper import Article
from logzero import logger
from urllib.parse import quote
import requests

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

class ClariahSpinqueApi:
    DEFAULT_COUNT = 10
    TERM_EXTRACT_ENDPOINT = "/q/TAG:termExtract/p/title/{title}/p/text/{text}/results"
    TOPIC_ENDPOINT = "/q/TAG:recommend{result_type}/p/topic/{query}/results"
    TOPIC_RESULT_TYPES = ("programs", "segments")

    def __init__(self, endpoint, user, password, config):
        self.endpoint = endpoint
        self.user = user
        self.password = password
        self.config = config

    def _request(self, method, count=None):
        if count is None:
            count = self.DEFAULT_COUNT

        url = f'{self.endpoint}{method}'

        params = {
            "count" : count,
            "config" : self.config
        }

        r = requests.get(url, params=params, auth=(self.user, self.password))

        logger.debug(f"Made Spinque API request < {r.url} >")

        return r.json()

    def extract_terms(self, title, text, count = None):
        method = self.TERM_EXTRACT_ENDPOINT.format(
            title=quote(title),
            text=quote(text)
        )

        return self._request(method, count)


    def topic(self, result_type, query, count = None):
        method = self.TOPIC_ENDPOINT.format(
            result_type=result_type.capitalize(), query = query
        )

        return self._request(method, count)

"""
def recommend(self, tupleList, count, resultType):
    url = '%s/q/TAG:%s/p/topic/%s/results?count=%s&config=%s' % (
        self.config['SPINQUE_API'],
        resultType,
        tupleList,
        count,
        self.config['SPINQUE_CONFIG_ID']
    )
    base64string = base64.b64encode('%s:%s' % (self.config['SPINQUE_USER'], self.config['SPINQUE_PW']))
    headers = {
        'Authorization' : 'Basic %s' % base64string
    }
    resp = requests.get(url, headers=headers)
    if resp.status_code == 200:
        data = json.loads(resp.text)
        return data
    return {'error' : 'not tested yet'}


def extract_terms(self, title, text, count):
    url = '%s/q/TAG:termExtract/p/title/%s/p/text/%s/results?count=%s&config=%s' % (
        self.config['SPINQUE_API'],
        title,
        text,
        count,
        self.config['SPINQUE_CONFIG_ID']
    )
    base64string = base64.b64encode('%s:%s' % (self.config['SPINQUE_USER'], self.config['SPINQUE_PW']))
    headers = {
        'Authorization' : 'Basic %s' % base64string
    }
    print url
    resp = requests.get(url, headers=headers)
    print resp.status_code
    if resp.status_code == 200:
        data = json.loads(resp.text)
        return data
    return {'error' : 'not tested yet'}
"""