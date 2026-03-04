import {
  DepartmentOptions,
  EducationOptions,
  GenderOptions,
  JobOptions,
  MaritalStatusOptions,
} from "@/constant/options";

/* 事件集合 */
export enum FormAssignPageToolsEvents {
  Create_Form = "Create_Form",
}

/* 整合 结果类型 */
export type TFormAssignPageTools = ExtractFunctionParameters<
  typeof FormAssignPageToolsFunctions
>[keyof typeof FormAssignPageToolsFunctions];

// 事件统一字段
const eventProperties = (props: TToolsProps) => {
  return {
    path: {
      type: "string",
      description: "目标页面路径",
      enum: ["/FormAssignPage"],
    },
  } as const;
};

// 创建/修改/删除表单赋值所需字段
const formDataProperties = (props: TToolsProps) => {
  // const { GenderOptions } = props;

  return {
    id: {
      type: "string",
      description: "数据唯一标识(ID): 随机字符串组成",
    },
    employeeId: {
      type: "string",
      description: "订单号，必填项，格式为为阿里员工编号",
    },
    createdTime: {
      type: "string",
      format: "date-time",
      description: "创建时间，系统自动生成",
      readOnly: true,
    },
    name: {
      type: "string",
      description: "用户姓名，必填项，长度限制为2-50个字符",
      minLength: 2,
      maxLength: 50,
    },
    gender: {
      type: "string",
      description: "性别，必填项，从预设选项中选择",
      enum: ["male", "female", "other"],
      options: GenderOptions, // 对应示例1中的 GenderOptions
    },
    birthDate: {
      type: "string",
      format: "date",
      description: "出生日期，必填项，格式为 YYYY-MM-DD",
    },
    idCard: {
      type: "string",
      description: "身份证号码，选填，需符合中中国大陆身份证格式",
      // pattern: "^\\d{17}[\\dXx]$|^$",
    },
    phone: {
      type: "string",
      description: "手机号码，必填项，需符合中国大陆手机号格式",
      // pattern: "^1[3-9]\\d{9}$",
    },
    email: {
      type: "string",
      format: "email",
      description: "电子邮箱，必填项，需符合邮箱格式",
    },
    emergencyContact: {
      type: "string",
      description: "紧急联系人姓名，必填项",
      minLength: 2,
    },
    emergencyPhone: {
      type: "string",
      description: "紧急联系人电话，必填项，需符合手机号格式",
      pattern: "^1[3-9]\\d{9}$",
    },
    maritalStatus: {
      type: "string",
      description: "婚姻状况，必填项，从预设选项中选择",
      // enum: ["single", "married", "divorced", "widowed"],
      options: MaritalStatusOptions, // 对应示例1
    },
    spouseName: {
      type: "string",
      description: "配偶姓名，婚姻状况为已婚时必填",
      nullable: true,
    },
    spousePhone: {
      type: "string",
      description: "配偶联系电话，婚姻状况为已婚时建议填写",
      pattern: "^1[3-9]\\d{9}$",
      nullable: true,
    },
    department: {
      type: "string",
      description: "所属部门，必填项，从部门列表中选择",
      options: DepartmentOptions, // 对应示例1
    },
    jobTitle: {
      type: "string",
      description: "职位，必填项，根据所选部门动态加载职位列表",
      options: JobOptions, // 动态依赖 department
    },
    hireDate: {
      type: "string",
      format: "date",
      description: "入职日期，必填项，格式为 YYYY-MM-DD，不能晚于当前日期",
    },
    education: {
      type: "string",
      description: "最高学历，必填项，从预设学历选项中选择",
      // enum: [
      //   "high_school",
      //   "associate",
      //   "bachelor",
      //   "master",
      //   "doctor",
      //   "other",
      // ],
      options: EducationOptions, // 对应示例1
    },
    university: {
      type: "string",
      description: "毕业院校，必填项，可手动输入或从常用院校中选择",
      maxLength: 100,
    },
  } as const;
};

const create_form = (props?: any) => {
  return {
    type: "function",
    function: {
      name: FormAssignPageToolsEvents.Create_Form,
      description: "创建表单赋值数据",
      parameters: {
        type: "object",
        properties: {
          ...eventProperties(props),
          name: {
            type: "string",
            description: "事件名称(必填)", // 设置 "必填" 二字，AI才会保证输出此字段
            enum: [FormAssignPageToolsEvents.Create_Form],
          },
          data: {
            type: "object",
            description: "需要用到的数据",
            properties: {
              ...formDataProperties(props),
            },
            required: [],
          },
        },
        required: ["name", "data"],
      },
    },
  } as const;
};

export const FormAssignPageToolsFunctions = {
  create_form,
} as const;
