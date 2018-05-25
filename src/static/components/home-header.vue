<template>
    <header class="header">
        <h1 class="header__title">
            <a href="#">{{title}}</a>
        </h1>

        <p class="header__lead" v-show="showLead">{{lead}}</p>
    </header>
</template>

<script>
export default {
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