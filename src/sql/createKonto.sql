create table Konto
(
    id                 integer NOT NULL,
    id_gruppe          int,
    shortdescription   varchar(80), 
    description        varchar(512),
    art				   int,
	primary key (id)
);

create unique index KonotID on Konto (id);
create sequence seq_konto;
