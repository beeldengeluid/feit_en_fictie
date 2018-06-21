export function $(selector) {
	return document.querySelector(selector);
}

export async function getJson(path) {
    const req = await fetch(path);
    const json = await req.json();
    return json;
}