//Dependencies
const connection = require("./db/connection");
const inquirer = require("inquirer");


//Inquirer Menus
const mainMenu = {
    type: "list",
    name: "mainMenu",
    message: "Choose a basic action:",
    choices: [
      "View",
      "Add",
      "Update",
    //   "Delete",
    ]
};

const viewMenu = {
    type: "list",
    name: "viewMenu",
    message: "Choose one:",
    choices: [
        "View all employees",
        "View all roles",
        "View all departments",
    ]
};

const addMenu = {
    type: "list",
    name: "addMenu",
    message: "Choose one:",
    choices: [
        "Add new employee",
        "Add new role",
        "Add new department",
    ]
};

const updateMenu = {
    type: "list",
    name: "updateMenu",
    message: "Choose one:",
    choices: [
        "Update employee's role",
        // "Update employee's manager",
    ]
};

// const deleteMenu = {
//     type: "list",
//     name: "deleteMenu",
//     message: "Choose one:",
//     choices: [
//         "Delete employee",
//         "Delete role",
//         "Delete department",
//     ]
// };


//Inquirer Swtich Cases
function askMain() {
    console.log("-----------------------------------------------------------")
    console.log("---MAIN MENU---")
    inquirer.prompt(mainMenu).then(answer => {
        switch (answer.mainMenu) {
            case "View":
                askView();
                break;
            case "Add":
                askAdd();
                break;
            case "Update":
                askUpdate();
                break;
            // case "Delete":
            //     askDelete();
            //     break;
        };
    });
};

function askView() {
    console.log("---VIEW---");
    inquirer.prompt(viewMenu).then(answer => {
        switch (answer.viewMenu) {
            case "View all employees":
                viewEmployees();
                break;
            case "View all roles":
                viewRoles();
                break;
            case "View all departments":
                viewDepartments();
                break;
        };
    });
};

function askAdd() {
    console.log("---ADD---");
    inquirer.prompt(addMenu).then(answer => {
        switch (answer.addMenu) {
            case "Add new employee":
                addEmployee();
                break;
            case "Add new role":
                addRole();
                break;
            case "Add new department":
                addDepartment();
                break;
        };
    });
};

function askUpdate() {
    console.log("---UPDATE---");
    populateArrays();
    inquirer.prompt(updateMenu).then(answer => {
        switch (answer.updateMenu) {
            case "Update employee's role":
                updateRole();
                break;
            // case "Update employee's manager":
            //     updateManager();
            //     break;
        };
    });
};

// function askDelete() {
//     console.log("---DELETE---");
//     inquirer.prompt(deleteMenu).then(answer => {
//         switch (answer.deleteMenu) {
//             case "Delete employee":
//                 deleteEmployee();
//                 break;
//             case "Delete role":
//                 deleteRole();
//                 break;
//             case "Delete department":
//                 deleteDepartment();
//                 break;
//         };
//     });
// };


//Switch Case Functions
//Common Queries
let allEmployeesQuery = `SELECT e.id, CONCAT(e.last_name, ", ", e.first_name) AS employee, roles.title, departments.name AS department, CONCAT(m.last_name, ", ", m.first_name) AS manager, roles.salary FROM employees e LEFT JOIN roles ON e.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id LEFT JOIN employees m ON m.id = e.manager_id ORDER BY e.last_name;`;

let allRolesQuery = `SELECT roles.id, roles.title, roles.salary, departments.name AS department FROM roles LEFT JOIN departments ON roles.department_id = departments.id ORDER BY roles.title;`;

let allDepartmentsQuery = `SELECT * FROM departments ORDER BY departments.name;`;

//view
function viewEmployees() {
    connection.query(allEmployeesQuery, callback);
};

function viewRoles() {
    connection.query(allRolesQuery, callback);
};

function viewDepartments() {
    connection.query(allDepartmentsQuery, callback);
};

//add
function addEmployee() {
    let roleArray = [];
    connection.query(allRolesQuery, function(err, res) {
        if (err) {
            console.log("Error!");
            console.log(err);
            askMain();
        } else {
            res.forEach(role =>
                roleArray.push(role.id + " " + role.title))
        };
    });

    let newEmployeeQs = [
        {
            type: "input",
            name: "firstName",
            message: "Enter employee's first name."
        },{
            type: "input",
            name: "lastName",
            message: "Enter employee's last name."
        },{
            type: "list",
            name: "role",
            message: "Choose an existing role for this employee:",
            choices: roleArray
        }
    ];

    //add functionality for assigning manager in the future

    inquirer.prompt(newEmployeeQs).then(answer => {
        connection.query(`INSERT INTO employees SET ?;`, 
        {
            first_name: answer.firstName,
            last_name: answer.lastName,
            role_id: answer.role.charAt(0)
        },
        viewEmployees);
    });
};


function addRole() {
    let departmentArray = [];
    connection.query(allDepartmentsQuery, function(err, res) {
        if (err) {
            console.log("Error!");
            console.log(err);
            askMain();
        } else {
            res.forEach(department =>
                departmentArray.push(department.id + " " + department.name))
        };
    });

    let newRoleQs = [
        {
            type: "input",
            name: "title",
            message: "Enter a title for this role."
        },{
            type: "number",
            name: "salary",
            message: "Enter a salary for this role."
        },{
            type: "list",
            name: "department",
            message: "Choose an existing department for this role:",
            choices: departmentArray
        }
    ];

    inquirer.prompt(newRoleQs).then(answer => {
        connection.query(`INSERT INTO roles SET ?;`, 
        {
            title: answer.title,
            salary: answer.salary,
            department_id: answer.department.charAt(0)
        },
        viewRoles);
    });
};

function addDepartment() {
    let newDepartmentQs = {
        type: "input",
        name: "name",
        message: "Enter a name for this department."
    };

    inquirer.prompt(newDepartmentQs).then(answer => {
        connection.query(`INSERT INTO departments SET ?;`, 
        {
            name: answer.name
        },
        viewDepartments);
    });
}

//update
let employeeArray = [];
let roleArray = [];

function populateArrays() {
    connection.query(allEmployeesQuery, function(err, res) {
        if (err) {
            console.log("Error!");
            console.log(err);
            askMain();
        } else {
            res.forEach(employee => {
                employeeArray.push(employee.id + " " + employee.employee)
            });
        };
    });
    connection.query(allRolesQuery, function(err, res) {
        if (err) {
            console.log("Error!");
            console.log(err);
            askMain();
        } else {
            res.forEach(role =>
                roleArray.push(role.id + " " + role.title))
        };
    });
}

function updateRole() {
    let updateRoleQs = [
        {
            type: "list",
            name: "employee",
            message: "Choose an existing employee to update:",
            choices: employeeArray
        },{
            type: "list",
            name: "role",
            message: "Choose an existing role to assign:",
            choices: roleArray
        }
    ];

    inquirer.prompt(updateRoleQs).then(answer => {
        console.log(answer)
        connection.query(`UPDATE employees SET role_id = ? WHERE id = ?;`, 
        [
            answer.role.charAt(0),
            answer.employee.charAt(0)
        ],
        viewEmployees);
    });
}


//CALLBACK
function callback(err, res) {
    if (err) {
        console.log("Error!");
        console.log(err);
        askMain();
    } else {
        console.log("Query succesful!");
        console.table(res);
        askMain();
    };
};

askMain();