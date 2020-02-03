alter sequence if exists seq_buchungsbeleg rename to seq_accountrecord;

alter index if exists BuchungsbelegID rename to AccountRecordID;
alter index if exists BuchungsbelegDate rename to AccountRecordDate;

alter table if exists Buchungsbeleg rename to account_record;
alter table if exists Account_Record rename column eingang to received;
alter table if exists Account_Record rename column beleg to created;
alter table if exists Account_Record rename column wertstellung to executed;
alter table if exists Account_Record rename column art to type;
alter table if exists Account_Record rename column absender to sender;
alter table if exists Account_Record rename column empfaenger to receiver;
alter table if exists Account_Record rename column wert to value;
alter table if exists Account_Record rename column einreicher_id to submitter;
alter table if exists Account_Record rename column mandat to mandate;
alter table if exists Account_Record rename column referenz to reference;

