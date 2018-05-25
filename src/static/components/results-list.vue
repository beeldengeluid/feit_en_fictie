<template>
    <div class="results-list">
        <ul>
            <li
                v-for="(item, index) in results"
                v-bind:key="index"
            >
                <router-link
                    v-bind:to="item.to"
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
                </router-link>
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
        }
    }
</script>