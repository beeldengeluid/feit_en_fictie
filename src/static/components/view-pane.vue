<template>
    <div class="view-pane">
        <video-player
            v-if="type === 'video'"
            v-bind:src="src"
            v-bind:autoplay="true"
            v-bind:start="start"></video-player>
    </div>
</template>

<script>
    import VideoPlayer from './video-player.vue';

    export default {
        computed : {
            src() {
                const id = this.$route.query.playerId;
                const baseUrl = this.$store.state.config.videoBaseUrl;
                return `${baseUrl}/${id}`;
            },

            type() {
                return this.$route.query.avtype;
            },

            start() {
                return Number(this.$route.query.startInSeconds);
            }
        },

        components : {
            VideoPlayer
        }
    };
</script>