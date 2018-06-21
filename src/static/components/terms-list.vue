<template>
    <div
        class="terms-list"
        v-bind:class="[`terms-list__${type}`]"
        v-show="terms && terms.length">

        <span class="terms-list__title">{{termLabel}}</span>

        <ul class="terms-list__list">
            <li v-for="(term, index) in terms"
                v-bind:key="index">
                <button
                    class="terms-list__textlink"
                    v-on:click="searchOnly(term)">
                    {{term.term}}
                </button>

                <button
                    v-on:click="remove(term)"
                    class="terms-list__remove"
                >&times;</button>
            </li>
        </ul>

        <button
            v-show="hasStaticTerms"
            class="terms-list__textlink"
            v-on:click="resetTerms">
           {{labelResetTerms}}
        </button>
    </div>
</template>

<script>
    export default {
        computed : {
            hasStaticTerms() {
                return this.$store.getters.hasStaticTerms;
            },

            terms() {
                return this.$store.getters.terms;
            }
        },

        data() {
            return {
                labelResetTerms : this.$store.state.messages.RESET_TERMS,
                termLabel : this.$store.state.messages.TERMS_LABEL
            };
        },

        methods : {
            remove(term) {
                this.$store.commit('removeTerm', term);
                this.termQuery();
            },

            resetTerms() {
                // Remove the termstring from the current page
                this.$router.push({
                    name : 'results',
                    query : {
                        url : this.$route.query.url,
                    }
                });
            },

            searchOnly(term) {
                this.$store.commit('onlyTerm', term);
                this.termQuery();
            },

            termQuery() {
                // This converts the current term list to a string we pass
                // to the route, we essentialy 'fix' the termstring
                const termstring = this.terms.map((t) => {
                    return `${t.probability}(${t.term})`
                }).join('|');

                this.$router.push({
                    name : 'results',
                    query : {
                        terms : termstring,
                        url : this.$route.query.url,
                    }
                });
            }
        },

        props : {
            type : {
                required : false,
                default : 'default',
                type : String,
                validator(val) {
                    return ['default', 'inverted'].includes(val);
                }
            }
        }
    }
</script>