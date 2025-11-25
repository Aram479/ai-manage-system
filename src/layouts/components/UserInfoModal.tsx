import { useEffect, useState } from "react";
import {
  Col,
  Flex,
  Form,
  Image,
  Input,
  message,
  Modal,
  ModalProps,
  Row,
  Upload,
  UploadProps,
} from "antd";
import { RcFile } from "antd/es/upload";
import { Rule } from "antd/es/form";
import { useModel, useRequest } from "@umijs/max";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { getFilenameSuffix } from "@/utils";
import { uploadImageApi } from "@/services/api/uploadApi";
import styles from "./index.less";

interface IUserInfoModal extends ModalProps {
  data?: any;
  onOk?: (data?: any) => void;
  onCancel?: (data?: any) => void;
}

const UserInfoModal = (props: IUserInfoModal) => {
  const { userInfo, updateUserAction } = useModel("user");
  const { data = {}, title, open, onOk, onCancel, ...modalProps } = props;
  const [form] = Form.useForm<IUserInfo>();
  const formValues = Form.useWatch([], form);
  const fileAccept = ".jpg,.png";
  const formRules: Record<keyof IUserInfo, Rule[]> = {
    userId: [],
    username: [{ required: true }],
    avatar: [],
  };

  const uploadImageReq = useRequest(uploadImageApi, {
    manual: true,
    onSuccess: (res) => {
      form.setFieldValue("avatar", res.fullUrl);
    },
    onError: () => {},
  });

  const handleBeforeUpload: UploadProps["beforeUpload"] = (file) => {
    const fileSuffix = getFilenameSuffix(file.name);
    const fileTypeArr = fileAccept?.split(",");
    const isFileType = fileTypeArr.includes(`.${fileSuffix}`);
    if (isFileType) {
      uploadImageReq.run(file);
    } else {
      const fileTypeMessage = fileTypeArr.join("、");
      message.error(`请上传${fileTypeMessage}类型文件`);
    }

    return Upload.LIST_IGNORE;
  };

  const handleConfirm = async () => {
    const formData = await form.validateFields();
    updateUserAction(formData);
    onCancel?.(false);
    // onOk?.(formData);
  };
  const handleCancel = () => {
    onCancel?.(false);
  };

  useEffect(() => {
    if (open) {
      form.setFieldsValue(userInfo);
    }
  }, [open, userInfo]);

  return (
    <Modal
      className={styles.userInfoModal}
      title="添加朋友"
      open={open}
      maskClosable={false}
      width={600}
      onOk={handleConfirm}
      onCancel={handleCancel}
      {...modalProps}
    >
      <Form layout="vertical" form={form} preserve={false}>
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item name="userId" label="用户ID" rules={formRules.userId}>
              <Input placeholder="请输入" disabled allowClear />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="username"
              label="用户名称"
              rules={formRules.username}
            >
              <Input placeholder="请输入" allowClear />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="avatar"
              label="头像"
              valuePropName="avatar"
              rules={formRules.avatar}
            >
              <Upload
                name="avatar"
                listType="picture-circle"
                accept=".jpg,.png"
                showUploadList={false}
                beforeUpload={handleBeforeUpload}
                // onChange={handleUploadChange}
              >
                {formValues?.avatar ? (
                  <>
                    <Image
                      className={styles.uploadAvatar}
                      src={formValues.avatar}
                      preview={{
                        visible: false,
                        mask: "选择图片",
                      }}
                    />
                    {uploadImageReq.loading && (
                      <Flex
                        className={styles.loadingMask}
                        align="center"
                        justify="center"
                      >
                        <LoadingOutlined />
                        <div>加载中</div>
                      </Flex>
                    )}
                  </>
                ) : (
                  <Flex vertical align="center" gap={5}>
                    {uploadImageReq.loading ? (
                      <LoadingOutlined />
                    ) : (
                      <PlusOutlined />
                    )}
                    <div>Upload</div>
                  </Flex>
                )}
              </Upload>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default UserInfoModal;
