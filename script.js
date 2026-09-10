// =========================================
// ELEMENTS
// =========================================

const form = document.querySelector("form");

const descriptionInput =
    document.querySelector("#description");

const amountInput =
    document.querySelector("#amount");

const categoryInput =
    document.querySelector("#category");

const dateInput =
    document.querySelector("#date");

const balanceAmount =
    document.querySelector(".balance-amount");

const incomeAmount =
    document.querySelector(".income p");

const expenseAmount =
    document.querySelector(".expense p");

const transactionList =
    document.querySelector("#transaction-list");


// =========================================
// FINANCIAL OVERVIEW ELEMENTS
// =========================================

const savingsAmount =
    document.querySelector("#savings-amount");

const savingsRate =
    document.querySelector("#savings-rate");

const highestExpense =
    document.querySelector("#highest-expense");

const topCategory =
    document.querySelector("#top-category");


// =========================================
// BUDGET ELEMENTS
// =========================================

const budgetInput =
    document.querySelector("#budget-input");

const saveBudgetButton =
    document.querySelector("#save-budget");

const budgetSpent =
    document.querySelector("#budget-spent");

const budgetRemaining =
    document.querySelector("#budget-remaining");

const budgetTotal =
    document.querySelector("#budget-total");

const budgetProgressBar =
    document.querySelector("#budget-progress-bar");

const budgetStatus =
    document.querySelector("#budget-status");

const budgetOverspent =
    document.querySelector("#budget-overspent");


// =========================================
// SEARCH & FILTER ELEMENTS
// =========================================

const searchInput =
    document.querySelector("#search-input");

const typeFilter =
    document.querySelector("#type-filter");

const categoryFilter =
    document.querySelector("#category-filter");

const transactionCount =
    document.querySelector("#transaction-count");


// =========================================
// MONTHLY OVERVIEW ELEMENTS
// =========================================

const monthlyExpense =
    document.querySelector("#monthly-expense");

const monthlyTransactions =
    document.querySelector("#monthly-transactions");

const categoryChart =
    document.querySelector("#category-chart");


// =========================================
// EDIT MODE
// =========================================

let editingTransactionId = null;


// =========================================
// LOAD TRANSACTIONS
// =========================================

let transactions =
    JSON.parse(
        localStorage.getItem("transactions")
    ) || [];


// =========================================
// LOAD MONTHLY BUDGET
// =========================================

let monthlyBudget =
    Number(
        localStorage.getItem("monthlyBudget")
    ) || 0;


// =========================================
// FORM BUTTON
// =========================================

const submitButton =
    form
        ? form.querySelector(
            'button[type="submit"]'
        )
        : null;


// =========================================
// CREATE CANCEL BUTTON
// =========================================

let cancelEditButton = null;


if (form && submitButton) {

    cancelEditButton =
        document.createElement("button");

    cancelEditButton.type =
        "button";

    cancelEditButton.className =
        "cancel-edit-button";

    cancelEditButton.innerHTML = `

        <i class="fa-solid fa-xmark"></i>

        <span>Cancel Edit</span>

    `;

    cancelEditButton.style.display =
        "none";

    submitButton.insertAdjacentElement(
        "afterend",
        cancelEditButton
    );

}


// =========================================
// SET SAVED BUDGET
// =========================================

if (budgetInput) {

    budgetInput.value =
        monthlyBudget > 0
            ? monthlyBudget
            : "";

}


// =========================================
// SET TODAY'S DATE
// =========================================

if (dateInput) {

    dateInput.value =
        new Date()
            .toISOString()
            .split("T")[0];

}


// =========================================
// FORMAT CURRENCY
// =========================================

function formatCurrency(amount) {

    return `₹${Number(amount).toLocaleString("en-IN")}`;

}


// =========================================
// FORMAT DATE
// =========================================

