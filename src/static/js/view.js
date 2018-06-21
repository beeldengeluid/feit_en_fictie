import Vue from 'vue';
import Vuex from 'vuex';
import 'vue-awesome/icons/sliders';
import Icon from 'vue-awesome/components/Icon.vue'
import Router from './router.js';
import { checkNetwork } from './util.js';

Vue.use(Vuex);
Vue.component('icon', Icon)

export default class View {
    constructor(el, model) {
        this.el = el;
        this.model = model;
        this.store = model.getStore();
        this.checkNetwork();
        this.router = new Router(this.store);
        this.view = this.getView();

        // Wait until the router is ready to mount the vue instance,
        // and also add the route to the store so we can easily query
        // that later
        this.router.onReady(() => {
            this.store.commit('route', this.router.currentRoute);
            this.view.$mount(this.el);
        });
    }

    checkNetwork() {
        checkNetwork((network) => {
            this.store.commit('setNetwork', network);
        });
    }

    getView() {
        return new Vue({
            'router' : this.router,

            'store' : this.store,

            /// Pass route to the store for easier reference later on
            mounted() {
                this.$store.commit('route', this.$route);

                this.$router.afterEach((to) => {
                    this.$store.commit('route', to);
                });
            }
        });
    }
};