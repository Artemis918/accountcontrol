delete from zuordnung;
alter sequence seq_zuordnung restart with 1;
delete from buchungsbeleg;
alter sequence seq_buchungsbeleg restart with 1;
delete from plan;
alter sequence seq_plan restart with 1;
delete from template;
alter sequence seq_template restart with 1;
delete from kontogruppe;
alter sequence seq_kontogruppe restart with 6;
delete from konto;
alter sequence seq_konto restart with 10;

insert into kontogruppe
(id,   shortdescription,description) values
(1 ,   'Diverses'      ,'ohne besonderen Hintergrund' ),
(2 ,  'täglicher Bedarf', 'Essen, Drogerie, Apotheke' ),
(3 ,  'Einnahmen', 'Alles ausser Miete' ),
(4 ,  'monatlich', 'Alles was jeden Monat an Ausgaben anfällt' ),
(5 ,  'quartal', 'Alles was ale 2-3 Monate an Ausgaben anfällt' );

insert into konto
(id,id_gruppe, shortdescription, description, art) values
(1,        1 , 'Diverses'      , 'alles was nirgends hingehört', 1),
(2,        3 , 'Gehalt'        , 'Gehälter' , 0 ),
(3,        3 , 'Geschenke'     , 'Geschenke von aussen' , 0),
(4,        1 , 'Tanken'        , 'alles was bei der Tankestelle ausgegeben wurde', 1),
(5,        2 , 'Essen'         , '', 1),
(6,        2 , 'Drogerie'      , '', 1),
(7,        2 , 'Apotheke'      , '', 1) ,
(8,        4 , 'Telekom'       , 'Handy und Festnetz', 1),
(9,        1 , 'Ebay'          , 'alle Transaktion bei Ebay', 1);
