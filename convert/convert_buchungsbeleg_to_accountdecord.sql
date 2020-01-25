alter sequence if exists seq_buchungsbeleg rename to seq_accountrecord;

alter index if exists BuchungsbelegID rename to AccountRecordID;
alter index if exists BuchungsbelegDate rename to AccountRecordDate;

alter table if exists Buchungsbeleg rename to AccountRecord;
alter table if exists AccountRecord rename column eingang to received;
alter table if exists AccountRecord rename column beleg to created;
alter table if exists AccountRecord rename column wertstellung to executed;
alter table if exists AccountRecord rename column art to type;
alter table if exists AccountRecord rename column absender to sender;
alter table if exists AccountRecord rename column empfaenger to receiver;
alter table if exists AccountRecord rename column wert to value;
alter table if exists AccountRecord rename column einreicher_id to submitter;
alter table if exists AccountRecord rename column mandat to mandate;
alter table if exists AccountRecord rename column referenz to reference;

