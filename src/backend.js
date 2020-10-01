
//export {readJson};

const fileSync = require("fs");

function dummyFunction() {
    return 1;
}

function readJson() {
    let rawdata = fileSync.readFileSync('data.json');
    let dataObj = JSON.parse(rawdata);
    console.log(dataObj);
    console.log(typeof(dataObj));
}

readJson()