const input = prompt();
console.log("Input:", input);

const months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "november", "december"];
const weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const dayReferences = ["today", "tomorrow", "this", "next"];

console.log("Closest month:", getClosest(input, months));

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

/*
ROADMAP
- Parsing input
    - Months
    - Weekdays
    - Task name from time, test out returning an object
    - Today, tomorrow
    - this weekday, next weekday
    - Is it a task, event, or thing?
- Storing data
    - Think about what data structures are optimal
- UI
    - React!!!
    - Displaying tables
- Back to data
    - Node!!!
    - Storing and reading locally
- UX
    - Allow the user to edit elements

*/


// takes in a string input, separates task name from time from other elements and outputs an object of a new task, event, thing, etc
function parseInput(input) {

    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)


}

// finds the most similar string to input that is in options
function getClosest(input, options) {
    let closest = "";
    let leastDistance = input.length;
    for (let i in options) {
        let option = options[i];
        let distance = editDistance(input, option.slice(0, input.length));
        if (distance < leastDistance) {
            closest = option;
            leastDistance = distance;
        }
    }
    return closest;
}

// calculates the damerau-levenshtein (with adjacent letter swaps) minimum edit distance from string1 to string2
function editDistance(string1, string2) {
    const insertionWeight = 1;
    const deletionWeight = 1;
    const substitutionWeight = 1;
    const swapWeight = 1;

    const n = string1.length;
    const m = string2.length;
    // initialize 2d array in one line
    // let array = Array(rows).fill().map(() => Array(columns).fill(0));
    let distance = [];
    for (let i = 0; i < n + 1; i++) {
        distance.push(new Array(m + 1).fill(0));
    }

    // initialize comparison between empty string to the other string
    for (let i = 0; i <= n; i++) {
        distance[i][0] = i;
    }
    for (let i = 0; i <= m; i++) {
        distance[0][i] = i;
    }

    // calculate the rest of the slots
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= m; j++) {
            let insertionDist = distance[i][j - 1] + insertionWeight;
            let deletionDist = distance[i - 1][j] + deletionWeight;
            let substitutionDist = distance[i - 1][j - 1] + substitutionWeight * (string1[i - 1] === string2[j - 1] ? 0 : 1);
            let swapDist = Math.max(n, m); // just initialize as largest in case you cannot swap
            if (i >= 2 && j >= 2) {
                let validSwap = string1[i - 2] === string2[j - 1] && string1[i - 1] === string2[j - 2];
                swapDist = distance[i - 2][j - 2] + (validSwap ? swapWeight : swapWeight + 1);
            }

            distance[i][j] = Math.min(insertionDist, deletionDist, substitutionDist, swapDist);
        }
    }

    return distance[n][m];
}