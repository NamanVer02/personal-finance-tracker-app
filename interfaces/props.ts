import { Transaction } from './types';

export interface AddTransactionModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (transaction: Transaction) => void;
}

export interface PasswordResetModalProps {
  visible: boolean;
  onClose: () => void;
}

export type GoogleAuthSetupProps = {
  qrCodeBase64: string;
  secret: string;
};