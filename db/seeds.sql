USE employee_tracker_db;

INSERT INTO departments (name)
VALUES 
    ("Sales"),
    ("Engineering"),
    ("Finance"),
    ("Legal");

INSERT INTO roles (title, salary, department_id)
VALUES 
    ("Sales Lead", 100000, 1),
    ("Salesperson", 80000, 1),
    ("Lead Engineer", 150000, 2),
    ("Software Engineer", 130000, 2),
    ("Accounting Manager", 160000, 3),
    ("Accountant", 140000, 3),
    ("Legal Team Lead", 200000, 4),
    ("Lawyer", 180000, 4);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES 
    ("John", "Doe", 1, NULL),
    ("Jane", "Doe", 2, 1),
    ("Dexter", "McPherson", 3, NULL),
    ("Johnny", "Bravo", 4, 3),
    ("JP", "Morgan", 5, NULL),
    ("Barack", "Obama", 7, NULL);