-- Active: 1691776638871@@127.0.0.1@3306@everytr1_ncnmediacontent
CREATE TABLE fbuid (
    `id` BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `account` VARCHAR(1000) NOT NULL,
    `password` VARCHAR(1000) NOT NULL,
    `uid` VARCHAR(1000),
    `token` VARCHAR(4000),
    `slot` VARCHAR(500)
);

INSERT INTO
    `menu` (
        `par_id`,
        `action`,
        `name`,
        `order`
    )
VALUES (
        1,
        'fbuid',
        'Quản lý fb user',
        4
    );