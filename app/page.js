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
  const [showIncomeDetail, setShowIncomeDetail] = useState(false);
  const [showExpenseDetail, setShowExpenseDetail] = useState(false);
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

    const options = {
      maintainAspectRatio: false,
      responsive: true,
    };

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
        <div className="w-1/2 mx-auto mt-6" style={{ position: 'relative', height: '40vh', width: '40vw' }}>
          <Doughnut data={chartData} options={options} />
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
      <div className="flex flex-col items-center justify-center h-full">
  {/* My Balance Section */}
  <section className="py-3 text-center">
    <small className="text-gray-400 text-md">My Balance</small>
    <h2 className="text-4xl font-bold">{currencyFormatter(balance)}</h2>
  </section>

  {/* Buttons Section */}
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
</div>



{/* My Income Section */}
<section className="py-6">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl">My Income</h3>
          <button
            className="text-lime-500 hover:text-lime-700"
            onClick={() => setShowIncomeDetail(!showIncomeDetail)}
          >
            {showIncomeDetail ? "Hide Details" : "Show Details"}
          </button>
        </div>
        {showIncomeDetail && (
          <div className="overflow-x-auto mt-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-200 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-200 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-200 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Delete</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-900 divide-y divide-gray-700">
                {income.map((i) => (
                  <tr key={i.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">
                      {new Date(i.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {currencyFormatter(i.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {i.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          deleteIncomeEntryHandler(i.id);
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaRegTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {showIncomeDetail && <IncomeHistoryDoughnut />} {/* Menampilkan grafik pendapatan jika showIncomeDetail true */}
      </section>

           {/* My Expenses Section */}
      <section className="py-6">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl">My Expenses</h3>
          <button
            className="text-lime-500 hover:text-lime-700"
            onClick={() => setShowExpenseDetail(!showExpenseDetail)}
          >
            {showExpenseDetail ? "Hide Details" : "Show Details"}
          </button>
        </div>
        {showExpenseDetail && (
          <div className="flex flex-col gap-4 mt-6">
            {expenses.map((expense) => (
              <ExpenseCategoryItem key={expense.id} expense={expense} />
            ))}
          </div>
        )}
        {showExpenseDetail && (
          <section className="py-6" id="stats">
            <div className="w-1/2 mx-auto mt-6" style={{ position: 'relative', height: '40vh', width: '40vw' }}>
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
                options={{
                  maintainAspectRatio: false,
                  responsive: true,
                }}
              />
            </div>
          </section>
        )}
      </section>
      </main>
    </>
  );
}
