# build environment
FROM ubuntu:18.04

# By default will run in 'dev' mode
ENV mode=development

# Needed dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    gnupg \
    curl \
    vim \
    less \
    openssl=1.1.1-1ubuntu2.1~18.04.9 \
    libssl-dev \
    zlib1g-dev \
    apache2 \
    uwsgi=2.0.15-10.2ubuntu2.1 \
    uwsgi-plugin-psgi=2.0.15-10.2ubuntu2.1 \
    libapache2-mod-proxy-uwsgi=2.0.15-10.2ubuntu2.1

# Needed dependencies specific to project
RUN curl -L https://cpanmin.us | perl - -M https://cpan.metacpan.org -n Mojolicious@9.17
RUN curl -L https://cpanmin.us | perl - -M https://cpan.metacpan.org -n Mojolicious::Plugin::OpenAPI@4.03
RUN curl -L https://cpanmin.us | perl - -M https://cpan.metacpan.org -n Mojolicious::Plugin::SwaggerUI@0.0.4
RUN curl -L https://cpanmin.us | perl - -M https://cpan.metacpan.org -n IO::Socket::SSL@2.070
RUN curl -L https://cpanmin.us | perl - -M https://cpan.metacpan.org -n JSON::XS@4.03

RUN \
    a2enmod headers && \
    a2enmod proxy && \
    a2enmod proxy_http && \
    a2enmod proxy_uwsgi && \
    a2enmod rewrite && \
    a2enmod ssl

# Disable the default apache home page on port 80
RUN a2dissite 000-default.conf

# Copy your codebase from local to inside container
COPY . /home/mojo_react_app
RUN mkdir -p /home/mojo_react_app/log/

# These will be used while setting virtual host in apache.conf
ENV APACHE_LOG_DIR /var/log/apache2
ENV APACHE_LOCK_DIR /var/lock/apache2
ENV APACHE_PID_FILE /var/run/apache2.pid

# Copy Apache config file
COPY etc/apache2.conf /etc/apache2/sites-available/mojo_react_app.conf
RUN ln -s /etc/apache2/sites-available/mojo_react_app.conf /etc/apache2/sites-enabled/mojo_react_app.conf

WORKDIR /home/mojo_react_app

# Expose both http and https port
EXPOSE 80 443

COPY script/start_mojo_react_app.sh /start_mojo_react_app.sh
RUN chmod a+x /start_mojo_react_app.sh

ENTRYPOINT /start_mojo_react_app.sh -m "$mode"
