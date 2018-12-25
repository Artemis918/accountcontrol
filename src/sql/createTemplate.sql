
-- drop table Template;

create table Template
(
    id               integer NOT NULL,
    gueltig_von       date,    
    gueltig_bis       date,    
    start            date,
	vardays          int,
	anzahl_rythmus    int,
	rythmus          int,
	konto		     int,
	position         int,
	description      varchar(512),
    short_description varchar(80),
	pattern          varchar(1024),
	wert             int,
	match_style	 int,
	next		 int,
	primary key (id)
);

create unique index TemplateID on Template (id);
-- drop sequence seq_template;

create sequence seq_template;
