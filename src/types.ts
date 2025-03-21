export type TUserData = {
  name: string;
  email: string;
  role: string;
  phone: string;
};

export type TLoginState = {
  token: string;
  userData: TUserData;
};
