<template>
    <div class="results-list">
        <ul>
            <li
                v-for="(item, index) in results"
                v-bind:key="index"
            >
                <a v-bind:href="item.playhref"
                   class="results__item">
                    <h3 class="results__title">
                        {{item.title}}
                    </h3>

                    <time class="results__date">
                        {{item.date}}
                    </time>

                    <p class="results__description">
                        {{item.description}}
                    </p>
                </a>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        computed: {
            results() {
                return this.$store.state.results;
            }
        }
    }
</script>