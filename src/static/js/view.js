import Vue from 'vue';
import Vuex from 'vuex';
import Router from './router.js';

Vue.use(Vuex);

export default function(el, model) {
    const store = model.getStore();
    const router = new Router(store);

    return new Vue({
        el,

        router,

        store
    });
};