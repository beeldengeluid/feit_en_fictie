import Vue from 'vue';
import { mediaForArticle } from './api.js';

export default function(el) {
    return new Vue({
        el,

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

            async search() {
                this.loading = true;
                const results = await mediaForArticle(this.query);
                this.loading = false;
                this.searchresults = results;
            }
        },

        data : {
            loading: false,
            query : null,
            searchresults : null
        }
    });
}