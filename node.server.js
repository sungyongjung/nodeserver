var fs = require('fs');
var http = require('http');
var url = require('url');
var mysql = require('mysql');
var ejs = require('ejs');


   var client = mysql.createClient({
      host: '127.0.0.1',
      port: 3306,
      user: 'root',
      password: '1000742',
      database: 'nodedb',
    });


    var server = http.createServer(function (request,response){

    var date = new Date();
    date.setDate(date.getDate()+7); // after 7day Expires

    var pathname = url.parse(request.url).pathname;
    var rest = pathname.split('/');

    var data = pathname

    if(request.method == 'GET'){

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
           response.writeHead(307, { 'Location': 'http://127.0.0.1:52273/index.html'});
           response.end();
    }//if-end re.html
    else if(rest[1] == 'name'){
          fs.readFile('name.html', 'utf8', function (error,data){
             
              client.query('select * from products', function(err, result){
                    response.writeHead(200);
                    response.end(ejs.render(data,{
                        data: result
                    }));
                });

          });//readFile end
    }//if-end name
    else{
       fs.readFile('404.html', function(error, data){
          response.writeHead(404);
          response.end(data);
        });//readFile-end
    }//else-end
    }//GET-end

    else if(request.method == 'POST'){
        if(rest[1] == 'name' && rest[3] != 'location'){
             fs.readFile('name.txt','utf8', function(error,data){
               fs.writeFile('name.txt', data + rest[2] + ', No Location/\n','utf8');
               response.writeHead(200);
               response.end('POST name : ' + rest[2]);
             });
        }else if(rest[1] == 'location'){
            fs.readFile('name.txt','utf8', function(error,data){
                fs.writeFile('name.txt', data + rest[0] +'No name,  ' + rest[2] + '/\n','utf8');
                response.writeHead(200);
                response.end('POST Location : ' + rest[2]);
             });
        }else if(rest[1] == 'name' && rest[3] == 'location'){
            fs.readFile('name.txt','utf8', function(error,data){
                fs.writeFile('name.txt', data + rest[2] + ',  ' + rest[4] + '/\n','utf8');
                response.writeHead(200);
                response.end('POST name : ' + rest[2] + ' location : ' + rest[4]);
            });
        }else {
                response.writeHead(200);
                response.end('NOT POST');
        }
    }//POST_end

    else if(request.method == 'DELETE'){
          if(rest[1] == 'name'){
              fs.readFile('name.txt','utf8', function(error, data){
                  if(data.indexOf(rest[2])){
                      var namedb = data.indexOf(rest[2]);
                      var db = data.slice(namedb,data.indexOf('\n',namedb)+1);
                      var deldata = data.replace(db,'');
                      fs.writeFile('name.txt',deldata,'utf8');
                      response.writeHead(200);
                      response.end('DELETE : ' + rest[2]);
                    }else{
                      response.wirteHead(200);
                      response.end('I CANT FIND USERs NAME');
                    }
              }); //readFile end
          }// if name end
          else {
                response.writeHead(200);
                response.end('NOT DELETE!');
          }

    }

    }).listen(52273, function(){
    console.log('Server Running at http://127.0.0.1:52273');
    });
