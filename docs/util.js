// put all the random stupid functions in here later lol


let isTrueAnagram = (word, pangram) => {
    for (letter of pangram) {
        if (!word.includes(letter)) {
            return false;
        }
    }
    return isAnagram(word, pangram);
}