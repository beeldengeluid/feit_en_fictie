import Vuex from 'vuex';
import { warn } from 'loglevel';
import {
    getFeedItems,
    mediaForArticle,
    stringToTerms
} from './api.js';
import { $ } from './util.js';

export default class {
    constructor(data) {
        this.store = null;
        this.data = data;
    }

    createStore() {
        const model = this;

        return new Vuex.Store({
            strict : this.data.debug,

            state : model.getInitialState(),

            getters : {
                hasStaticTerms(state) {
                    if (state.route) {
                        return !!state.route.query.terms;
                    } else {
                        return null;
                    }
                },

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
                    if (state.results) {
                        return state.results.terms.slice(
                            0, state.config.maxTermsCount
                        );
                    } else {
                        return null;
                    }
                }
            },

            mutations : {
                error(state, error) {
                    state.error = state.messages[error];
                },

                extractsource(state, source) {
                    state.extractsource = source;
                },

                onlyTerm(state, term) {
                    const results = state.results;
                    results.terms = results.terms.filter(t => t.term === term.term);
                },

                playerType(state, type) {
                    if (state.playerTypes.includes(type)) {
                        state.playerType = type;
                    } else {
                        throw new Error('Unknown playertype');
                    }
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
                    Object.assign(state, {
                        error : null,
                        loading : false,
                        query : null,
                        results : null
                    });
                },

                route(state, route) {
                    state.route = route;
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
                        results = await mediaForArticle({
                            extractsource : state.extractsource,
                            termextractor : state.termextractor,
                            terms : query.terms || false,
                            url : query.url
                        });

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

                search({ state, dispatch }) {
                    dispatch('queryByUrl', state.route.query);
                },

                termextractor({ state, dispatch }, termextractor) {
                    state.termextractor = termextractor;
                    // Whenever we change the termextractor we need to
                    // re-do the query
                    dispatch('search');
                }
            }
        });
    }

    getInitialState() {
        const { examples, messages } = this.data;
        const config = this.data.config;

        return {
            config : Object.assign(this.data.config, {
                audioBaseUrl : $('meta[name="AUDIO_BASE_URL"]').getAttribute('content'),
                videoBaseUrl : $('meta[name="VIDEO_BASE_URL"]').getAttribute('content')
            }),
            error : null,
            examples,
            extractsource : config.extractsource,
            feedItems : this.feedItems,
            loading : false,
            messages,
            playerType : 'internal',
            playerTypes : ['internal', 'npo'],
            query : null,
            results : null,
            route : null,
            termextractor : config.termextractor
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
            try {
                this.feedItems = await getFeedItems();
            } catch(e) {
                this.feedItems = null;
            }

            resolve();
        });
    }
}