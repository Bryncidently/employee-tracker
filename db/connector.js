const mysql = require('mysql');


const connection = mysql.createConnection({
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: 'K6733910y!',
  database: 'employee_db',
});



module.exports = connection;
