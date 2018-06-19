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
                    <h3>
                        {{item.title}}
                    </h3>

                    <time>
                        {{item.date}}
                    </time>

                    <p>
                        {{item.description}}
                    </p>
                </button>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        computed: {
            results() {
                return this.$store.getters.resultItems;
            }
        },

        methods : {
            play(media) {
                this.$emit('playmedia', media);
            }
        }
    }
</script>