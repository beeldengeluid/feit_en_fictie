import Vuex from 'vuex';
import { warn } from 'loglevel';
import {
    getFeedItems,
    mediaForArticle,
    stringToTerms
} from './api.js';
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
                            media : {
                                avtype : item.avtype,
                                externalId : item.externalId,
                                playerId : item.playerId,
                                startInSeconds : item.startTime / 100
                            },
                            title : item.title || state.messages.NO_TITLE
                        });

                        return item;
                    });
                },

                terms(state) {
                    return state.results ? state.results.terms : null;
                }
            },

            mutations : {
                error(state, error) {
                    state.error = state.messages[error];
                },

                onlyTerm(state, term) {
                    const results = state.results;
                    results.terms = results.terms.filter(t => t.term === term.term);
                },

                query(state, query) {
                    state.query = query;
                },

                removeTerm(state, term) {
                    const results = state.results;
                    results.terms = results.terms.filter(t => t.term !== term.term);
                },

                results(state, results) {
                    state.results = results;
                },

                reset(state) {
                    Object.assign(state, model.getInitialState());
                },

                setNetwork(state, network) {
                    state.network = network;
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
                    // If there are terms in the query we use that, otherwise
                    // we simply pass the url and the api figures it all out
                    commit('query', query.url);
                    commit('startLoading');

                    let results = null;

                    try {
                        results = await mediaForArticle(query.url, query.terms || false);

                        // FIXME: this is awful
                        if (query.terms) {
                            results.terms = stringToTerms(results.terms);
                        }

                        commit('results', results);
                    } catch (err) {
                        warn(err);
                        commit('error', 'ERR_API_ERROR');
                        return;
                    } finally {
                        commit('stopLoading');
                    }
                },

                search({ commit, dispatch }, route) {
                    dispatch('queryByUrl', route.query);
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
            network : null,
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