<template>
    <div class="screen-results">
        <header class="results-header">
            <h1 class="results-header__logo">
                <a href="#">{{title}}</a>
            </h1>

            <search-input class="results-header__search"></search-input>
        </header>

        <div class="screen-results__content">
            <results-list></results-list>

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
        </div>
    </div>
</template>

<script>
    import ResultsList from './results-list.vue';
    import SearchInput from './search-input.vue';

    export default {
        mounted() {
            // Is this really the best solution to make this connection?
            this.$store.dispatch('doQuery', this.$route.params.query);
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
            SearchInput
        }
    };
</script>