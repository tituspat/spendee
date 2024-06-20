import { useRef, useEffect, useContext } from "react";
import { currencyFormatter } from "@/lib/utils";

import { financeContext } from "@/lib/store/finance-context";
import { authContext } from "@/lib/store/auth-context";

// Icons
import { FaRegTrashAlt } from "react-icons/fa";

import Modal from "@/components/Modal";

import { toast } from "react-toastify";

function AddIncomeModal({ show, onClose }) {
  const amountRef = useRef();
  const descriptionRef = useRef();
  const { income, addIncomeItem} =
    useContext(financeContext);

  const { user } = useContext(authContext);

  // Handler Functions
  const addIncomeHandler = async (e) => {
    e.preventDefault();

    const newIncome = {
      amount: +amountRef.current.value,
      description: descriptionRef.current.value,
      createdAt: new Date(),
      uid: user.uid,
    };

    try {
      await addIncomeItem(newIncome);
      descriptionRef.current.value = "";
      amountRef.current.value = "";
      toast.success("Income added successfully!");
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  const handleCategoryChange = (e) => {
    if (e.target.value === "custom") {
      // Menampilkan input untuk kategori kustom
      const customCategory = prompt("Enter custom category:");
      setCustomCategory(customCategory);
      descriptionRef.current.dataset.category = customCategory;
    } else {
      // Memilih kategori dari dropdown
      setCustomCategory("");
      descriptionRef.current.dataset.category = e.target.value;
    }
  };


  return (
    <Modal show={show} onClose={onClose}>
      <h2 style={{ fontSize: "2rem", fontWeight: "bold", textAlign: "center" }}> INCOME </h2>
      <form onSubmit={addIncomeHandler} className="flex flex-col gap-4">
        <div className="input-group">
          <label htmlFor="amount">Income Amount : </label>
          <input className="inputan"
            type="number"
            name="amount"
            ref={amountRef}
            min={0.01}
            step={0.01}
            placeholder="Enter income amount"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="description">Description : </label>
          <input className="inputan"
            name="description"
            ref={descriptionRef}
            type="text"
            placeholder="Enter income description"
            required
          />
        </div>
        <p></p>
        <button type="submit" className="btn btn-primary">
          Add entry
        </button>
      </form>

    </Modal>
  );
}

export default AddIncomeModal;
