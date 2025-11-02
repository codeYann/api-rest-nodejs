// eslint-disable-next-line
import { Knex } from "knex";

interface Transaction {
  id: string;
  session_id?: string;
  title: string;
  amount: number;
  created_at: string;
}

declare module "knex/types/table" {
  export interface Tables {
    transactions: Transaction;
  }
}
