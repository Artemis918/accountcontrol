create table Category
(
    id                 integer NOT NULL,
    shortdescription   varchar(80)    ,
    description        varchar(512),
    primary key (id)
);

create unique index CategoryID on Category (id);
create sequence seq_category;

