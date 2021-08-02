# beep
A chat application where you can create chat groups share images, videos, files.


## Built with

- Typescript
- React
- Redux
- Material Ui
- Express
- Socket IO
- Oauth
- Postgres
- Redis
- Nginx
- Docker
- Kubernetes

## Details
Its a university project. Its a chat application in which you can create chat groups and send messages, images, videos etc.
It uses websockets for realtime chat features and also persists them in backend postgres database. 

## Infrastructure
Application is built using a distributed system. Frontend is built using react & redux with material ui library and socketio client. For backend nginx
gateway is used which routes trafic to appropriate services. There is an auth services which manages users and authentication, a file services which provides api
for file uploads, a static service which serves static files, a socket service which is responsible for real time messaging.