function formatDate(date) {

    if (!date) {

        return "No date";

    }


    const parsedDate =
        new Date(
            date + "T00:00:00"
        );


    return parsedDate.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


// =========================================
// SAVE TRANSACTIONS
// =========================================

function saveTransactions() {

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

}


// =========================================
// ADD / UPDATE TRANSACTION
// =========================================

if (form) {

    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const description =
                descriptionInput.value.trim();

            const amount =
                Number(
                    amountInput.value
                );

            const category =
                categoryInput.value;

            const date =
                dateInput.value;

            const selectedType =
                document.querySelector(
                    'input[name="type"]:checked'
                );


            // =================================
            // VALIDATION
            // =================================

            if (!selectedType) {

                alert(
                    "Please select Income or Expense."
                );

                return;

            }


            if (
                description === "" ||
                !Number.isFinite(amount) ||
                amount <= 0 ||
                category === "" ||
                date === ""
            ) {

                alert(
                    "Please fill all transaction details."
                );

                return;

            }


            // =================================
            // UPDATE EXISTING TRANSACTION
            // =================================

            if (
                editingTransactionId !== null
            ) {

                const transactionIndex =
                    transactions.findIndex(
                        function (transaction) {

                            return (
                                transaction.id ===
                                editingTransactionId
                            );

                        }
                    );


                if (
                    transactionIndex !== -1
                ) {

                    transactions[
                        transactionIndex
                    ] = {

                        ...transactions[
                            transactionIndex
                        ],

                        description:
                            description,

                        amount:
                            amount,

                        type:
                            selectedType.value,

                        category:
                            category,

                        date:
                            date

                    };

                }


                saveTransactions();


                exitEditMode();


                updateUI();


                return;

            }


            // =================================
            // CREATE NEW TRANSACTION
            // =================================

            const transaction = {

                id:
                    Date.now(),

                description:
                    description,

                amount:
                    amount,

                type:
                    selectedType.value,

                category:
                    category,

                date:
                    date

            };


            // =================================
            // ADD TRANSACTION
            // =================================

            transactions.push(
                transaction
            );


            // =================================
            // SAVE
            // =================================

            saveTransactions();


            // =================================
            // UPDATE UI
            // =================================

            updateUI();


            // =================================
            // RESET FORM
            // =================================

            form.reset();


            if (dateInput) {

                dateInput.value =
                    new Date()
                        .toISOString()
                        .split("T")[0];

            }

        }
    );

}


// =========================================
// EDIT TRANSACTION
// =========================================

function editTransaction(id) {

    const transaction =
        transactions.find(
            function (item) {

                return item.id === id;

            }
        );


    if (!transaction) {

        return;

    }


    // =====================================
    // SAVE EDITING ID
    // =====================================

    editingTransactionId =
        id;


    // =====================================
    // LOAD DATA INTO FORM
    // =====================================

    descriptionInput.value =
        transaction.description || "";

    amountInput.value =
        transaction.amount || "";

    categoryInput.value =
        transaction.category || "";

    dateInput.value =
        transaction.date || "";


    // =====================================
    // SELECT TYPE
    // =====================================

    const typeRadio =
        document.querySelector(
            `input[name="type"][value="${transaction.type}"]`
        );


    if (typeRadio) {

        typeRadio.checked =
            true;

    }


    // =====================================
    // CHANGE BUTTON
    // =====================================

    if (submitButton) {

        submitButton.innerHTML = `

            <span>
                Update Transaction
            </span>

            <i class="fa-solid fa-check"></i>

        `;

        submitButton.classList.add(
            "update-mode"
        );

    }


    // =====================================
    // SHOW CANCEL BUTTON
    // =====================================

    if (cancelEditButton) {

        cancelEditButton.style.display =
            "flex";

    }


    // =====================================
    // UPDATE SECTION TITLE
    // =====================================

    const formHeading =
        document.querySelector(
            ".transaction-form h2"
        );


    if (formHeading) {

        formHeading.textContent =
            "Edit Transaction";

    }


    // =====================================
    // UPDATE EYEBROW
    // =====================================

    const eyebrow =
        document.querySelector(
            ".transaction-form .eyebrow"
        );


    if (eyebrow) {

        eyebrow.textContent =
            "UPDATE";

    }


    // =====================================
    // SCROLL TO FORM
    // =====================================

    const transactionFormSection =
        document.querySelector(
            ".transaction-form"
        );


    if (transactionFormSection) {

        transactionFormSection.scrollIntoView({

            behavior: "smooth",

            block: "center"

        });

    }

}


