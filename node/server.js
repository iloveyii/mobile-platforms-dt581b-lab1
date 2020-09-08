const http = require('http');
const mysql = require('mysql');
const fs = require('fs');
const path = require('path');

const db = mysql.createConnection({
    host: 'localhost',
    database: 'lab1',
    user: 'root',
    password: 'root'
});

db.connect({}, error => {
    if (error) {
        throw error;
    }

    console.log('MySql connected');
    insertIntoMysql();
});

const insertIntoMysql = () => {
    const rows = [
        ['unit 01', 1],
        ['unit 02', -2],
        ['unit 03', 3],
        ['unit 04', 2]
    ];
    db.query('DELETE from units WHERE id > 0', (error, result) => {
        console.log('DELETED ' + result.affectedRows);
    })
    db.query('insert into units(unit_id, temperature)  VALUES ?', [rows], function (error, result) {
        if(error) throw error;
        console.log("Number of records inserted: " + result.affectedRows);
    })
}

const port = 7000;
const hostname = 'localhost';

const readFile = (fileName) => {
    const data = fs.readFileSync(path.resolve(__dirname, fileName));
    return data;
};

const getTable = (rows) => {
    let table = '<table class="table table-hover">';
    table += '<thead><tr><th>unit</th><th>temperature</th></tr></thead><tbody>';
    rows.map(row => {
        table += '<tr>';
            table += `<td>${row['unit_id']}</td>`
            table += `<td>${row['temperature']}</td>`
        table += '</tr>';
    });
    table += '</tbody></table>';
    return table;
};

const handleRequest = (request, response) => {
    response.status = 200;
    response.setHeader('Content-Type', 'text/html');
    if (db)
        db.query('select * from units', (error, result, fields) => {
            if (error) throw error;
            const header = readFile('header.html');
            const data = getTable(result);
            const footer = readFile('footer.html');
            response.end(header + data + footer);
        });

};

http.createServer(handleRequest).listen(port, hostname, () => {
    console.log(`http server is listing on http://${hostname}:${port}`)
});

