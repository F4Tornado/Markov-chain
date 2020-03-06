let charChances = {};
let chars = [];
let charsObj = {
    " ": 0
};
let start = [];
let word = [];
let order = 2;

function generate() {
    let words = [];
    let number = parseInt(document.getElementById("amt").value);

    // Loop for every word the user wants
    for (let i = 0; i < number; i++) {
        word = [];

        // Generate a random start to a word, unless one is provided
        let startIn = document.getElementById("start").value;
        if (startIn && startIn.length >= order) {
            word = startIn.split("");
        } else {
            word = start[Math.floor(start.length * Math.random())].split("");
        }

        // Add letters until coming upon a " "
        while (word[word.length - 1] !== " ") {
            word.push(charChances[word.slice(word.length - order, word.length).join("")][Math.floor(Math.random() * charChances[word.slice(word.length - order, word.length).join("")].length)]);
        }

        // Remove the excess " ", convert to string, and add to words array
        word.pop();
        words.push(word.join(""));
    }

    document.getElementById("words").innerHTML = words.join(", ");
}

window.onload = () => {
    if (localStorage.getItem("corpus")) {
        document.getElementById("corpus").value = localStorage.getItem("corpus");
    }
    document.getElementById("corpus").onchange = () => {
        localStorage.setItem("corpus", document.getElementById("corpus").value);
        calculateChances();
    }
    document.getElementById("order").onchange = () => {
        order = parseInt(document.getElementById("order").value);
        calculateChances();
    }
    calculateChances();
}

function calculateChances() {
    // Reset variables
    charChances = {};
    chars = [];
    charsObj = {
        " ": 0
    };
    start = [];

    // Get the list of characters the user is using & initialize the variables
    let corpus = document.getElementById("corpus").value.split(" ");
    for (let i = 0; i < corpus.length; i++) {
        for (let j = 0; j < corpus[i].length; j++) {
            // console.log(corpus[i].slice(j, j + order).length);
            if (corpus[i].slice(j, j + order).length == order && chars.indexOf(corpus[i].slice(j, j + order)) == -1) {
                chars.push(corpus[i].slice(j, j + order));
                charsObj[corpus[i].slice(j, j + order)] = 0;
            }
        }
    }

    // Calculate the odds ratios of the next letter & turn them into arrays, put " " at end of words
    for (let i = 0; i < chars.length; i++) {
        charChances[chars[i]] = [];
        for (let j = 0; j < corpus.length; j++) {
            for (let k = 0; k < corpus[j].length; k++) {
                if (chars[i] == corpus[j].slice(k, k + order)) {
                    if (corpus[j][k + order]) {
                        charChances[chars[i]].push(corpus[j][k + order]);
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
        start.push(corpus[i].slice(0, order));
    }
}