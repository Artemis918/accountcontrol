
alter table if exists Template rename column konto  to subcategory;
alter table if exists Template rename column vardays to variance;
alter table if exists Template rename column anzahl_rythmus to repeat_count;
alter table if exists Template rename column rythmus to repeat_unit;
alter table if exists Template rename column wert to value;

