console.log("Hello world");

var input = prompt();
console.log("Input:", input);

var months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "november", "december"];
var weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
var dayReferences = ["today", "tomorrow", "this", "next"];



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
    Time word - at--, from-to, due
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


    var today = new Date();


}

// finds the most similar string to input that is in options
function getClosest(input, options) {
    var closest = "";
    var leastDistance = input.length;
    for (var i in options) {
        var option = options[i];
        var distance = editDistance(input, option.slice(0, input.length));
        console.log(option, distance);
        if (distance < leastDistance) {
            closest = option;
            leastDistance = distance;
        }
    }
    return closest;
}

// calculates the damerau-levenshtein (with adjacent letter swaps) minimum edit distance from string1 to string2
function editDistance(string1, string2) {
    var insertionWeight = 1;
    var deletionWeight = 1;
    var substitutionWeight = 1;
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
            var insertionDist = distance[i][j - 1] + insertionWeight;
            var deletionDist = distance[i - 1][j] + deletionWeight;
            var substitutionDist = distance[i - 1][j - 1] + substitutionWeight * (string1[i - 1] === string2[j - 1] ? 0 : 1);
            var swapDist = Math.max(n, m); // just initialize as largest in case you cannot swap
            if (i >= 2 && j >= 2) {
                var validSwap = string1[i - 2] === string2[j - 1] && string1[i - 1] === string2[j - 2];
                swapDist = distance[i - 2][j - 2] + (validSwap ? swapWeight : swapWeight + 1);
            }

            distance[i][j] = Math.min(insertionDist, deletionDist, substitutionDist, swapDist);
        }
    }

    return distance[n][m];
}