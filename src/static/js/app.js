import view from './view.js';
import Model from './model.js';

const model = new Model();

model.load().then(() => {
    window.__view__ = new view("main", model);
});