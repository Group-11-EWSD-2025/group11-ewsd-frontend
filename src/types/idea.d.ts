export type TIdea = {
  id: string;
  category_id: string;
  department_id: string;
  user_id: string;
  content: string;
  status: string;
  privacy: string;
  views: number;
  academic_year_id: string;
  created_at: string;
  updated_at: string;
  files: {
    id: string;
    idea_id: string;
    file: string;
    created_at: string;
    updated_at: string;
  }[];
};
