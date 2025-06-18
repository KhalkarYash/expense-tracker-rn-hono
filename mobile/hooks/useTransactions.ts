import { API_URL } from "@/constants/api";
import { Summary, Transaction } from "@/types/types";
import { useCallback, useState } from "react";
import { Alert } from "react-native";

type TransactionResponse = {
  message: string;
  transactions: Transaction[];
};

export const useTransactions = (userId: string) => {
  const [transactions, setTransactions] = useState<TransactionResponse>({
    message: "",
    transactions: [],
  });
  const [summary, setSummary] = useState<Summary>({
    balance: 0,
    income: 0,
    expenses: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchTransaction = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/transactions/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error(error);
    }
  }, [userId]);

  const fetchSummary = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/transactions/summary/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }
      const data = await response.json();
      setSummary(data);
    } catch (error) {
      console.error(error);
    }
  }, [userId]);

  const loadData = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);

    try {
      await Promise.all([fetchSummary(), fetchTransaction()]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchSummary, fetchTransaction, userId]);

  const deleteTransaction = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/transactions/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete transaction");

      loadData();
      Alert.alert("Success", "Transaction deleted successfully!");
    } catch (error: any) {
      console.error(error);
      Alert.alert("Error", error.message);
    }
  };

  return { transactions, summary, isLoading, loadData, deleteTransaction };
};
