create table Buchungsbeleg
(
    id            integer NOT NULL,
    eingang       date,    
    beleg         date,
    wertstellung  date,
    art           smallint,
    absender      varchar(80),
    empfaenger    varchar(80),
    wert          int,
    details       varchar(200),
    einreicher_id varchar(40),
    mandat        varchar(40),
    referenz      varchar(40)
    primary key (id)
);

create unique index BuchungsbelegID on Buchungsbeleg (id);
create index BuchungsbelegDate on Buchungsbeleg (beleg);

create sequence seq_buchungsbeleg;
