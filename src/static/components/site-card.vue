<template>
    <figure class="site-card">
        <img
            v-if="site.image"
            v-bind:src="site.image"
            alt=""
            class="site-card__image" />

        <figcaption class="site-card__caption">
            <h2
                v-if="site.title"
                class="site-card__title">
                <a v-if="site.url"
                   v-bind:href="site.url"
                   target="_blank">
                    {{site.title}}
                </a>

                <span v-else>{{site.title}}</span>
            </h2>

            <p
                v-if="site.description"
                class="site-card__description"
                v-html="description"></p>

            <p
                v-if="site.domain"
                class="site-card__domain"
            >
                <a
                    v-if="site.url"
                    v-bind:href="site.url"
                    target="_blank">
                    {{site.domain}}
                </a>

                <span v-if="!site.url">
                    {{site.domain}}
                </span>
            </p>
        </figcaption>
    </figure>
</template>

<script>
    import { truncate } from 'lodash';

    export default {
        computed : {
            description() {
                return truncate(this.site.description, {
                    length: 200,
                    separator : /,?\.* +/
                });
            }
        },

        props : {
            site : {
                required : true,
                type : Object
            }
        }
    }
</script>