ALTER TABLE `fbuid` CHANGE `slot` `slotId` INT DEFAULT NULL;

CREATE TABLE slot (
    `id` int NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(1000),
    `note` TEXT
);

UPDATE `menu` SET `action`='slot' WHERE `id`=11;