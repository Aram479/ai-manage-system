declare namespace ApiTypes {
  type IUpload = {
    filename: string;
    originalName: string;
    size: number;
    mimeType: string;
    url: string;
    fullUrl: string;
  };
}
