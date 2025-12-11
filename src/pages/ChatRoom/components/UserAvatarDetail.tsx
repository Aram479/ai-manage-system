import {
  Avatar,
  AvatarProps,
  Button,
  Flex,
  Image,
  message,
  Popover,
  Tooltip,
} from "antd";
import { useModel } from "@umijs/max";
import { copy } from "@/utils";

const AvatarCmp = (props: AvatarProps) => {
  const { userInfo } = useModel("user");
  return (
    <Image
      preview={userInfo?.avatar ? { mask: false } : false}
      src={userInfo?.avatar}
      style={{
        width: 43,
        height: 43,
        borderRadius: 5,
        objectFit: "cover",
        cursor: "pointer",
      }}
    >
      {userInfo?.username}
    </Image>
  );
};

/* 用户头像详细信息 */
const UserAvatarDetail = () => {
  const { userInfo } = useModel("user");
  return (
    <div>
      <Popover
        content={
          <Flex gap={8} align="center">
            <AvatarCmp />
            <Flex vertical style={{ fontSize: 14 }}>
              <div style={{ fontWeight: "bold" }}>{userInfo?.username}</div>
              <div style={{ fontSize: 12 }}>
                用户ID：
                <Tooltip title="点击复制" arrow={false}>
                  <Button
                    type="link"
                    style={{ padding: 0, height: "auto" }}
                    onClick={() => {
                      copy(userInfo?.userId ?? "");
                      message.success("复制成功");
                    }}
                  >
                    {userInfo?.userId}
                  </Button>
                </Tooltip>
              </div>
            </Flex>
          </Flex>
        }
        placement="right"
        trigger={["click"]}
        arrow={false}
      >
        <Avatar
          shape="square"
          src={userInfo?.avatar}
          style={{ cursor: "pointer", width: 45, height: 45 }}
        >
          {userInfo?.username.charAt(0)}
        </Avatar>
      </Popover>
    </div>
  );
};

export default UserAvatarDetail;
