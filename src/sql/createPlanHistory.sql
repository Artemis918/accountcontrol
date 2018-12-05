-- drop table planhistory;

create table PlanHistory
(
    id               integer NOT NULL,   
    creation_date     date,
	deactivate_date   date,
    start_date        date,
    plan_date         date,
	enddate          date,
	konto		     int,
	position         int,
	description      varchar(512),
    short_description varchar(80),
	pattern          varchar(256),
	wert             int,
	plan_art			 int,
	template         int,
	primary key (id)
);