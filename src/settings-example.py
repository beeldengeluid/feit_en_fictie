import yaml

# I'm really lazy
FEEDS = """
  - source: de Volkskrant
    url: https://www.volkskrant.nl/voorpagina/rss.xml
  - source: NU.nl
    url: https://www.nu.nl/rss
  - source: AD
    url: https://www.ad.nl/home/rss.xml
  - source: NOS
    url: http://feeds.nos.nl/nosnieuwsalgemeen
  - url: https://www.nrc.nl/rss/
    source: NRC
"""

class Config:
   APP_HOST = '0.0.0.0'
   APP_PORT = 5310

   VIDEO_BASE_URL = '<url here>'
   AUDIO_BASE_URL = '<url here>'

   SPINQUE_API = '<url here>'
   SPINQUE_CONFIG_ID = 'config_id_here'
   SPINQUE_USER = 'user_here'
   SPINQUE_PW = 'pass_here'

   STOP_WORDS_FILE = "src/data/stop-words-dutch.txt"

   CACHE_REQUESTS = True

   FEEDS = yaml.load(FEEDS)
   FEEDS_ITEM_LIMIT = 5