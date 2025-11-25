import { request } from "@umijs/max";
import { RcFile } from "antd/es/upload";

export const uploadImageApi = (
  file: RcFile,
  options?: { [key: string]: any }
) => {
  const formData = new FormData();

  if (file) {
    formData.append("image", file);
  }
  return request<ApiTypes.IUpload>("/api/upload/image", {
    method: "POST",
    data: formData,
    requestType: "form",
    ...(options || {}),
  });
};
