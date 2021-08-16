INSERT INTO departments (dep_name)
VALUES
('KC'),
('Data Security');

INSERT INTO roles (title, salary, department_id)
VALUES
('CEO', 500000, 1),
('Vice President', 400000, 2),
('Project Manager', 300000, 2),
('Senior Manager', 150000, 2),
('Employee', 90000, 2),
('Intern', 40000, 2);


INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
('Kyle', 'A', 1, 1),
('Jorge', 'M', 2, 2),
('John', 'K', 3, 3),
('Andy', 'H', 4, 4),
('Lisa', 'C', 5, 5),
('Albert', 'J', 6, 6),
('Jared', 'G', 7, 6);



