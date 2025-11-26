import { Editor } from "@tiptap/react";
import { useState } from "react";
import BarItem from "../BarItem";
import VideoModal from "./VideoModal";
interface IVideo {
  icon?: string;
  editor?: Editor;
  title?: string;
  isActive?: () => boolean;
}

const Video = (props: IVideo) => {
  const { icon, editor, title, isActive } = props;
  const [isVideoModal, setIsVideoModal] = useState(false);

  const handleVideo = () => {
    setIsVideoModal(true);
  };
  const handleSetVideo = (url: string) => {
    if (url) {
      // 自定义插入iframe
      const youtubeUrlData = new URL(url);
      const videoId = youtubeUrlData.searchParams.get("v") || youtubeUrlData.pathname.replace(/\//g, "");
      url = `https://www.youtube.com/embed/${videoId || ""}`;
      editor?.commands.setYoutubeVideo({
        src: url,
        width: 320,
        height: 280,
      });
    }
    setIsVideoModal(false);
  };

  return (
    <>
      <BarItem title={title} icon={icon} isActive={isActive} onClick={handleVideo} />
      <VideoModal open={isVideoModal} onOk={handleSetVideo} onCancel={() => setIsVideoModal(false)} />
    </>
  );
};

export default Video;
