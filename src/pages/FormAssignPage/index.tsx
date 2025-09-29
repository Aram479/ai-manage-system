import React, { useEffect, useMemo, useState } from "react";
import { useRequest } from "@umijs/max";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Flex,
  Form,
  Input,
  message,
  Modal,
  ModalProps,
  Row,
  Select,
  Switch,
} from "antd";
import { Rule } from "antd/es/form";
import {
  GenderOptions,
  MaritalStatusOptions,
  DepartmentOptions,
  JobOptions,
  EducationOptions,
} from "@/constant//options";
import { useChatEvent } from "@/hooks/useChatEvent";
import dayjs from "dayjs";
import { useFieldEvent } from "@/hooks/useFieldEvent";
import {
  FormAssignPageToolsEvents,
  TFormAssignPageTools,
} from "@/tools/formAssignPageTools";

interface IFormAssignPage extends ModalProps {
  onOk?: (data?: any) => void;
  onCancel?: (data?: any) => void;
}

interface FormData {
  employeeId: string;
  createTime: string;
  name: string;
  gender: string;
  birthDate: string;
  idCard: string;
  phone: string;
  email: string;
  emergencyContact: string;
  emergencyPhone: string;
  maritalStatus: string;
  spouseName: string;
  spousePhone: string;
  department: string;
  jobTitle: string;
  hireDate: string;
  education: string;
  university: string;
  remark: string;
}

const initValues = {
  id: "",
  employeeId: "AL100001",
  createTime: "2030-10-01",
  name: "",
  gender: "",
  birthDate: "",
  idCard: "",
  phone: "",
  email: "",
  emergencyContact: "",
  emergencyPhone: "",
  maritalStatus: "",
  spouseName: "",
  spousePhone: "",
  department: "",
  jobTitle: "",
  hireDate: "",
  education: "",
  university: "",
  remark: "",
};

