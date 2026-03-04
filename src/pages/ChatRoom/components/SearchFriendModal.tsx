import { KeyboardEventHandler, useEffect, useState } from "react";
import {
  Button,
  Card,
  Empty,
  Flex,
  Image,
  Input,
  message,
  Modal,
  ModalProps,
  Spin,
} from "antd";
import { useModel, useRequest } from "@umijs/max";
import { SearchOutlined } from "@ant-design/icons";
import { getAddFriendList, sendAddFriendApi } from "@/services/api/chatRoomApi";
import AddFriendModal from "./AddFriendModal";
import styles from "./SearchFriendModal.less";

interface ISearchFriendModal extends ModalProps {
  open?: boolean;
  title?: string;
  data?: any;
  onOk?: (data?: any) => void;
  onCancel?: (data?: any) => void;
}

const FriendReqStatusMap = new Map([
  [1, "自己"],
  [2, "申请中"],
  [3, "已添加"],
]);
const SearchFriendModal = (props: ISearchFriendModal) => {
  const { data = {}, title, open, onOk, onCancel, ...modalProps } = props;
  const { userInfo } = useModel("user");
  const [searchValue, setSearchValue] = useState("");
  const [friendList, setFriendList] = useState<
    Partial<ApiTypes.TChatRoomUserList>[]
  >([]);
  const [addFriendOpen, setAddFriendOpen] = useState(false);
  const [currentAddUserData, setCurrentAddUserData] =
    useState<(typeof friendList)[number]>();

  const sendAddFriendReq = useRequest(sendAddFriendApi, {
    manual: true,
    onSuccess: () => {
      message.success("好友申请发送成功！");
      setAddFriendOpen(false);
    },
  });

  const getUserInfoReq = useRequest(getAddFriendList, {
    manual: true,
    onSuccess: (newFriendList) => {
      setFriendList(newFriendList);
    },
  });

  const handleEnterKeyDown: KeyboardEventHandler<any> = (e) => {
    if (e.key === "Enter") {
      handleSearchFriend();
    }
  };

  const handleSearchFriend = () => {
    if (searchValue.trim()) {
      getUserInfoReq.run({ search: searchValue });
    } else {
      message.error({
        key: "noSearch",
        content: "请提供朋友id或邮箱",
      });
    }
  };

  const handleAddFriend = (userData: typeof currentAddUserData) => {
    setCurrentAddUserData(userData);
    setAddFriendOpen(true);
  };

  const handleCancel = () => {
    setSearchValue("");
    onCancel?.(false);
  };

  // 模态框打开时初始化表单数据
  useEffect(() => {
    if (open) {
      setFriendList([]);
      setSearchValue("");
    }
  }, [open]);

  return (
    <div className={styles.addFriendModal} onKeyDown={handleEnterKeyDown}>
      <Modal
        title="添加好友"
        open={open}
        maskClosable={false}
        cancelButtonProps={{ loading: false }}
        okButtonProps={{ loading: false }}
        width={400}
        destroyOnClose
        footer={false}
        onCancel={handleCancel}
        {...modalProps}
      >
        <Flex vertical gap={10}>
          <Flex gap={5}>
            <Input
              allowClear
              prefix={<SearchOutlined style={{ color: "#ccc" }} />}
              placeholder="用户Id/邮箱"
              onChange={(e) => setSearchValue(e.target.value?.trim())}
            />
            <Button type="primary" onClick={handleSearchFriend}>
              搜索
            </Button>
          </Flex>
          <Spin spinning={getUserInfoReq.loading}>
            <Flex className={styles.addUserList} vertical gap={8}>
              {!!friendList.length ? (
                friendList.map((item) => (
                  <Card
                    key={item.id}
                    classNames={{
                      body: styles.addUserCard,
                    }}
                  >
                    <Flex gap={8}>
                      <Image
                        className={styles.userAvatarBox}
                        width={60}
                        preview={
                          item.avatar
                            ? {
                                mask: false,
                              }
                            : false
                        }
                        src={item.avatar}
                      >
                        {item.username}
                      </Image>
                      <div style={{ fontSize: 14 }}>{item.username}</div>
                      <Flex
                        align="center"
                        justify="end"
                        style={{ flexGrow: 1 }}
                      >
                        {!item.status ? (
                          <Button
                            type="link"
                            onClick={() => handleAddFriend(item)}
                          >
                            添加
                          </Button>
                        ) : (
                          <div>{FriendReqStatusMap.get(item.status)}</div>
                        )}
                      </Flex>
                    </Flex>
                  </Card>
                ))
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  style={{ height: "100%" }}
                />
              )}
            </Flex>
          </Spin>
        </Flex>
      </Modal>
      <AddFriendModal
        open={addFriendOpen}
        data={currentAddUserData}
        confirmLoading={sendAddFriendReq.loading}
        onOk={(data) => {
          sendAddFriendReq.run(data);
        }}
        onCancel={setAddFriendOpen}
      />
    </div>
  );
};

export default SearchFriendModal;
