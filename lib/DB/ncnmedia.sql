-- MySQL dump 10.13  Distrib 8.0.31, for Win64 (x86_64)
--
-- Host: localhost    Database: everytr1_ncnmediacontent
-- ------------------------------------------------------
-- Server version	5.7.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `menu`
--
create database `ncnmediacontent`;

use `everytr1_ncnmediacontent`;

DROP TABLE IF EXISTS `menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menu` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(450) NOT NULL,
  `par_id` int(11) NOT NULL DEFAULT '0',
  `order` int(11) DEFAULT '0',
  `action` varchar(450) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu`
--

LOCK TABLES `menu` WRITE;
/*!40000 ALTER TABLE `menu` DISABLE KEYS */;
INSERT INTO `menu` VALUES (1,'Tool',0,2,''),(3,'Thông báo',0,0,'notice'),(5,'Quản lý tài khoản',0,1,'users'),(6,'Cào dữ liệu',1,1,'get_content'),(7,'Lọc chuỗi',1,2,'filter_string'),(8,'Lọc trùng chuỗi',1,3,'dis_string'),(9,'Thư viện Tool',0,3,'tool_lib'),(10,'Quản lý tool',0,4,'tool_m');
/*!40000 ALTER TABLE `menu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tool_lib`
--

DROP TABLE IF EXISTS `tool_lib`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tool_lib` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(4000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `link` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tool_lib`
--

LOCK TABLES `tool_lib` WRITE;
/*!40000 ALTER TABLE `tool_lib` DISABLE KEYS */;
INSERT INTO `tool_lib` VALUES (2,'Vtool1.0','https://drive.google.com/file/d/1zAPGXkGtOU2XLeUQ69LbAPi8fAe8p5qq/view?usp=sharing'),(3,'Vtool2.0','https://drive.google.com/file/d/1xTdLY_ii28-jIXufPpXJXe7CZ4RvSrF0/view?usp=sharing'),(4,'Vtool3.0','https://drive.google.com/file/d/1pVJ3I6HY8_kqOK-FVXbN35x13gYc3exz/view?usp=sharing'),(5,'Vtool4.0','https://drive.google.com/file/d/1Tud7ITYTSmaHy6hYi5FbOCWhw37xlZJP/view?usp=sharing'),(6,'Vtool 5.0','https://drive.google.com/file/d/1P7Wc-bi1PNEfzfgZ8TG8qnjQe3zcKFp9/view?usp=sharing'),(7,'Vtool6.0','https://drive.google.com/file/d/1YC2EZMKy-hIrXQK9jGhHtlYaJTcaBtzm/view?usp=sharing'),(8,'Vtool7.0','https://drive.google.com/file/d/1Sd9aV-v19RXRQArTtmqIa_wsd546K4Mk/view?usp=sharing'),(9,'Vtool8.0','https://drive.google.com/file/d/1-YcPuef7ZMDzIQ7Jg7HQ4VEeEXq5-GJ2/view?usp=sharing'),(10,'Vtool9.0','https://drive.google.com/file/d/1YF_yEZ21TpmxET6J7U1ZVhMAeKks9KBw/view?usp=sharing'),(11,'Vtool10.0','https://drive.google.com/file/d/1OCw3-E_OVxmLv_9qNfZ9gZwOgsKELb6Z/view?usp=sharing'),(12,'Vtool11.0','https://drive.google.com/file/d/1U61mKuab8RDLkYZf-1iKXfkHYpg1i0w8/view?usp=sharing'),(13,'Vtool12.0','https://drive.google.com/file/d/1sch3swOxRFBhB3BW_YGeo5nwPfmFYaB7/view?usp=sharing');
/*!40000 ALTER TABLE `tool_lib` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` char(100) NOT NULL,
  `pass` varchar(1000) NOT NULL,
  `is_admin` tinyint(4) NOT NULL DEFAULT '0',
  `active` tinyint(4) NOT NULL DEFAULT '1',
  `real_name` varchar(1000) CHARACTER SET utf8 DEFAULT NULL,
  `phone` char(11) DEFAULT NULL,
  `add` varchar(1500) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'admin','Xuanmai@12321',1,1,'nhã','0905656595','nha trang','2021-12-23 22:21:41',0),(2,'sean','123456',0,0,'nguyen le loc thinh','0908263415','abc xyzz','2021-12-25 00:44:56',0),(3,'thinhspct','123456',0,0,'','0908263415','','2021-12-25 01:35:53',0),(4,'test1','123456',0,0,'nguyen van a','0908263415','abc xyzz','2022-01-09 12:52:39',0),(5,'tri','Tri@123',0,0,'trí','0393183823','nha trang','2022-01-13 22:10:17',0),(6,'viet','Viet@123',0,0,'việt','0349034955','đà nẵng','2022-01-13 22:11:35',0),(7,'tri','tri@123',0,1,'trí','0393183823','nha trang','2022-02-20 21:55:48',0),(8,'viet','viet@123',0,1,'việt','0349034955','đà nẵng','2022-02-20 21:56:10',0),(9,'thien','squm Vs10 2Qe4 38MS n8Qx T98a',0,1,'thien','0918275946','Nha Trang','2022-02-23 21:07:13',0),(10,'long','long123',0,1,'long','0935946632','đà nẵng','2022-03-02 06:08:48',0),(11,'phong','phong@123',0,1,'phong','0905656595','đà nẵng','2022-05-06 04:49:02',0),(12,'kimquy','kimquy@123',0,1,'quy','0905656595','đà nẵng','2022-05-06 09:20:09',0),(13,'tin','tin@123',0,1,'tín','0905656595','nha trang','2022-05-09 08:29:18',0),(14,'tuhy23','thuy@123',0,1,'tuyhy23','0346682048','đà nẵng','2022-05-13 04:07:14',0),(15,'uyen','uyen123',0,1,'thuuyen','0708679777','đà nẵng','2022-05-17 07:19:36',0),(16,'thang','thang@123',0,1,'thắng','0905656595','nha trang','2022-06-05 22:28:24',0),(17,'khactien','khactien123',0,1,'tiện','0905656595','chợ gồm','2022-09-06 07:50:54',0);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_menu`
--

DROP TABLE IF EXISTS `user_menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_menu` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `menu_id` int(11) NOT NULL,
  `stt` smallint(6) NOT NULL DEFAULT '1',
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=247 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_menu`
--

