# Synth-Lord

## Description


## Usage


## Tools used

### Web Audio API 


### WAD.js




## Issues and Fixes

### CORS configuration: 

Upload audio files to AWS S3 and created a bucket. Go to Permissions > CORS configuration and modified the code in the CORS configuration editor with this code:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
<CORSRule>
    <AllowedOrigin>*</AllowedOrigin>
    <AllowedMethod>HEAD</AllowedMethod>
    <AllowedMethod>GET</AllowedMethod>
    <AllowedMethod>PUT</AllowedMethod>
    <AllowedMethod>POST</AllowedMethod>
    <AllowedMethod>DELETE</AllowedMethod>
    <ExposeHeader>ETag</ExposeHeader>
    <AllowedHeader>*</AllowedHeader>
</CORSRule>
</CORSConfiguration> 
```

Make all files public by going to the Objects tabs, choose all your files and click More > Make public.

To get the file link, click on the file and a board should popup with the file's link. 


### Visualizer with WAD.js 

The AnalyserNode is created within the WAD.js and the challenge here is to actually find this node in your WAD object. 
Do NOT create another AnalyserNode since this would most likely override the current one that already exists. 



## Our config.json for clearDB:

{
  "development": {
    "username": "be0a4d94f7ab2f",
    "password": "02b68e21",
    "database": "heroku_e173a3460c3a3e7",
    "host": "us-cdbr-iron-east-03.cleardb.net",
    "dialect": "mysql"
  },
  "test": {
    "username": "be0a4d94f7ab2f",
    "password": "02b68e21",
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "us-cdbr-iron-east-03.cleardb.net"
  },
  "production": {
    "username": "be0a4d94f7ab2f",
    "password": "02b68e21",
    "database": "heroku_e173a3460c3a3e7",
    "host": "us-cdbr-iron-east-03.cleardb.net",
    "dialect": "mysql"
  }
}
