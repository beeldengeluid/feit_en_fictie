import Vuex from 'vuex';
import { warn } from 'loglevel';
import { mediaForArticle } from './api.js';
import { $ } from './util.js';

const DEBUG = true; // CHANGE THIS
const { examples, messages } = window.__messages__;

export default class {
    constructor(...args) {
        this.store = null;
    }

    createStore() {
        const model = this;

        return new Vuex.Store({
            strict : DEBUG,

            state : model.getInitialState(),

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

                reset(state) {
                    Object.assign(state, model.getInitialState());
                },

                stopLoading(state) {
                    state.loading = false;
                },

                startLoading(state) {
                    state.loading = true;
                }
            },

            actions : {
                async queryByUrl({ state, commit }, query) {
                    commit('query', query);
                    commit('startLoading');

                    let results = null;

                    try {
                        results = await mediaForArticle(query);

                        results.map((item) => {
                            Object.assign(item, {
                                description : item.description || state.messages.NO_DESCRIPTION,
                                title : item.title || state.messages.NO_TITLE,
                                to : {
                                    name : 'results',
                                    query : {
                                        avtype : item.avtype,
                                        playerId : item.playerId,
                                        startInSeconds : item.startTime / 1000,
                                        url : query
                                    }
                                }
                            });

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

    getInitialState() {
        return {
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
    }

    getStore() {
        if (!this.store) {
            this.store = this.createStore();
        }

        return this.store;
    }
}