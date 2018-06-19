import { map, words } from 'lodash';

export function highlight({ highlight, text }) {
    const keywords = map(highlight, 'word');
    const wordlist = words(text);

    wordlist.forEach((word) => {
        const wordIndex = keywords.indexOf(word.toLowerCase());

        if (wordIndex !== -1) {
            const opacity = highlight[wordIndex].opacity;
            const style = `background-color: rgba(255, 255, 0, ${opacity})`;
            const html = `<mark style="${style}">${word}</mark>`;
            text = text.replace(word, html);
        }
    });

    return text;
}