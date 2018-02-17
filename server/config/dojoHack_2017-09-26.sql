# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.5.42)
# Database: dojoHack
# Generation Time: 2017-10-02 05:47:44 +0000
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
  `mattermost` varchar(32) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  KEY `fk_user_location` (`location`),
  CONSTRAINT `fk_user_location` FOREIGN KEY (`location`) REFERENCES `locations` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;


/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
