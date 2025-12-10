import React, { useState } from "react";
import {
  Collapse,
  Avatar,
  Button,
  List,
  Empty,
  Popover,
  CollapseProps,
} from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  UserOutlined,
  ClockCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { FriendListProps, FriendRequest } from "../types";
import styles from "./FriendList.less";

const FriendList: React.FC<FriendListProps> = ({
  friendRequests = [],
  contacts = [],
  onAcceptRequest,
  onRejectRequest,
  onSelectContact,
}) => {
  const [activeKey, setActiveKey] = useState<string[]>([]);
  // 渲染好友申请项
  const renderRequestItem = (request: FriendRequest) => {
    // 好友申请详情内容
    const requestDetailContent = (
      <div className={styles.requestDetail}>
        <div className={styles.detailHeader}>
          <Avatar size={64} src={request.avatar} icon={<UserOutlined />} />
          <div className={styles.detailInfo}>
            <h3 className={styles.detailName}>{request.username}</h3>
            <p className={styles.detailMessage}>
              {request.message || "请求添加你为好友"}
            </p>
            <p className={styles.detailTime}>
              <ClockCircleOutlined />{" "}
              {new Date(request.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
        <div className={styles.detailActions}>
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={() => onAcceptRequest?.(request)}
            className={styles.acceptBtn}
          >
            接受
          </Button>
          <Button
            danger
            icon={<CloseOutlined />}
            onClick={() => onRejectRequest?.(request)}
            className={styles.rejectBtn}
          >
            拒绝
          </Button>
        </div>
      </div>
    );

    return (
      <Popover
        content={requestDetailContent}
        trigger="click"
        placement="right"
        classNames={{
          body: styles.popover,
        }}
      >
        <List.Item
          key={request.id}
          className={styles.requestItem}
          actions={[<InfoCircleOutlined className={styles.infoIcon} />]}
        >
          <List.Item.Meta
            avatar={<Avatar src={request.avatar} icon={<UserOutlined />} />}
            title={<span className={styles.singeLine}>{request.username}</span>}
            description={
              <div>
                <div className={styles.requestMessage}>
                  {request.message || "请求添加你为好友"}
                </div>
              </div>
            }
          />
        </List.Item>
      </Popover>
    );
  };

  // 渲染好友项
  const renderContactItem = (friend: ApiTypes.TFriendList) => (
    <List.Item
      key={friend.id}
      className={`${styles.contactItem}`}
      onClick={() => onSelectContact?.(friend)}
    >
      <List.Item.Meta
        avatar={<Avatar src={friend.avatar} icon={<UserOutlined />} />}
        title={<span>{friend.username}</span>}
      />
    </List.Item>
  );

  const friendPanelItems: CollapseProps["items"] = [
    {
      key: "requests",
      label: `好友申请 (${friendRequests.length})`,
      className: styles.panel,
      children: (
        <>
          {friendRequests.length > 0 ? (
            <List
              dataSource={friendRequests}
              renderItem={renderRequestItem}
              className={styles.requestList}
            />
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="暂无好友申请"
            />
          )}
        </>
      ),
    },
    {
      key: "contacts",
      label: `好友列表 (${contacts.length})`,
      className: styles.panel,
      children: (
        <>
          {contacts.length > 0 ? (
            <List
              dataSource={contacts}
              renderItem={renderContactItem}
              className={styles.contactList}
            />
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="暂无好友"
            />
          )}
        </>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <Collapse
        activeKey={activeKey}
        onChange={setActiveKey}
        ghost
        items={friendPanelItems}
        className={styles.collapse}
      />
    </div>
  );
};

export default FriendList;
