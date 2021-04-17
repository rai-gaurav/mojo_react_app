package MojoReactApp;
use Mojo::Base 'Mojolicious', -signatures;
use MojoReactApp::Model::Data;

# This method will run once at server start
sub startup ($self) {

    # Load configuration from config file
    my $config = $self->plugin('NotYAMLConfig');

    # Configure the application
    $self->secrets($config->{secrets});

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
    $r->get('/')->to('charts#create_multi_line_chart');
}

1;

