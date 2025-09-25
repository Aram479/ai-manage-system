export const GoodsOptions = [
  {
    label: "男士夏季上衣",
    value: "1",
    price: 100,
    count: 1000,
    desc: "产自外太空，利用太空陨石抽丝制作而成, 全世界仅100件",
  },
  {
    label: "男士夏季短裤",
    value: "2",
    price: 50,
    count: 100,
    desc: "超人穿剩的短裤，产自氪星，全世界仅10件, 先到先得",
  },
  {
    label: "男士夏季运动鞋",
    value: "3",
    price: 200,
    count: 2000,
    desc: "赫尔墨斯的运动鞋，穿上后可以飞翔，请遵守国家飞行政策，保修不保活",
  },
  {
    label: "电子手表",
    value: "4",
    price: 500,
    count: 1,
    desc: "看起来像是一件很普通的电子手表",
  },
];

export const PayTypeOptions = [
  {
    label: "微信",
    value: "weChat",
  },
  {
    label: "支付宝",
    value: "alipay",
  },
];

export const DeliveryTypeOptions = [
  {
    label: "送货上门",
    value: "home",
  },
  {
    label: "商品自提",
    value: "self",
  },
];

export const RoleOptions = [
  {
    label: "普通用户",
    value: "user",
  },
  {
    label: "组织管理员",
    value: "leader",
  },
  {
    label: "系统管理员",
    value: "admin",
  },
];

// 表单赋值页面
export const GenderOptions = [
  {
    key: "male",
    label: "男",
    value: "male",
  },
  {
    key: "female",
    label: "女",
    value: "female",
  },
];

export const MaritalStatusOptions = [
  {
    label: "未婚",
    value: "single",
  },
  {
    label: "已婚",
    value: "married",
  },
  {
    label: "离异",
    value: "divorced",
  },
];

export const DepartmentOptions = [
  {
    label: "技术部",
    value: "engineering",
  },
  {
    label: "设计部",
    value: "design",
  },
  {
    label: "人力资源部",
    value: "hr",
  },
  {
    label: "销售部",
    value: "sales",
  },
];

export const EducationOptions = [
  {
    label: "高中",
    value: "high_school",
  },
  {
    label: "大专",
    value: "associate",
  },
  {
    label: "本科",
    value: "bachelor",
  },
  {
    label: "硕士",
    value: "master",
  },
  {
    label: "博士",
    value: "phd",
  },
];

export const JobOptions: Record<string, string[]> = {
  engineering: ["前端开发", "后端开发", "测试工程师", "DevOps"],
  design: ["UI设计师", "UX研究员", "平面设计师"],
  hr: ["招聘专员", "薪酬绩效", "培训主管"],
  sales: ["销售代表", "客户经理", "大客户总监"],
};
