import View from './view.js';
import Model from './model.js';
import { getJson } from './util.js';

async function main() {
    const DATA_PATH = 'static/data/data.json';
    const data = await getJson(DATA_PATH);
    const model = new Model(data);

    model.load().then(() => {
        window.__view__ = new View("main", model);
        window.__model__ = model;
    });
}

main();