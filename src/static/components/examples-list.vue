<template>
    <div class="examples-list">
        <h2 class="examples-list__title">
            {{examplesLabel}}
        </h2>

        <ul>
            <li v-for="example in examples">
                <router-link v-bind:to="example.route">
                    {{example.title}}
                </router-link>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                examplesLabel : this.$store.state.messages.EXAMPLES_LABEL,

                examples : this.$store.state.examples.map((example) => {
                    example.route = {
                        name : 'results',
                        query : {
                            url : example.url
                        }
                    };

                    return example;
                })
            };
        }
    }
</script>