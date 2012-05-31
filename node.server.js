var fs = require('fs');

var http = require('http');

var server = http.createServer(function (request,response){
    
    var date = new Date();
    date.setDate(date.getDate()+7);
    
    fs.readFile('index.html', function(error, data){
        response.writeHead(200, {
            'Content-Type': 'text/html',
            'Set-Cookie':[
              'username = jung;Expires = ' + date.toUTCString(),
              'age = 27;max-age = ' +60*60,
              'location = koera; path = /'],
            'Connection': 'close'
          });
        response.end(data);
        });
    }).listen(52273, function(){
    console.log('Server Running at http://127.0.0.1:52273');
    });
