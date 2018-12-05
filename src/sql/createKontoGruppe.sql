create table KontoGruppe
(
    id                 integer NOT NULL,
    shortdescription   varchar(80)    ,
    description        varchar(512),
	primary key (id)
);

create unique index KontoGruppeID on KontoGruppe (id);
create sequence seq_kontogruppe;
