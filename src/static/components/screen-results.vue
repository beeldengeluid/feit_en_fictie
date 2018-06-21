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

                <button
                    v-on:click="toggleSettings"
                    class="results-header__settingsbtn">
                    <icon name="sliders" scale="2"></icon>
                </button>
            </div>

            <div
                class="results-header__settings"
                v-show="showSettings">
                <p>Term extractor</p>

                <label>
                    <input type="radio"
                           value="spinque"
                           v-model="termextractor" />
                    Spinque
                </label>

                <label>
                    <input type="radio"
                           value="tess"
                           v-model="termextractor" />
                    Tess
                </label>

                <span>—</span>

                <p>Network: {{network}}</p>
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
            <results-list v-on:playmedia="playMedia"></results-list>
            <view-pane
                v-show="media"
                v-bind:media="media"></view-pane>
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
            },

            network() {
                return this.$store.state.network || 'searching...';
            }
        },

        methods : {
            playMedia(media) {
                this.media = media;
            },

            search() {
                this.$store.dispatch('search');
            },

            toggleSettings() {
                this.showSettings = !this.showSettings;
            }
        },

        watch : {
            $route() {
                this.search();
            },

            termextractor(extractor) {
                this.$store.dispatch('termextractor', extractor);
            }
        },

        data() {
            return {
                media : null,
                showSettings : false,
                termextractor : this.$store.state.termextractor,
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