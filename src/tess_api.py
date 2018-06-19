from logzero import logger
from time import time
import requests

def map_term(term):
    # Fix the silly pref_label convention for people
    term_label = term["pref_label"]

    if term["type"] == "GTAA_Personen":
        parts = term_label.split(",")
        parts.reverse()
        term_label = " ".join(parts).strip()

    return {
        "gtaa_id" : term["gtaa_id"],
        "gtaa_type" : term["type"],
        "probability" : term["classifier_probability"],
        "pref_label" : term["pref_label"],
        "term" : term_label
    }

class ApiException(Exception):
    pass

class TessApi:
    def __init__(self, endpoint, api_key):
        self.endpoint = endpoint
        self.api_key = api_key

    def extract_terms(self, title, text, genre):
        url = f'{self.endpoint}extract?apikey={self.api_key}'

        logger.debug("Going to make a TESS API request")

        then = time()

        payload = {
            "show" : {
                "genres" : [genre],
                "id" : "urn:does-not-exist",
                "text" : [text],
                "summary" : title
            }
        }

        req = requests.post(url, json=payload)

        took = round(time() - then, 5)

        logger.debug(f"Made TESS API request, took {took}s")

        if req.status_code != 200:
            logger.debug("Request did not work, status code %s", req.status_code)
            raise ApiException

        terms = req.json()

        return list(map(map_term, terms["show"]["extracted_terms"]))