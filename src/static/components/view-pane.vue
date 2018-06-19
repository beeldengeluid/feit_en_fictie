<template>
    <div class="view-pane">
        <video-player
            v-if="media && type === 'video'"
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
                const id = this.media.playerId;
                const baseUrl = this.$store.state.config.videoBaseUrl;
                return `${baseUrl}/${id}`;
            },

            type() {
                return this.media.avtype;
            },

            start() {
                return Number(this.media.startInSeconds);
            }
        },

        components : {
            VideoPlayer
        },

        props : {
            media : {
                type: Object
            }
        }
    };
</script>