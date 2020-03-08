var inquirer = require("inquirer");
var mysql = require("mysql");
const cTable = require('console.table');

function processAllInTable(connection, tableName, cb) {
  connection.query(
    `SELECT * FROM ${tableName}`, function(err, results) {
      if (err) throw err;
      cb(connection, results);
    }
  );
}

function updateInTable(connection, tableName, data, primaryKey, updateKey, cb) {
  var pk = {};
  var uk = {};
  pk[primaryKey] = data[primaryKey];
  uk[updateKey] = data[updateKey];
  connection.query(
    `UPDATE ${tableName} SET ? WHERE ?`,
    [
      uk, pk
    ],
    function(err) {
      if (err) throw err;
      console.log("\nYour update action was successfully!");
      cb();
    }
  );
}

function insertInTable(connection, tableName, data, cb) {
  // when finished prompting, insert a new item into the db with that info
  // console.log(getKeyAnswerPairs(this.keys, answer));
  connection.query(
    `INSERT INTO ${tableName} SET ?`,
    data,
    function(err) {
      if (err) throw err;
      console.log("\nYour insert action was successfully!");
      cb();
    }
  );
}

class DBTable {
  constructor(connection) {
    this.connection = connection;
  }

  insertDepartment(cb) {
    processAllInTable(this.connection, "department", function(connection, departmentResults) {
      console.log("\n");
      inquirer.prompt(
        [
          {
            name: "name",
            message: 'What is the name?',
            type: "input"
          }
        ])
        .then(function(answer) {
          insertInTable(connection, "department", answer, cb);
      });
    });
  }

  insertRole(cb) {
    processAllInTable(this.connection, "department", function(connection, departmentResults) {
      // console.log("\n");
      // console.table(departmentResults);
      console.log("\n");
      inquirer.prompt(
        [
          {
            name: "title",
            message: 'What is the title?',
            type: "input"
          },
          {
            name: "salary",
            message: 'What is the salary?',
            type: "number"
          },
          {
            name: "department_id",
            message: 'What is the department?',
            type: "list",
            choices: departmentResults.map(function(element) {
              return {
                "name": element.name,
                "value": element.id
              }
            })
          }
        ])
        .then(function(answer) {
          insertInTable(connection, "role", answer, cb);
      });
    });
  }

  insertEmployee(cb) {
    processAllInTable(this.connection, "role", function(connection, roleResults) {
      processAllInTable(connection, "employee", function(connection, employeeResults) {
        // console.log("\n");
        // console.table(roleResults);
        // console.log("\n");
        // console.table(employeeResults);
        // console.log(roleResults.map(element => element.title));
        // console.log(employeeResults.map(element => element.first_name + " " + element.last_name));
        console.log("\n");
        inquirer.prompt(
          [
            {
              name: "first_name",
              message: 'What is the first name?',
              type: "input"
            },
            {
              name: "last_name",
              message: 'What is the last name?',
              type: "input"
            },
            {
              name: "role_id",
              message: 'What is the title?',
              type: "list",
              choices: roleResults.map(function(element) {
                return {
                  "name": element.title,
                  "value": element.id
                }
              })
            },
            {
              name: "manager_id",
              message: 'Who is the manager?',
              type: "list",
              choices: employeeResults.map(function(element) {
                return {
                  "name": element.first_name + " " + element.last_name,
                  "value": element.id
                }
              })
            }
          ])
          .then(function(answer) {
            insertInTable(connection, "employee", answer, cb);
        });
      });
    });
  }

  viewTable(tableName, cb) {
    processAllInTable(this.connection, tableName, function(connection, results) {
      console.log("\n");
      console.table(results);
      cb();
    });
  }

  udpateEmployeeRole(cb) {
    processAllInTable(this.connection, "role", function(connection, roleResults) {
      processAllInTable(connection, "employee", function(connection, employeeResults) {
        console.log("\n");
          inquirer.prompt([
            {
              name: "id",
              message: 'Who to update?',
              type: "list",
              choices: employeeResults.map(function(element) {
                return {
                  "name": element.first_name + " " + element.last_name,
                  "value": element.id
                }
              })
            },
            {
              name: "role_id",
              message: 'Update to which role?',
              type: "list",
              choices: roleResults.map(function(element) {
                return {
                  "name": element.title,
                  "value": element.id
                }
              })
            }
          ]).then(function(answer) {
            updateInTable(connection, "employee", answer, "id", "role_id", cb);
        });
      });
    });
  }

}

module.exports = DBTable;
