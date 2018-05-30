<template>
    <site-card v-bind:site="target"></site-card>
</template>

<script>
    import SiteCard from './site-card.vue';

    export default {
        computed : {
            target() {
                return this.$store.getters.opengraph;
            }
        }
    }
</script>