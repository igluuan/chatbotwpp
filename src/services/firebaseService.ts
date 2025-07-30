import { db } from '../config/firebase';

interface Transaction {
  userId: string;
  type: 'receita' | 'despesa';
  value: number;
  category?: string;
  source?: string;
  description?: string;
  date?: Date;
}

interface Budget {
  userId: string;
  category: string;
  limit: number;
  monthYear?: string;
}

class FirebaseService {
  public async addTransaction(transaction: Transaction) {
    await db.collection('transacoes').add({ ...transaction, date: new Date() });
  }

  public async getBalance(userId: string): Promise<number> {
    const snapshot = await db
      .collection('transacoes')
      .where('userId', '==', userId)
      .get();

    let balance = 0;
    snapshot.forEach((doc) => {
      const transaction = doc.data();
      if (transaction.type === 'receita') {
        balance += transaction.value;
      } else {
        balance -= transaction.value;
      }
    });

    return balance;
  }

  public async getCategories(userId: string): Promise<string[]> {
    const snapshot = await db
      .collection('transacoes')
      .where('userId', '==', userId)
      .where('type', '==', 'despesa')
      .get();

    const categories = new Set<string>();
    snapshot.forEach((doc) => {
      const transaction = doc.data();
      if (transaction.category) {
        categories.add(transaction.category);
      }
    });

    return Array.from(categories);
  }

  public async getUsers(): Promise<{ id: string; phone: string; }[]> {
    const snapshot = await db.collection('usuarios').where('ativo', '==', true).get();
    const users: { id: string; phone: string; }[] = [];
    snapshot.forEach((doc) => {
      const user = doc.data();
      users.push({ id: doc.id, phone: user.telefone });
    });
    return users;
  }

  public async getReport(userId: string, monthYear?: string)
 {
    const targetMonthYear = monthYear || new Date().toLocaleDateString('pt-BR', { month: '2-digit', year: 'numeric' });

    const snapshot = await db
      .collection('transacoes')
      .where('userId', '==', userId)
      .get();

    let revenues = 0;
    let expenses = 0;

    snapshot.forEach((doc) => {
      const transaction = doc.data();
      const transactionDate = transaction.date.toDate();
      const transactionMonthYear = transactionDate.toLocaleDateString('pt-BR', { month: '2-digit', year: 'numeric' });

      if (transactionMonthYear === targetMonthYear) {
        if (transaction.type === 'receita') {
          revenues += transaction.value;
        } else {
          expenses += transaction.value;
        }
      }
    });

    return {
      monthYear: targetMonthYear,
      revenues,
      expenses,
      balance: revenues - expenses,
    };
  }

  public async setBudget(budget: Budget) {
    const monthYear = budget.monthYear || new Date().toLocaleDateString('pt-BR', { month: '2-digit', year: 'numeric' });
    await db.collection('orcamentos').add({ ...budget, monthYear });
  }
}

export default new FirebaseService();
