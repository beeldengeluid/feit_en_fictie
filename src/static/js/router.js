import Vue from 'vue';
import VueRouter from 'vue-router';
import ScreenHome from '../components/screen-home.vue';
// import ScreenMedia from './components/screen-media.vue';
// import ScreenUrl from './components/screen-url.vue';

Vue.use(VueRouter);

export default function(store) {
    return new VueRouter({
        routes : [
            {
                name : 'home',
                path : '/',
                component : ScreenHome
            }/*,
            {
                name : 'url',
                path : '/url/:url',
                component : ScreenUrl
            },
            {
                name : 'media',
                path : '/media/:media',
                component : ScreenMedia
            }*/
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