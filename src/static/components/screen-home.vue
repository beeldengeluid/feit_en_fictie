<template>
    <div class="screen-home">
        <home-header></home-header>
        <search-input class="search-input--fullwidth"></search-input>

        <!-- Show the feed list if we've got items, otherwise show examples -->
        <feed-items v-if="feedItems"></feed-items>
        <examples-list v-if="!feedItems"></examples-list>
    </div>
</template>

<script>
import ExamplesList from './examples-list.vue';
import FeedItems from './feed-items.vue';
import HomeHeader from './home-header.vue';
import SearchInput from './search-input.vue';

export default {
    components : {
        ExamplesList,
        FeedItems,
        HomeHeader,
        SearchInput
    },

    computed : {
        feedItems() {
            return this.$store.state.feedItems;
        }
    }
};
</script>