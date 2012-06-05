#nodeServer
---

> RESTful HTTP-server만들기 

### TO - DO
- HTTP 통신 하는 서버 만들기 (Node.js)
- REST에 준수하여 만들기
- GET POST DELETE EDIT 구현
- DB연동
- response HEADER 구성
	- redirection
	- OPTIONS
- Cookie 테스트     
    

----    

####6.5 작업 현황
- Status Code 수정
- response Header 수정
- curl 사용확인
	- curl -v 127.0.0.1:52273/ (GET)
	- curl -v -d POST 127.0.0.1:52273/list?'id=1&name=kim&location=pusan' (EDIT: POST방식)
	- curl -v -d POST 127.0.0.1:52273/list?'name=hong&location=sagun' (POST)
	- curl -v -X DELETE 127.0.0.1:52273/list?id=2 (DELETE)
	- curl -v -X OPTIONS 127.0.0.1:52273/

####6.4 작업 현황
- MYSQL 연동 완료
- GET 완료 
	- 	127.0.0.1:52273/list
- POST 완료 
	- 	127.0.0.1:52273/list?name=XXX&location=XXX
- DELETE 완료
	-	127.0.0.1:52273/list?id=XX
- EDIT 완료 (GET 방식)
	-	127.0.0.1:52273/edit?id=XX&name=XXX&location=XXX