import Vue from 'vue';
import { noop } from 'lodash';
import { mediaForArticle } from './api.js';
import { ERR_API_ERROR } from './messages.js'

const DEFAULT_DATA = {
    error : null,
    loading : false,
    query : null,
    searchresults : null
};

export default function(el) {
    return new Vue({
        el,

        mounted() {
            function go() {
                if (!!window.location.hash) {
                    this.query = decodeURIComponent(window.location.hash.slice(1));
                    this.search();
                } else {
                    this.reset();
                }
            }

            window.addEventListener('hashchange', go.bind(this));
            go.call(this);
        },

        computed : {
            results() {
                if (!this.searchresults) return null;

                return this.searchresults.items.map((item) => {
                    return item.tuple[0].attributes;
                });
            }
        },

        methods : {
            noop,

            reset() {
                this.query = null;
                this.searchresults = null;
                this.error = null;
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

                this.searchresults = results;
            },

            setQuery(query) {
                if (query) {
                    // We use this for the examples
                    this.query = query;
                }

                window.location.hash = encodeURIComponent(this.query);
            }
        },

        data : Object.assign(DEFAULT_DATA)
    });
}