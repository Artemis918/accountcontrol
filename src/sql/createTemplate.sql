create table Template
(
    id                integer NOT NULL,
    valid_from        date,
    valid_until       date,
    start             date,
    variance          int,
    repeat_count      int,
    repeat_unit       int,
    subcategory       int,
    position          int,
    description       varchar(512),
    short_description varchar(80),
    pattern           varchar(1024),
    value             int,
    match_style       int,
    next              int,
    primary key (id)
);

create unique index TemplateID on Template (id);

create sequence seq_template;

