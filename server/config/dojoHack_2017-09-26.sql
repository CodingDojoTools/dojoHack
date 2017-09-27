# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.6.34)
# Database: dojoHack
# Generation Time: 2017-09-27 01:23:19 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table hackathons
# ------------------------------------------------------------

DROP TABLE IF EXISTS `hackathons`;

CREATE TABLE `hackathons` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL DEFAULT '',
  `deadline` datetime NOT NULL,
  `winner` int(11) unsigned DEFAULT NULL,
  `theme` varchar(32) NOT NULL DEFAULT '',
  `info` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_hackathon_project` (`winner`),
  CONSTRAINT `fk_hackathon_project` FOREIGN KEY (`winner`) REFERENCES `projects` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `hackathons` WRITE;
/*!40000 ALTER TABLE `hackathons` DISABLE KEYS */;

INSERT INTO `hackathons` (`id`, `name`, `deadline`, `winner`, `theme`, `info`)
VALUES
	(1,'hack1','2017-09-13 15:29:19',NULL,'',''),
	(2,'hach2','2017-09-14 15:29:36',NULL,'',''),
	(3,'hach3','2017-09-14 15:30:03',NULL,'',''),
	(4,'hack4','2017-09-20 15:30:03',NULL,'',''),
	(5,'hack5','2017-10-20 15:30:03',NULL,'',''),
	(6,'hack6','2017-10-20 15:30:03',NULL,'',''),
	(7,'iOS Map Hack','2017-10-20 15:30:03',NULL,'iOS','');

/*!40000 ALTER TABLE `hackathons` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table locations
# ------------------------------------------------------------

DROP TABLE IF EXISTS `locations`;

CREATE TABLE `locations` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `locations` WRITE;
/*!40000 ALTER TABLE `locations` DISABLE KEYS */;

INSERT INTO `locations` (`id`, `name`)
VALUES
	(1,'San Jose'),
	(2,'Burbank'),
	(3,'Seattle'),
	(4,'Chicago'),
	(5,'Dallas'),
	(6,'DC'),
	(7,'Tulsa'),
	(8,'Berkeley'),
	(9,'OC');

/*!40000 ALTER TABLE `locations` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table members
# ------------------------------------------------------------

DROP TABLE IF EXISTS `members`;

CREATE TABLE `members` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `firstName` varchar(32) NOT NULL DEFAULT '',
  `lastName` varchar(32) NOT NULL DEFAULT '',
  `team` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_member_team` (`team`),
  CONSTRAINT `fk_member_team` FOREIGN KEY (`team`) REFERENCES `teams` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `members` WRITE;
/*!40000 ALTER TABLE `members` DISABLE KEYS */;

INSERT INTO `members` (`id`, `firstName`, `lastName`, `team`)
VALUES
	(1,'Bob','Bobbers',5),
	(2,'Eli ','Byers',7),
	(3,'Amy','Giver',7),
	(4,'Bob','Bobbers',16);

/*!40000 ALTER TABLE `members` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table projects
# ------------------------------------------------------------

DROP TABLE IF EXISTS `projects`;

CREATE TABLE `projects` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(32) NOT NULL DEFAULT '',
  `gitUrl` varchar(128) NOT NULL DEFAULT '',
  `vidUrl` varchar(128) NOT NULL DEFAULT '',
  `description` text NOT NULL,
  `teamId` int(11) unsigned NOT NULL,
  `hackathonId` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_project_team` (`teamId`),
  KEY `fk_project_hackathon` (`hackathonId`),
  CONSTRAINT `fk_project_hackathon` FOREIGN KEY (`hackathonId`) REFERENCES `hackathons` (`id`),
  CONSTRAINT `fk_project_team` FOREIGN KEY (`teamId`) REFERENCES `teams` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;

INSERT INTO `projects` (`id`, `title`, `gitUrl`, `vidUrl`, `description`, `teamId`, `hackathonId`)
VALUES
	(19,'project 1','https://github.com/eli-byers/dojoHack','https://youtube.com/asdfasdf','asdfasdf.',5,3),
	(20,'Asdf asdf','https://github.com/asdf/asdf','https://youtu.be/asdf','asdf asdf asdf asdf asdf asdf asdf',7,5),
	(21,'ASDasdf','https://github.com/asdf/asdf','https://youtu.be/asdf','asdf asdf asdf asdf asdf asdf asdf ',7,4),
	(22,'asdfasdf','https://github.com/asdfasdf/asdf','https://youtu.be/asdf','asdf asdf asdf asdf asdf asdf asdf',7,4);

/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table scores
# ------------------------------------------------------------

DROP TABLE IF EXISTS `scores`;

CREATE TABLE `scores` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `uiux` int(1) NOT NULL DEFAULT '0',
  `pres` int(1) NOT NULL DEFAULT '0',
  `idea` int(1) NOT NULL DEFAULT '0',
  `impl` int(1) NOT NULL DEFAULT '0',
  `extra` int(1) NOT NULL DEFAULT '0',
  `comment` text,
  `userId` int(11) unsigned NOT NULL,
  `projectId` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_score_user` (`userId`),
  KEY `fk_score_project` (`projectId`),
  CONSTRAINT `fk_score_project` FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`),
  CONSTRAINT `fk_score_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `scores` WRITE;
/*!40000 ALTER TABLE `scores` DISABLE KEYS */;

