<template>
    <site-card
        v-if="target"
        v-bind:site="target"></site-card>
</template>

<script>
    import SiteCard from './site-card.vue';

    export default {
        components : {
            SiteCard
        },

        computed : {
            target() {
                return this.$store.getters.opengraph;
            }
        }
    }
</script>