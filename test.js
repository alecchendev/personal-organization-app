//const input = prompt();
const input = "asdf due dec 13 1159p";
console.log("Input:", input);

const months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
const weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const dayReferences = ["today", "tomorrow", "this", "next"];
const timeWords = {
    "task": "due",
    "event": "at",
    "thing": ""
};

//console.log("Closest month:", getClosest(input, months));

//console.log(parseInput(input));

const data = {
    "tasks": [

    ]
    // "events": [],
    // "things": []
};

storeData(parseInput(input));
console.log(data);

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
    Time word - at--, from-to(?), due
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
THINGS DONE BEFORE ROADMAP
- DONE Recognizing months
- DONE Recognizing weekdays

ROADMAP
- DONE Parsing input - just test for base input form of | task name | due | month day (year) time | - asdf due dec 13 1159p
    - DONE Recognize and parse task name from date from time, test out returning an object
- Storing data
    - Think about what data structures are optimal
        - Probably just store in a js object that has a tasks array
        - Task array holds task objects
        - That's p much it
        - Possibly have an abstract class for elements - tasks, events, and things would all extend element
    - Test out getting task from input into an object
- UI
    - React!!!
    - Displaying tables
- Back to data
    - Node!!!
    - Storing and reading locally
- Parsing input pt. 2
    - Is it a task, event, or thing?
- Storing data pt. 2
    - Tasks vs events vs things - probably just make 3 of the same type of thing
    - Store new data
    - display new data
- UX
    - Allow the user to edit elements
- Parsing input pt. 3
    - Assuming today's and so on
    - Today, tomorrow
    - this weekday, next weekday
    - Anything else you think of

*/

// takes object and stores it in data
function storeData(object) {
    const type = "tasks";
    data[type].unshift(object); // push most recent task to the top
}


// takes in a string input, separates task name from time from other elements and outputs an object of a new task, event, thing, etc
function parseInput(input) {

    /*
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    */

    // Strategies
    // separate by keywords - at, due
    // separate multiple times by hyphen (-), assume same day unless specified otherwise

    // check valid input
    if (checkValidInput(input)) {

    }

    // parsing - current/basic form - asdf due dec 13 1159p
    if (input.includes(timeWords["task"])) {
        const name = input.split(timeWords["task"])[0].trim();
        const dateTime = input.split(timeWords["task"])[1];
        console.log("Name:", name);
        const time = dateTime.match(/\d+\w{1,2}$/)[0];
        const hours = parseInt(time.slice(0, 2)) + (time[5] === "p" ? 12 : 0);
        const minutes = parseInt(time.slice(2, 4));
        console.log("Time:", time);
        const date = dateTime.replace(time, "").trim();
        console.log(date);
        // assume time is today
        const today = new Date();
        const year = today.getFullYear();
        const month = parseInt(months.findIndex(x => x === getClosest(date.split(" ")[0], months))); // findIndex takes in a method to test
        const day = parseInt(date.split(" ")[1]);
        console.log(day);
        console.log(month);
        console.log(year);

        const task = {
            "name": name,
            // figure out better naming so you can avoid confusion here
            "date": new Date(year, month, day, hours, minutes)
        };

        return task;
    }


}

// checks if the input is of a form able to be parsed into an element object
function checkValidInput(input) {
    const validForm = /asdf/;
    return validForm.test(input);
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