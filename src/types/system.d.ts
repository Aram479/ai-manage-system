interface IUserInfo extends ILoginData {
  userId?: string
}

interface ILoginData {
  username: string;
  password: string;
}
