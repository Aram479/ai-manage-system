import { useState } from "react";
import { CloudUploadOutlined } from "@ant-design/icons";
import { Attachments, AttachmentsProps, Sender } from "@ant-design/x";
import { SenderHeaderProps } from "@ant-design/x/es/sender/SenderHeader";
import { UploadFile } from "antd";

interface ISenderHeader extends SenderHeaderProps {
  open?: boolean;
  onUpload?: (fileList: UploadFile[]) => void;
  onOpenChange?: (open: boolean) => void;
}

const SenderHeader = (props: ISenderHeader) => {
  const { open = false, onUpload, onOpenChange } = props;
  const [files, setFiles] = useState<UploadFile[]>([]);
  const handleFileChange: AttachmentsProps["onChange"] = (info) => {
    setFiles(info.fileList);
    onUpload?.(info.fileList);
  };

  return (
    <div>
      <Sender.Header
        title="Attachments"
        open={open}
        onOpenChange={onOpenChange}
        styles={{
          content: {
            padding: 0,
          },
        }}
      >
        <Attachments
          beforeUpload={() => false}
          items={files}
          onChange={handleFileChange}
          placeholder={(type) =>
            type === "drop"
              ? { title: "Drop file here" }
              : {
                  icon: <CloudUploadOutlined />,
                  title: "Upload files",
                  description: "Click or drag files to this area to upload",
                }
          }
        />
      </Sender.Header>
    </div>
  );
};

export default SenderHeader;
