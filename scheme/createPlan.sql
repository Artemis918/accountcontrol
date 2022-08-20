-- DROP TABLE public.plan;
CREATE TABLE public.plan (
	id int4 NOT NULL,
	creation_date date NULL,
	deactivate_date date NULL,
	description varchar(255) NULL,
	end_date date NULL,
	match_style int4 NULL,
	pattern varchar(255) NOT NULL,
	plan_date date NULL,
	"position" int4 NOT NULL,
	short_description varchar(255) NULL,
	start_date date NULL,
	value int4 NOT NULL,
	subcategory int4 NOT NULL,
	"template" int4 NULL,
	CONSTRAINT plan_pkey PRIMARY KEY (id)
);


-- public.plan foreign keys

ALTER TABLE public.plan 
  ADD CONSTRAINT subcatecory_ref 
  FOREIGN KEY (subcategory) 
  REFERENCES public.sub_category(id);

ALTER TABLE public.plan 
  ADD CONSTRAINT template_ref 
  FOREIGN KEY ("template") 
  REFERENCES public."template"(id);


create unique index plan_id on public.plan(id);

create index plan_date_idx  on public.plan(plan_date);


-- drop sequence seq_plan;

create sequence public.seq_plan;