// =========================================
// EXIT EDIT MODE
// =========================================

function exitEditMode() {

    editingTransactionId =
        null;


    // =====================================
    // RESET FORM
    // =====================================

    if (form) {

        form.reset();

    }


    // =====================================
    // SET TODAY'S DATE
    // =====================================

    if (dateInput) {

        dateInput.value =
            new Date()
                .toISOString()
                .split("T")[0];

    }


    // =====================================
    // RESTORE SUBMIT BUTTON
    // =====================================

    if (submitButton) {

        submitButton.innerHTML = `

            <span>
                Add Transaction
            </span>

            <i class="fa-solid fa-arrow-right"></i>

        `;

        submitButton.classList.remove(
            "update-mode"
        );

    }


    // =====================================
    // HIDE CANCEL BUTTON
    // =====================================

    if (cancelEditButton) {

        cancelEditButton.style.display =
            "none";

    }


    // =====================================
    // RESTORE HEADING
    // =====================================

    const formHeading =
        document.querySelector(
            ".transaction-form h2"
        );


    if (formHeading) {

        formHeading.textContent =
            "Add Transaction";

    }


    // =====================================
    // RESTORE EYEBROW
    // =====================================

    const eyebrow =
        document.querySelector(
            ".transaction-form .eyebrow"
        );


    if (eyebrow) {

        eyebrow.textContent =
            "FINANCE";

    }

}


// =========================================
// CANCEL EDIT
// =========================================

if (cancelEditButton) {

    cancelEditButton.addEventListener(
        "click",
        function () {

            exitEditMode();

        }
    );

}


// =========================================
// GET FILTERED TRANSACTIONS
// =========================================

function getFilteredTransactions() {

    const search =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    const selectedType =
        typeFilter
            ? typeFilter.value
            : "all";


    const selectedCategory =
        categoryFilter
            ? categoryFilter.value
            : "all";


    return transactions.filter(
        function (transaction) {

            const description =
                String(
                    transaction.description ||
                    ""
                )
                .toLowerCase();


            const category =
                transaction.category ||
                "Other";


            const matchesSearch =
                description.includes(
                    search
                );


            const matchesType =
                selectedType === "all" ||
                transaction.type ===
                    selectedType;


            const matchesCategory =
                selectedCategory === "all" ||
                category ===
                    selectedCategory;


            return (
                matchesSearch &&
                matchesType &&
                matchesCategory
            );

        }
    );

}


// =========================================
// CHECK CURRENT MONTH
// =========================================

function isCurrentMonth(date) {

    if (!date) {

        return false;

    }


    const now =
        new Date();


    const transactionDate =
        new Date(
            date + "T00:00:00"
        );


    return (
        transactionDate.getMonth() ===
            now.getMonth() &&
        transactionDate.getFullYear() ===
            now.getFullYear()
    );

}


// =========================================
// GET CURRENT MONTH DATA
// =========================================

function getCurrentMonthData() {

    let income = 0;

    let expense = 0;

    let transactionCount = 0;

    let highestExpense = 0;

    const categoryTotals = {};


    transactions.forEach(
        function (transaction) {

            if (
                !isCurrentMonth(
                    transaction.date
                )
            ) {

                return;

            }


            transactionCount++;


            const amount =
                Number(
                    transaction.amount
                ) || 0;


            // =================================
            // INCOME
            // =================================

            if (
                transaction.type ===
                "income"
            ) {

                income += amount;

            }


            // =================================
            // EXPENSE
            // =================================

            if (
                transaction.type ===
                "expense"
            ) {

                expense += amount;


                // Highest expense

                if (
                    amount >
                    highestExpense
                ) {

                    highestExpense =
                        amount;

                }


                // Category totals

                const category =
                    transaction.category ||
                    "Other";


                if (
                    !categoryTotals[
                        category
                    ]
                ) {

                    categoryTotals[
                        category
                    ] = 0;

                }


                categoryTotals[
                    category
                ] += amount;

            }

        }
    );


    return {

        income:
            income,

        expense:
            expense,

        transactionCount:
            transactionCount,

        highestExpense:
            highestExpense,

        categoryTotals:
            categoryTotals

    };

}


