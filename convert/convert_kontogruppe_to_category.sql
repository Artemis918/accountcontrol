alter sequence if exists seq_kontogruppe rename to seq_catecory;

alter index if exists KontoGruppeID rename to CategoryID;

alter table if exists KontoGruppe rename to Category;
