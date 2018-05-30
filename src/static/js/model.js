import Vuex from 'vuex';
import { warn } from 'loglevel';
import { getFeedItems, mediaForArticle } from './api.js';
import { $, getJson } from './util.js';

const DEBUG = true; // CHANGE THIS
const DATA_PATH = 'static/data/data.json';

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
                opengraph(state) {
                    return state.results ? state.results.opengraph : null;
                },

                resultItems(state) {
                    if (!state.results) {
                        return null;
                    }

                    return state.results.items.map((item) => {
                        // Note that we make a new object here to avoid
                        // mutating state
                        item = Object.assign({}, item, {
                            description : item.description || state.messages.NO_DESCRIPTION,
                            title : item.title || state.messages.NO_TITLE,
                            to : {
                                name : 'results',
                                query : {
                                    avtype : item.avtype,
                                    playerId : item.playerId,
                                    startInSeconds : item.startTime / 1000,
                                    url : state.query
                                }
                            }
                        });

                        return item;
                    });
                },

                terms(state) {
                    if (!state.results) {
                        return null;
                    }

                    return state.results.terms.items.map((item) => {
                        return item.tuple[0];
                    });
                }
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
                        commit('results', results);
                    } catch (err) {
                        warn(err);
                        commit('error', 'ERR_API_ERROR');
                        return;
                    } finally {
                        commit('stopLoading');
                    }
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
        const { examples, messages } = this.data;

        return {
            config : {
                audioBaseUrl : $('meta[name="AUDIO_BASE_URL"]').getAttribute('content'),
                videoBaseUrl : $('meta[name="VIDEO_BASE_URL"]').getAttribute('content')
            },
            error : null,
            examples,
            feedItems : this.feedItems,
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

    load() {
        return new Promise(async (resolve) => {
            this.data = await getJson(DATA_PATH);

            try {
                this.feedItems = await getFeedItems();
            } catch(e) {
                this.feedItems = null;
            }

            resolve();
        });
    }
}