console.log("Hello world");

var input = prompt();
console.log("Input:", input);

var months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "november", "december"];
var monthsKey = {};
for (var i in months) {
    var month = months[i];
    monthsKey[month] = month;
    monthsKey[month.slice(0, 3)] = month;
}

console.log(getClosest(input, monthsKey));

/*
GENERAL DESIGN

    Tasks
    | Class? Link? | Name of task | Date and time due | Progress? |

    Events
    | Class? Link? | Name of event | Date and time start-end |

    Things to get around to
    | Link? | Name of thing |

    Input form
    | [name of event] [[time word] [time]] [link or link word] |
    Name of event - anyt text
    Time word - at, due
    Time -
        date - today, tomorrow, this weekday, next weekday, (month) day (year)
            weekday - whichever is closest
            month - assume current month, whichever is closest
            day - number
            year - assume current year, if 2 numbers add 20 to beginning, otherwise just 4 numbers
        time - assume normal times unless specified and convert to current time zone if another is specified
            normal times - if time < 10 assume pm, if time >= 10 assume am

*/

// takes in a string input and outputs an object of a new task, event, thing, etc
function parseInput(input) {

}

// finds the most similar string to input that is in options
function getClosest(input, options) {
    closest = "";
    leastDistance = input.length;
    for (var i in Object.keys(options)) {
        var option = Object.keys(options)[i];
        var distance = editDistance(input, option);
        if (distance < leastDistance) {
            closest = options[option];
            leastDistance = distance;
        }
    }
    return closest;
}

// calculates the damerau-levenshtein (with adjacent letter swaps) minimum edit distance from string1 to string2
function editDistance(string1, string2) {
    var insertionWeight = 1;
    var deletionWeight = 1;
    var substitutionWeight = 2;
    var swapWeight = 1;

    var n = string1.length;
    var m = string2.length;
    // initialize 2d array in one line
    // let array = Array(rows).fill().map(() => Array(columns).fill(0));
    var distance = [];
    for (var i = 0; i < n + 1; i++) {
        distance.push(new Array(m + 1).fill(0));
    }

    // initialize comparison between empty string to the other string
    for (var i = 0; i <= n; i++) {
        distance[i][0] = i;
    }
    for (var i = 0; i <= m; i++) {
        distance[0][i] = i;
    }

    // calculate the rest of the slots
    for (var i = 1; i <= n; i++) {
        for (var j = 1; j <= m; j++) {
            insertionDist = distance[i][j - 1] + insertionWeight;
            deletionDist = distance[i - 1][j] + deletionWeight;
            substitutionDist = distance[i - 1][j - 1] + substitutionWeight * (string1[i] === string2[j] ? 0 : 1);
            swapDist = Math.max(n, m); // just initialize as largest in case you cannot swap
            if (i >= 2 && j >= 2) {
                validSwap = string1[i - 2] === string2[j - 1] && string1[i - 1] === string2[j - 2];
                swapDist = distance[i - 2][j - 2] + (validSwap ? swapWeight : swapWeight + 1);
            }

            distance[i][j] = Math.min(insertionDist, deletionDist, substitutionDist, swapDist);
        }
    }

    return distance[n][m];
}