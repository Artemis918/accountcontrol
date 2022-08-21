
CREATE TABLE public.sub_category (
	id int4 NOT NULL,
	description varchar(512) NULL,
	shortdescription varchar(80) NULL,
	"type" int4 NOT NULL,
	category int4 NULL,
	CONSTRAINT sub_category_pkey PRIMARY KEY (id)
);


-- public.sub_category foreign keys

ALTER TABLE public.sub_category 
  ADD CONSTRAINT category_ref 
  FOREIGN KEY (category) 
  REFERENCES public.category(id);

create unique index sub_category_id  on public.sub_category(id);
create sequence public.seq_subcategory;
