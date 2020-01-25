alter sequence if exists seq_zuordnung rename to seq_assignment;

alter index if exists ZuordnungID rename to AssignmentID;

alter table if exists Zuordnung rename to Assignment;
alter table if exists Assignment rename column konto to subcategory;
alter table if exists Assignment rename column wert to value;
alter table if exists Assignment rename buchungsbeleg to accountrecord;

