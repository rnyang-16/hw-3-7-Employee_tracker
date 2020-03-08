var mysql = require("mysql");
var inquirer = require("inquirer");
var DBTable = require("./dBTable");

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

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});

// function which prompts the user for what action they should take
function start() {
  inquirer
    .prompt({
      name: "topOptions",
      type: "list",
      message: "Would you like to [Add], [View] or [Update]?",
      choices: ["Add", "View", "Update", "Exit"]
    })
    .then(function(answer) {
      // based on their answer, either call the addEntry or viewEntry or updateEmployeeRole functions
      if (answer.topOptions === "Add") {
        addEntry();
      }
      else if(answer.topOptions === "View") {
        viewEntry();
      } 
      else if(answer.topOptions === "Update") {
        updateEmployeeRole();
      }
      else{
        connection.end();
      }
    });
}

// function to handle add entry
function addEntry() {
  // prompt for info about the item type
  inquirer
    .prompt({
      name: "entryType",
      type: "list",
      message: "Would you like to add [Employee], [Role] or [Department]?",
      choices: ["Employee", "Role", "Department", "Return"]
    })
    .then(function(answer) {
      if (answer.entryType === "Employee") {
        var table = new DBTable(connection, "employee",
          ["first_name", "last_name", "role_id", "manager_id"]);
        table.insertEntry(start);
      }
      else if(answer.entryType === "Role") {
        var table = new DBTable(connection, "role",
          ["title", "salary", "department_id"]);
        table.insertEntry(start);
      } 
      else if(answer.entryType === "Department") {
        var table = new DBTable(connection, "department",
          ["name"]);
        table.insertEntry(start);
      }
      else {
        start();
      }
    });
}

// function to handle view entry
function viewEntry() {
  // prompt for info about the item type
  inquirer
    .prompt({
      name: "entryType",
      type: "list",
      message: "Would you like to view [Employee], [Role] or [Department]?",
      choices: ["Employee", "Role", "Department", "Return"]
    })
    .then(function(answer) {
      if (answer.entryType === "Employee") {
        var table = new DBTable(connection, "employee",
          ["first_name", "last_name", "role_id", "manager_id"]);
        table.viewEntry();
      }
      else if(answer.entryType === "Role") {
        var table = new DBTable(connection, "role",
          ["title", "salary", "department_id"]);
        table.viewEntry();
      } 
      else if(answer.entryType === "Department") {
        var table = new DBTable(connection, "department",
          ["name"]);
        table.viewEntry();
      }
      start();
    });
}

// function to handle update entry
function updateEmployeeRole() {
  var table = new DBTable(connection, "employee",
          ["first_name", "last_name", "role_id", "manager_id"]);
  table.viewEntry();
  table.updateEntry("id", "role_id", start);
}
