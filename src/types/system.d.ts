interface IUserInfo extends Omit<ILoginData, "password"> {
  userId?: string;
  avatar?: string;
}

interface ILoginData {
  username: string;
  password: string;
}