const FormAssignPage = (props: IFormAssignPage) => {
  const { open, onOk, onCancel } = props;
  const [form] = Form.useForm<FormData>();
  const formValues = Form.useWatch([], form);
  // 是否实时赋值
  const [isAutoAssign, setIsAutoAssign] = useState(false);
  const formRules: Record<keyof FormData, Rule[]> = {
    employeeId: [],
    createTime: [],
    name: [{ required: true }],
    gender: [{ required: true }],
    birthDate: [{ required: true }],
    idCard: [
      {
        required: false,
        pattern:
          /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/,
        message: "身份证格式不正确",
      },
    ],
    phone: [
      { required: true, pattern: /^1[3-9]\d{9}$/, message: "手机号格式不正确" },
    ],
    email: [{ required: true, type: "email", message: "邮箱格式不正确" }],
    emergencyContact: [{ required: true }],
    emergencyPhone: [
      { required: true, pattern: /^1[3-9]\d{9}$/, message: "手机号格式不正确" },
    ],
    maritalStatus: [{ required: true }],
    spouseName: [{ required: true }],
    spousePhone: [{ required: true }],
    department: [{ required: true }],
    jobTitle: [{ required: !!formValues?.department }],
    hireDate: [{ required: true }],
    education: [{ required: true }],
    university: [{ required: true }],
    remark: [],
  };

  const JobOptionsByDepartment = JobOptions[formValues?.department]?.map(
    (job) => ({
      label: job,
      value: job,
    })
  );

  // Modal销毁时清空数据
  const resetAction = () => {
    form.resetFields();
  };

  const handleConfirm = async () => {
    await form.validateFields();
    const formData = form.getFieldsValue(true);
    message.success("创建成功");
    onOk?.(formData);
  };

  const setFormDataAction = (chatData: TFormAssignPageTools["data"]) => {
    if (chatData) {
      Object.keys(chatData || {}).forEach((key) => {
        const isHasKey = initValues.hasOwnProperty(key);
        if (isHasKey) {
          let newFieldValue: any =
            chatData[key as keyof TFormAssignPageTools["data"]];
          if (~key.indexOf("Time") || ~key.indexOf("Date")) {
            newFieldValue = newFieldValue ? dayjs(newFieldValue) : undefined;
          }
          form.setFieldValue(key as keyof FormData, newFieldValue);
        }
      });
    }
    // form.setFieldValue(
    //   "deliveryTime",
    //   chatData?.deliveryTime ? dayjs(chatData?.deliveryTime) : undefined
    // );
  };

  useFieldEvent<TFormAssignPageTools>((event, isComplete) => {
    if (event.name === FormAssignPageToolsEvents.Create_Form) {
      const chatData = event.data;

      if ((isAutoAssign || isComplete) && chatData) {
        setFormDataAction(chatData);
        if (isComplete) {
          handleConfirm();
        }
      }
    }
  });

  return (
    <div className="dap-main-content">
      <Card>
        <div>
          实时赋值：
          <Switch onChange={setIsAutoAssign} />
        </div>
        <Form layout="vertical" form={form}>
          <Row gutter={24}>
            {/* 1. 员工编号 - 只读 */}
            <Col span={8}>
              <Form.Item
                label="员工编号"
                name="employeeId"
                initialValue={initValues.employeeId}
                rules={formRules.employeeId}
              >
                <Input disabled />
              </Form.Item>
            </Col>

            {/* 2. 创建时间 - 只读 */}
            <Col span={8}>
              <Form.Item
                label="创建时间"
                name="createTime"
                initialValue={initValues.createTime}
                rules={formRules.createTime}
              >
                <Input disabled />
              </Form.Item>
            </Col>

            {/* 3. 姓名 */}
            <Col span={8}>
              <Form.Item label="姓名" name="name" rules={formRules.name}>
                <Input placeholder="请输入员工姓名" />
              </Form.Item>
            </Col>

            {/* 4. 性别 */}
            <Col span={8}>
              <Form.Item label="性别" name="gender" rules={formRules.gender}>
                <Select placeholder="请选择性别" options={GenderOptions} />
              </Form.Item>
            </Col>

            {/* 5. 出生日期 */}
            <Col span={8}>
              <Form.Item
                label="出生日期"
                name="birthDate"
                rules={formRules.birthDate}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            {/* 6. 身份证号 */}
            <Col span={8}>
              <Form.Item
                label="身份证号"
                name="idCard"
                rules={formRules.idCard}
              >
                <Input placeholder="请输入身份证号" />
              </Form.Item>
            </Col>

            {/* 7. 手机号 */}
            <Col span={8}>
              <Form.Item label="手机号" name="phone" rules={formRules.phone}>
                <Input placeholder="请输入手机号" />
              </Form.Item>
            </Col>

            {/* 8. 邮箱 */}
            <Col span={8}>
              <Form.Item label="邮箱" name="email" rules={formRules.email}>
                <Input placeholder="请输入邮箱" />
              </Form.Item>
            </Col>

            {/* 9. 紧急联系人 */}
            <Col span={8}>
              <Form.Item
                label="紧急联系人"
                name="emergencyContact"
                rules={formRules.emergencyContact}
              >
                <Input placeholder="请输入紧急联系人姓名" />
              </Form.Item>
            </Col>

            {/* 10. 紧急联系人电话 */}
            <Col span={8}>
              <Form.Item
                label="紧急联系人电话"
                name="emergencyPhone"
                rules={formRules.emergencyPhone}
              >
                <Input placeholder="请输入紧急联系人电话" />
              </Form.Item>
            </Col>

            {/* 11. 婚姻状况 */}
            <Col span={8}>
              <Form.Item
                label="婚姻状况"
                name="maritalStatus"
                rules={formRules.maritalStatus}
              >
                <Select
                  placeholder="请选择婚姻状况"
                  options={MaritalStatusOptions}
                />
              </Form.Item>
            </Col>

            {/* 12. 配偶姓名 - 联动显示 */}
            {(formValues?.maritalStatus === "married" ||
              formValues?.maritalStatus === "divorced") && (
              <Col span={8}>
                <Form.Item
                  label="配偶姓名"
                  name="spouseName"
                  rules={formRules.spouseName}
                >
                  <Input placeholder="请输入配偶姓名" />
                </Form.Item>
              </Col>
            )}

            {/* 13. 配偶电话 - 联动显示 */}
            {(formValues?.maritalStatus === "married" ||
              formValues?.maritalStatus === "divorced") && (
              <Col span={8}>
                <Form.Item
                  label="配偶联系电话"
                  name="spousePhone"
                  rules={formRules.spousePhone}
                >
                  <Input placeholder="请输入配偶联系电话" />
                </Form.Item>
              </Col>
            )}

            {/* 14. 部门 - 联动岗位 */}
            <Col span={8}>
              <Form.Item
                label="所属部门"
                name="department"
                rules={formRules.department}
              >
                <Select
                  placeholder="请选择部门"
                  options={DepartmentOptions}
                  onChange={() => {
                    form.setFieldsValue({ jobTitle: undefined }); // 清空岗位
                  }}
                />
              </Form.Item>
            </Col>

            {/* 15. 岗位 - 根据部门联动 */}
            <Col span={8}>
              <Form.Item
                label="岗位"
                name="jobTitle"
                rules={formRules.jobTitle}
              >
                <Select
                  placeholder="请先选择部门"
                  disabled={!formValues?.department}
                  options={JobOptionsByDepartment}
                />
              </Form.Item>
            </Col>

            {/* 16. 入职日期 */}
            <Col span={8}>
              <Form.Item
                label="入职日期"
                name="hireDate"
                rules={formRules.hireDate}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            {/* 17. 工作邮箱（系统生成） - 只读 */}
            <Col span={8}>
              <Form.Item label="工作邮箱">
                <Input
                  value={
                    formValues?.email
                      ? formValues?.email?.split("@")[0] + "@company.com"
                      : "待生成"
                  }
                  disabled
                />
              </Form.Item>
            </Col>

            {/* 18. 最高学历 */}
            <Col span={8}>
              <Form.Item
                label="最高学历"
                name="education"
                rules={formRules.education}
              >
                <Select placeholder="请选择学历" options={EducationOptions} />
              </Form.Item>
            </Col>

            {/* 19. 毕业院校 */}
            <Col span={8}>
              <Form.Item
                label="毕业院校"
                name="university"
                rules={formRules.university}
              >
                <Input placeholder="请输入毕业院校" />
              </Form.Item>
            </Col>

            {/* 20. 备注 */}
            <Col span={24}>
              <Form.Item label="备注" name="remark">
                <Input.TextArea rows={3} placeholder="请输入备注信息" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Divider />
        <Flex align="center" justify="right" gap={8}>
          <Button onClick={resetAction}>重置</Button>
          <Button type="primary" onClick={handleConfirm}>
            提交
          </Button>
        </Flex>
      </Card>
    </div>
  );
};

export default FormAssignPage;
