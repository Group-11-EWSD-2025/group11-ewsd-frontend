export type TUser = {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  role: string;
  created_at: string;
  updated_at: string;
  phone: string | null;
  profile: string | null;
  department?: string;
};
