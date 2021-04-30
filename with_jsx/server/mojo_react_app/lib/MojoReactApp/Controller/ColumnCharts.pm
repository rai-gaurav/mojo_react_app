package MojoReactApp::Controller::ColumnCharts;
use Mojo::Base 'Mojolicious::Controller', -signatures;
use Mojo::JSON qw(encode_json);

sub get_stacked_column_chart ($self) {

    # Do not continue on invalid input and render a default 400 error document.
    my $app = $self->openapi->valid_input or return;

    my $data_in_json = $app->model->get_column_data();

    # $output will be validated by the OpenAPI spec before rendered
    my $output = {chart_data => $data_in_json};
    $app->render(openapi => $output);
}

1;
