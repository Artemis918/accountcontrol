create table sub_category
(
    id                 integer NOT NULL,
    category           int,
    shortdescription   varchar(80), 
    description        varchar(512),
    type               int,
    primary key (id)
);

create unique index sub_categoryID on sub_category (id);
create sequence seq_subcategory;

