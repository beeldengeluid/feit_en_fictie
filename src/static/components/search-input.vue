<template>
    <form
        class="search-input"
        v-on:submit.prevent="submit"
    >
        <p 
            v-if="type === 'default'"
            class="search-input__lead">
            {{enterUrlLabel}}
        </p>

        <div class="search-input__input">
            <input
                class="search-input__query"
                v-bind:value="value"
                v-bind:placeholder="searchPlaceholder"
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
            const messages = this.$store.state.messages;

            return {
                enterUrlLabel : messages.ENTER_URL,
                searchLabel : messages.SEARCH_LABEL,
                searchPlaceholder : messages.URL_PLACEHOLDER
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
        },

        props : {
            type : {
                type : String,
                validator(val) {
                    return ['compact', 'default'].includes(val);
                },
                default: 'default'
            }
        }
    }
</script>