import Vue from 'vue';
import Vuex from 'vuex';
import 'vue-awesome/icons/sliders';
import Icon from 'vue-awesome/components/Icon.vue'
import Router from './router.js';
import { checkNetwork } from './util.js';

Vue.use(Vuex);
Vue.component('icon', Icon)

export default function(el, model) {
    const store = model.getStore();
    const router = new Router(store);

    checkNetwork((network) => {
        store.commit('setNetwork', network);
    });

    return new Vue({
        el,

        router,

        store,

        mounted() {
            this.$store.commit('route', this.$route);

            this.$router.afterEach((to) => {
                this.$store.commit('route', to);
            });
        },

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