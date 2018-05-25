import { Converter } from 'showdown';

const converter = new Converter();

export default {
    methods : {
        markdown(str) {
            return converter.makeHtml(str);
        }
    }
};