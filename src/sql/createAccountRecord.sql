create table account_record
(
    id            integer NOT NULL,
    received      date,
    created       date,
    executed      date,
    type          smallint,
    sender        varchar(80),
    receiver      varchar(80),
    value         int,
    details       varchar(200),
    submitter     varchar(40),
    mandate       varchar(40),
    reference     varchar(40),
    primary key (id)
);

create unique index AccountRecordID on Account_Record (id);
create index AccountRecordDate on Account_Record (created);

create sequence seq_accountrecord;

