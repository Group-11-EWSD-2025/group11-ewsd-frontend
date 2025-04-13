export type TComment = {
  id: number;
  idea_id: number;
  user_id: number;
  content: string;
  privacy: string;
  status: string;
  created_at: string;
  updated_at: string;
};

export type TIdea = {
  id: string;
  category_id: string;
  category: {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
  };
  department_id: string;
  department: {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
  };
  user_id: string;
  user: {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
    role: string;
    created_at: string;
    updated_at: string;
    phone: string;
    profile: string;
  };
  content: string;
  status: string;
  privacy: string;
  views: number;
  academic_year_id: string;
  academic_year: {
    id: number;
    start_date: string;
    end_date: string;
    idea_submission_deadline: string;
    final_closure_date: string;
    created_at: string;
    updated_at: string;
  };
  created_at: string;
  updated_at: string;
  files: {
    id: string;
    idea_id: string;
    file: string;
    created_at: string;
    updated_at: string;
  }[];
  comments: TComment[];
  comments_count: number;
  is_liked: boolean;
  is_unliked: boolean;
  likes_count: number;
  un_likes_count: number;
};
