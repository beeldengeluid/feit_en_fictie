import Vue from 'vue';
import { mediaForArticle } from './api.js';

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
            noop() {
                // Mainly used for preventing forms to submit on enter
            },

            reset() {
                this.query = null;
                this.searchresults = null;
            },

            async search() {
                this.loading = true;
                const results = await mediaForArticle(this.query);
                this.loading = false;
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

        data : {
            loading: false,
            query : null,
            searchresults : null
        }
    });
}