Requirment
1. One way -
    * Install Docker
    * Run - `make dev` for development environemnt

2. In case you don't want to use docker and just run locally
    * Install some of the dependencies as present in Dockerfile namely - Mojolicious, Mojolicious::Plugin::OpenAPI, Mojolicious::Plugin::SwaggerUI
    * cd mojo_react_app
    * morbo script/mojo_react_app   -> This will run in port 3000
    * In case you want diiferent port, run - morbo -l http://*:3001 script/mojo_react_app
