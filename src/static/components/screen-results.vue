<template>
    <div class="screen-results">
        <header class="results-header">
            <div class="results-header__masthead">
                <h1 class="results-header__logo">
                    <router-link v-bind:to="{ name : 'home' }">{{title}}</router-link>
                </h1>

                <search-input 
                    type="compact"
                    class="results-header__search"></search-input>
            </div>

            <div
                class="results-header__metadata"
                v-show="!loading">
                <p>Op basis van dit artikel:</p>
                <opengraph-card class="site-card--small"></opengraph-card>

                <p>Heb ik deze termen gevonden:</p>
                <terms-list type="inverted"></terms-list>
            </div>
        </header>

        <error-message></error-message>

        <loading-indicator></loading-indicator>

        <p
            class="screen-results__message"
            v-show="!loading">
            En vond ik deze resultaten in het archief van Beeld en Geluid:
        </p>

        <div 
            v-show="!loading"
            class="screen-results__content">
            <results-list></results-list>
            <view-pane></view-pane>
        </div>
    </div>
</template>

<script>
    import ErrorMessage from './error-message.vue';
    import LoadingIndicator from './loading-indicator.vue';
    import OpengraphCard from './opengraph-card.vue';
    import ResultsList from './results-list.vue';
    import SearchInput from './search-input.vue';
    import TermsList from './terms-list.vue';
    import ViewPane from './view-pane.vue';

    export default {
        mounted() {
            // Is this really the best solution to make this connection?
            this.search();
        },

        computed : {
            error() {
                return this.$store.state.error;
            },

            loading() {
                return this.$store.state.loading;
            }
        },

        methods : {
            search() {
                this.$store.dispatch('search', this.$route.query);   
            }
        },

        watch : {
            $route() {
                this.search();
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
            OpengraphCard,
            ResultsList,
            SearchInput,
            TermsList,
            ViewPane
        }
    };
</script>