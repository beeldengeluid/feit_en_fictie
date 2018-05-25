<template>
    <form
        class="search"
        v-on:submit.prevent="noop"
    >
        <div class="search__input">
            <input
                class="search__query"
                v-model="query"
                placeholder=""
            />

            <button
                v-on:click="setQuery()"
                class="search__button"
            >Zoek</button>
        </div>
    </form>
</template>