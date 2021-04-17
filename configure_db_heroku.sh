#!/bin/bash

echo "Configuring heroku postgre database (weather app)..."

heroku pg:reset DATABASE

heroku pg:psql < ./server/bin/sql/city.sql

echo "Heroku postgre database (weather app) configured!"