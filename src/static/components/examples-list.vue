<template>
    <div class="examples-list">
        <h2 class="examples-list__title">
            {{examplesLabel}}
        </h2>

        <ul>
            <li v-for="example in examples">
                <a v-bind:href="'#' + encodeURIComponent(example.url)">
                    {{example.title}}
                </a>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                examplesLabel : this.$store.state.messages.EXAMPLES_LABEL,
                examples : this.$store.state.examples
            };
        }
    }
</script>