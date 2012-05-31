var fs = require('fs');
var http = require('http');
var url = require('url');


var server = http.createServer(function (request,response){
    
    var date = new Date();
    date.setDate(date.getDate()+7); // after 7day Expires

    var pathname = url.parse(request.url).pathname;



    if(pathname == '/' || pathname == '/index.html'){
       fs.readFile('index.html', function(error, data){
           response.writeHead(200, {
              'Content-Type': 'text/html',
              'Set-Cookie':[
                 'username = jung;Expires = ' + date.toUTCString() + '; HttpOnly',
                 //  'username = jung;Expires = ' + date.toUTCString(),  //No HttpOnly
                 'age = 27',
                 'location = koera; path = /'],
              'Connection': 'close'
             }); //response.writeHead End
         response.end(data);
        }); //readFile-end
    } //if-end index.html
    else if(pathname == '/re.html'){
        fs.readFile('re.html', function(error,data){
           response.writeHead(302, { 'Location': 'http://127.0.0.1:52273/index.html'});
           response.end(data);
        });//readFile-end
    }//if-end re.html
    else{
       fs.readFile('404.html', function(error, data){
          response.writeHead(404);
          response.end(data);
        });//readFile-end
    }//else-end

    }).listen(52273, function(){
    console.log('Server Running at http://127.0.0.1:52273');
    });
