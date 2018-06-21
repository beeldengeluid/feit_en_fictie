<template>
    <div class="error-message" v-show="error">
        <p v-html="error"></p>
    </div>
</template>

<script>
    export default {
        computed: {
            error() {
                return this.message || this.$store.state.error;
            }
        },

        data() {
            return {
                tryAgain: this.$store.state.messages.TRY_AGAIN
            }
        },

        props : {
            message :{
                type : String
            }
        }
    }
</script>