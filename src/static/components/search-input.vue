<template>
    <form
        class="search-input"
        v-on:submit.prevent="setQuery"
    >
        <div class="search-input__input">
            <input
                class="search-input__query"
                v-model="query"
                placeholder=""
            />

            <button class="search-input__button">{{searchLabel}}</button>
        </div>
    </form>
</template>

<script>
    export default {
        computed : {
            query() {
                return this.$store.state.query;
            }
        },

        data() {
            return {
                searchLabel : this.$store.state.messages.SEARCH_LABEL
            };
        },

        methods : {
            setQuery() {
                this.$store.dispatch('query', this.query);
            }
        }
    }
</script>