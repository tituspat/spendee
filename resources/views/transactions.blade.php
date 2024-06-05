@extends('layouts.app')

@section('content')
    <h1>Transactions</h1>

    <table>
        <thead>
            <tr>
                <th>Amount</th>
                <th>Description</th>
            </tr>
        </thead>
        <tbody>
            @foreach($transactions as $transaction)
                <tr>
                    <td>{{ $transaction->amount }}</td>
                    <td>{{ $transaction->description }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <form action="{{ route('transactions.store') }}" method="post">
        @csrf
        <label for="amount">Amount:</label>
        <input type="number" id="amount" name="amount"><br><br>
        <label for="description">Description:</label>
        <input type="text" id="description" name="description"><br><br>
        <input type="submit" value="Submit Transaction">
    </form>
@endsection

<style>
/* Style for the Transactions page */
h1 {
    font-size: 2em;
    margin-bottom: 20px;
    color: #333;
    text-align: center;
}

/* Style for the table */
table {
    width: 80%;
    margin: 0 auto;
    border-collapse: collapse;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

thead {
    background-color: #f4f4f4;
}

th, td {
    padding: 15px;
    text-align: left;
    border-bottom: 1px solid #ddd;
}

th {
    font-weight: bold;
}

tr:hover {
    background-color: #f1f1f1;
}

/* Style for the form */
form {
    width: 80%;
    margin: 30px auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 5px;
    background-color: #f9f9f9;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

label {
    font-weight: bold;
    display: block;
    margin-bottom: 10px;
    color: #555;
}

input[type="number"],
input[type="text"] {
    width: calc(100% - 20px);
    padding: 10px;
    margin-bottom: 20px;
    border: 1px solid #ddd;
    border-radius: 5px;
    box-sizing: border-box;
}

input[type="submit"] {
    display: block;
    width: 100%;
    padding: 10px;
    border: none;
    border-radius: 5px;
    background-color: #5cb85c;
    color: white;
    font-size: 1em;
    cursor: pointer;
}

input[type="submit"]:hover {
    background-color: #4cae4c;
}
</style>
