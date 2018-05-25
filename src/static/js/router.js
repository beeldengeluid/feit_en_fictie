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
                component : ScreenHome
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