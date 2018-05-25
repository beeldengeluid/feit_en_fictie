<template>
    <div class="screen-home">
        <home-header></home-header>
        <search-input></search-input>
        <examples-list></examples-list>
    </div>
</template>

<script>
import HomeHeader from './home-header.vue';
import SearchInput from './search-input.vue';
import ExamplesList from './examples-list.vue';

export default {
    components : {
        HomeHeader,
        SearchInput,
        ExamplesList
    }
};
</script>