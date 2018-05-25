import Vuex from 'vuex';
import { clone } from 'lodash';
import { warn } from 'loglevel';
import { mediaForArticle } from './api.js';
import { $ } from './util.js';

const DEBUG = window.location.href.includes('debug');
const { examples, messages } = window.__messages__;

const DEFAULT_DATA = {
    config : {
        audioBaseUrl : $('meta[name="AUDIO_BASE_URL"]').getAttribute('content'),
        videoBaseUrl : $('meta[name="VIDEO_BASE_URL"]').getAttribute('content')
    },
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
                error(state, error) {
                    state.error = state.messages[error];
                },

                query(state, query) {
                    state.query = query;
                },

                results(state, results) {
                    state.results = results;
                },

                stopLoading(state) {
                    state.loading = false;
                },

                startLoading(state) {
                    state.loading = true;
                }
            },

            actions : {
                async queryByUrl({ commit }, query) {
                    commit('query', query);
                    commit('startLoading');

                    let results = null;

                    try {
                        results = await mediaForArticle(query);

                        results.map((item) => {
                            item.to = {
                                name : 'results',
                                query : {
                                    avtype : item.avtype,
                                    playerId : item.playerId,
                                    startInSeconds : item.startTime / 1000,
                                    url : query
                                }
                            };

                            return item;
                        });
                    } catch (err) {
                        warn(err);
                        commit('error', 'ERR_API_ERROR');
                        return;
                    } finally {
                        commit('stopLoading');
                    }

                    commit('results', results);
                },

                search({ dispatch }, query) {
                    if (query.url) {
                        dispatch('queryByUrl', query.url);
                    }
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