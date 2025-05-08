import apiClient from "./apiClient";
import { TransactionDTO } from "interfaces/dto";
import * as SecureStore from 'expo-secure-store';
import { FinanceDetails, FetchAllTransactionParams } from "interfaces/types";



export const fetchTransactions = async () => {
    try {
        const response = await apiClient.post("/api/search");
        return response.data;
    } catch (error) {
        console.error("Error fetching transactions:", error);
        throw error;
    }
}


export const fetchAllTransactions = async (params: FetchAllTransactionParams = {}) => {
    try {
        const response = await apiClient.post('/api/search', null, {
            params: {
                type: params.type,
                category: params.category,
                minAmount: params.minAmount,
                maxAmount: params.maxAmount,
                startDate: params.startDate,
                endDate: params.endDate,
                searchTerm: params.searchTerm,
                page: params.page ?? 0,
                size: params.size ?? 8,
                sort: params.sort ?? ['date,desc'],
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching all transactions:', error);
        throw error;
    }
};


export const addTransaction = async (transaction: TransactionDTO) => {
    const transactionDTO: TransactionDTO = {
        type: transaction.type,
        label: transaction.label,
        amount: transaction.amount,
        category: transaction.category,
        date: transaction.date
    };
        
    try {
    const response = await apiClient.post("/api/post", transactionDTO);
      return response.data;
  } catch (error) {
    console.error("Error adding transaction:", error);
    throw error;
  }
}


export const updateTransaction = async (transactionId: number, transaction: TransactionDTO) => {
    const transactionDTO: TransactionDTO = {
        type: transaction.type,
        label: transaction.label,
        amount: transaction.amount,
        category: transaction.category,
        date: transaction.date
    };
        
    try {
        const response = await apiClient.put(`/api/put/${transactionId}`, transactionDTO);
        return response.data;
    } catch (error) {
        console.error("Error updating transaction:", error);
        throw error;
    }
}


export const deleteTransaction = async (transactionId: number) => {
    try {
        const response = await apiClient.delete(`/api/delete/${transactionId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting transaction:", error);
        throw error;
    }
}


export const fetchFinanceDetails = async () => {
    const userString = await SecureStore.getItemAsync('user');
    const user = userString ? JSON.parse(userString) : null;

    let incomeResponse = {};
    let expenseResponse = {};

    try {
        const response = await apiClient.post(`/api/get/summary/income/${user?.id}`);
        incomeResponse = response.data;
    } catch (error) {
        console.error("Error fetching income details:", error);
        throw error;
    }

    try {
      const response = await apiClient.post(`/api/get/summary/expense/${user?.id}`);
      expenseResponse = response.data;
    } catch (error) {
      console.error('Error fetching expense details:', error);
      throw error;
    }

    const total_income = (Object.values(incomeResponse) as number[]).reduce(
      (sum, amount) => sum + amount,
      0
    );

    const total_expense = (Object.values(expenseResponse) as number[]).reduce(
      (sum, amount) => sum + amount,
      0
    );

    const total_balance = total_income - total_expense;
    const income_by_category = Object.values(incomeResponse) as number[];
    const expense_by_category = Object.values(expenseResponse) as number[];

    const financeDetails: FinanceDetails = {
        total_income,
        total_expense,
        total_balance,
        income_by_category,
        expense_by_category
    };

    return financeDetails;
}