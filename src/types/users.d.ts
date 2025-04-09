export type TUser = {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string | null;
  role: string;
  created_at?: string;
  updated_at?: string;
  phone: string | null;
  profile?: string | null;
  department_id?: string;
  avatar?: string; // URL to the user's avatar image
  status?: "active" | "pending" | "disabled"; // User account status
  departments: {
    id: string;
    name: string;
  }[];
};
