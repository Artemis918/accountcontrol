CREATE TABLE public.plan (
	id int4 NOT NULL,
	creation_date date NULL,
	start_date date NULL,
	plan_date date NULL,
	end_date date NULL,
	deactivate_date date NULL,
	subcategory int4 NOT NULL,
	"position" int4 NOT NULL,	
	description varchar(512) NULL,
	short_description varchar(80) NULL,
	pattern varchar(1024) NOT NULL,
	value int4 NOT NULL,
	match_style int4 NULL,
	"template" int4 NULL,
	CONSTRAINT plan_pkey PRIMARY KEY (id)
);


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

create sequence public.seq_plan;
