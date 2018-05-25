import Vue from 'vue';
import Vuex from 'vuex';
// import { clone, noop } from 'lodash';
// import { mediaForArticle } from './api.js';
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

        store,

        /*
        mounted() {
            function go() {
                if (!!window.location.hash) {
                    const path = decodeURIComponent(window.location.hash.slice(1));

                    if (path.startsWith('play')) {
                        const parts = path.replace('play:', '').split(':');
                        this.play(...parts);
                    } else {
                        this.query = path;
                        this.search();
                    }
                } else {
                    this.reset();
                }

                this.state = window.location.href.includes('#play:') ? 'player' : 'search';
            }

            window.addEventListener('hashchange', () => {
                this.firstRoute = false;
                go.call(this);
            });

            go.call(this);
        },
        */

        methods : {
            /*
            back() {
                window.history.back();
            },

            noop,

            play(type, id, startTime) {
                if (type === 'video') {
                    this.player = {
                        startTime : parseInt(startTime),
                        type : 'video',
                        url : `${VIDEO_BASE_URL}/${id}`
                    };
                }
            },

            reset() {
                Object.assign(this, clone(DEFAULT_DATA));
            },

            async search() {
                this.loading = true;
                let results = null;

                try {
                    results = await mediaForArticle(this.query);
                } catch (err) {
                    this.error = ERR_API_ERROR;
                    this.$forceUpdate();
                    return;
                } finally {
                    this.loading = false;
                }

                this.results = results.map((item) => {
                    if (item.playerId) {
                        const startInSeconds = item.startTime / 1000;
                        item.playhref = `#play:${item.avtype}:${item.playerId}:${startInSeconds}`;
                    } else {
                        item.playhref = null;
                    }

                    if (!item.title) {
                        item.title = NO_TITLE;
                    }

                    if (!item.description) {
                        item.description = NO_DESCRIPTION;
                    }

                    return item;
                });
            },

            setQuery(query) {
                if (query) {
                    // We use this for the examples
                    this.query = query;
                }

                window.location.hash = encodeURIComponent(this.query);
            }
            */
        },

        /*
        data : Object.assign(clone(DEFAULT_DATA), {
            firstRoute : true
        })
        */
    });
}