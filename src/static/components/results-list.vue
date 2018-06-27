<template>
    <div class="results-list">
        <ul v-show="results && results.length">
            <li
                v-for="(record, index) in results"
                v-bind:key="index"
            >
                <button
                    v-on:click="play(record.media)"
                    class="results-list__item">
                    <p class="results-list__hint">In dit programma:</p>

                    <div class="results-list__inset">
                        <h3 v-html="highlight(record.program.title)"></h3>

                        <time>
                            {{record.program.date}}
                        </time>

                        <p v-html="trim(highlight(record.program.description))"></p>
                    </div>

                    <p class="results-list__hint">
                        Vond ik
                        <span v-if="typeLabel(record.hit.type)">
                            op basis van {{typeLabel(record.hit.type)}}
                        </span>
                        dit fragment:
                    </p>

                    <div class="results-list__inset">
                        <h3 v-html="highlight(record.hit.title)"></h3>
                        <p v-html="highlight(record.hit.description)"></p>
                    </div>
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
    import { trim } from '../js/trimwords.js';
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

            messages() {
                return this.$store.state.messages;
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
            },

            trim(str) {
                return trim({
                    maxWords : this.$store.state.config.maxDescriptionWords,
                    string : str
                });
            },

            typeLabel(type) {
                if (type === 'transcript') {
                    return this.messages.HIT_TRANSCRIPT;
                } else if (type === 'subtitle') {
                    return this.messages.HIT_SUBTITLES;
                } else {
                    return null;
                }
            }
        }
    }
</script>