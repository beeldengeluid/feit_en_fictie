import { words } from 'lodash';

export function trim({
    ellipsis = '…',
    maxWords,
    string,
    separator = ' '
}) {
    const wordList = words(string).slice(0, maxWords);
    return wordList.join(separator) + ellipsis;
}