// =========================================
// UPDATE UI
// =========================================

function updateUI() {

    let income = 0;

    let expense = 0;


    // =====================================
    // ALL-TIME TOTALS
    // =====================================

    transactions.forEach(
        function (transaction) {

            const amount =
                Number(
                    transaction.amount
                ) || 0;


            if (
                transaction.type ===
                "income"
            ) {

                income += amount;

            }


            if (
                transaction.type ===
                "expense"
            ) {

                expense += amount;

            }

        }
    );


    // =====================================
    // BALANCE
    // =====================================

    const balance =
        income - expense;


    // =====================================
    // MAIN DISPLAY
    // =====================================

    if (balanceAmount) {

        balanceAmount.textContent =
            formatCurrency(
                balance
            );

    }


    if (incomeAmount) {

        incomeAmount.textContent =
            formatCurrency(
                income
            );

    }


    if (expenseAmount) {

        expenseAmount.textContent =
            formatCurrency(
                expense
            );

    }


    // =====================================
    // FILTERED TRANSACTIONS
    // =====================================

    const filteredTransactions =
        getFilteredTransactions();


    if (transactionCount) {

        transactionCount.textContent =
            filteredTransactions.length;

    }


    // =====================================
    // RENDER TRANSACTIONS
    // =====================================

    renderTransactions(
        filteredTransactions
    );


    // =====================================
    // MONTHLY OVERVIEW
    // =====================================

    updateMonthlyOverview();


    // =====================================
    // FINANCIAL INSIGHTS
    // =====================================

    updateFinancialInsights();

}


// =========================================
// RENDER TRANSACTIONS
// =========================================

