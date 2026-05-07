export interface RegisterCompanyPayload {
  name: string;
  taxId?: string;
  phone: string;
  city: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  companyId: string;
  companyName: string;
  role: string;
}
