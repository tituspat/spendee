<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Transaction;

class MoneyTrackerController extends Controller
{
    public function index()
    {
        $transactions = Transaction::all();
        return view('transactions', compact('transactions'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric',
            'description' => 'required|string',
        ]);

        Transaction::create($request->all());

        return redirect()->route('transactions.index');
    }
}
