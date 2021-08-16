const { response } = require("express");
const inquirer = require("inquirer");

const db = require("./db/connection");
const mysql = require("mysql2");

function showList() {
  return inquirer
    .prompt({
      name: "start",
      type: "list",
      message: "Please select below options.",
      choices: [
        "View All Departments",
        "View All Employees",
        "View All Roles",
        "Add Department",
        "Add Employee",
        "Add Role",
        "Update Employee",
      ],
    })
    .then((response) => {
      if (response.start === "View All Departments") showDepartments();
      else if (response.start === "View All Employees") showEmployees();
      else if (response.start === "View All Roles") showRoles();
      else if (response.start === "Add Department") addDepartment();
      else if (response.start === "Add Employee") addEmployee();
      else if (response.start === "Add Role") addRole();
      else if (response.start === "Update Employee") updateEmployee();
    });
}

// GET all Departments
function showDepartments() {
  db.query(`SELECT * FROM departments`, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    showList();
  });
}

// GET all roles
function showRoles() {
  db.query(`SELECT * FROM roles`, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    showList();
  });
}

// GET all employees
function showEmployees() {
  db.query(`SELECT * FROM employees`, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    showList();
  });
}

// ADD departments with async function
async function addDepartment() {
  let departmentAns = await inquirer.prompt([
    {
      name: "departmentName",
      type: "input",
      message: "Please enter department name -> ",
    },
  ]);

  // ADD to department table what user type
  db.query(`INSERT INTO departments SET ? `, {
    dep_name: departmentAns.departmentName,
  });

  console.log(
    `${departmentAns.departmentName} was added into your company departments !`
  );
  showList();
}

// ADD new role to role table what user added
async function addRole() {
  // Call the departments to show user what departments user can select
  const departmentChoice = await db
    .promise()
    .query(`SELECT * FROM departments`);

  let departmentArray = [];

  // Add all of the departments to empty array (departmentArray)
  for (let i = 0; i < departmentChoice[0].length; i++) {
    departmentArray.push(departmentChoice[0][i].dep_name);
  }

  let userAnswer = await inquirer.prompt([
    {
      name: "title",
      type: "input",
      message: "Enter the name of the new role -> ",
    },
    {
      name: "salary",
      type: "input",
      message: "Enter the salary for new role -> ",
    },
    {
      name: "departmentName",
      type: "list",
      // now can see departments from empty array what i added all departments
      choices: departmentArray,
    },
  ]);

  var departmentID = await db
    .promise()
    .query(
      `SELECT id FROM departments WHERE dep_name = ? `,
      userAnswer.departmentName
    );

  // Add new role into table
  db.query(`INSERT INTO roles SET ?`, {
    title: userAnswer.title,
    salary: userAnswer.salary,
    department_id: departmentID[0][0].id,
  });

  console.log(
    `The new ${userAnswer.title} role has been added into role table`
  );
  showList();
}

// ADD new employee
async function addEmployee() {
  const roleChoice = await db.promise().query(`SELECT * FROM roles`);

  let roleArray = [];

  for (let i = 0; i < roleChoice[0].length; i++) {
    roleArray.push(roleChoice[0][i].title);
  }

  let userAnswer = await inquirer.prompt([
    {
      name: "firstName",
      type: "input",
      message: "What is the new employee's first name? -> ",
    },
    {
      name: "lastName",
      type: "input",
      message: "What is the new employee's last name? -> ",
    },
    {
      name: "employeeRole",
      type: "list",
      choices: roleArray,
    },
    {
      name: "managerID",
      type: "input",
      message: "What is the manager's ID? -> ",
    },
  ]);

  var roleID = await db
    .promise()
    .query(`SELECT id FROM roles WHERE title = ? `, userAnswer.employeeRole);

  db.query(`INSERT INTO employees SET ?`, {
    first_name: userAnswer.firstName,
    last_name: userAnswer.lastName,
    role_id: roleID[0][0].id,
    manager_id: userAnswer.managerID,
  });
  console.log(
    `The new employee ${userAnswer.firstName} + ${userAnswer.lastName} has been added into employee table !`
  );
  showList();
}

//Update employee role
async function updateEmployee() {
  let employeeChoice = await db.promise().query(`SELECT * FROM employees`);
  let roleChoice = await db.promise().query(`SELECT * FROM roles`);
  let employeeArray = [];
  let roleArray = [];

  for (let i = 0; i < employeeChoice[0].length; i++) {
    employeeArray.push(employeeChoice[0][i].first_name);
  }

  for (let i = 0; i < roleChoice[0].length; i++) {
    roleArray.push(roleChoice[0][i].title);
  }

  //console.log(roleArray);

  let updateInfo = await inquirer.prompt([
    {
      name: "select",
      type: "list",
      message: "Which employee do you want to update? -> ",
      choices: employeeArray,
    },
    {
      name: "newRole",
      type: "list",
      message: "Select new role for this employee -> ",
      choices: roleArray,
    },
  ]);

  let employeeID = await db
    .promise()
    .query(`SELECT id FROM employees WHERE first_name = ?`, updateInfo.select);

  let roleID = await db
    .promise()
    .query(`SELECT id FROM roles WHERE title = ?`, updateInfo.newRole);

  //console.log(employeeID[0][0].id);
  //console.log(roleID[0][0].id);

  var newID = await db
    .promise()
    .query(
      `UPDATE employees SET role_id = ? WHERE employees.id = ${employeeID[0][0].id}`,
      roleID[0][0].id
    );
  console.log(`The ${updateInfo.select} has been changed. `);
  showList();
}

db.connect((err) => {
  if (err) throw err;
});

showList();
