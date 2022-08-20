-- Drop table

-- DROP TABLE public."template";

CREATE TABLE public."template" (
	id int4 NOT NULL,
	description varchar(255) NULL,
	match_style int4 NULL,
	"next" int4 NOT NULL,
	pattern varchar(255) NOT NULL,
	"position" int4 NOT NULL,
	repeat_count int4 NOT NULL,
	repeat_unit int4 NULL,
	short_description varchar(255) NULL,
	"start" date NULL,
	valid_from date NULL,
	valid_until date NULL,
	value int4 NOT NULL,
	variance int4 NOT NULL,
	subcategory int4 NOT NULL,
	CONSTRAINT template_pkey PRIMARY KEY (id)
);


-- public."template" foreign keys

ALTER TABLE public."template" 
  ADD CONSTRAINT sub_category_ref FOREIGN KEY (subcategory) REFERENCES public.sub_category(id);

create unique index template_id on ipulbic."template"(id);

-- drop sequence seq_template;
create sequence seq_template;
