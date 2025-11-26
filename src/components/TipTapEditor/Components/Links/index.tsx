import { useRef, useState } from "react";
import BarItem from "../BarItem";
import LinkModal from "./LinkModal";

interface ILinks {
  icon?: string;
  editor?: any;
  title?: string;
  isActive?: () => boolean;
}

const Links = (props: ILinks) => {
  const { icon, editor, title, isActive } = props;
  const linkRef = useRef();
  const [linkUrl, setLinkUrl] = useState("");
  const [isModal, setIsModal] = useState(false);
  const handleLinks = () => {
    setLinkUrl("");
    setIsModal(true);
  };
  const handleEditLink = () => {
    const url = editor.getAttributes("link").href;
    setLinkUrl(url);
    setIsModal(true);
  };
  const handleSaveLink = (linkUrl: string) => {
    if (linkUrl) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl, target: "_blank" }).run();
    } else {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    }
    editor.commands.blur();
    setIsModal(false);
    setLinkUrl(linkUrl);
  };
  const handleCancel = () => {
    setIsModal(false);
  };
  const handleRemoveLink = () => {
    setLinkUrl("");
  };

  return (
    <>
      <BarItem title={title} icon={icon} isActive={isActive} onClick={handleLinks} />
      <LinkModal
        linkRef={linkRef}
        url={linkUrl}
        open={isModal}
        editor={editor}
        onEdit={handleEditLink}
        onSave={handleSaveLink}
        onCancel={handleCancel}
        onRemove={handleRemoveLink}
      />
    </>
  );
};

export default Links;
