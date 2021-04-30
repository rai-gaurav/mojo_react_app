package MojoReactApp;
use Mojo::Base 'Mojolicious', -signatures;
use MojoReactApp::Model::Data;

# This method will run once at server start
sub startup ($self) {

    # Load configuration from config file
    my $config = $self->plugin('NotYAMLConfig');

    # Configure the application
    $self->secrets($config->{secrets});

    # Load the "api.json" specification
    # Can also be written as -
    # "OpenAPI" => {spec => $self->static->file("api.json")->path}

    $self->plugin(
        "OpenAPI" => {
            url => $self->home->rel_file("public/api.json")
        }
    );

    $self->plugin(
        SwaggerUI => {
            route => $self->routes()->any('api'),
            url => "/api/v1",
            title => "My Mojolicious App"
        }
    );

    # Helper to lazy initialize and store our model object
    $self->helper(
        model => sub ($c) {
            state $data = MojoReactApp::Model::Data->new();
            return $data;
        }
    );

    # Router
    my $r = $self->routes;

    # Normal route to controller
    $r->get('/')->to(template => 'home/welcome');
}

1;

