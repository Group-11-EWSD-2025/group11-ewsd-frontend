export type TUserData = {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  profile: string | null;
};

export type TLoginState = {
  token: string;
  userData: TUserData;
};
