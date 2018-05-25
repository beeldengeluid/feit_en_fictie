<template>
    <form
        class="search-input"
        v-on:submit.prevent="submit"
    >
        <div class="search-input__input">
            <input
                class="search-input__query"
                v-bind:value="value"
                placeholder=""
            />

            <button class="search-input__button">{{searchLabel}}</button>
        </div>

        <error-message></error-message>
    </form>
</template>

<script>
    import ErrorMessage from './error-message.vue';

    export default {
        computed : {
            value() {
                return this.$store.state.query;
            }
        },

        data() {
            return {
                searchLabel : this.$store.state.messages.SEARCH_LABEL
            };
        },

        methods : {
            submit() {
                const query = this.$el.querySelector('input').value;

                if (!query.startsWith('http')) {
                    this.$store.commit('error', 'ERR_INVALID_QUERY_GIVEN');
                } else {
                    this.$router.push({
                        name : 'results',
                        query : {
                            url : query
                        }
                    });
                }


            }
        },

        components : {
            ErrorMessage
        }
    }
</script>