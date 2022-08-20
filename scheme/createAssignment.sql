-- DROP TABLE public."assignment";

CREATE TABLE public."assignment" (
	id int4 NOT NULL,
	"committed" bool NOT NULL,
	description varchar(255) NULL,
	shortdescription varchar(255) NULL,
	value int4 NOT NULL,
	accountrecord int4 NULL,
	plan int4 NULL,
	subcategory int4 NULL,
	CONSTRAINT assignment_pkey PRIMARY KEY (id)
);

create unique index assignment_id on public.assignment(id);

create sequence public.seq_assignment;
