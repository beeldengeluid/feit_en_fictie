<template>
    <div class="view-pane"
         v-if="media && type === 'video'">
        <video-player
            v-if="network === 'nibg'"
            v-bind:src="src"
            v-bind:autoplay="true"
            v-bind:start="start"></video-player>

        <vpro-player
            v-if="network === 'internet'"
            v-bind:pomsid="externalId"
            v-bind:start="start"></vpro-player>
    </div>
</template>

<script>
    import VideoPlayer from './video-player.vue';
    import VproPlayer from './vpro-player.vue';

    export default {
        computed : {
            externalId() {
                return this.media.externalId;
            },

            network() {
                return this.$store.state.network;
            },

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
            VideoPlayer,
            VproPlayer
        },

        props : {
            media : {
                type: Object
            }
        }
    };
</script>