LOCK TABLES `user_menu` WRITE;
/*!40000 ALTER TABLE `user_menu` DISABLE KEYS */;
INSERT INTO `user_menu` VALUES (9,1,1,2),(8,5,0,2),(7,3,1,2),(10,3,1,3),(11,5,0,3),(12,1,1,3),(13,3,1,4),(14,5,0,4),(15,1,1,4),(108,6,1,1),(107,5,1,1),(106,3,1,1),(51,8,1,5),(50,7,1,5),(49,1,1,5),(57,8,1,6),(56,7,1,6),(55,1,1,6),(48,6,1,5),(47,5,0,5),(46,3,1,5),(54,6,1,6),(53,5,0,6),(52,3,1,6),(158,9,1,7),(157,8,1,7),(156,7,1,7),(155,1,1,7),(154,6,1,7),(153,5,0,7),(174,10,0,8),(173,9,1,8),(172,8,1,8),(171,7,1,8),(170,1,1,8),(169,6,1,8),(143,8,1,9),(142,7,1,9),(141,1,1,9),(140,6,1,9),(139,5,0,9),(138,3,1,9),(109,1,1,1),(110,7,1,1),(111,8,1,1),(181,9,1,10),(180,8,1,10),(179,7,1,10),(178,1,1,10),(177,6,1,10),(176,5,0,10),(152,3,1,7),(168,5,1,8),(144,9,1,9),(175,3,1,10),(167,3,1,8),(182,10,0,10),(183,3,1,11),(184,5,0,11),(185,6,1,11),(186,1,1,11),(187,7,1,11),(188,8,1,11),(189,9,1,11),(190,10,0,11),(191,3,1,12),(192,5,0,12),(193,6,1,12),(194,1,1,12),(195,7,1,12),(196,8,1,12),(197,9,1,12),(198,10,0,12),(199,3,1,13),(200,5,0,13),(201,6,1,13),(202,1,1,13),(203,7,1,13),(204,8,1,13),(205,9,1,13),(206,10,0,13),(230,10,0,14),(229,9,1,14),(228,8,1,14),(227,7,1,14),(226,1,1,14),(225,6,1,14),(224,5,0,14),(223,3,0,14),(215,3,1,15),(216,5,0,15),(217,6,1,15),(218,1,1,15),(219,7,1,15),(220,8,1,15),(221,9,1,15),(222,10,0,15),(231,3,1,16),(232,5,0,16),(233,6,1,16),(234,1,1,16),(235,7,1,16),(236,8,1,16),(237,9,1,16),(238,10,0,16),(239,3,1,17),(240,5,0,17),(241,6,1,17),(242,1,1,17),(243,7,1,17),(244,8,1,17),(245,9,1,17),(246,10,0,17);
/*!40000 ALTER TABLE `user_menu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `web_info`
--

DROP TABLE IF EXISTS `web_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `web_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` char(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content` longtext COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `web_info`
--

LOCK TABLES `web_info` WRITE;
/*!40000 ALTER TABLE `web_info` DISABLE KEYS */;
INSERT INTO `web_info` VALUES (1,'notice','Hệ Thống NCNMEDIA');
/*!40000 ALTER TABLE `web_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'everytr1_ncnmediacontent'
--
/*!50003 DROP PROCEDURE IF EXISTS `get_all_menu_by_user` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_ALL_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER' */ ;
DELIMITER ;;
CREATE PROCEDURE `get_all_menu_by_user`(IN `user_id` INT)
BEGIN
	set @is_admin = (select is_admin from `user` where `user`.id = user_id limit 1);
    if(@is_admin != 1) then 
        select UM.*,M.action,U.`username`,M.name,M.par_id,M.id as id from user_menu as UM 
		left join menu AS M on UM.menu_id = M.id 
		left join `user` as U on UM.user_id = U.id
		where UM.user_id = user_id and UM.stt = 1
		order by M.`order`;
	else 
		select *,id as menu_id,1 as stt from menu order by `order`;
    end if;
	
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `get_all_menu_template` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_ALL_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER' */ ;
DELIMITER ;;
CREATE PROCEDURE `get_all_menu_template`()
BEGIN
	SELECT `menu`.`id`,
    `menu`.`name`,
    `menu`.`par_id`,
    `menu`.`order`
