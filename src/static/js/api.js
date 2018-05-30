import { shuffle } from 'lodash';
import { MediaItem } from './mediaitem.js';

async function getJson(url) {
    const res = await fetch(url);
    const data = await res.json();
    return data;
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

export async function mediaForArticle(url) {
    const endpoint = `api/media_for_article?url=${encodeURIComponent(url)}`;
    const data = await getJson(endpoint);

    data.items = data.items.map((itemData) => {
        const item = new MediaItem(itemData);
        return item.getData();
    });

    return data;
}