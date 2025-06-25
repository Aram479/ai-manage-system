import { mockRequest } from "@/services/mockRequest";
import { UserList } from "./mockData";

export const fetchUserList = () => {
  return mockRequest<IUserList[]>(UserList);
};

export const deleteUserById = () => {
  return mockRequest<any>({}, 800);
};
