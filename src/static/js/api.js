import { shuffle } from 'lodash';
import { getJson } from './util.js';
import { MediaItem } from './mediaitem.js';

export function stringToTerms(query) {
    return query.split('|').map((q) => {
        // FIXME: do this with regexes instead of being lazy
        const parts = q.split('(');
        const probability = parseFloat(parts[0]);
        const term = parts[1].replace(')', '');
        return { probability, term };
    });
}

export async function getFeedItems() {
    const feeds = await getJson('api/feeds');

    // Shuffle the items around for a bit
    const items = [];

    feeds.forEach((feed) => {
        feed.items.forEach((item) => {
            item.source = feed.source;
            items.push(item);
        });
    });

    return shuffle(items);
}

export async function mediaForArticle(url, terms = false) {
    let endpoint = `api/media_for_article?url=${encodeURIComponent(url)}`;

    if (terms) {
        endpoint += `&terms=${terms}`;
    }

    const data = await getJson(endpoint);

    data.items = data.items.map((itemData) => {
        const item = new MediaItem(itemData);
        return item.getData();
    });

    return data;
}