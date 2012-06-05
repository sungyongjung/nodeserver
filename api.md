#NodeServer

###Api Routes
---
####GET

- */api*
    - api 페이지 
- */re*
    - index.html Redirect 
- */list*
    - id, name, location DB확인
- */list/{id}*
    - id로 DB확인 
- */list/name/{name}*
    - name으로 DB확인 
- */list/location/{location}*
    - location으로 DB확인

####POST

- */list?name={name}&location={location}*
    - name, location으로 DB입력 (POST)
- */list?id={id}&name={name}&location={location}*
    - id에 해당하는 name, location DB수정 (EDIT)


####DELETE
- */list?id={id}*
    - id에 해당하는 DB삭제

####OPTIONS
- */*
    - 가능한 OPTIONS 확인