<template>
    <div
        class="terms-list"
        v-bind:class="[`terms-list__${type}`]"
        v-show="terms">
        <span class="terms-list__title">{{termLabel}}</span>
        <ul class="terms-list__list">
            <li v-for="(term, index) in terms"
                v-bind:key="index">
                {{term.term}}
                <button
                    v-on:click="remove(term)"
                    class="terms-list__remove"
                >&times;</button>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        computed : {
            terms() {
                return this.$store.getters.terms;
            }
        },

        data() {
            return {
                termLabel : this.$store.state.messages.TERMS_LABEL
            };
        },

        methods : {
            remove(term) {
                this.$store.commit('removeTerm', term);
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