function renderTransactions(list) {

    if (!transactionList) {

        return;

    }


    transactionList.innerHTML =
        "";


    // =====================================
    // NO RESULTS
    // =====================================

    if (
        list.length === 0
    ) {

        transactionList.innerHTML = `

            <li class="empty-state">

                <div class="empty-icon">

                    <i class="fa-solid fa-receipt"></i>

                </div>

                <strong>
                    ${
                        transactions.length === 0
                            ? "No transactions yet"
                            : "No transactions found"
                    }
                </strong>

                <span>
                    ${
                        transactions.length === 0
                            ? "Your recent transactions will appear here."
                            : "Try changing your search or filters."
                    }
                </span>

            </li>

        `;

        return;

    }


    // =====================================
    // SORT NEWEST FIRST
    // =====================================

    list
        .slice()
        .sort(
            function (a, b) {

                const dateA =
                    new Date(
                        a.date || 0
                    );

                const dateB =
                    new Date(
                        b.date || 0
                    );


                return (
                    dateB - dateA
                );

            }
        )
        .forEach(
            function (transaction) {

                const li =
                    document.createElement(
                        "li"
                    );


                const isIncome =
                    transaction.type ===
                    "income";


                const icon =
                    getCategoryIcon(
                        transaction.category
                    );


                // =================================
                // TRANSACTION HTML
                // =================================

                li.innerHTML = `

                    <div class="transaction-info">

                        <div
                            class="
                                transaction-icon
                                ${
                                    isIncome
                                        ? "income-icon"
                                        : "expense-icon"
                                }
                            "
                        >

                            <i
                                class="${icon}"
                            ></i>

                        </div>


                        <div class="transaction-details">

                            <strong>

                                ${escapeHTML(
                                    transaction.description ||
                                    "Untitled"
                                )}

                            </strong>


                            <small>

                                ${escapeHTML(
                                    transaction.category ||
                                    "Other"
                                )}

                                •

                                ${formatDate(
                                    transaction.date
                                )}

                            </small>

                        </div>

                    </div>


                    <div
                        class="
                            transaction-amount
                            ${
                                isIncome
                                    ? "income-amount"
                                    : "expense-amount"
                            }
                        "
                    >

                        ${
                            isIncome
                                ? "+"
                                : "-"
                        }

                        ${formatCurrency(
                            transaction.amount
                        )}

                    </div>


                    <div class="transaction-actions">


                        <!-- EDIT -->

                        <button
                            class="edit-transaction"
                            aria-label="Edit transaction"
                            title="Edit transaction"
                            type="button"
                        >

                            <i
                                class="fa-solid fa-pen"
                            ></i>

                        </button>


                        <!-- DELETE -->

                        <button
                            class="delete-transaction"
                            aria-label="Delete transaction"
                            title="Delete transaction"
                            type="button"
                        >

                            <i
                                class="fa-solid fa-trash"
                            ></i>

                        </button>


                    </div>

                `;


                // =================================
                // EDIT BUTTON
                // =================================

                const editButton =
                    li.querySelector(
                        ".edit-transaction"
                    );


                if (editButton) {

                    editButton.addEventListener(
                        "click",
                        function () {

                            editTransaction(
                                transaction.id
                            );

                        }
                    );

                }


                // =================================
                // DELETE BUTTON
                // =================================

                const deleteButton =
                    li.querySelector(
                        ".delete-transaction"
                    );


                if (deleteButton) {

                    deleteButton.addEventListener(
                        "click",
                        function () {

                            deleteTransaction(
                                transaction.id
                            );

                        }
                    );

                }


                transactionList.appendChild(
                    li
                );

            }
        );

}


// =========================================
// DELETE TRANSACTION
// =========================================

function deleteTransaction(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this transaction?"
        );


    if (!confirmed) {

        return;

    }


    // If currently editing this transaction
    if (
        editingTransactionId === id
    ) {

        exitEditMode();

    }


    transactions =
        transactions.filter(
            function (transaction) {

                return (
                    transaction.id !==
                    id
                );

            }
        );


    saveTransactions();


    updateUI();

}


// =========================================
// CATEGORY ICON
// =========================================

function getCategoryIcon(category) {

    const icons = {

        Salary:
            "fa-solid fa-money-bill-wave",

        Food:
            "fa-solid fa-utensils",

        Shopping:
            "fa-solid fa-bag-shopping",

        Transport:
            "fa-solid fa-car",

        Bills:
            "fa-solid fa-file-invoice",

        Entertainment:
            "fa-solid fa-film",

        Health:
            "fa-solid fa-heart-pulse",

        Education:
            "fa-solid fa-graduation-cap",

        Other:
            "fa-solid fa-wallet"

    };


    return (
        icons[category] ||
        "fa-solid fa-wallet"
    );

}


// =========================================
// MONTHLY OVERVIEW
// =========================================

function updateMonthlyOverview() {

    const monthData =
        getCurrentMonthData();


    // =====================================
    // MONTHLY EXPENSE
    // =====================================

    if (monthlyExpense) {

        monthlyExpense.textContent =
            formatCurrency(
                monthData.expense
            );

    }


    // =====================================
    // MONTHLY TRANSACTIONS
    // =====================================

    if (monthlyTransactions) {

        monthlyTransactions.textContent =
            monthData.transactionCount;

    }


    // =====================================
    // CATEGORY CHART
    // =====================================

    renderCategoryChart(
        monthData.categoryTotals
    );

}


// =========================================
// CATEGORY CHART
// =========================================

