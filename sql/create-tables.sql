CREATE TABLE `user` (
  `uid` varchar(16) NOT NULL,
  `name` varchar(16) NOT NULL,
  `password` varchar(16) NOT NULL,
  `descs` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `friend` (
  `uid` varchar(16) NOT NULL,
  `friend_uid` varchar(16) NOT NULL,
  PRIMARY KEY (`uid`,`friend_uid`),
  KEY `friend_uid` (`friend_uid`),
  CONSTRAINT `friend_ibfk_1` FOREIGN KEY (`friend_uid`) REFERENCES `user` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `chat_msg` (
  `from_uid` varchar(16) NOT NULL DEFAULT '',
  `uid` varchar(16) NOT NULL DEFAULT '',
  `msg` varchar(255) NOT NULL DEFAULT '',
  `msgType` smallint(11) NOT NULL DEFAULT '0' COMMENT '0文本消息 1文件 2通话',
  `sendTime` int(11) NOT NULL,
  KEY `from_uid` (`from_uid`,`uid`),
  KEY `uid` (`uid`),
  CONSTRAINT `chat_msg_ibfk_1` FOREIGN KEY (`from_uid`) REFERENCES `user` (`uid`),
  CONSTRAINT `chat_msg_ibfk_2` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;