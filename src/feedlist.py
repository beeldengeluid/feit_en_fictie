from rss import get_feed
import yaml

class FeedList:
    def __init__(self, path, ids, item_limit = 10):
        with open(path) as f:
            feed_data = yaml.load(f)

        self.feeds = []
        self.limit = item_limit

        for feedid, feed in feed_data["feeds"].items():
            if feedid in ids:
                self.feeds.append(feed)

    def get_feeds(self):
        for feed in self.feeds:
            url = feed["url"]
            feed["items"] = get_feed(url)

            if self.limit:
                feed["items"] = feed["items"][0:self.limit]

        return self.feeds