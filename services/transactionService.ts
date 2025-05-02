import apiClient from "./apiClient";
import { Transaction } from "../interfaces/types";
import { AddTransactionDTO } from "interfaces/dto";


export const addTransaction = async (transaction: Transaction) => {
    const transactionDTO: AddTransactionDTO = {
        type: transaction.type,
        label: transaction.label,
        amount: transaction.amount,
        category: transaction.category.name,
        date: transaction.date.toISOString().split("T")[0],
    };

    console.log('Transaction DTO:', transactionDTO);
        
    try {
    const response = await apiClient.post("/api/post", transactionDTO);
      console.log('Transaction added successfully:', response.data);
      return response.data;
  } catch (error) {
    console.error("Error adding transaction:", error);
    throw error;
  }
}