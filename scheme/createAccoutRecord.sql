-- DROP TABLE public.account_record;

CREATE TABLE public.account_record (
	id int4 NOT NULL,
	created date NULL,
	details varchar(255) NULL,
	executed date NULL,
	mandate varchar(255) NULL,
	received date NULL,
	receiver varchar(255) NULL,
	reference varchar(255) NULL,
	sender varchar(255) NULL,
	submitter varchar(255) NULL,
	"type" int4 NULL,
	value int4 NOT NULL,
	CONSTRAINT account_record_pkey PRIMARY KEY (id)
);

create unique index account_record_id on public.account_record(id);
create index account_record_date on puiblic.account_record(executed);

create sequence public.seq_accountrecord;
