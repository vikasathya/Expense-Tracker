const form = document.querySelector("form");

const descriptionInput = document.querySelector("#description");
const amountInput = document.querySelector("#amount");

const balanceAmount = document.querySelector(".balance h3");
const incomeAmount = document.querySelector(".income p");
const expenseAmount = document.querySelector(".expense p");

const transactionList = document.querySelector(".history ul");

let transactions = JSON.parse(
    localStorage.getItem("transactions")
) || [];


// Add Transaction
form.addEventListener("submit", function (event) {

    event.preventDefault();

    const description = descriptionInput.value.trim();
    const amount = Number(amountInput.value);

    // Get selected radio button
    const selectedType = document.querySelector(
        'input[name="type"]:checked'
    );

    // Check if type is selected
    if (!selectedType) {
        alert("Please select Income or Expense.");
        return;
    }

    const type = selectedType.value;


    // Validate
    if (description === "" || amount <= 0) {
        alert("Please enter a valid description and amount.");
        return;
    }


    // Create transaction
    const transaction = {
        id: Date.now(),
        description: description,
        amount: amount,
        type: type
    };


    // Save transaction
    transactions.push(transaction);

    localStorage.setItem(
    "transactions",
    JSON.stringify(transactions)
);

    // Update page
    updateUI();


    // Clear form
    form.reset();
});


// Update UI
function updateUI() {

    let income = 0;
    let expense = 0;

    transactionList.innerHTML = "";


    transactions.forEach(function (transaction) {

        // Income
        if (transaction.type === "income") {

            income = income + transaction.amount;

        }

        // Expense
        if (transaction.type === "expense") {

            expense = expense + transaction.amount;

        }

    });


    // Balance
    const balance = income - expense;


    // Show values
    balanceAmount.textContent = `₹${balance}`;

    incomeAmount.textContent = `₹${income}`;

    expenseAmount.textContent = `₹${expense}`;


    // No transactions
    if (transactions.length === 0) {

        transactionList.innerHTML =
            "<li>No transactions yet.</li>";

        return;
    }


    // Show transactions
    transactions.forEach(function (transaction) {

        const li = document.createElement("li");

        const text = document.createElement("span");

        const deleteButton = document.createElement("button");


        // Income
        if (transaction.type === "income") {

            text.textContent =
                `${transaction.description} +₹${transaction.amount}`;

        }


        // Expense
        if (transaction.type === "expense") {

            text.textContent =
                `${transaction.description} -₹${transaction.amount}`;

        }


        // Delete
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function () {

            transactions = transactions.filter(function (item) {

                return item.id !== transaction.id;

            });

            // Save updated transactions
        localStorage.setItem(
             "transactions",
             JSON.stringify(transactions)
        );

            updateUI();

        });


        li.appendChild(text);
        li.appendChild(deleteButton);

        transactionList.appendChild(li);

    });
}

updateUI();