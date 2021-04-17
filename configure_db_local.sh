#!/bin/bash

echo "Configuring local app postgreSQL DB..."

dropdb -U postgres weather-db
createdb -U postgres weather-db

psql -U postgres weather-db < ./server/bin/sql/city.sql

echo "Local app postgreSQL DB configured!"