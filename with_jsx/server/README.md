Requirment
1. One way -
    * Install Docker
    * Run - `make dev` for development environemnt. It will take care of all the dependencies and you can access your server on https://localhost/

2. In case you don't want to use docker and just run locally
    * Install some of the dependencies as present in Dockerfile namely - Mojolicious, Mojolicious::Plugin::OpenAPI, Mojolicious::Plugin::SwaggerUI
    * cd mojo_react_app
    * morbo script/mojo_react_app   -> This will run it on port 3000
    * In case you want diiferent port, run - morbo -l http://*:3001 script/mojo_react_app
    * It will work on Windows as well as Linux
