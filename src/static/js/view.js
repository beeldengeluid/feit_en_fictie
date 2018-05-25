import Vue from 'vue';
import Vuex from 'vuex';
import { clone, noop } from 'lodash';
import { mediaForArticle } from './api.js';
import { messages, NO_DESCRIPTION, NO_TITLE, ERR_API_ERROR } from './messages.js'
import { $ } from './util.js';
import Router from './router.js';
import examples from './examples.js';
import FfHeader from './components/ff-header.vue';
import VideoPlayer from './components/video-player.vue';

Vue.use(Vuex);

const AUDIO_BASE_URL = $('meta[name="AUDIO_BASE_URL"]').getAttribute('content');
const VIDEO_BASE_URL = $('meta[name="VIDEO_BASE_URL"]').getAttribute('content');

export default function(el) {
    const store = this.model.getStore();
    const router = new Router(store);

    return new Vue({
        el,

        router,

        store,

        components : {
            FfHeader,
            VideoPlayer
        },

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

        methods : {
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
        },

        data : Object.assign(clone(DEFAULT_DATA), {
            firstRoute : true
        })
    });
}