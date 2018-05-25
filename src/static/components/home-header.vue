<template>
    <header class="home-header">
        <h1 class="home-header__title">
            <a href="#">{{title}}</a>
        </h1>

        <p class="home-header__lead"
           v-show="showLead"
           v-html="markdown(lead)"></p>
    </header>
</template>

<script>
    import markdown from '../js/markdown.js';

    export default {
        mixins : [markdown],

        data() {
            return {
                lead : this.$store.state.messages.HEADER_LEAD,
                title : this.$store.state.messages.TITLE
            }
        },

        props : {
            showLead : {
                type : Boolean,
                required : false,
                default : true
            }
        }
    }
</script>