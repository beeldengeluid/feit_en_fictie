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
    import { map, words } from 'lodash';

    export default {
        computed: {
            results() {
                return this.$store.getters.resultItems;
            },

            termlabels() {
                return map(this.terms, 'term');
            },

            terms() {
                return this.$store.getters.terms;
            }
        },

        methods : {
            highlight(text) {
                const wordlist = words(text);

                wordlist.forEach((word) => {
                    const isTerm = this.termlabels.indexOf(word.toLowerCase());

                    if (isTerm !== -1) {
                        const term = this.terms[isTerm];
                        const prob = term.probability;
                        const style = `background-color: rgba(255, 255, 0, ${prob})`;
                        const html = `<mark style="${style}">${word}</mark>`;
                        text = text.replace(word, html);
                    }
                });

                return text;
            },

            play(media) {
                this.$emit('playmedia', media);
            }
        }
    }
</script>