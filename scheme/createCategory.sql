-- DROP TABLE public.category;

CREATE TABLE public.category (
	id int4 NOT NULL,
	description varchar(255) NULL,
	shortdescription varchar(255) NULL,
	CONSTRAINT category_pkey PRIMARY KEY (id)
);

create unique index category_id on public.category(id);
create sequence public.seq_category;
