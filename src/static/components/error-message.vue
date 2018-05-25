<template>
    <div class="error-message" v-show="error">
        <p v-html="error"></p>
        <!-- <router-link v-bind:to="{ name : 'home' }">{{tryAgain}}</router-link> -->
    </div>
</template>

<script>
    export default {
        computed: {
            error() {
                return this.$store.state.error;
            }
        },

        data() {
            return {
                tryAgain: this.$store.state.messages.TRY_AGAIN
            }
        }
    }
</script>