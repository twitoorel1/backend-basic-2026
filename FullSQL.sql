-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: cipher_warehouse
-- ------------------------------------------------------
-- Server version	8.0.40

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
-- Table structure for table `core_device`
--

DROP TABLE IF EXISTS `core_device`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `core_device` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `serial` varchar(128) NOT NULL,
  `makat` varchar(64) NOT NULL,
  `device_name` varchar(191) NOT NULL,
  `current_unit_symbol` varchar(64) NOT NULL,
  `device_type_id` bigint unsigned NOT NULL,
  `encryption_profile_id` bigint unsigned DEFAULT NULL,
  `lifecycle_status` enum('NEW','PENDING_CARD','ACTIVE','NOT_ELIGIBLE','TRANSFERRED','REMOVED') NOT NULL DEFAULT 'NEW',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_core_device_serial` (`serial`),
  KEY `idx_core_device_makat` (`makat`),
  KEY `idx_core_device_device_name` (`device_name`),
  KEY `idx_core_device_created_at` (`created_at`),
  KEY `idx_core_device_updated_at` (`updated_at`),
  KEY `idx_core_device_device_type_id` (`device_type_id`),
  KEY `idx_core_device_encryption_profile_id` (`encryption_profile_id`),
  KEY `idx_core_device_lifecycle_status` (`lifecycle_status`),
  CONSTRAINT `fk_core_device_device_type` FOREIGN KEY (`device_type_id`) REFERENCES `device_type` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_core_device_encryption_profile` FOREIGN KEY (`encryption_profile_id`) REFERENCES `encryption_profile` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `core_device`
--

