from logzero import logger
from urllib.parse import quote
import requests

class ClariahSpinqueApi:
    DEFAULT_COUNT = 10
    MAX_TEXT_LENGTH = 2000
    TERM_EXTRACT_ENDPOINT = "/q/TAG:termExtract/p/title/{title}/p/text/{text}/results"
    SEARCH_MEDIA = "/q/TAG:programFragmentSearch/p/topic/{query}/results"
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

        logger.debug(f"Going to make a Spinque API request: < {url} > ")

        r = requests.get(url, params=params, auth=(self.user, self.password))

        logger.debug(f"Made Spinque API request < {r.url} >")

        return r.json()

    def extract_terms(self, title, text, count = None):
        # Truncate the text, because URLS over 2kb or so won't work in
        # GET requests
        text = text[0:self.MAX_TEXT_LENGTH]

        method = self.TERM_EXTRACT_ENDPOINT.format(
            title=quote(title),
            text=quote(text)
        )

        return self._request(method, count)

    """
    `query` is a string with probabilities and terms, formatted like this:
    0.27597002(onderzoekers)|0.24492039(syrië)|0.13638654(grote)
    """
    def search_media(self, query, count = None):
        method = self.SEARCH_MEDIA.format(query = query)

        return self._request(method, count)