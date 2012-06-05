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
    else if(rest[1] == 'list'){
          fs.readFile('list.html', 'utf8', function (error,data){
             
              client.query('select * from products', function(err, result){
                    response.writeHead(200);
                    response.end(ejs.render(data,{
                        data: result
                    }));
                });

          });//readFile end
    }//if-end name
    else if(rest[1] == 'edit'){   //GET 방식의 edit
       var qt = url.parse(request.url).query;
       var queryid = qt.slice(qt.indexOf('=')+1,qt.indexOf('&'));
       var queryname = qt.slice(qt.indexOf('=',qt.indexOf('&'))+1,qt.indexOf('&',qt.indexOf('&')+1));
       var querylocation = qt.slice(qt.lastIndexOf('=')+1);

       //console.log('qt : ' + qt + '\nQid : ' + queryid + '\nQname : ' + queryname + '\nQlocation : ' + querylocation + '\n');
       client.query('update products set name=?, location=? where id=?',[queryname,querylocation,queryid],function(err){
          if(err){
              response.writeHead(404);
              response.end('NOT EDIT : ' + err + '\n');
          }
          else{
            response.writeHead(307, { 'Location' : 'http://127.0.0.1:52273/list'});
            response.end('EDIT SECCESS : ' + queryid  + '\n');
          }
      });//query end
    }                                                                                                                   
    else{
       fs.readFile('404.html', function(error, data){
          response.writeHead(404);
          response.end(data);
        });//readFile-end
    }//else-end
    }//GET-end

   else if(request.method == 'POST'){
        if(rest[1] == 'add'){
            var qt = url.parse(request.url).query; //query-title
           // console.log(request);
           // console.log('URL : ' + request.url + '\nPATHNAME : ' + pathname + '\nQUERY : ' +qt); 
            var queryname = qt.slice(qt.indexOf('=')+1,qt.indexOf('&'));
            var querylocation = qt.slice(qt.indexOf('=',qt.indexOf('&'))+1);
          //  console.log('name : ' + queryname + '\nlocation : ' + querylocation + '\n');
            client.query('insert into products (name, location) values (?,?)',[queryname,querylocation
                ], function(err, results){
                    if(err){
                        response.writeHead(404);
                        response.end('POST ERROR : ' + err + '\n');
                    }else {
                        response.writeHead(201); //POST 201 Created status code
                        response.end('POST SUCCESS : '+ queryname + '\n');
                    }
                });
        } //list end
        else { 
              response.writeHead(404);
              response.end('NOT list\n');
        }
      }//POST_end

    else if(request.method == 'DELETE'){
          if(rest[1] == 'delete'){
              var qt = url.parse(request.url).query; //query-title
              var queryid = qt.slice(qt.indexOf('=')+1);
              
              client.query('delete from products where id = ?',[queryid], function(err, results){
                    if(err){
                          return console.log('DELETE ERROR : ' + err + '\n');
                    }else{
                          response.writeHead(204);//DELETE 204 No Content status code
                          response.end('DELETE SUCCESS : ' + queryid + '\n');
                    }});

          }// if list end
          else {
                response.writeHead(404);
                response.end('NOT list!\n');
          }

    }// DELETE end

    else if(request.method == 'OPTIONS'){ 
            response.writeHead(200,{ 'Allow' : 'GET, POST, DELETE, OPTIONS'});
            response.end();
    }// OPTIONS end

    }).listen(52273, function(){
    console.log('Server Running at http://127.0.0.1:52273');
    });
