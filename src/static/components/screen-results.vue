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
                <div
                    class="results-header__settings"
                    v-show="!hasStaticTerms">
                    <p>{{labelTermExtractor}}</p>

                    <label>
                        <input type="radio"
                               value="spinque"
                               v-model="termextractor" />
                        {{labelTermExtractorSpinque}}
                    </label>

                    <label>
                        <input type="radio"
                               value="tess"
                               v-model="termextractor" />
                        {{labelTermExtractorTess}}
                    </label>
                </div>

                <div v-show="hasStaticTerms"
                     class="result-header__settings">
                    <button
                        class="results-header__btn-link"
                        v-on:click="resetTerms">
                        {{labelResetTerms}}
                    </button>
                </div>

                <span>—</span>

                <p>{{labelPlayerType}}</p>

                <label>
                    <input type="radio"
                           value="internal"
                           v-model="playerType" />
                    {{labelPlayerInternal}}
                </label>

                <label>
                    <input type="radio"
                           value="npo"
                           v-model="playerType" />
                    {{labelPlayerNpo}}
                </label>

                <span>—</span>

                <p>{{labelExtractSource}}</p>

                <label>
                    <input type="radio"
                           value="article"
                           v-model="extractsource" />
                    {{labelExtractArticle}}
                </label>

                <label>
                    <input type="radio"
                           value="ogp"
                           v-model="extractsource" />
                    {{labelExtractOgp}}
                </label>
            </div>

            <div
                class="results-header__metadata"
                v-show="!loading">
                <template v-if="hasOpenGraph">
                    <p>{{labelBasicOfArticle}}</p>
                    <opengraph-card class="site-card--small"></opengraph-card>

                    <p>{{labelFoundTerms}}</p>
                </template>

                <terms-list type="inverted"></terms-list>
            </div>
        </header>

        <error-message></error-message>

        <loading-indicator></loading-indicator>

        <p
            class="screen-results__message"
            v-show="!loading">
            {{labelFoundInBgArchives}}
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

            hasOpenGraph() {
                return this.$store.getters.hasOpenGraph;
            },

            hasStaticTerms() {
                return this.$store.getters.hasStaticTerms;
            },

            loading() {
                return this.$store.state.loading;
            }
        },

        methods : {
            playMedia(media) {
                this.media = media;
            },

            resetTerms() {
                // Remove the termstring from the current page
                this.$router.push({
                    name : 'results',
                    query : {
                        url : this.$route.query.url,
                    }
                });
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

            extractsource(source) {
                this.$store.commit('extractsource', source);
                // Force a search again
                this.$store.dispatch('search');
            },

            playerType(type) {
                this.$store.commit('playerType', type);
            },

            termextractor(extractor) {
                this.$store.dispatch('termextractor', extractor);
            }
        },

        data() {
            const msg = this.$store.state.messages;

            // FIXME: Using the `msg` object directly is easier, so we need
            // to convert al these label at a leter time
            return {
                extractsource : this.$store.state.extractsource,
                labelBasicOfArticle : msg.ON_BASIS_OF_ARTCILE,
                labelExtractSource : msg.EXTRACT_SOURCE,
                labelExtractArticle : msg.EXTRACT_ARTICLE,
                labelExtractOgp : msg.EXTRACT_OGP,
                labelFoundTerms : msg.FOUND_TERMS,
                labelFoundInBgArchives : msg.FOUND_IN_BG_ARCHIVES,
                labelPlayerType : msg.PLAYER_TYPE,
                labelPlayerInternal : msg.PLAYER_INTERNAL,
                labelPlayerNpo : msg.PLAYER_NPO,
                labelResetTerms : msg.RESET_TERMS,
                labelTermExtractor : msg.TERM_EXTRACTOR,
                labelTermExtractorSpinque : msg.TERM_EXTRACTOR_SPINQUE,
                labelTermExtractorTess: msg.TERM_EXTRACTOR_TESS,
                media : null,
                msg,
                playerType : this.$store.state.playerType,
                showSettings : false,
                termextractor : this.$store.state.termextractor,
                title : msg.TITLE
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