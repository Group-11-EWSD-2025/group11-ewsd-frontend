export type TUserData = {
  email: string;
};

export type TLoginState = {
  token: string;
  userData: TUserData;
};
