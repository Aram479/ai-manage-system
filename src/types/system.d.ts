interface IUserInfo extends Omit<ILoginData, "password"> {
  userId?: string;
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
