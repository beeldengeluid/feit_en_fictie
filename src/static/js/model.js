import Vuex from 'vuex';
import { clone } from 'lodash';

const DEBUG = window.location.href.includes('debug');
const { examples, messages } = window.__messages__;

const DEFAULT_DATA = {
    error : null,
    examples,
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

            state : clone(DEFAULT_DATA),

            getters : {
            },

            mutations : {
                query(state, query) {
                    state.query = query;
                }
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