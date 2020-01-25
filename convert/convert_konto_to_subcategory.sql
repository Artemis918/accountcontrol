alter sequence if exists seq_konto rename to seq_subcategory;

alter index if exists KonotID rename to SubCategoryID;

alter table if exists Konto rename to sub_category;
alter table if exists SubCategory rename column art to type;
alter table if exists SubCategory rename column id_gruppe to category;

