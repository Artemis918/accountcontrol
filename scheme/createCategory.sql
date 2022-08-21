CREATE TABLE public.category (
	id int4 NOT NULL,
	description varchar(80) NULL,
	shortdescription varchar(512) NULL,
	CONSTRAINT category_pkey PRIMARY KEY (id)
);

create unique index category_id on public.category(id);
create sequence public.seq_category;
