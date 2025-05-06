import { ComponentProps } from 'react';
import { Octicons } from '@expo/vector-icons';

type OcticonName = ComponentProps<typeof Octicons>['name'];

export interface User {
  id: string;
  username: string;
  email: string;
  roles: string[];
  twoFactorRequired: boolean;
  profileImage: string;
  tokenType: string;
}

export interface Category {
  id: number;
  name: string;
  icon: OcticonName;
}

export interface Transaction {
  id: number;
  amount: number;
  category: string;
  createdAt: string;
  createdBy: string;
  date: Date;
  label: string;
  type: 'Expense' | 'Income';
  updatedAt: string;
  updatedBy: string;
  user: User;
  userId: number;
  version: number;
}

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Main: undefined;
  Dashboard: undefined;
  GoogleAuthSetup: {
    secret: string;
    qrCodeBase64: string;
  };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export interface Pageable {
  offset: number;
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  sort: Sort;
  unpaged: boolean;
}

export interface Sort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export interface FinanceDetails {
  total_income: number;
  total_expense: number;
  total_balance: number;
  income_by_category: number[];
  expense_by_category: number[];
}