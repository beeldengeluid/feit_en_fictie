<template>
    <div class="feed-items">
        <h3 class="feed-items__title">
            {{title}}
        </h3>

        <ul>
            <li v-for="(item, index) in items">
                <router-link
                    class="feed-items__item"
                    v-bind:to="item.route">
                    <site-card v-bind:site="item.site"></site-card>
                </router-link>
            </li>
        </ul>
    </div>
</template>

<script>
    import { truncate } from 'lodash';
    import SiteCard from './site-card.vue';

    export default {
        computed : {
            items() {
                return this.$store.state.feedItems.map((item) => {
                    item.route = {
                        name : 'results',
                        query : {
                            url : item.link
                        }
                    };

                    item.site = {
                        title : item.title,
                        description : truncate(item.description, {
                            length: 200,
                            separator : /,?\.* +/
                        }),
                        image : item.thumb,
                        domain : item.source
                    };

                    return item;
                })
            }
        },

        data() {
            return {
                title : this.$store.state.messages.FEED_ITEMS_LABEL
            }
        },

        components : {
            SiteCard
        }
    }
</script>