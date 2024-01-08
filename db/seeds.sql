INSERT INTO departments (id, department_name)
VALUES (1, "Sales"),
       (2, "Engineering"),
       (3, "Finance"),
       (4, "Legal");

INSERT INTO roles (id, title, department, salary)
VALUES (1, "Sales Lead", "Sales", 100000),
	   (2, "Lead Engineer", "Engineering", 200000),
       (3, "Account Manager", "Finance", 150000),
	   (4, "Lawyer", "Legal", 180000);

INSERT INTO employees (id, first_name, last_name, title, department, salary, manager)
VALUES (1, "Leslie", "Knope", "Sales Lead", "Sales", 100000, "Ron Swanson"),
	   (2, "Ron", "Swanson", "Lead Engineer", "Engineering", 200000, "Himself"),
       (3, "Tom", "Haverford", "Account Manager", "Finance", 150000, "Ginuwine"),
	   (4, "April", "Ludgate", "Lawyer", "Legal", 180000, "Satan");