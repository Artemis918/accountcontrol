create table Zuordnung
(
    id               integer NOT NULL,   
	konto		     int,
	description      varchar(512),
    shortdescription varchar(80),
	wert             int,
	plan             int,
	buchungsbeleg    int,
	committed		boolean,
	primary key (id)
);

create unique index ZuordnungID on Zuordnung (id);

create sequence seq_zuordnung;
