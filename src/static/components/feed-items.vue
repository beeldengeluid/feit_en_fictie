<template>
    <div class="feed-items">
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
                        description : item.description,
                        image : item.thumb,
                        domain : item.source
                    };

                    return item;
                })
            }
        },

        components : {
            SiteCard
        }
    }
</script>