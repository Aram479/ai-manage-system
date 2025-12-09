import React, { useEffect, useState, useCallback } from "react";
import {
  Form,
  Image,
  Input,
  message,
  Modal,
  ModalProps,
  Upload,
  UploadProps,
} from "antd";
import { RcFile } from "antd/es/upload";
import { Rule } from "antd/es/form";
import { useModel, useRequest } from "@umijs/max";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { getFilenameSuffix } from "@/utils";
import { uploadAvatarByUser } from "@/services/api/uploadApi";
import styles from "./index.less";

// 静态常量定义
const FILE_ACCEPT = ".jpg,.png";
const MODAL_WIDTH = 600;
const MODAL_TITLE = "用户信息";

// 表单规则常量
const formRules: Record<string, Rule[]> = {
  username: [{ required: true, message: "请输入用户名" }],
  email: [{ required: true, message: "请输入邮箱" }],
};

interface IUserInfoModal extends ModalProps {
  data?: any;
  onOk?: (data?: any) => void;
  onCancel?: (data?: any) => void;
}

const UserInfoModal: React.FC<IUserInfoModal> = ({
  title = MODAL_TITLE,
  open,
  onOk,
  onCancel,
  ...modalProps
}) => {
  const { userInfo, updateUserInfoReq } = useModel("user");
  const [avatarFile, setAvatarFile] = useState<RcFile>();
  const [form] = Form.useForm<IUserInfo>();
  const formValues = Form.useWatch([], form);

  // 上传头像请求
  const uploadAvatarReq = useRequest(uploadAvatarByUser, {
    manual: true,
    onSuccess: (res) => {
      const formData = form.getFieldsValue();
      URL.revokeObjectURL(formData.avatar || "");
      updateUserInfoReq.run({
        ...formData,
        avatar: res.fullUrl,
      });
      onOk?.(formData);
    },
    onError: () => {
      message.error("头像上传失败");
    },
  });

  // 处理文件上传前的校验
  const handleBeforeUpload: NonNullable<UploadProps["beforeUpload"]> = (
    file
  ) => {
    const fileSuffix = getFilenameSuffix(file.name);
    const fileTypeArr = FILE_ACCEPT.split(",");
    const isFileType = fileTypeArr.includes(`.${fileSuffix}`);

    if (!isFileType) {
      const fileTypeMessage = fileTypeArr.join("、");
      message.error(`请上传${fileTypeMessage}类型文件`);
      return false;
    }

    const url = URL.createObjectURL(file);
    form.setFieldValue("avatar", url);
    setAvatarFile(file);
    return Upload.LIST_IGNORE;
  };

  // 处理确认操作
  const handleConfirm = async () => {
    await form.validateFields();

    if (avatarFile) {
      uploadAvatarReq.run({
        userId: userInfo.userId,
        avatar: avatarFile,
      });
    } else {
      // 只有用户名变更
      const formData = form.getFieldsValue();
      updateUserInfoReq.run(formData);
      onOk?.(formData);
    }
  };

  // 处理取消操作
  const handleCancel = () => {
    onCancel?.();
  };

  // 模态框打开时初始化表单数据
  useEffect(() => {
    if (open) {
      form.setFieldsValue(userInfo);
      setAvatarFile(undefined);
    }
  }, [open, userInfo, form]);

  return (
    <Modal
      className={styles.userInfoModal}
      title={title}
      open={open}
      maskClosable={false}
      width={MODAL_WIDTH}
      onOk={handleConfirm}
      onCancel={handleCancel}
      confirmLoading={uploadAvatarReq.loading}
      {...modalProps}
    >
      <Form layout="vertical" form={form} preserve={false}>
        <Form.Item name="userId" label="用户ID">
          <Input placeholder="请输入" disabled allowClear />
        </Form.Item>

        <Form.Item name="username" label="用户名称" rules={formRules.username}>
          <Input placeholder="请输入" allowClear />
        </Form.Item>

        <Form.Item name="email" label="邮箱" rules={formRules.email}>
          <Input placeholder="请输入" allowClear />
        </Form.Item>

        <Form.Item name="avatar" label="头像">
          <Upload
            name="avatar"
            listType="picture-circle"
            accept={FILE_ACCEPT}
            showUploadList={false}
            beforeUpload={handleBeforeUpload}
          >
            {formValues?.avatar ? (
              <Image
                className={styles.uploadAvatar}
                src={formValues.avatar}
                preview={{
                  visible: false,
                  mask: "选择图片",
                }}
              />
            ) : (
              <div className={styles.uploadPlaceholder}>
                {uploadAvatarReq.loading ? (
                  <LoadingOutlined />
                ) : (
                  <PlusOutlined />
                )}
                <div>Upload</div>
              </div>
            )}
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserInfoModal;
