package MojoReactApp::Controller::Charts;
use Mojo::Base 'Mojolicious::Controller', -signatures;
use Mojo::JSON qw(encode_json);

sub create_multi_line_chart ($self) {
    my $data_in_json = $self->model->get_data();

    $self->render(template => 'charts/multi_line_chart', chart_data => encode_json($data_in_json));
}

1;
