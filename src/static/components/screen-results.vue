<template>
    <div class="screen-results">
        <header class="results-header">
            <h1 class="results-header__logo">
                <router-link v-bind:to="{ name : 'home' }">{{title}}</router-link>
            </h1>

            <search-input class="results-header__search"></search-input>
        </header>

        <!-- These two divs should be components -->
        <div class="error"
             v-show="error">
            <p v-html="error"></p>
            <a href="#" class="error__button">Probeer nogmaals</a>
        </div>

        <div class="loading"
             v-show="loading">
            <img src="static/img/loading.gif" alt="Laden..." />
            <h2 class="loading__title">Laden...</h2>
        </div>

        <div class="screen-results__content">
            <results-list></results-list>
            <view-pane></view-pane>
        </div>
    </div>
</template>

<script>
    import ResultsList from './results-list.vue';
    import SearchInput from './search-input.vue';
    import ViewPane from './view-pane.vue';

    export default {
        mounted() {
            // Is this really the best solution to make this connection?
            this.$store.dispatch('search', this.$route.query);
        },

        computed : {
            error() {
                return this.$store.state.error;
            },

            loading() {
                return this.$store.state.loading;
            }
        },

        data() {
            return {
                title : this.$store.state.messages.TITLE
            };
        },

        components : {
            ResultsList,
            SearchInput,
            ViewPane
        }
    };
</script>