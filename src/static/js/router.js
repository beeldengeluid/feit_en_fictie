import Vue from 'vue';
import VueRouter from 'vue-router';
import ScreenHome from '../components/screen-home.vue';
import ScreenResults from '../components/screen-results.vue';
import ViewPane from '../components/view-pane.vue';

Vue.use(VueRouter);

export default function(store) {
    return new VueRouter({
        routes : [
            {
                name : 'home',
                path : '/',
                component : ScreenHome,
                beforeEnter : (to, from, next) => {
                    // Always clean up when entering here
                    store.commit('reset');
                    next();
                }
            },
            {
                name : 'results',
                path : '/results',
                component : ScreenResults
            }
        ],

        scrollBehavior (to, from, savedPosition) {
            if (savedPosition) {
                return savedPosition
            } else {
                return { x: 0, y: 0 }
            }
        }
    });
};