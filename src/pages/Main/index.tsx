import { creatResource } from "@/services/deepseekApi/resource";
import { Button, Flex } from "antd";
import React from "react";

const MainPage = () => {
  const fooAvatar: React.CSSProperties = {
    color: "#f56a00",
    backgroundColor: "#fde3cf",
  };
  const barAvatar: React.CSSProperties = {
    color: "#fff",
    backgroundColor: "#87d068",
  };
  const hideAvatar: React.CSSProperties = {
    visibility: "hidden",
  };

  const handleDeepSeek = () => {
    creatResource();
  };

  return (
    <div>
      <Button onClick={handleDeepSeek}>点击</Button>
    </div>
  );
};

export default MainPage;
