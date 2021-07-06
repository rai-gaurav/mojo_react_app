To run
1. One way -
    * Install Docker
    * Run - `make dev` for development environment. It will take care of all the dependencies and you can access your server on https://localhost/. Run `make help` for more options

2. In case you don't want to use docker and just run locally
    * Install some of the dependencies as present in Dockerfile namely - Mojolicious, Mojolicious::Plugin::OpenAPI, Mojolicious::Plugin::SwaggerUI
    * cd mojo_react_app
    * `morbo script/mojo_react_app`         -> This will run it on port 3000
    * In case you want diiferent port, run - `morbo -l http://*:3001 script/mojo_react_app`
    * It will work on Windows as well as Linux

You can look at the [screenshots](https://github.com/rai-gaurav/mojo_react_app/tree/main/with_jsx/server/output_screenshot) for more understanding.
