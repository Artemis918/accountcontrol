-- public.sub_category definition

-- Drop table

-- DROP TABLE public.sub_category;

CREATE TABLE public.sub_category (
	id int4 NOT NULL,
	description varchar(255) NULL,
	shortdescription varchar(255) NULL,
	"type" int4 NOT NULL,
	category int4 NULL,
	CONSTRAINT sub_category_pkey PRIMARY KEY (id)
);


-- public.sub_category foreign keys

ALTER TABLE public.sub_category 
  ADD CONSTRAINT category_ref 
  FOREIGN KEY (category) 
  REFERENCES public.category(id);

create unique index public.sub_category_id  on publici.sub_category(id);
create sequence public.seq_subcategory;
