import apiClient from "./apiClient";
import { TransactionDTO } from "interfaces/dto";


export const fetchTransactions = async () => {
    try {
        const response = await apiClient.get("/api/search");
        return response.data;
    } catch (error) {
        console.error("Error fetching transactions:", error);
        throw error;
    }
}


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