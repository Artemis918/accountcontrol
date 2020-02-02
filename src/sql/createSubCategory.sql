create table SubCategory
(
    id                 integer NOT NULL,
    category           int,
    shortdescription   varchar(80), 
    description        varchar(512),
    type               int,
    primary key (id)
);

create unique index SubCategoryID on SubCategory (id);
create sequence seq_subcategory;

