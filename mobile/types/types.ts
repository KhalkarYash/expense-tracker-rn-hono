export interface Summary {
  balance: number;
  income: number;
  expenses: number;
}

export type Transaction = {
  id: number;
  user_id: string;
  title: string;
  amount: string;
  category: string;
  created_at: string;
};
