CREATE TABLE cities (
	id serial NOT NULL,
	city_name character varying(50) NOT NULL UNIQUE,
	PRIMARY KEY (id)
);