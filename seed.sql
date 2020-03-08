DROP DATABASE IF EXISTS employeeTracker_DB;
CREATE DATABASE employeeTracker_DB;

USE employeeTracker_DB;

CREATE TABLE employee(
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT,
  manager_id INT,
  PRIMARY KEY (id)
);

CREATE TABLE role(
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(10,2),
  department_id INT,
  PRIMARY KEY (id)
);

CREATE TABLE department(
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (1, "Ruonan", "Yang", 1, 1);
INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (1, "Joyce", "Yang", 2, 1);

INSERT INTO role (id, title, salary, department_id)
VALUES (1, "Manager", 100, 1);
INSERT INTO role (id, title, salary, department_id)
VALUES (2, "Vice Manager", 100, 1);

INSERT INTO department (id, name)
VALUES (1, "CEO office");

SELECT * FROM employee;
SELECT * FROM department;
SELECT * FROM role;