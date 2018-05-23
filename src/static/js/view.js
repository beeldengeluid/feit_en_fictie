import Vue from 'vue';
import { clone, noop } from 'lodash';
import { mediaForArticle } from './api.js';
import { messages, ERR_API_ERROR } from './messages.js'
import { $ } from './util.js';

const AUDIO_BASE_URL = $('meta[name="AUDIO_BASE_URL"]').getAttribute('content');
const VIDEO_BASE_URL = $('meta[name="VIDEO_BASE_URL"]').getAttribute('content');

const DEFAULT_DATA = {
    error : null,
    loading : false,
    messages,
    player : null,
    query : null,
    results : null,
    state : null
};

export default function(el) {
    return new Vue({
        el,

        mounted() {
            function go() {
                if (!!window.location.hash) {
                    const path = decodeURIComponent(window.location.hash.slice(1));

                    if (path.startsWith('play')) {
                        const parts = path.replace('play:', '').split(':');
                        this.play(parts[0], parts[1]);
                    } else {
                        this.query = path;
                        this.search();
                    }
                } else {
                    this.reset();
                }

                this.state = window.location.href.includes('#play:') ? 'player' : 'search';
            }

            window.addEventListener('hashchange', go.bind(this));
            go.call(this);
        },

        methods : {
            back() {
                window.history.back();
            },

            noop,

            play(type, id) {
                if (type === 'video') {
                    this.player = {
                        type : 'video',
                        url : `${VIDEO_BASE_URL}/${id}`
                    };
                }
            },

            reset() {
                Object.assign(this, DEFAULT_DATA);
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
                        item.playhref = `#play:${item.avtype}:${item.playerId}`;
                    } else {
                        item.playhref = null;
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

        data : clone(DEFAULT_DATA)
    });
}