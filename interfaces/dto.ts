import { Transaction, Sort, Pageable } from './types';

export interface LoginRequestDTO {
  username: string;
  password: string;
  twoFactorCode: string;
}

export interface LoginResponseDTO {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  id: string;
  username: string;
  email: string;
  roles: string[];
  twoFactorRequired: boolean;
  profileImage: string;
}

export interface RegisterRequestDTO {
  username: string;
  email: string;
  password: string;
  roles: string[];
  profileImage: string;
}

export interface RegisterResponseDTO {
  message: string;
  twoFactorSetupResponse: TwoFactorSetupResponse;
}

export interface TwoFactorSetupResponse {
  secret: string;
  qrCodeBase64: string;
}

export interface TransactionDTO {
  type: 'Expense' | 'Income';
  label: string;
  amount: number;
  category: string;
  date: string;
}

export interface TransactionResponseDTO {
  content: Transaction[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  pageable: Pageable;
  size: number;
  sort: Sort;
  totalElements: number;
  totalPages: number;
}

export interface UpdatePasswordRequestDTO {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordRequestDTO {
  username: string;
  twoFactorCode: number;
  newPassword: string;
}