function renderCategoryChart(categories) {

    if (!categoryChart) {

        return;

    }


    categoryChart.innerHTML =
        "";


    const entries =
        Object.entries(
            categories
        );


    // =====================================
    // NO EXPENSES
    // =====================================

    if (
        entries.length === 0
    ) {

        categoryChart.innerHTML = `

            <div class="no-results">

                No expenses this month.

            </div>

        `;

        return;

    }


    // =====================================
    // MAX VALUE
    // =====================================

    const maxValue =
        Math.max(
            ...entries.map(
                function ([, value]) {

                    return value;

                }
            )
        );


    // =====================================
    // SORT & RENDER
    // =====================================

    entries
        .sort(
            function ([, a], [, b]) {

                return b - a;

            }
        )
        .forEach(
            function ([category, value]) {

                const percentage =
                    maxValue > 0
                        ? (
                            value /
                            maxValue
                        ) * 100
                        : 0;


                const row =
                    document.createElement(
                        "div"
                    );


                row.className =
                    "category-row";


                row.innerHTML = `

                    <span
                        class="category-name"
                    >
                        ${escapeHTML(
                            category
                        )}
                    </span>


                    <div
                        class="category-bar"
                    >

                        <div
                            class="category-progress"
                            style="
                                width:${percentage}%
                            "
                        ></div>

                    </div>


                    <span
                        class="category-value"
                    >

                        ${formatCurrency(
                            value
                        )}

                    </span>

                `;


                categoryChart.appendChild(
                    row
                );

            }
        );

}


// =========================================
// FINANCIAL INSIGHTS
// =========================================

function updateFinancialInsights() {

    const monthData =
        getCurrentMonthData();


    const income =
        monthData.income;


    const expense =
        monthData.expense;


    // =====================================
    // SAVINGS
    // =====================================

    const savings =
        income - expense;


    if (savingsAmount) {

        savingsAmount.textContent =
            formatCurrency(
                savings
            );

    }


    // =====================================
    // SAVINGS RATE
    // =====================================

    let rate = 0;


    if (income > 0) {

        rate =
            (
                savings /
                income
            ) * 100;

    }


    if (savingsRate) {

        savingsRate.textContent =
            `${Math.max(
                0,
                rate
            ).toFixed(1)}%`;

    }


    // =====================================
    // HIGHEST EXPENSE
    // =====================================

    if (highestExpense) {

        highestExpense.textContent =
            formatCurrency(
                monthData.highestExpense
            );

    }


    // =====================================
    // TOP CATEGORY
    // =====================================

    const categoryEntries =
        Object.entries(
            monthData.categoryTotals
        );


    if (topCategory) {

        if (
            categoryEntries.length > 0
        ) {

            categoryEntries.sort(
                function ([, a], [, b]) {

                    return b - a;

                }
            );


            topCategory.textContent =
                categoryEntries[0][0];

        } else {

            topCategory.textContent =
                "—";

        }

    }


    // =====================================
    // UPDATE BUDGET
    // =====================================

    updateBudget(
        expense
    );

}


// =========================================
// UPDATE BUDGET
// =========================================

