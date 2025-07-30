import cron from 'node-cron';
import firebaseService from '../services/firebaseService';
import whatsappService from '../services/whatsappService';

// Schedule a job to run every Sunday at 9:00 AM
cron.schedule('0 9 * * 0', async () => {
  const users = await firebaseService.getUsers();

  for (const user of users) {
    const report = await firebaseService.getReport(user.id);
    const message = `Relatório semanal:\nReceitas: R$ ${report.revenues.toFixed(2)}\nDespesas: R$ ${report.expenses.toFixed(2)}\nSaldo: R$ ${report.balance.toFixed(2)}`;

    whatsappService.sendMessage(user.phone, message);
  }
});
