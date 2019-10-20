
CREATE EXTENSION Postgis;
CREATE TABLE public.cities
(
    id serial PRIMARY KEY NOT NULL,
    name VARCHAR(255),
    country VARCHAR(255),
    pos geography(POINT),
    population int,
    elevation int,
    iso3 CHAR(3)
);
CREATE UNIQUE INDEX cities_id_uindex ON public.cities (id);
CREATE INDEX global_points_gix ON cities USING GIST ( pos );
-- CREATE UNIQUE INDEX cities_pos_uindex ON public.cities (pos)

drop table cities


INSERT INTO public.cities (name, country, pos, population, elevation, iso3)
VALUES (%s, %s, 'SRID=4326;POINT(-%s %s)', %s, %s, %s)

INSERT INTO cities (name, country, pos, population, elevation, iso3)
VALUES ('Moscow', 'Russia', 'SRID=4326;POINT(-110 30)', 1000, 123, 'MOS')

select * from public.cities where population > 10000
delete from public.cities

select * from public.cities where pos = 'SRID=4326;POINT(42.4822,20.7458)'

SELECT st_x(pos::geometry)  FROM cities;
select St_Astext(pos) from cities


select count(id) from public.cities;