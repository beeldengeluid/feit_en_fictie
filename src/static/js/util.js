export function $(selector) {
	return document.querySelector(selector);
}

export function checkNetwork(callback) {
    fetchWithTimeout('http://gtaa.beeldengeluid.nl/', 3000).then(() => {
        callback('nibg');
    }).catch(() => {
        callback('internet');
    });
}

export function fetchWithTimeout(url, TIMEOUT) {
    let didTimeOut = false;

    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() =>{
            didTimeOut = true;
            reject(new Error('Request timed out'));
        }, TIMEOUT);

        fetch(url).then((response) => {
            // Clear the timeout as cleanup
            clearTimeout(timeout);

            if(!didTimeOut) {
                resolve(response);
            }
        }).catch((err) => {
            console.log('fetch failed! ', err);

            // Rejection already happened with setTimeout
            if(didTimeOut) return;
            // Reject with error
            reject(err);
        });
    });
}

export async function getJson(path) {
    const req = await fetch(path);
    const json = await req.json();
    return json;
}