let charChances = {};
let chars = [];
let charsObj = {
    " ": 0
};
let start = [];
let word = [];
let order = 2;
let backwards = false;

function generate() {
    let words = [];
    let number = parseInt(document.getElementById("amt").value);

    // Loop for every word the user wants
    for (let i = 0; i < number; i++) {
        word = [];

        // Generate a random start to a word, unless one is provided
        let startIn = document.getElementById("start").value;
        if (startIn) {
            if (startIn.length >= order) {
                word = startIn.split("");

                // Flip the provided start if backwards is checked
                if (backwards) {
                    word = word.reverse();
                }
            } else {
                while (!arraysEqual(word.slice(0, startIn.length), startIn.split(""))) {
                    word = start[Math.floor(start.length * Math.random())].split("");
                }
            }
        } else {
            word = start[Math.floor(start.length * Math.random())].split("");
        }

        // Add letters until coming upon a " "
        while (word[word.length - 1] !== " ") {
            word.push(charChances[word.slice(word.length - order, word.length).join("")][Math.floor(Math.random() * charChances[word.slice(word.length - order, word.length).join("")].length)]);
        }

        // Remove the excess " "
        word.pop();

        // If backwards is on, then the word is backward and needs to be flipped back to forwards
        if (backwards) {
            word = word.reverse();
        }

        // Convert the word to a string and put it into the list of words
        words.push(word.join(""));
    }

    // Put the words generated onto the screen
    document.getElementById("words").innerHTML = words.join(", ");
}

window.onload = () => {
    backwards = document.getElementById("backwards").checked;
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
    document.getElementById("backwards").onchange = () => {
        backwards = document.getElementById("backwards").checked;

        if (backwards) {
            document.getElementById("start").placeholder = "end";
        } else {
            document.getElementById("start").placeholder = "start";
        }
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
    let corpus = document.getElementById("corpus").value;

    // If backwards is checked, reverse the corpus
    if (backwards) {
        corpus = corpus.split("").reverse().join("");
    }

    corpus = corpus.split(" ");

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

function arraysEqual(a, b) {
    if (a.length != b.length) return false;

    for (let i = 0; i < a.length; a++) {
        if (a[i] != b[i]) return false;
    }

    return true;
}