INSERT INTO `scores` (`id`, `uiux`, `pres`, `idea`, `impl`, `extra`, `comment`, `userId`, `projectId`)
VALUES
	(1,4,1,1,3,1,'Nice!',1,19);

/*!40000 ALTER TABLE `scores` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table submissions
# ------------------------------------------------------------

DROP TABLE IF EXISTS `submissions`;

CREATE TABLE `submissions` (
  `teamId` int(11) unsigned NOT NULL,
  `hackathonId` int(11) unsigned NOT NULL,
  `projectId` int(11) unsigned DEFAULT NULL,
  KEY `fk_submission_team` (`teamId`),
  KEY `fk_submission_hackathon` (`hackathonId`),
  KEY `fk_submission_project` (`projectId`),
  CONSTRAINT `fk_submission_hackathon` FOREIGN KEY (`hackathonId`) REFERENCES `hackathons` (`id`),
  CONSTRAINT `fk_submission_project` FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`),
  CONSTRAINT `fk_submission_team` FOREIGN KEY (`teamId`) REFERENCES `teams` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `submissions` WRITE;
/*!40000 ALTER TABLE `submissions` DISABLE KEYS */;

INSERT INTO `submissions` (`teamId`, `hackathonId`, `projectId`)
VALUES
	(5,2,NULL),
	(6,2,NULL),
	(5,4,19),
	(7,5,20),
	(7,4,22);

/*!40000 ALTER TABLE `submissions` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table teams
# ------------------------------------------------------------

DROP TABLE IF EXISTS `teams`;

CREATE TABLE `teams` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL DEFAULT '',
  `password` varchar(255) NOT NULL DEFAULT '',
  `location` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_team_location` (`location`),
  CONSTRAINT `fk_team_location` FOREIGN KEY (`location`) REFERENCES `locations` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `teams` WRITE;
/*!40000 ALTER TABLE `teams` DISABLE KEYS */;

INSERT INTO `teams` (`id`, `name`, `password`, `location`)
VALUES
	(5,'asdfasdff','$2a$10$5xBVhIZK.nmbJxKTA4J6meWuViLLfqOE.YAuBBhIrLmmWY9aAb0q6',1),
	(6,'asdfasdfd','$2a$10$gBHZdXPqI3zwtWkWp3IXVuqszxF86d.XWkJOgK2u2sVyDNYyGME4C',1),
	(7,'Bob is great','$2a$10$dGwlTB.7609Qsg244BVjZOWECZDo2eVaOnHYkweiu6zzLGrAMKh0y',1),
	(14,'asdfasdf','$2a$10$BfAGaNcn7uGt08yYNqU.w.6K3Gq9G/Ldnhu93kHfdz/8ISjK0rUty',1),
	(15,'qwerqwer','$2a$10$.WqxOo5mVJSA8iPE.8DxUOmkD3Y.YBUtQOT/yHKUAV0zPZ4/V4Nsu',1),
	(16,'bobbob','$2a$10$iczoU0P/5VlQVAYfTwn63.XuHMMjnYh1KZPosjFq979Tq0xp7Wm.2',1);

/*!40000 ALTER TABLE `teams` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL DEFAULT '',
  `password` varchar(255) NOT NULL DEFAULT '',
  `location` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_user_location` (`location`),
  CONSTRAINT `fk_user_location` FOREIGN KEY (`location`) REFERENCES `locations` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;

INSERT INTO `users` (`id`, `name`, `password`, `location`)
VALUES
	(1,'admin','$2a$10$dnOrKSYtm/JYU5k1b.h61eQg0WkpLzzdE0/7.d/ifc8MmSNd4y.8q',1);

/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
