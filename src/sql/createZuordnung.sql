create table Assignment
(
	id               integer NOT NULL,
	subcategory      int,
	description      varchar(512),
	shortdescription varchar(80),
	value            int,
	plan             int,
	accountrecord    int,
	committed        boolean,
	primary key (id)
);

create unique index AssignmentID on Assignment (id);

create sequence seq_assignment;
