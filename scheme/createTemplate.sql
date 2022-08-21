
CREATE TABLE public."template" (
	id int4 NOT NULL,
	valid_from date NULL,
	valid_until date NULL,
	"start" date NULL,
	variance int4 NOT NULL,
	repeat_count int4 NOT NULL,
	repeat_unit int4 NULL,
	subcategory int4 NOT NULL,
	"position" int4 NOT NULL,
	description varchar(512) NULL,
	short_description varchar(80) NULL,
	pattern varchar(1024) NOT NULL,
	value int4 NOT NULL,
	match_style int4 NULL,
	"next" int4 NOT NULL,
	CONSTRAINT template_pkey PRIMARY KEY (id)
);

ALTER TABLE public."template" 
  ADD CONSTRAINT sub_category_ref 
  FOREIGN KEY (subcategory) 
  REFERENCES public.sub_category(id);

create unique index template_id on public."template"(id);

create sequence seq_template;