LOCK TABLES `core_device` WRITE;
/*!40000 ALTER TABLE `core_device` DISABLE KEYS */;
INSERT INTO `core_device` VALUES (15,'490031','310902748','מח 710','פלחיק571/חט828 - 0010/MG01',1,NULL,'NEW','2025-12-18 03:31:07','2025-12-18 05:31:16',NULL),(16,'490201','310902748','מח 710','פלחיק571/חט828 - 0010/MG01',1,NULL,'NEW','2025-12-18 03:31:07','2025-12-18 05:31:16',NULL),(17,'112101051','319658875','אול\"ר רישתי','פלחיק571/חט828 - 0010/MG01',4,NULL,'NEW','2025-12-18 03:31:07','2025-12-18 05:32:48',NULL),(18,'102301011','319658869','אול\"ר רישתי XCOVER','פלחיק571/חט828 - 0010/MG01',4,NULL,'NEW','2025-12-18 03:31:07','2025-12-18 05:32:48',NULL),(19,'550751','319653269','מגן מכלול','פלחיק571/חט828 - 0010/MG01',1,NULL,'NEW','2025-12-18 03:31:07','2025-12-18 04:47:33',NULL),(20,'353251','319667169','טל 88','פלחיק571/חט828 - 0010/MG01',1,NULL,'NEW','2025-12-18 03:31:07','2025-12-18 05:31:16',NULL),(21,'761954','310902683','מב\"ן','פלחיק571/חט828 - 0010/MG01',2,NULL,'NEW','2025-12-18 03:31:07','2025-12-18 05:00:35',NULL),(22,'886582','319652817','מחשב 19ה','פלחיק571/חט828 - 0010/MG01',4,NULL,'NEW','2025-12-18 03:31:07','2025-12-18 05:32:48',NULL);
/*!40000 ALTER TABLE `core_device` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `device_type`
--

DROP TABLE IF EXISTS `device_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `device_type` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `code` enum('RADIO','ZIAD','MOBILITY','OTHER') NOT NULL,
  `display_name` varchar(120) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_device_type_code` (`code`),
  UNIQUE KEY `uk_device_type_display_name` (`display_name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `device_type`
--

LOCK TABLES `device_type` WRITE;
/*!40000 ALTER TABLE `device_type` DISABLE KEYS */;
INSERT INTO `device_type` VALUES (1,'RADIO','Radio','2025-12-17 20:43:06','2025-12-17 20:43:06'),(2,'ZIAD','ZIAD','2025-12-17 20:43:06','2025-12-17 20:43:06'),(3,'MOBILITY','Mobility','2025-12-17 20:43:06','2025-12-17 20:43:06'),(4,'OTHER','Other','2025-12-17 20:43:06','2025-12-17 20:43:06');
/*!40000 ALTER TABLE `device_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `encryption_profile`
--

DROP TABLE IF EXISTS `encryption_profile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `encryption_profile` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `profile_name` varchar(80) NOT NULL,
  `device_family` varchar(40) NOT NULL,
  `expected_car` int NOT NULL,
  `expected_simol` int DEFAULT NULL,
  `expected_period_code` int DEFAULT NULL,
  `period_mode` enum('NONE','ZIAD','FIXED') NOT NULL DEFAULT 'NONE',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_encryption_profile_profile_name` (`profile_name`),
  UNIQUE KEY `uk_encryption_profile_device_family` (`device_family`),
  KEY `idx_encryption_profile_expected` (`expected_car`,`expected_simol`,`expected_period_code`),
  CONSTRAINT `chk_encryption_profile_period` CHECK ((((`period_mode` = _utf8mb4'NONE') and (`expected_period_code` is null)) or ((`period_mode` <> _utf8mb4'NONE') and (`expected_period_code` is not null))))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `encryption_profile`
--

LOCK TABLES `encryption_profile` WRITE;
/*!40000 ALTER TABLE `encryption_profile` DISABLE KEYS */;
/*!40000 ALTER TABLE `encryption_profile` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refresh_tokens`
--

DROP TABLE IF EXISTS `refresh_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refresh_tokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `token_hash` char(64) NOT NULL,
  `issued_at` datetime NOT NULL,
  `expires_at` datetime NOT NULL,
  `revoked_at` datetime DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `ip` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_refresh_tokens_token_hash` (`token_hash`),
  KEY `idx_refresh_tokens_user_id_expires_at` (`user_id`,`expires_at`),
  CONSTRAINT `fk_refresh_tokens_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refresh_tokens`
--

LOCK TABLES `refresh_tokens` WRITE;
/*!40000 ALTER TABLE `refresh_tokens` DISABLE KEYS */;
INSERT INTO `refresh_tokens` VALUES (49,1,'3cc47df3a3608ef465d311cbe2d1dd81d0a58ce51c4d2646f2d27730734eb5a2','2025-12-17 19:26:14','2026-01-16 19:26:14',NULL,'PostmanRuntime/7.51.0','::1'),(50,1,'08af2b930f252c9cbe7be9d0e5f608346e67a921b67b8ce4b5a04719cc004897','2025-12-17 22:15:32','2026-01-16 22:15:32',NULL,'PostmanRuntime/7.51.0','::1'),(51,1,'0f48a03bf5cc1e737df07accd0917bdcce491f41ecd54dc5fac7c7cddb6e6203','2025-12-18 02:46:28','2026-01-17 02:46:28',NULL,'PostmanRuntime/7.51.0','::1'),(52,1,'b811e2571bf4fd398a5efd7724f04f35e452bf03ea1db898fcaddcba0662d477','2025-12-18 03:01:39','2026-01-17 03:01:39',NULL,'PostmanRuntime/7.51.0','::1'),(53,1,'0e9ff3204b2d2f66a05e3be96e76e85073b9a45975b27a3dc4b0dce0ab05c581','2025-12-18 03:16:45','2026-01-17 03:16:45',NULL,'PostmanRuntime/7.51.0','::1'),(54,1,'e0974b2e981979652d47e8991cb57e837768facf4e1646250bb16b534b08c0d2','2025-12-18 03:16:51','2026-01-17 03:16:51',NULL,'PostmanRuntime/7.51.0','::1'),(55,1,'b8e1ba8d429da306aa0c446132d3ed6819afe2a1d9a959244e77bf137b7714f7','2025-12-18 03:24:57','2026-01-17 03:24:57',NULL,'PostmanRuntime/7.51.0','::1'),(56,1,'1784bd9b4d1ce03a0ad0e53fdbc16ead0844bb8c343974f09d7b1e02d550e83c','2025-12-18 03:36:12','2026-01-17 03:36:12',NULL,'PostmanRuntime/7.51.0','::1'),(57,1,'925b523474cffb799d9edb277948414901153856f3ce825923b97096c5d97c00','2025-12-18 03:39:15','2026-01-17 03:39:15',NULL,'PostmanRuntime/7.51.0','::1'),(58,1,'50f5f32723095bfb1e9b73658fd856ccc9fb57d8972f21e7c0d590a2535b93f8','2025-12-18 04:00:17','2026-01-17 04:00:17',NULL,'PostmanRuntime/7.51.0','::1'),(59,1,'154b75fabe5456f3e023814880a2cb252710704a33e4f1f2f3473cf854277ed4','2025-12-18 04:14:09','2026-01-17 04:14:09',NULL,'PostmanRuntime/7.51.0','::1'),(60,1,'13c5809de8dbfdab253e06be5ab06ebb1e79a0a9b159a834b680b32cd1cf27a2','2025-12-18 04:25:05','2026-01-17 04:25:05',NULL,'PostmanRuntime/7.51.0','::1'),(61,1,'13e374d5a7fc052b9cf7e59b5e69ff0f01106dd1293edae9710f929451b8babf','2025-12-18 04:34:00','2026-01-17 04:34:00',NULL,'PostmanRuntime/7.51.0','::1'),(62,1,'6c60be893f0007fbe7fd94a2edee3cee18dd7617a85653cbe2ae2ba02ec66bae','2025-12-18 04:51:26','2026-01-17 04:51:26',NULL,'PostmanRuntime/7.51.0','::1'),(63,1,'19857212ccb68885b8dbf381832f41e4a448351936ab593645aca8c8f04124eb','2025-12-18 05:00:09','2026-01-17 05:00:09',NULL,'PostmanRuntime/7.51.0','::1'),(64,1,'aae93357e9bac42fa1b0724a8be19551131b9e849b9899276b5569a9e565bdd4','2025-12-18 05:14:46','2026-01-17 05:14:46',NULL,'PostmanRuntime/7.51.0','::1'),(65,1,'23cef8c551dc8abab9a238bec26bdbc49413713a48c5d531cf0a64488f23279e','2025-12-18 05:21:53','2026-01-17 05:21:53',NULL,'PostmanRuntime/7.51.0','::1');
/*!40000 ALTER TABLE `refresh_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(200) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('VIEWER','EDITOR','ADMIN') NOT NULL DEFAULT 'VIEWER',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `last_login_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_users_username` (`username`),
  UNIQUE KEY `uq_users_email` (`email`),
  KEY `idx_users_username_is_active` (`username`,`is_active`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Orel','Twito','twitoorel1','twitoorel1@example.com','$2b$12$NBkqd3G/4lamLzsH6JcWselDD5YyUV87M3neOnAXag9EmsytAj0qm','ADMIN',1,NULL,'2025-12-16 15:44:53','2025-12-17 17:58:33');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'cipher_warehouse'
--

--
-- Dumping routines for database 'cipher_warehouse'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-18 14:03:47
