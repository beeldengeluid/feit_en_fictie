from logzero import logger
from urllib.parse import quote
from time import time
import requests

def map_term(term):
    return {
        "probability" : term["probability"],
        "term" : term["tuple"][0]
    }

class ApiException(Exception):
    pass

class ClariahSpinqueApi:
    DEFAULT_COUNT = 10
    MAX_TEXT_LENGTH = 2000
    RECOMMEND_SEGMENTS = "/q/TAG:recommendSegments/p/topic/{query}/results"
    SEARCH_MEDIA = "/q/TAG:programFragmentSearch/p/topic/{query}/results"
    TERM_EXTRACT_ENDPOINT = "/q/TAG:termExtract/p/title/{title}/p/text/{text}/results"
    TOPIC_RESULT_TYPES = ("programs", "segments")

    def __init__(self, endpoint, user, password, config, stop_words = None):
        self.endpoint = endpoint
        self.user = user
        self.password = password
        self.config = config
        self.stop_words = stop_words

    def _request(self, method, count=None):
        if count is None:
            count = self.DEFAULT_COUNT

        url = f'{self.endpoint}{method}'

        params = {
            "count" : count,
            "config" : self.config
        }

        logger.debug(f"Going to make a Spinque API request: < {url} > ")

        then = time()
        r = requests.get(url, params=params, auth=(self.user, self.password))
        took = round(time() - then, 5)

        logger.debug(f"Made Spinque API request < {r.url} > in {took}s")

        if r.status_code != 200:
            logger.debug("Request did not work, status code %s", r.status_code)
            raise ApiException

        return r.json()

    def extract_terms(self, title, text, count = None):
        # Truncate the text, because URLS over 2kb or so won't work in
        # GET requests
        text = text[0:self.MAX_TEXT_LENGTH]

        method = self.TERM_EXTRACT_ENDPOINT.format(
            title=quote(title),
            text=quote(text)
        )

        results = self._request(method, count)

        # Convert to the default term format
        terms = map(map_term, results["items"])

        # Remove stop words if applicable
        if self.stop_words:
            terms = [t for t in terms if t["term"] not in self.stop_words]

        return terms

    """
    `query` is a string with probabilities and terms, formatted like this:
    0.27597002(onderzoekers)|0.24492039(syrië)|0.13638654(grote)
    """
    def recommend_segments(self, query, count = None):
        method = self.RECOMMEND_SEGMENTS.format(query = query)
        return self._request(method, count)

    """
    `query` is a string with probabilities and terms, formatted like this:
    0.27597002(onderzoekers)|0.24492039(syrië)|0.13638654(grote)
    """
    def search_media(self, query, count = None):
        method = self.SEARCH_MEDIA.format(query = query)
        return self._request(method, count)