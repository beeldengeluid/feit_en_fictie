<template>
    <div class="loading-indicator"
         v-show="loading">
        <img src="static/img/loading.gif" v-bind:alt="loadingLabel" />
        <h2 class="loading-indicator__title">{{loadingLabel}}</h2>
    </div>
</template>

<script>
    export default {
        computed: {
            loading() {
                return this.$store.state.loading;
            }
        },

        data() {
            return {
                loadingLabel : this.$store.state.LOADING
            }
        }
    };
</script>