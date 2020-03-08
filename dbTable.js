var inquirer = require("inquirer");
var mysql = require("mysql");
const cTable = require('console.table');

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Xrch@6972",
  database: "employeeTracker_DB"
});

function getKeyInquirer(key) {
  if (key.includes("id")) {
    var res = {
      name: key,
      type: "number",
      message: `What is the ${key}?`
    }
  } 
  else {
    var res = {
      name: key,
      type: "input",
      message: `What is the ${key}?`
    }
  }
  return res;
}

function getKeyAnswerPairs(keys, answer) {
  var dict = {};
  keys.forEach(function (item, index) {
    dict[item] = answer[item];
  });
  return dict
}

class DBTable {
  constructor(connection, tableName, keys) {
    this.connection = connection;
    this.tableName = tableName;
    this.keys = keys;
  }

  insert(answer) {
    // when finished prompting, insert a new item into the db with that info
    // console.log(getKeyAnswerPairs(this.keys, answer));
    this.connection.query(
      `INSERT INTO ${this.tableName} SET ?`,
      getKeyAnswerPairs(this.keys, answer),
      function(err) {
        if (err) throw err;
        console.log("Your action was successfully!");
      }
    );
  }

  async insertEntry(cb) {
    // console.log(questions);
    const answer = await inquirer.prompt(
      this.keys.map(getKeyInquirer)
    );
    // console.log(answer);
    this.insert(answer);
    cb();
  }

  viewEntry(cb) {
    this.connection.query(
      `SELECT * FROM ${this.tableName}`, function(err, results) {
        if (err) throw err;
        console.log("\n");
        console.table(results);
      }
    )
  }

  update(answer, primaryKey, updateKey) {
    var pk = {};
    var uk = {};
    pk[primaryKey] = answer[primaryKey];
    uk[updateKey] = answer[updateKey];
    connection.query(
      `UPDATE ${this.tableName} SET ? WHERE ?`,
      [
        uk, pk
      ],
      function(error) {
        if (error) throw err;
        console.log("Update successfully!");
      }
    );
  }

  async updateEntry(primaryKey, updateKey, cb) {
    const answer = await inquirer.prompt(
      [primaryKey, updateKey].map(getKeyInquirer)
    );
    // console.log(answer);
    this.update(answer, primaryKey, updateKey);
    cb();
  }
}

module.exports = DBTable;
