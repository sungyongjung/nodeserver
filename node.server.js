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
    

    switch(request.method)
    {
        case 'GET':
                getR();
                break;
        case 'POST':
                postR();
                break;
        case 'DELETE':
                deleteR();
                break;
        case 'OPTIONS':
                optionsR();
                break;
        defult:
                e404R();
                break;
    }


    function getR(){
         if(pathname == '/' || pathname == '/index.html'){
             indexR();
         }
         else if(rest[1] == 're'){
             reindex();
         }
         else if(rest[1] == 'list'){
               listR();
         }
         else if(rest[1] == 'add'){
             addR();  
         } 
         else if(rest[1] == 'edit'){
             editR();
         }
         else if(rest[1] == 'delete'){
             deleteR();
         }
         else if(rest[1] == 'api'){
             apiR();
         }
         else{
            e404R();
         }//if-end 

    } // getR-end

    
    function postR(){
        var qt = url.parse(request.url).query;
        var qname = qt.slice(0,qt.indexOf('='));
        if(qname == 'name'){
          addR();
        }
        else if(qname == 'id'){
          editR();
        }
        else{
            e404R();
        } //if-end

    } // postR-end



    function indexR(){
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
     } // index-response




    function reindex(){
           response.writeHead(307, { 'Location': 'http://127.0.0.1:52273/index.html'});
           response.end();   
    } //Redirecte-response

    function relist(){
           response.writeHead(307, { 'Location': 'http://127.0.0.1:52273/list'});
           response.end();
    } //redirecte-list


    function listR(){
          fs.readFile('list.html', 'utf8', function (error,data){
            if(rest[2] == 'name'){
                client.query('select * from products where name=? order by id',[rest[3]] ,function(error, result){
                    response.writeHead(200);
                    response.end(ejs.render(data,{
                        data: result
                    }));
               });
             }
             else if(rest[2] == 'location'){
                client.query('select * from products where location=? order by id',[rest[2]] ,function(error, result){
                    response.writeHead(200);
                    response.end(ejs.render(data,{
                        data: result
                    }));
               });

             }
             else if(rest[2]){
               client.query('select * from products where id=? order by id',[rest[2]] ,function(error, result){
                    response.writeHead(200);
                    response.end(ejs.render(data,{
                        data: result
                    }));
               });
            }else{
              client.query('select * from products order by id', function(error, result){
                    response.writeHead(200);
                    response.end(ejs.render(data,{
                        data: result
                    }));
                });
            }
          });//readFile end
    } //list-response




    function e404E(){
        response.writeHead(404);
        response.end('Error : ' + error);
    } //404-response-with-errorcode




    function e404R(){
        response.writeHead(404);
        response.end('Error');
    } // 404-response-without-errorcode



    function addR(){
            var qt = url.parse(request.url).query; //query-title
            // console.log(request);
            // console.log('URL : ' + request.url + '\nPATHNAME : ' + pathname + '\nQUERY : ' +qt); 
            var queryname = qt.slice(qt.indexOf('=')+1,qt.indexOf('&'));
            var querylocation = qt.slice(qt.indexOf('=',qt.indexOf('&'))+1);
            //  console.log('name : ' + queryname + '\nlocation : ' + querylocation + '\n');
            client.query('insert into products (name, location) values (?,?)',[queryname,querylocation
                ], function(error, results){
                    if(error){
                            e404E();
                    }else{
                        relist(); //PRG 307->200
                    }
            });
    } // add-response





    function editR(){
        var qt = url.parse(request.url).query;
           var queryid = qt.slice(qt.indexOf('=')+1,qt.indexOf('&'));
           var queryname = qt.slice(qt.indexOf('=',qt.indexOf('&'))+1,qt.indexOf('&',qt.indexOf('&')+1));
           var querylocation = qt.slice(qt.lastIndexOf('=')+1);

        //console.log('qt : ' + qt + '\nQid : ' + queryid + '\nQname : ' + queryname + '\nQlocation : ' + querylocation 
           client.query('update products set name=?, location=? where id=?',[queryname,querylocation,queryid],function(error){
               if(error){
                    e404E();
               }
               else{
                relist();
               }
            });//query end
    } // edit-response




    function deleteR(){
             var qt = url.parse(request.url).query; //query-title
             var queryid = qt.slice(qt.indexOf('=')+1);

             client.query('delete from products where id = ?',[queryid], function(error, results){
                if(error){
                    e404E();
                }else{
                    relist();
                }});
    } // delete-response





    function optionsR(){
            response.writeHead(200,{ 'Allow' : 'GET, POST, DELETE, OPTIONS'});
            response.end();
    } // options-response



    function apiR(){
            fs.readFile('api.html', function(error, data){
                 response.writeHead(200);
                 response.end(data);
              }); //readFile-end
     } // api-response


    }).listen(52273, function(){
    console.log('Server Running at http://127.0.0.1:52273');
    });
