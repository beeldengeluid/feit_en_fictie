import Vuex from 'vuex';

const DEBUG = window.location.href.includes('debug');

const DEFAULT_DATA = {
    error : null,
    loading : false,
    messages,
    player : null,
    query : null,
    results : null,
    state : null
};

export default class {
    constructor(...args) {
        this.store = null;
    }

    createStore() {
        return new Vuex.Store({
            strict : DEBUG,

            state : this.getData(),

            getters : {
            },

            mutations : {
            }
        });
    }

    getStore() {
        if (!this.store) {
            this.store = this.createStore();
        }

        return this.store;
    }
}