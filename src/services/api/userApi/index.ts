import { mockRequest } from "@/services/mockRequest";
import { UserList } from "./mockData";
import { TUserFormData } from "@/pages/UserManage/cpns/SearchFormCmp";
import dayjs from "dayjs";
import { uniqueId } from "lodash";

export const fetchUserList = (searchData?: TUserFormData) => {
  const newUserList = UserList.filter((item) => {
    if (searchData) {
      const { userName, role, createTime } = searchData;
      return (
        item.userName === userName &&
        item.role === role &&
        item.createTime === createTime
      );
    }
    return true;
  });
  return mockRequest<IUserList[]>(newUserList);
};

export const deleteUserById = (id: number | string) => {
  const deleteIndex = UserList.findIndex((item) => item.id == id);
  UserList.splice(deleteIndex, 1);
  return mockRequest<any>({});
};

export const createUserApi = (data: IUserList) => {
  if (UserList.find((item) => item.userName === data.userName)) {
    return mockRequest<any>(null, {
      code: 400,
      data: null,
      message: "重复用户",
    });
  }
  const nowTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
  const uuid = uniqueId();
  const newData: IUserList = {
    ...data,
    id: uuid,
    createTime: nowTime,
    updateTime: nowTime,
  };
  UserList.push(newData);
  return mockRequest<any>({});
};
