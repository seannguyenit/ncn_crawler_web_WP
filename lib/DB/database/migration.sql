-- Active: 1691776638871@@127.0.0.1@3306@everytr1_ncnmediacontent
ALTER TABLE slot 
    ADD COLUMN userId INT DEFAULT 0;

UPDATE slot SET `userId` = 1;