import { mockRequest } from "@/services/mockRequest";
import { UserList } from "./mockData";
import { TUserFormData } from "@/pages/UserManage/cpns/SearchFormCmp";
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";

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
  }).sort(
    (a, b) => dayjs(b.updateTime).valueOf() - dayjs(a.updateTime).valueOf()
  );
  return mockRequest<IUserList[]>(newUserList);
};

export const deleteUserById = (id: number | string) => {
  const delUserData = UserList.find((item) => item.id == id);
  if (!delUserData) {
    return mockRequest<any>(null, {
      code: 400,
      data: null,
      message: "用户不存在",
    });
  }
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
  const uuid = uuidv4();
  const newData: typeof data = {
    ...data,
    id: uuid,
    createTime: nowTime,
    updateTime: nowTime,
  };
  UserList.push(newData);
  return mockRequest<any>({});
};

export const editUserApi = (data: IUserList) => {
  const editUserData = UserList.find((item) => item.id == data.id);
  if (!editUserData) {
    return mockRequest<any>(null, {
      code: 400,
      data: null,
      message: "用户不存在",
    });
  }
  const isUserNameInclude = UserList.filter(
    (item) => item.id !== editUserData.id
  ).find((item) => item.userName === editUserData.userName);
  if (isUserNameInclude) {
    return mockRequest<any>(null, {
      code: 400,
      data: null,
      message: "用户名已存在",
    });
  }
  const editIndex = UserList.findIndex((item) => item.id == editUserData.id);
  const nowTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
  const newData: typeof editUserData = {
    ...data,
    id: editUserData.id,
    updateTime: nowTime,
  };
  UserList.splice(editIndex, 1, newData);
  return mockRequest<any>({});
};
