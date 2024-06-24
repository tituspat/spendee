import { useContext } from "react";
import { financeContext } from "@/lib/store/finance-context";


import Modal from "@/components/Modal";
import { currencyFormatter } from "@/lib/utils";


import { FaRegTrashAlt } from "react-icons/fa";


import { toast } from "react-toastify";


function ViewExpenseModal({ show, onClose, expense, paymentMethod }) {
  const { deleteExpenseItem, deleteExpenseCategory } =
    useContext(financeContext);


  const deleteExpenseHandler = async () => {
    try {
      await deleteExpenseCategory(expense.id);
      toast.success("Expense category deleted successfully!");
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };


  const deleteExpenseItemHandler = async (item) => {
    try {
      //  Remove the item from the list
      const updatedItems = expense.items.filter((i) => i.id !== item.id);


      // Update the expense balance
      const updatedExpense = {
        items: [...updatedItems],
        total: expense.total - item.amount,
      };


      await deleteExpenseItem(updatedExpense, expense.id);
      toast.success("Expense item removed successfully!");
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };


  return (
    <Modal show={show} onClose={onClose}>
      <div className="flex items-center justify-between">
        <h2 className="text-4xl">{expense.title}</h2>
        <button onClick={deleteExpenseHandler} className="btn btn-danger">
          Delete
        </button>
      </div>


      <div>
        <h3 className="my-4 text-2xl">Expense History</h3>
        <div style={tableHeaderStyle}>
          <p style={columnStyle}>Date</p>
          <p style={columnStyle}>Payment Method</p>
          <p style={columnStyle}>Amount</p>
        </div>


        {expense.items.map((item) => {
          return (
            <div key={item.id} style={rowStyle}>
            <small style={itemStyle}>
              {item.createdAt.toMillis
                ? new Date(item.createdAt.toMillis()).toISOString()
                : item.createdAt.toISOString()}
            </small>
            <p style={itemStyle}>{item.paymentMethod}</p>
            <div style={amountStyle}>
              <p>{currencyFormatter(item.amount)}</p>
              <button
                onClick={() => {
                  deleteExpenseItemHandler(item);
                }}
                style={buttonStyle}
              >
                  <FaRegTrashAlt />
                </button>
                </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
}


export default ViewExpenseModal;




const tableHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  backgroundColor: "#4a5568",
  color: "white",
  padding: "1rem",
};


const columnStyle = {
  textAlign: "center",
  flex: "1",
  fontWeight: "bold", // Bold font weight for column headers
};


const rowStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0.75rem 1rem",
  borderBottom: "1px solid #ddd",
};


const itemStyle = {
  flex: "1",
  textAlign: "center",
};


const amountStyle = {
  flex: "1",
  textAlign: "left",
  display: "flex",
  alignItems: "center",
};


const buttonStyle = {
  marginLeft: "auto",
};
