CREATE TABLE public."assignment" (
	id int4 NOT NULL,
	subcategory int4 NULL,
	description varchar(512) NULL,
	shortdescription varchar(80) NULL,
	value int4 NOT NULL,
	plan int4 NULL,
	accountrecord int4 NULL,
	"committed" bool NOT NULL,
	CONSTRAINT assignment_pkey PRIMARY KEY (id)
);

create unique index assignment_id on public.assignment(id);

create sequence public.seq_assignment;
