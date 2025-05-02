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
  type: 'Expense' | 'Income';
  label: string;
  amount: number;
  category: Category;
  date: Date;
}

export interface AddTransactionModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (transaction: Transaction) => void;
}