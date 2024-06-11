export type TLoginPayload = {
  username: string;
  password: string;
};

export type TJwtPayload = {
  id: string;
  full_name: string;
  role_id: string;
  iat?: number;
  exp?: number;
};

export type TEmployee = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  username: string;
  full_name: string;
  password: string;
  is_active: boolean;
  role_id: string;
};