FROM `menu`
order by `menu`.`order`;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `login` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_ALL_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER' */ ;
DELIMITER ;;
CREATE PROCEDURE `login`(`userp` NVARCHAR(250), `passp` NVARCHAR(250))
BEGIN
	select `id`,
`username`,
`is_admin`,
`active` from `user` where `user`.`username` = userp and pass = passp and `active` = 1 limit 1;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `logout` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_ALL_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER' */ ;
DELIMITER ;;
CREATE PROCEDURE `logout`(IN `acc_id` INT)
BEGIN
	select * from `user` where `user`.id = acc_id limit 1;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `user_getall` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_ALL_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER' */ ;
DELIMITER ;;
CREATE PROCEDURE `user_getall`(`pic` INT)
BEGIN
	select `user`.`id`,
    `user`.`username`,
    `user`.`is_admin`,
    `user`.`active`,
    `user`.`real_name`,
    `user`.`phone`,
    `user`.`add`,
    `user`.`created_at`,
    `user`.`created_by` from `user` where `user`.`active` = 1;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `user_getdetail` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_ALL_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER' */ ;
DELIMITER ;;
CREATE PROCEDURE `user_getdetail`(`id` INT)
BEGIN
	select `user`.`id`,
    `user`.`username`,
	`user`.`pass`,
    `user`.`is_admin`,
    `user`.`real_name`,
    `user`.`phone`,
    `user`.`add` from `user` where `user`.`id`= id and `active` = 1;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-12-05 21:23:16
