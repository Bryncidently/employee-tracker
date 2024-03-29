const inquirer = require('inquirer');
const connection = require('./db/connector.js');

var emp_tracker = function () {
inquirer
//where you get to choose your action
  .prompt([
    {
        type: 'list',
        message: 'What would you like to do?',
        name: 'prompt',
        choices: [
            "View All Departments",
            "View All Titles",
            "View All Employees",
            "Add Department",
            "Add Title",
            "Add Employee",
            "Update Employee Title",
            "Done!",
        ]
      },
  ])

 
  .then((choice) => {
    //shows you the departments table
    if (choice.prompt === "View All Departments") {
      connection.query(`SELECT * FROM departments`, (err, result) => {
        if (err) throw err;
        console.table(result);
        emp_tracker();
      });
      
    //shows the titles roles table  
    } else if (choice.prompt === "View All Titles") {
      connection.query(`SELECT * FROM roles`, (err, result) => {
        if (err) throw err;
        console.table(result);
        emp_tracker();
      });
    
     //shows the employees table
    } else if (choice.prompt === "View All Employees") {
      connection.query(`SELECT * FROM employees`, (err, result) => {
        if (err) throw err;
        console.table(result);
        emp_tracker();
      });
     
    //add a new department  
    } else if (choice.prompt === "Add Department") {
      inquirer
        .prompt([
          {
            type: "input",
            name: "department",
            message: "What new department would you like to add?",
            validate: (newDept) => {
              if (newDept) {
                return true;
              } else {
                console.log("Still waiting for you to add an department...");
                return false;
              }
            },
          },
        ])
        .then((choice) => {
          connection.query(
            `INSERT INTO departments (department_name) VALUES (?)`,
            [choice.department],
            (err, result) => {
              if (err) throw err;
              console.log(`Added ${choice.department}.`);
              emp_tracker();
            }
          );
        });
     
  //add new title with salary and department
  } else if (choice.prompt === "Add Title") {
  connection.query(`SELECT * FROM departments`, (err, result) => {
    if (err) throw err;
    inquirer.prompt([
      {
        type: "input",
        name: "title",
        message: "What new title would you like to add?",
        validate: (newTitle) => {
          if (newTitle) {
            return true;
          } else {
            console.log("You still haven't added a title...");
            return false;
          }
        },
      },
      {
        type: "input",
        name: "salary",
        message: "What is the salary of the new role?",
        validate: (newSalary) => {
          if (newSalary) {
            return true;
          } else {
            console.log("Are they working for free? Add a salary!");
            return false;
          }
        },
      },
      {
        type: "list",
        name: "department",
        message: "What department is the new role in?",
        choices: result.map((dept) => dept.department_name),
      },
    ])
    .then((choice) => {
      connection.query(
        `INSERT INTO roles (title, salary, department) VALUES (?, ?, ?)`,
        [choice.title, choice.salary, choice.department],
        (err, result) => {
          if (err) throw err;
          console.log(`Added ${choice.title}.`);
          emp_tracker();
        }
      );
    });
  });

//add new employee  
} else if (choice.prompt === "Add Employee") {
  connection.query(`SELECT * FROM roles`, (err, result) => {
    if (err) throw err;
    inquirer.prompt([
      {
        type: "input",
        name: "firstName",
        message: "What is the employee's first name?",
        validate: (firstNameInput) => {
          if (firstNameInput) {
            return true;
          } else {
            console.log("Add a first name!");
            return false;
          }
        },
      },
      {
        type: "input",
        name: "lastName",
        message: "What is the employee's last name?",
        validate: (lastNameInput) => {
          if (lastNameInput) {
            return true;
          } else {
            console.log("Add a last name!");
            return false;
          }
        },
      },
      {
        type: "list",
        name: "title",
        message: "What is the employee's title?",
        choices: result.map((role) => role.title),
      },
      {
        type: "input",
        name: "manager",
        message: "Enter the manager's name.",
        validate: (managerName) => {
          if (managerName) {
            return true;
          } else {
            console.log("Add a manager!");
            return false;
          }
        },
      },
    ])
    .then((choice) => {
      const selectedRole = result.find((role) => role.title === choice.title);
      const department = selectedRole ? selectedRole.department : null;
      const salary = selectedRole ? selectedRole.salary : null;

      connection.query(
        `INSERT INTO employees (first_name, last_name, title, department, salary, manager) VALUES (?, ?, ?, ?, ?, ?)`,
        [choice.firstName, choice.lastName, choice.title, department, salary, choice.manager],
        (err, result) => {
          if (err) throw err;
          console.log(`Added ${choice.firstName} ${choice.lastName}.`);
          emp_tracker();
        }
      );
    });
  });
 //update employee title
    } else if (choice.prompt === "Update Employee Title") {
        connection.query(`SELECT * FROM employees`, (err, result) => {
          if (err) throw err;
          inquirer.prompt([
            {
              type: "list",
              name: "employee",
              message: "What employee needs to be updated?",
              choices: result.map((employee) => `${employee.first_name} ${employee.last_name}`),
            },
          ])
          .then((employeeChoice) => {
            const [firstName, lastName] = employeeChoice.employee.split(' ');
            connection.query(`SELECT * FROM roles`, (err, result) => {
              if (err) throw err;
              inquirer.prompt([
                {
                  type: "list",
                  name: "title",
                  message: "Enter the employee's new title",
                  choices: result.map((role) => role.title),
                },
              ])
              .then((titleChoice) => {
                connection.query(
                  `UPDATE employees SET title = ? WHERE first_name = ? AND last_name = ?`,
                  [titleChoice.title, firstName, lastName],
                  (err, result) => {
                    if (err) throw err;
                    console.log(`Updated ${employeeChoice.employee}'s title.`);
                    emp_tracker();
                  }
                );
              });
            });
          });
        });
  //you out!    
    } else if (choice.prompt === "Done!") {
      connection.end();
      console.log("Byeeeeeeee!");
    }
  });
};

connection.connect((err) => {
  if (err) throw err;
  console.log("Database connected.");
  emp_tracker();
});






  

