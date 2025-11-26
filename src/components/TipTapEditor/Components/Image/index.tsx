import { Dropdown, MenuProps, message } from "antd";
import { useState } from "react";
import BarItem from "../BarItem";
import ImageModal from "./ImageModal";
interface IImage {
  icon?: string;
  editor?: any;
  title?: string;
  isActive?: () => boolean;
}

const Image = (props: IImage) => {
  const { icon, editor, title, isActive } = props;
  const [isImageModal, setIsImageModal] = useState(false);

  const getBase64 = (img: any, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result as string));
    reader.readAsDataURL(img);
  };

  // 上传图片
  const handleUploadImage = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
    input.onchange = async () => {
      const file = input.files[0];
      /* TODO 调用接口上传 */
      // upload(file);

      /* 本地上传 */
      getBase64(file, (url) => {
        handleSetImage(url);
      });
      // message.loading('上传中...', 0)
      // const formData = new FormData();
      // formData.append('file', file);
      // await upload(formData)
    };
  };
  const upload = async (file: any) => {
    message.loading("上传中...", 0);
    try {
      const res = await uploadThumbnailToServerApi({ file, type: 2 });
      if (res.code === 200) {
        handleSetImage(res.data);
        message.success("上传成功");
      } else {
        message.error("上传失败");
      }
    } finally {
      message.destroy();
    }
  };

  const handleSetImage = (url: string) => {
    if (url) {
      editor
        ?.chain()
        .focus()
        .setImage({
          src: url,
          style: { maxWidth: "512px", maxHeight: "512px" },
        })
        .run();
      // editor.commands.insertContent(`<p style="display: flex"><img src="${url}" /></p>`)
    }
    setIsImageModal(false);
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: "线上地址",
      onClick: () => setIsImageModal(true),
    },
    {
      key: "2",
      label: "上传图片",
      onClick: () => handleUploadImage(),
    },
  ];

  return (
    <>
      <Dropdown menu={{ items }} trigger={["click"]}>
        <BarItem title={title} icon={icon} isActive={isActive} />
      </Dropdown>
      <ImageModal
        open={isImageModal}
        onOk={handleSetImage}
        onCancel={() => setIsImageModal(false)}
      />
    </>
  );
};

export default Image;
