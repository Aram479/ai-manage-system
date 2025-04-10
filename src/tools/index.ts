import { navigate_page, update_system_title } from "./baseTools";
import { search_User } from "./userTools";
import { search_Role, export_Role } from "./roleTools";
import { search_Order, create_Order } from "./orderTools";

export const allTools = [
  navigate_page,
  update_system_title,
  search_User,
  search_Role,
  export_Role,
  search_Order,
  create_Order
];
