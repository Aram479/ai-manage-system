import { useRequest } from "@umijs/max";
import { uploadChatImageById } from "@/services/api/uploadApi";
import { Editor, NodeConfig } from "@tiptap/react";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import BulletList from "@tiptap/extension-bullet-list";
import CharacterCount from "@tiptap/extension-character-count";
import Document from "@tiptap/extension-document";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import TextAlign from "@tiptap/extension-text-align";
import Youtube from "@tiptap/extension-youtube";
import StarterKit from "@tiptap/starter-kit";
import FileHandler, {
  FileHandlerOptions,
} from "@tiptap/extension-file-handler";

export default function (limit: number = 3000) {
  const tableExtends: Partial<NodeConfig<any, any>> = {
    addAttributes() {
      return {
        ...this.parent?.(),
        style: {
          renderHTML: (data) => {
            /**
             * 解决table复制问题
             * 复制的table时同时会将其style复制过来，这样会导致复制的table style出问题,
             * 并且复制本项目外的table没有data.colwidth, 所以通过!data.colwidth修改其默认style样式
             */
            if (!data.colwidth) {
              data.style = "height: 1.875rem; overflow: hidden";
            }
            return {
              style: data.style,
              // colwidth: data.colwidth,
            };
          },
          parseHTML: (element) => element.getAttribute("style"),
        },
      };
    },
  };
  const uploadChatImage = useRequest(uploadChatImageById, {
    manual: true,
  });
  const handleFileChange: FileHandlerOptions["onPaste"] &
    FileHandlerOptions["onDrop"] = (editor, files, htmlContent) => {
    files.forEach((file) => {
      if (htmlContent) {
        return false;
      }
      const { userId, chatId } = editor.view.props as any;
      uploadChatImage
        .run({
          image: file,
          userId,
          chatId,
        })
        .then((res) => {
          editor
            .chain()
            .insertContentAt(editor.state.selection.anchor, {
              type: "image",
              attrs: {
                src: res.fullUrl,
              },
            })
            .focus()
            .run();
        });
    });
  };
  return [
    Document,
    StarterKit,
    Highlight,
    TaskList,
    TaskItem,
    Color,
    TextStyle,
    ListItem,
    BulletList,
    OrderedList,
    Link.configure({
      openOnClick: false,
      autolink: false,
    }),
    TextAlign.configure({
      types: ["heading", "paragraph", "image"],
    }),
    Image.configure({
      inline: true,
      HTMLAttributes: {
        style: "max-width: 15rem; max-height: 15rem; object-fit: contain;",
      },
    }),
    Youtube.extend({
      addAttributes() {
        return {
          ...this.parent?.(),
          name: {
            default: "iframe",
          },
          style: {
            renderHTML: (data) => {
              return {
                style: `${data.style}`,
              };
            },
            parseHTML: (element) => element.getAttribute("style"),
          },
        };
      },
      renderHTML({ HTMLAttributes }) {
        return ["iframe", HTMLAttributes];
      },
      parseHTML() {
        return [
          {
            tag: "iframe",
          },
        ];
      },
    }).configure({
      inline: true,
    }),
    Table.extend({
      addAttributes() {
        return {
          ...this.parent?.(),
          style: {
            renderHTML: (data) => {
              return {
                style: `${data.style}`,
              };
            },
            parseHTML: (element) => element.getAttribute("style"),
          },
        };
      },
    }).configure({
      resizable: true,
    }),
    TableCell.extend(tableExtends),
    TableHeader.extend(tableExtends),
    TableRow.extend(tableExtends),
    CharacterCount.configure({
      limit,
    }),
    FileHandler.configure({
      allowedMimeTypes: ["image/png", "image/jpeg", "image/gif", "image/webp"],
      onDrop: handleFileChange,
      onPaste: handleFileChange,
    }),
  ];
}
