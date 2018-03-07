create table if not exists user (
    id int unsigned ZEROFILL not null auto_increment,
    name varchar(16) not null,
    password varchar(16) not null,
    descs varchar(32),

    primary key(id)
);