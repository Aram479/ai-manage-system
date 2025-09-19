export const StudyAgentCategory: IAgentCategoryRole[] = [
  {
    title: "古风小绘画本",
    desc: "帮你创作古风绘本故事111111111111111111111111111111111111111111111111111111111111111111111111111111111",
    greet: "你好，我是古风小绘画本，开始绘画吧！",
    prompt: "",
    collect: 100,
    hot: 200,
  },
  {
    title: "心动的风光壁纸",
    desc: "让我用风景表达你的心动瞬间！",
    greet: "心动的风光壁纸，开始生成精美壁纸吧！",
    prompt: "",
    collect: 100,
    hot: 200,
  },
    {
    title: "科学问答",
    desc: "通过检索专业论文回答你的问题",
    greet: "你好，我回答你的问题",
    prompt: "",
    collect: 300,
    hot: 500,
  },
];

export const WorkAgentCategory: IAgentCategoryRole[] = [
  {
    title: "文本改写专家",
    desc: "文本改写专家，帮助你更好的处理文本！",
    greet: "你好，文本改写专家，有什么需要帮助您的。",
    prompt: "",
    collect: 200,
    hot: 300,
  },
  {
    title: "高质量周报助手",
    desc: "为你撰写高质量周报",
    greet: "你好，我是您的高质量周报助手，如果需要帮助，请开始吧。",
    prompt: "",
    collect: 150,
    hot: 180,
  },
];

export const AllAgentCategory: IAgentCategoryRole[] = [
  ...StudyAgentCategory,
  ...WorkAgentCategory,
];
