'use client';

import { useState, useContext, useEffect } from 'react';
import { financeContext } from '@/lib/store/finance-context';
import { authContext } from '@/lib/store/auth-context';

import { currencyFormatter } from '@/lib/utils';

import ExpenseCategoryItem from '@/components/ExpenseCategoryItem';

import AddIncomeModal from '@/components/modals/AddIncomeModal';
import AddExpensesModal from '@/components/modals/AddExpensesModal';
import SignIn from '@/components/SignIn';

// Icons
import { FaRegTrashAlt } from "react-icons/fa";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { toast } from "react-toastify";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Home() {
  const [showAddIncomeModal, setShowAddIncomeModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);

  const [balance, setBalance] = useState(0);
  const { expenses, income,removeIncomeItem } = useContext(financeContext);
  const { user } = useContext(authContext);

  useEffect(() => {
    const newBalance =
      income.reduce((total, i) => {
        return total + i.amount;
      }, 0) -
      expenses.reduce((total, e) => {
        return total + e.total;
      }, 0);

    setBalance(newBalance);
  }, [expenses, income]);

  if (!user) {
    return <SignIn />;
  }
  const deleteIncomeEntryHandler = async (incomeId) => {
    try {
      await removeIncomeItem(incomeId);
      toast.success("Income deleted successfully.");
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  function IncomeHistoryDoughnut() {
    const { income } = useContext(financeContext);
  
    // Mengelompokkan data berdasarkan description
    const groupedData = income.reduce((acc, curr) => {
      const description = curr.description.toLowerCase(); // Sesuaikan dengan data aktual
  
      // Jika sudah ada data untuk description tersebut, tambahkan jumlahnya
      if (acc[description]) {
        acc[description] += curr.amount;
      } else {
        // Jika belum ada, inisialisasi dengan jumlah baru
        acc[description] = curr.amount;
      }
  
      return acc;
    }, {});
  
    // Mengubah hasil pengelompokkan menjadi format yang dapat digunakan oleh Doughnut Chart
    const chartData = {
      labels: Object.keys(groupedData),
      datasets: [
        {
          label: 'Income by Description',
          data: Object.values(groupedData),
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#8B4513',
            '#00FF00',
            '#0000FF',
            '#FF00FF',
            '#800080',
            '#808000',
            '#008080',
          ], // Atur warna sesuai dengan jumlah kategori
          hoverBackgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#8B4513',
            '#00FF00',
            '#0000FF',
            '#FF00FF',
            '#800080',
            '#808000',
            '#008080',
          ], // Warna saat hover
        },
      ],
    };

    return (
      <section className="py-6">
        <div className="w-1/2 mx-auto mt-6">
          <Doughnut data={chartData} />
        </div>
      </section>
    );
  };

  if (!user) {
    return <SignIn />;
  }


  return (
    <>
      {/* Add Income Modal */}
      <AddIncomeModal show={showAddIncomeModal} onClose={setShowAddIncomeModal} />

      {/* Add Expenses Modal */}
      <AddExpensesModal show={showAddExpenseModal} onClose={setShowAddExpenseModal} />

      <main className="container max-w-2xl px-6 mx-auto">
        <section className="py-3">
          <small className="text-gray-400 text-md">My Balance</small>
          <h2 className="text-4xl font-bold">{currencyFormatter(balance)}</h2>
        </section>

        <section className="flex items-center gap-2 py-3">
          <button
            onClick={() => {
              setShowAddExpenseModal(true);
            }}
            className="btn btn-primary"
          >
            + Expenses
          </button>
          <button
            onClick={() => {
              setShowAddIncomeModal(true);
            }}
            className="btn btn-primary-outline"
          >
            + Income
          </button>
        </section>

        {/* Income History */}
        <section className="py-6">
          <h3 className="text-2xl">My Income</h3>
          <div className="flex flex-col gap-4 mt-6">
            {income.map((i) => (
              <div className="flex justify-between item-center" key={i.id}>
                <div>
                  <p className="font-semibold">{i.description}</p>
                  <small className="text-xs">{i.createdAt.toISOString()}</small>
                </div>
                <p className="flex items-center gap-2">
                {currencyFormatter(i.amount)}
                <button
                  onClick={() => {
                    deleteIncomeEntryHandler(i.id);
                  }}
                >
                  <FaRegTrashAlt />
                </button>
              </p>
              </div>
            ))}
          </div>
          <IncomeHistoryDoughnut />
        </section>


        {/* Expenses */}
        <section className="py-6">
          <h3 className="text-2xl">My Expenses</h3>
          <div className="flex flex-col gap-4 mt-6">
            {expenses.map((expense) => {
              return <ExpenseCategoryItem key={expense.id} expense={expense} />;
            })}
          </div>
        </section>

        {/* Chart Section */}
        <section className="py-6">
          <a id="stats" />
          <h3 className="text-2xl">Statement</h3>
          <div className="w-1/2 mx-auto">
            <Doughnut
              data={{
                labels: expenses.map((expense) => expense.title),
                datasets: [
                  {
                    label: 'Expenses',
                    data: expenses.map((expense) => expense.total),
                    backgroundColor: expenses.map((expense) => expense.color),
                    borderColor: ['#18181b'],
                    borderWidth: 5,
                  },
                ],
              }}
            />
          </div>
        </section>
      </main>
    </>
  );
}
