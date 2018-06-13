import Vue from 'vue';
import Vuex from 'vuex';
import Router from './router.js';

Vue.use(Vuex);

export default function(el, model) {
    const store = model.getStore();
    const router = new Router(store);

    return new Vue({
        el,

        router,

        store,

        computed : {
            terms() {
                return this.$store.getters.terms;
            }
        },

        watch : {
            terms(terms) {
                if (!terms) {
                    return;
                }

                const termstring = terms.map((t) => {
                    return `${t.probability}(${t.term})`
                }).join('|');

                this.$router.push({
                    name : 'results',
                    query : {
                        terms : termstring,
                        url : this.$route.query.url,
                    }
                });
            }
        }
    });
};