async function getJson(url) {
    const res = await fetch(url);
    const data = await res.json();
    return data;
}

export async function mediaForArticle(url) {
    const endpoint = `api/media_for_article?url=${encodeURIComponent(url)}`;
    const data = await getJson(endpoint);
    return data;
}