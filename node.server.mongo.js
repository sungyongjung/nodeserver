var fs = require('fs');
var mongodb = require('mongodb');
var http = require('http');
var url = require('url');
var mysql = require('mysql');
var ejs = require('ejs');



    var server = http.createServer(function (request,response){
    
    var server = new mongodb.Server("127.0.0.1", 27017, {});
    new mongodb.Db('mydb', server, {}).open(function (error, client){

    var collection = new mongodb.Collection(client, 'products');


    var date = new Date();
    date.setDate(date.getDate()+7); // after 7day Expires

    var pathname = url.parse(request.url).pathname;
    var rest = pathname.split('/');
    

    switch(request.method)
    {
        case 'GET':
                getR();
                break;
        case 'HEAD':
                headR();
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
        default:
                e404R();
                break;
    }


    function getR(){
         if(pathname == '/' || pathname == '/index.html'){
             indexR();
         }
         else if(rest[1]){
            switch(rest[1])
            {
                case 're':
                    reindex();
                    break;
                case 'list':
                    listR();
                    break;
                case 'add':
                    addR();
                    break;
                case 'edit':
                    editR();
                    break;
                case 'delete':
                    deleteR();
                    break;
                case 'api':
                    apiR();
                    break;
                default :
                    e404R();
                    break;

            }
         }else {
             e404R();
         }




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

    function headR(){
        response.writeHead(200);
        response.end();
    } // Head-end

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
          fs.readFile('listm.html', 'utf8', function (error,data){
            if(rest[2] == 'name'){
                collection.find({name:rest[3]}).toArray(function(err, doc){
                        response.writeHead(200);
                        response.end(ejs.render(data,{
                                data: doc
                            }));
                    });
             }
             else if(rest[2] == 'location'){
                collection.find({location:rest[3]}).toArray(function(err, doc){
                        response.writeHead(200);
                        response.end(ejs.render(data,{
                                data: doc
                            }));
                    });
             }else{
                collection.find().toArray(function(err, doc){
                        response.writeHead(200);
                        response.end(ejs.render(data,{
                                data: doc
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
            //console.log('name : ' + queryname + '\nlocation : ' + querylocation + '\n');
            collection.insert({name:queryname,location:querylocation},{safe:true},function(err){
                    if(err){
                        e404E();
                    }else{
                        relist();
                    }
            }); 
   } // add-response





    function editR(){
        var qt = url.parse(request.url).query;
           var queryid = qt.slice(qt.indexOf('=')+1,qt.indexOf('&'));
           var queryname = qt.slice(qt.indexOf('=',qt.indexOf('&'))+1,qt.indexOf('&',qt.indexOf('&')+1));
           var querylocation = qt.slice(qt.lastIndexOf('=')+1);

        //console.log('qt : ' + qt + '\nQid : ' + queryid + '\nQname : ' + queryname + '\nQlocation : ' + querylocation );
               collection.update({name:queryid},{$set : {name:queryname,location:querylocation}}, {safe:true}, 
                function(err){
                 if(err){
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

             collection.findAndModify({name:queryid},[],{},{remove:true}, function(err){
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

        }); // db-end
    }).listen(52273, function(){
    console.log('Server Running at http://127.0.0.1:52273');
    });
