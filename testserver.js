var mysql = require('db-mysql');
new mysql.Database({
        hostname: 'localhost',
        user: 'root',
        password: '1000742',
        database: 'nodedb'
     }).on('error', function(error) {
        console.log('ERROR: ' + error);
     }).on('ready', function(server) {
        console.log('Connected to ' + server.hostname + ' (' + server.version + ')');
     }).connect(function(error) {
          if (error) {
               return console.log('CONNECTION error: ' + error);
          }
          this.query().
              select('*').
              from('products').
                execute(function(error, result) {
                   if (error) {
                     console.log('ERROR: ' + error);
                      return;
                   }
          });
      });
