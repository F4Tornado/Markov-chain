let charChances = {};
let chars = [];
let charsObj = {
    " ": 0
};
let start = [];
let word = [];

function generate() {
    // Reset variables
    charChances = {};
    chars = [];
    charsObj = {
        " ": 0
    };
    start = [];
    let word = [];

    // Get the list of characters the user is using & initialize the variables
    let corpus = document.getElementById("corpus").value.split(" ");
    for (let i = 0; i < corpus.length; i++) {
        for (let j = 0; j < corpus[i].length; j++) {
            if (chars.indexOf(corpus[i][j]) == -1) {
                chars.push(corpus[i][j]);
                charsObj[corpus[i][j]] = 0;
            }
        }
    }

    // Calculate the odds ratios of the next letter & turn them into arrays, put " " at end of words
    for (let i = 0; i < chars.length; i++) {
        charChances[chars[i]] = [];
        for (let j = 0; j < corpus.length; j++) {
            for (let k = 0; k < corpus[j].length; k++) {
                if (chars[i] == corpus[j][k]) {
                    if (corpus[j][k + 1]) {
                        charChances[chars[i]].push(corpus[j][k + 1]);
                    } else {
                        charChances[chars[i]].push(" ");
                    }
                }
            }
        }
    }

    // Calculate the chance a letter starts a word
    start = [];
    for (let i = 0; i < corpus.length; i++) {
        start.push(corpus[i][0]);
    }

    // Generate a random start to a word
    word.push(start[Math.floor(start.length * Math.random())]);

    // Add letters until coming upon a " "
    while (word[word.length - 1] !== " ") {
        word.push(charChances[word[word.length - 1]][Math.floor(Math.random() * charChances[word[word.length - 1]].length)]);
    }

    // Remove the excess " ",convert to string, and add put into a <span>
    word.pop();
    document.getElementById("words").innerHTML = word.join("");
}