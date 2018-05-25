<template>
	<div class="video-player">
		<video
			v-if="!error"
			v-bind:src="src"
			controls
		></video>

		<div
			class="video-player__error"
			v-if="error">
			<h3 class="video-player__error-title">Er ging iets mis...</h3>
			<p class="video-player__error-message">{{error}}</p>
		</div>
	</div>
</template>

<script>
	export default {
		mounted() {
			const player = this.$el.querySelector('video');

			player.addEventListener('error', (e) => {
				this.error = e.target.error.message;
			});

			if (this.start) {
				player.addEventListener('loadedmetadata', () => {
					this.$el.currentTime = this.start;

					if (this.autoplay) {
						player.play();
					}
				});
			}
		},

		data() {
			return {
				error : false
			}
		},

		props : {
			autoplay : {
				type : Boolean,
				required : false,
				default : false
			},

			src : {
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