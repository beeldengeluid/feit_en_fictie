<template>
    <div class="screen-results">
        <header class="results-header">
            <div class="results-header__masthead">
                <h1 class="results-header__logo">
                    <router-link v-bind:to="{ name : 'home' }">{{title}}</router-link>
                </h1>

                <search-input class="results-header__search"></search-input>
            </div>

            <terms-list type="inverted"></terms-list>
        </header>

        <error-message></error-message>

        <loading-indicator></loading-indicator>

        <div class="screen-results__content">
            <results-list></results-list>
            <view-pane></view-pane>
        </div>
    </div>
</template>

<script>
    import ErrorMessage from './error-message.vue';
    import LoadingIndicator from './loading-indicator.vue';
    import ResultsList from './results-list.vue';
    import SearchInput from './search-input.vue';
    import TermsList from './terms-list.vue';
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
            ErrorMessage,
            LoadingIndicator,
            ResultsList,
            SearchInput,
            TermsList,
            ViewPane
        }
    };
</script>