function updateBudget(
    totalExpense
) {

    const expense =
        Number(
            totalExpense
        ) || 0;


    // =====================================
    // BUDGET TOTAL
    // =====================================

    if (budgetTotal) {

        budgetTotal.textContent =
            formatCurrency(
                monthlyBudget
            );

    }


    // =====================================
    // BUDGET SPENT
    // =====================================

    if (budgetSpent) {

        budgetSpent.textContent =
            formatCurrency(
                expense
            );

    }


    // =====================================
    // NO BUDGET
    // =====================================

    if (
        monthlyBudget <= 0
    ) {

        if (budgetRemaining) {

            budgetRemaining.textContent =
                "—";

        }


        if (budgetProgressBar) {

            budgetProgressBar.style.width =
                "0%";

            budgetProgressBar.className =
                "budget-progress-bar";

        }


        if (budgetStatus) {

            budgetStatus.textContent =
                "Set a monthly budget to start tracking.";

            budgetStatus.className =
                "budget-status";

        }


        if (budgetOverspent) {

            budgetOverspent.textContent =
                "";

            budgetOverspent.className =
                "budget-overspent";

        }


        return;

    }


    // =====================================
    // REMAINING
    // =====================================

    const remaining =
        monthlyBudget -
        expense;


    if (budgetRemaining) {

        budgetRemaining.textContent =
            formatCurrency(
                Math.max(
                    0,
                    remaining
                )
            );

    }


    // =====================================
    // USED PERCENTAGE
    // =====================================

    const percentage =
        (
            expense /
            monthlyBudget
        ) * 100;


    const safePercentage =
        Math.min(
            Math.max(
                percentage,
                0
            ),
            100
        );


    // =====================================
    // PROGRESS BAR
    // =====================================

    if (budgetProgressBar) {

        budgetProgressBar.style.width =
            `${safePercentage}%`;

        budgetProgressBar.className =
            "budget-progress-bar";

    }


    // =====================================
    // RESET STATUS
    // =====================================

    if (budgetStatus) {

        budgetStatus.className =
            "budget-status";

    }


    if (budgetOverspent) {

        budgetOverspent.className =
            "budget-overspent";

        budgetOverspent.textContent =
            "";

    }


    // =====================================
    // OVER BUDGET
    // =====================================

    if (
        percentage >= 100
    ) {

        const overspentAmount =
            expense -
            monthlyBudget;


        if (budgetProgressBar) {

            budgetProgressBar.classList.add(
                "danger"
            );

        }


        if (budgetStatus) {

            budgetStatus.classList.add(
                "danger"
            );


            budgetStatus.textContent =
                "⚠️ You have exceeded your monthly budget.";

        }


        if (budgetOverspent) {

            budgetOverspent.textContent =
                `Overspent by ${formatCurrency(
                    overspentAmount
                )}`;

            budgetOverspent.classList.add(
                "danger"
            );

        }

    }


    // =====================================
    // WARNING
    // =====================================

    else if (
        percentage >= 80
    ) {

        if (budgetProgressBar) {

            budgetProgressBar.classList.add(
                "warning"
            );

        }


        if (budgetStatus) {

            budgetStatus.classList.add(
                "warning"
            );


            budgetStatus.textContent =
                `⚠️ You have used ${percentage.toFixed(
                    0
                )}% of your budget.`;

        }


        if (budgetOverspent) {

            budgetOverspent.textContent =
                `${formatCurrency(
                    remaining
                )} remaining`;

        }

    }


    // =====================================
    // NORMAL
    // =====================================

    else {

        if (budgetStatus) {

            budgetStatus.textContent =
                `You're using ${percentage.toFixed(
                    0
                )}% of your monthly budget.`;

        }


        if (budgetOverspent) {

            budgetOverspent.textContent =
                `${formatCurrency(
                    remaining
                )} remaining`;

        }

    }

}

// =========================================
// SAVE MONTHLY BUDGET
// =========================================

if (saveBudgetButton) {

    saveBudgetButton.addEventListener(
        "click",
        function () {

            const budget =
                Number(budgetInput.value);

            // Validation
            if (
                !Number.isFinite(budget) ||
                budget <= 0
            ) {

                alert(
                    "Please enter a valid monthly budget."
                );

                return;

            }

            // Save budget
            monthlyBudget = budget;

            localStorage.setItem(
                "monthlyBudget",
                monthlyBudget
            );

            // Update UI immediately
            updateUI();

        }
    );

}


// =========================================
// SEARCH
// =========================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        updateUI
    );

}


// =========================================
// TYPE FILTER
// =========================================

if (typeFilter) {

    typeFilter.addEventListener(
        "change",
        updateUI
    );

}


// =========================================
// CATEGORY FILTER
// =========================================

if (categoryFilter) {

    categoryFilter.addEventListener(
        "change",
        updateUI
    );

}


// =========================================
// ESCAPE HTML
// =========================================

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        String(text);


    return div.innerHTML;

}


// =========================================
// INITIALIZE APPLICATION
// =========================================

updateUI();