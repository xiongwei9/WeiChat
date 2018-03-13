create table if not exists user (
    uid varchar(16) not null,
    name varchar(16) not null,
    password varchar(16) not null,
    descs varchar(32),

    primary key(uid)
);