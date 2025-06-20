type RefIcon = typeof import("@ant-design/icons").HomeOutlined;

interface IRouteTypes {
  name?: string;
  path: string;
  component?: string;
  routes?: IRouteTypes[];
  layout?: boolean;
  redirect?: string;
  meta?: {
    title?: string;
    icon?: RefIcon;
  };
}
