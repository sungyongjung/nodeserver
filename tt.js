var mysql = require('mysql');

var client = mysql.createClient({
    user: 'root',
    password: '1000742',
    database: 'nodedb'
});

console.log(client);

client.query("select * from user;", function(a, b) {
    console.log(a);
});
