"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_1 = require("../config/firebase");
class FirebaseService {
    addTransaction(transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            yield firebase_1.db.collection('transacoes').add(Object.assign(Object.assign({}, transaction), { date: new Date() }));
        });
    }
    getBalance(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const snapshot = yield firebase_1.db
                .collection('transacoes')
                .where('userId', '==', userId)
                .get();
            let balance = 0;
            snapshot.forEach((doc) => {
                const transaction = doc.data();
                if (transaction.type === 'receita') {
                    balance += transaction.value;
                }
                else {
                    balance -= transaction.value;
                }
            });
            return balance;
        });
    }
    getCategories(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const snapshot = yield firebase_1.db
                .collection('transacoes')
                .where('userId', '==', userId)
                .where('type', '==', 'despesa')
                .get();
            const categories = new Set();
            snapshot.forEach((doc) => {
                const transaction = doc.data();
                if (transaction.category) {
                    categories.add(transaction.category);
                }
            });
            return Array.from(categories);
        });
    }
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const snapshot = yield firebase_1.db.collection('usuarios').where('ativo', '==', true).get();
            const users = [];
            snapshot.forEach((doc) => {
                const user = doc.data();
                users.push({ id: doc.id, phone: user.telefone });
            });
            return users;
        });
    }
    getReport(userId, monthYear) {
        return __awaiter(this, void 0, void 0, function* () {
            const targetMonthYear = monthYear || new Date().toLocaleDateString('pt-BR', { month: '2-digit', year: 'numeric' });
            const snapshot = yield firebase_1.db
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
                    }
                    else {
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
        });
    }
    setBudget(budget) {
        return __awaiter(this, void 0, void 0, function* () {
            const monthYear = budget.monthYear || new Date().toLocaleDateString('pt-BR', { month: '2-digit', year: 'numeric' });
            yield firebase_1.db.collection('orcamentos').add(Object.assign(Object.assign({}, budget), { monthYear }));
        });
    }
    getExpenses(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const snapshot = yield firebase_1.db
                .collection('transacoes')
                .where('userId', '==', userId)
                .where('type', '==', 'despesa')
                .orderBy('date', 'desc') // Order by date, newest first
                .get();
            const expenses = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                expenses.push({
                    userId: data.userId,
                    type: data.type,
                    value: data.value,
                    category: data.category,
                    description: data.description,
                    date: data.date.toDate(), // Convert Firebase Timestamp to Date
                });
            });
            return expenses;
        });
    }
}
exports.default = new FirebaseService();
