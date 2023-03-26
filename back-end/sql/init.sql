-- 基础功能 ----------
-- user
create table user (
  id bigint(20) primary key auto_increment,
  user_id varchar(256) not null unique,
  nickname varchar(128),
  level tinyint(4) default 0,
  avatar_img varchar(256),
  feed_setting_type tinyint(4) default 0,
  disabled tinyint(4) default 0,
  deleted tinyint(4) default 0,
  create_time datetime,
  last_modify_time datetime
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 AUTO_INCREMENT=1;

-- material
create table material (
  id bigint(20) primary key auto_increment,
  user_id varchar(256),
  filename varchar(256) not null,
  md5 varchar(256) not null,
  `size` bigint(20) default 0,
  duration bigint(20) default 0 comment "视频时长",
  original_filename varchar(256),
  material_type tinyint(4) default 0 comment "0:视频文件、1:图片文件",
  disabled tinyint(4) default 0,
  deleted tinyint(4) default 0,
  create_time datetime,
  last_modify_time datetime
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 AUTO_INCREMENT=1;

-- content
create table content (
  id bigint(20) primary key auto_increment,
  user_id varchar(256),
  video_filename varchar(256),
  cover_img varchar(256),
  title varchar(256),
  description text,
  duration bigint(20) default 0,
  watcher_level tinyint(4) default 0 comment "要求的用户等级",
  count_ip_nft bigint(20) default 0 comment "视频的NFT总数量",
  count_ip_nft_for_investor bigint(20) default 0 comment "给股东的视频的NFT的最大数量",
  count_max_limit_per_investor bigint(20) default 0 comment "每个原始股东持有的IP NFT的最大数量",
  price_ip_nft bigint(20) default 0 comment "NFT的单价",
  count_ip_nft_left bigint(20) default 0 comment "NFT剩余",
  yield_rate_influencer double default 0 comment "大V分享收益占比",
  yield_rate_viewer double default 0 comment "观看者收益占比",
  disabled tinyint(4) default 0,
  deleted tinyint(4) default 0,
  create_time datetime,
  last_modify_time datetime
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 AUTO_INCREMENT=1;

-- 我订阅的创作者
create table subscription_creator (
  id bigint(20) primary key auto_increment,
  user_id varchar(256),
  creator_id varchar(256),
  disabled tinyint(4) default 0,
  deleted tinyint(4) default 0,
  create_time datetime,
  last_modify_time datetime
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 AUTO_INCREMENT=1;

-- 我分享的视频: 每个视频只可有一个分享链接
create table content_marked (
  id bigint(20) primary key auto_increment,
  user_id varchar(256),
  content_id bigint(20) comment "内容id（视频id）",
  utm_content varchar(256) comment "标识分享链接",
  liked tinyint(4) default 0,
  marked tinyint(4) default 0,
  disabled tinyint(4) default 0,
  deleted tinyint(4) default 0,
  create_time datetime,
  last_modify_time datetime
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 AUTO_INCREMENT=1;

-- 我的时间线(分享)
create table user_timeline (
  id bigint(20) primary key auto_increment,
  user_id varchar(256),
  content_id bigint(20) comment "内容id（视频id）",
  utm_content varchar(20) comment "标识分享链接",
  content_marked_id bigint(20) comment "表示分享链接的来源id",
  user_comment varchar(2000) comment "用户评论",
  share_type tinyint(4) default 0 comment "分享类型: 0站内分享, 1分享到facebook, 2分享到twitter",
  disabled tinyint(4) default 0,
  deleted tinyint(4) default 0,
  create_time datetime,
  last_modify_time datetime
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 AUTO_INCREMENT=1;




-- 交易相关功能 ----------

-- wallet
create table wallet (
  id bigint(20) primary key auto_increment,
  user_id varchar(256),
  balance_pot bigint(20) default 0,
  balance_hit bigint(20) default 0,
  create_time datetime,
  last_modify_time datetime
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 AUTO_INCREMENT=1;

-- 内容份额购买记录，购买ip nft的POT归创作者所有
-- 发布视频时创作者拥有全部份额，原始股东购买份额，需要向其购买，共开放发售的份额
create table content_stock (
  id bigint(20) primary key auto_increment,
  user_id varchar(256),
  content_id bigint(20) comment "内容id（视频id）",
  stock_type tinyint(4) default 0 comment "0:创作者、1:原始股东",
  count_ip_nft bigint(20) default 0 comment "视频NFT的总数",
  price_ip_nft bigint(20) default 0 comment "NFT的单价",
  amount_pot bigint(20) default 0 comment "购买NFT花费的POT数量",
  create_time datetime,
  last_modify_time datetime
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 AUTO_INCREMENT=1;


-- user transaction record
-- 用户的交易记录: 0:使用POT兑换HIT、1:充值POT、2:提现POT、3观看挖矿、4充值交易失败的退款(竞价购买NFT份额)
-- transaction_type tinyint(4) default 0 comment "0:使用POT兑换HIT、1:充值POT、2:提现POT、3观看挖矿、4充值交易失败的退款(竞价兑换HIT)",
create table user_transaction (
  id bigint(20) primary key auto_increment,
  user_id varchar(256),
  transaction_type tinyint(4) default 0 comment "0:使用POT兑换HIT、1:充值POT、2:提现POT、3观看挖矿",
  status tinyint(20) default 0 comment "状态（当transaction_type=3或4）: 0交易成功, 1交易中, 2交易失败",
  amount_pot bigint(20) default 0 comment "交易的pot金额",
  amount_hit bigint(20) default 0 comment "交易的hit金额",
  paid_time datetime,
  transaction_id varchar(256),
  create_time datetime,
  last_modify_time datetime
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 AUTO_INCREMENT=1;

-- 视频注入hit记录
-- 优先消耗广告商注入的hit
create table content_hit_balance (
  id bigint(20) primary key auto_increment,
  user_id varchar(256) comment "注入人",
  content_id bigint(20) comment "内容id（视频id）",
  amount_hit bigint(20) comment "注入hit的数量",
  balance_hit bigint(20) comment "剩余hit",
  balance_type tinyint(4) comment "注入类型: 0无广告注入, 1广告注入",
  ad_link varchar(2048) comment "广告链接",
  ad_title varchar(2048) comment "广告标题",
  create_time datetime,
  last_modify_time datetime
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 AUTO_INCREMENT=1;

-- 视频观看记录（消费视频HIT记录）
create table content_watch (
  id bigint(20) primary key auto_increment,
  user_id varchar(256),
  content_id bigint(20) comment "内容id（视频id）",
  amount_hit bigint(20) default 0 comment "消耗hit的数量",
  amount_sec bigint(20) default 0 comment "产生SEC的数量",
  duration bigint(20) default 0 comment "观看时长",
  user_level tinyint(4) default 0 comment "用户等级",
  utm_content varchar(256) comment "--如果用户通过分享链接注册, 标注分享链接的来源",
  referrer_user_id varchar(256) comment "--推荐人",
  create_time datetime,
  last_modify_time datetime
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 AUTO_INCREMENT=1;

-- 视频消费记录明细, 一条观看记录会对应一条或多条消费明细
create table content_hit_consume (
  id bigint(20) primary key auto_increment,
  user_id varchar(256) comment "当consume_type=1时, 该字段不能为空",
  content_id bigint(20) comment "视频id",
  content_watch_id bigint(20) comment "关联的观看记录",
  consume_type tinyint(4) default 0 comment "消费类型: 0消费视频注入的hit,需要关联content_consume表, 1自动消费用户钱包中的hit",
  amount_hit bigint(20) default 0 comment "消耗hit数量",
  content_hit_balance_id bigint(20) comment "当consume_type=0时, 如果关联的视频注入hit记录",
  create_time datetime,
  last_modify_time datetime
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 AUTO_INCREMENT=1;
