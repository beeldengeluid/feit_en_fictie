import Vue from 'vue';
import Vuex from 'vuex';
import Router from './router.js';
import Model from './model.js';

Vue.use(Vuex);

export default function(el) {
    const model = new Model();
    const store = model.getStore();
    const router = new Router(store);

    return new Vue({
        el,

        router,

        store
    });
};