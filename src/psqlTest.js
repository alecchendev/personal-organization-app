// PostgreSQL sandbox
var pg = require("pg");

var connectionString = "postgres://postgres:urincorrect1@localhost:5432/dvdrental";
var pgClient = new pg.Client(connectionString);
pgClient.connect();
var queryResult = pgClient.query("SELECT * FROM Category");
var query = "SELECT * FROM Category";
pgClient.query(query, (err, res) => {
    if (err) {
        console.error(err.stack)
    } else {
        console.log(res.rows) // ['brianc']
    }
})
//console.log(query);
console.log(typeof(queryResult));
pgClient.end();