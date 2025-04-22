import { CloudUploadOutlined } from '@ant-design/icons';
import { Attachments, AttachmentsProps, Sender } from '@ant-design/x';
import { Attachment } from '@ant-design/x/es/attachments';
import { SenderHeaderProps } from '@ant-design/x/es/sender/SenderHeader';
import { useModel } from '@umijs/max';
import { UploadFile,  } from 'antd';
import { RcFile } from 'antd/lib/upload';
import { qwenFileUpload } from '@/services/qwen.api';

interface ISenderHeader extends SenderHeaderProps {
  files?: UploadFile[];
  onUpload?: (fileList: UploadFile[]) => void;
}

const SenderHeader = (props: ISenderHeader) => {
  const { open = false, files, onUpload, onOpenChange } = props;
  const { chatUploadFiles } = useModel('chat');
  const uploadFile: AttachmentsProps['customRequest'] = async ({ file, onSuccess, onError }) => {
    try {
      const fileInfo = await qwenFileUpload.create(
        {
          file: file as RcFile,
          purpose: 'file-extract',
        },
        {
          headers: {
            'X-DashScope-DataInspection': '{"input":"cip","output":"cip"}',
          },
        },
      );
      onSuccess?.(fileInfo, file);
    } catch (error: any) {
      onError?.(error);
    }
  };

  const uploadChange: AttachmentsProps['onChange'] = ({ file, fileList }) => {
    const newFile = file as Attachment;
    if (newFile.status === 'uploading') {
      newFile.description = '上传中...';
    } else if (newFile.status === 'error') {
      newFile.description = '上传失败';
    }
    chatUploadFiles.current = fileList;
    onUpload?.(fileList);
  };
  return (
    <div>
      <Sender.Header
        title="附件"
        open={open}
        onOpenChange={onOpenChange}
        styles={{
          content: {
            padding: 0,
          },
        }}
      >
        <Attachments
          accept=".pdf,.doc,.docx,.xls,.xlsx,.md,.epub,.mobi,.txt"
          customRequest={uploadFile}
          onChange={uploadChange}
          multiple
          items={files}
          placeholder={(type) =>
            type === 'drop'
              ? { title: 'Drop file here' }
              : {
                  icon: <CloudUploadOutlined />,
                  title: 'Upload files',
                  description:
                    '可同时上传100个文件（每个 150 MB）支持PDF / Word / Excel / Markdown /EPUB / Mobi / txt',
                }
          }
        />
      </Sender.Header>
    </div>
  );
};

export default SenderHeader;
