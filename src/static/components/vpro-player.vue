<template>
    <div class="vpro-player">
        <iframe
            v-bind:src="src"
            class="vpro-player__iframe"
            frameborder="0"
            allowfullscreen></iframe>
    </div>
</template>

<script>
    export default {
        computed : {
            src() {
                let src = `https://embed.vpro.nl/popout/?id=${this.pomsid}&profile=default&autoplay=1`;

                if (this.start) {
                    src += `&currenttime=${this.start}`;
                }

                return src;
            }
        },

        props : {
            pomsid : {
                type : String,
                required : true
            },

            start : {
                type : Number,
                required : false
            }
        }
    }
</script>