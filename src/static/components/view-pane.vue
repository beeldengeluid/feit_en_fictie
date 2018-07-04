<template>
    <div class="view-pane"
         v-if="media && type === 'video'">
        <video-player
            v-if="playerType === 'internal'"
            v-bind:src="src"
            v-bind:autoplay="true"
            v-bind:start="media.carrierOffset + media.hitOffset"></video-player>

        <vpro-player
            v-if="playerType === 'npo'"
            v-bind:pomsid="externalId"
            v-bind:start="media.hitOffset"></vpro-player>
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

            playerType() {
                return this.$store.state.playerType;
            },

            src() {
                const id = this.media.playerId;
                const baseUrl = this.$store.state.config.videoBaseUrl;
                return `${baseUrl}/${id}`;
            },

            type() {
                return this.media.avtype;
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