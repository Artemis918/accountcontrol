CREATE TABLE public.account_record (
	id int4 NOT NULL,
	received date NULL,
	created date NULL,
	executed date NULL,
	"type" int4 NULL,
	sender varchar(80) NULL,
	receiver varchar(80) NULL,
	value int4 NOT NULL,
	details varchar(200) NULL,
	mandate varchar(40) NULL,
	submitter varchar(40) NULL,
	reference varchar(40) NULL,
	CONSTRAINT account_record_pkey PRIMARY KEY (id)
);

create unique index account_record_id on public.account_record(id);
create index account_record_date on public.account_record(executed);

create sequence public.seq_accountrecord;
