#!/bin/bash
# This script can be runned by docker or directly by provide the parameter.
# Move it outside and run -
# ./start_mojo_react_app.sh -m "development" or
# ./start_mojo_react_app.sh -m "production"

# Restart Web server (here Apache)
service apache2 restart

# start Mojo React App
while getopts "m:" opt; do
    case ${opt} in
        m)
            mode="${OPTARG}"
            echo "Running in '$mode' mode"
            if [ "$mode" == "development" ]; then
                # Since we are using uwsgi, we have commented the morbo
                # exec morbo -l "https://*:6363" script/mojo_react_app
                exec uwsgi --ini etc/uwsgi.conf:$mode
            elif [[ "$mode" = "production" || "$mode" = "staging" ]]; then
                # exec hypnotoad -f script/mojo_react_app
                exec uwsgi --ini etc/uwsgi.conf:$mode
            else 
                echo "Wrong mode provided. Accepted value - development, staging or production" 1>&2
            fi
            ;;
        : )
            echo "Invalid option: $OPTARG requires an argument" 1>&2
    esac
done