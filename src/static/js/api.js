import { get } from 'object-path';

const DIST_CHANNEL_TELEVISION = 'televisie';
const TYPE_VIDEO = 'video';

class MediaItem {
    constructor(item) {
        this.item = item.tuple[0].attributes;
    }

    getData() {
        return {
            date : this.date,
            description : this.description,
            player : this.player,
            title : this.title
        }
    }

    get date() {
        return this.hasPublication ? this.publication.startdate : null;
    }

    get description() {
        return this.item.description;
    }

    get hasPublication() {
        return Boolean(
            this.item.program &&
            this.item.program.publication &&
            this.item.program.publication[0]
        );
    }

    get publication() {
        if (this.hasPublication) {
            return this.item.program.publication[0];
        }
    }

    get title() {
        return this.item.maintitles;
    }
}

async function getJson(url) {
    const res = await fetch(url);
    const data = await res.json();
    return data;
}

export async function mediaForArticle(url) {
    const endpoint = `api/media_for_article?url=${encodeURIComponent(url)}`;
    const data = await getJson(endpoint);

    return data.items.map((itemData) => {
        const item = new MediaItem(itemData);
        return item.getData();
    });
}