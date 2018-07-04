<template>
    <div class="results-list">
        <ul v-show="results && results.length">
            <li
                v-for="(record, index) in results"
                v-bind:key="index"
            >
                <button
                    v-on:click="play(record.media)"
                    class="results-list__item">
                    <p class="results-list__hint">In dit programma:</p>

                    <div class="results-list__inset">
                        <h3 v-if="record.program.title"
                            v-html="highlight(record.program.title)"></h3>

                        <h3 v-if="!record.program.title">
                            {{messages.NO_TITLE}}
                        </h3>

                        <p
                            class="results-list__description"
                            v-html="trim(highlight(record.program.description))"></p>

                        <dl class="results-list__meta">
                            <template v-if="record.media.date">
                                <dt>{{messages.DATE}}</dt>
                                <dd><time>{{record.media.date}}</time></dd>
                            </template>

                            <template v-if="record.media.broadcasters">
                                <dt>{{messages.BROADCASTERS}}</dt>
                                <dd>
                                    {{record.media.broadcasters.join(',')}}
                                </dd>
                            </template>

                            <template v-if="record.media.distributionchannel">
                                <dt>{{messages.DISTRIBUTION_CHANNEL}}</dt>
                                <dd>{{record.media.distributionchannel}}</dd>
                            </template>

                            <template v-if="record.media.duration">
                                <dt>{{messages.DURATION}}</dt>
                                <dd>{{secondsToHms(record.media.duration)}}</dd>
                            </template>

                            <template v-if="record.media.carrierDuration">
                                <dt>{{messages.CARRIER_DURATION}}</dt>
                                <dd>{{secondsToHms(record.media.carrierDuration)}}</dd>
                            </template>
                        </dl>
                    </div>

                    <p class="results-list__hint">
                        Vond ik
                        <span v-if="typeLabel(record.hit.type)">
                            op basis van {{typeLabel(record.hit.type)}}
                        </span>
                        dit fragment
                        <span v-if="record.media.hitOffset">
                            vanaf {{secondsToHms(record.media.hitOffset)}}
                        </span>
                    </p>

                    <div class="results-list__inset">
                        <h3 v-html="highlight(record.hit.title)"></h3>
                        <p class="results-list__description"
                           v-html="highlight(record.hit.description)"></p>
                    </div>
                </button>
            </li>
        </ul>

        <error-message
            v-show="results && !results.length"
            v-bind:message="labelNoResults"></error-message>
    </div>
</template>

<script>
    import { highlight } from '../js/highlight.js';
    import { trim } from '../js/trimwords.js';
    import { secondsToHms } from '../js/util.js';
    import ErrorMessage from './error-message.vue';

    export default {
        components : {
            ErrorMessage
        },

        computed: {
            highlightTerms() {
                return this.terms.map((term) => {
                    return {
                        opacity : term.probability,
                        word : term.term
                    }
                });
            },

            messages() {
                return this.$store.state.messages;
            },

            results() {
                return this.$store.getters.resultItems;
            },

            terms() {
                return this.$store.getters.terms;
            }
        },

        data() {
            return {
                labelNoResults : this.$store.state.messages.NO_RESULTS
            }
        },

        methods : {
            highlight(text) {
                return highlight({
                    highlight : this.highlightTerms,
                    text : text
                });
            },

            play(media) {
                this.$emit('playmedia', media);
            },

            secondsToHms,

            trim(str) {
                return trim({
                    maxWords : this.$store.state.config.maxDescriptionWords,
                    string : str
                });
            },

            typeLabel(type) {
                if (type === 'transcript') {
                    return this.messages.HIT_TRANSCRIPT;
                } else if (type === 'subtitle') {
                    return this.messages.HIT_SUBTITLES;
                } else {
                    return null;
                }
            }
        }
    }
</script>