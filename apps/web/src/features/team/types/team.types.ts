export interface Operator {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

export interface CreateOperatorPayload {
  name: string;
  email: string;
  password: string;
}

export interface UpdateOperatorPayload {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
}
