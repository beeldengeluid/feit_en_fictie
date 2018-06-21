<template>
    <div class="results-list">
        <ul v-show="results && results.length">
            <li
                v-for="(item, index) in results"
                v-bind:key="index"
            >
                <button
                    v-on:click="play(item.media)"
                    class="results-list__item">
                    <h3 v-html="highlight(item.title)"></h3>

                    <time>
                        {{item.date}}
                    </time>

                    <p v-html="highlight(item.description)"></p>
                </button>
            </li>
        </ul>

        <error-message
            v-show="results && !results.length"
            v-bind:message="labelNoResults"></error-message>
    </div>
</template>

<script>
    import { highlight } from '../js/highlight.js';
    import ErrorMessage from './error-message.vue';

    export default {
        components : {
            ErrorMessage
        },

        computed: {
            highlightTerms() {
                return this.terms.map((term) => {
                    return {
                        opacity : term.probability,
                        word : term.term
                    }
                });
            },

            results() {
                return this.$store.getters.resultItems;
            },

            terms() {
                return this.$store.getters.terms;
            }
        },

        data() {
            return {
                labelNoResults : this.$store.state.messages.NO_RESULTS
            }
        },

        methods : {
            highlight(text) {
                return highlight({
                    highlight : this.highlightTerms,
                    text : text
                });
            },

            play(media) {
                this.$emit('playmedia', media);
            }
        }
    }
</script>