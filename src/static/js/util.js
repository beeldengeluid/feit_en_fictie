export function $(selector) {
	return document.querySelector(selector);
}

export async function getJson(path) {
    const req = await fetch(path);
    const json = await req.json();
    return json;
}

export function secondsToHms(seconds) {
    let hms = new Date(seconds * 1000).toISOString().substr(11, 8);
    let ms = hms.slice(3);
    let h = parseInt(hms.slice(0, 2));
    return h ? `${h}:${ms}` : ms;
}