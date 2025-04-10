import { navigate_page } from "./baseTools";
import { search_User } from "./userTools";
import { search_Role, export_Role } from "./roleTools";
import { search_Order } from "./orderTools";

export const allTools = [
  navigate_page,
  search_User,
  search_Role,
  export_Role,
  search_Order,
];
