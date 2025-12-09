import { useEffect, useState } from "react";
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

  const handleSearchFriend = () => {
    getUserInfoReq.run({ search: searchValue });
  };

  const handleAddFriend = (userData: typeof currentAddUserData) => {
    setCurrentAddUserData(userData);
    setAddFriendOpen(true);
  };

  const handleCancel = () => {
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
    <div className={styles.addFriendModal}>
      <Modal
        title="添加朋友"
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
                      preview={{
                        mask: false,
                      }}
                      src={item.avatar}
                    >
                      {item.username}
                    </Image>
                    <div style={{ fontSize: 14 }}>{item.username}</div>
                    <Flex align="center" justify="end" style={{ flexGrow: 1 }}>
                      {userInfo.userId === item.userId ? (
                        <div>自己</div>
                      ) : (
                        <Button
                          type="link"
                          onClick={() => handleAddFriend(item)}
                        >
                          添加
                        </Button>
                      )}
                    </Flex>
                  </Flex>
                </Card>
              ))
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Flex>
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
