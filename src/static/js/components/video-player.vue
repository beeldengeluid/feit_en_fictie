<template>
	<video
		v-bind:src="src"
		controls
	></video>
</template>

<script>
	export default {
		mounted() {
			if (this.start) {
				this.$el.addEventListener('loadedmetadata', () => {
					this.$el.currentTime = this.start;

					if (this.autoplay) {
						this.$el.play();
					}
				});
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