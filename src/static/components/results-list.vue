<template>
    <div class="results-list">
        <ul>
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
    </div>
</template>

<script>
    import { highlight } from '../js/highlight.js';

    export default {
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