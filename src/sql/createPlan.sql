-- drop table plan;

create table Plan
(
    id               integer NOT NULL,   
    creation_date     date,
    start_date        date,
    plan_date         date,
    end_date          date,
    deactivate_date   date,
    konto		      int,
	position          int,
	description       varchar(512),
    short_description varchar(80),
	pattern           varchar(1024),
	wert              int,
	match_style       int,
	template          int,
	primary key (id)
);


create unique index PlanID on Plan (id);

create index PlanDateIdx on plan(plandate);


-- drop sequence seq_plan;

create sequence seq_plan;
