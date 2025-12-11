interface IUserInfo extends Omit<ILoginData, "password"> {
  id: string,
  userId: string;
  avatar?: string;
  email?: string;
}

interface ILoginData {
  username: string;
  password: string;
  email?: string;
}

interface IRegisterData extends ILoginData {
  confirmPassword: string;
}
type TFormEditPsd = ApiTypes.TEditPsd & {
  confirmPassword: string;
};

type TAddFriendData = {
  userId: string;
  friendMessage: string;
  remarkName: string;
};
