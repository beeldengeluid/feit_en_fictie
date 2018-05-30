<template>
    <figure
        class="opengraph-card"
        v-if="target">
        <img
            v-if="target.image"
            v-bind:src="target.image"
            alt=""
            class="opengraph-card__image" />

        <figcaption class="opengraph-card__caption">
            <h2
                v-if="target.title"
                class="opengraph-card__title">
                {{target.title}}
            </h2>

            <p
                v-if="target.description"
                class="opengraph-card__description"
            >{{target.description}}</p>
        </figcaption>
    </figure>
</template>

<script>
    export default {
        computed : {
            target() {
                return this.$store.getters.opengraph;
            }
        }
    }
</script>