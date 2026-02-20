const form = document.getElementById("expenseForm");
const list = document.getElementById("expenseList");
const totalDisplay = document.getElementById("total");
const monthlyDisplay = document.getElementById("monthly");
const toggleMode = document.getElementById("toggleMode");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let editIndex = -1;

let chart;

// SAVE DATA
function saveData() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
}

// TOTAL CALCULATION
function updateTotals() {

    let total = 0;
    let monthly = 0;
    const currentMonth = new Date().getMonth();

    expenses.forEach(exp => {
        total += exp.amount;

        if(new Date(exp.date).getMonth() === currentMonth){
            monthly += exp.amount;
        }
    });

    totalDisplay.textContent = total;
    monthlyDisplay.textContent = monthly;
}

// RENDER LIST
function renderExpenses() {

    list.innerHTML = "";

    expenses.forEach((exp, index) => {

        const li = document.createElement("li");

        li.innerHTML = `
            <span>
                ${exp.title} ( ${exp.category} ) - ₹${exp.amount}
            </span>

            <div class="actions">
                <button onclick="editExpense(${index})">✏️</button>
                <button onclick="deleteExpense(${index})">❌</button>
            </div>
        `;

        list.appendChild(li);
    });

    updateTotals();
    updateChart();
}

// ADD / EDIT
form.addEventListener("submit", e => {

    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const amount = Number(document.getElementById("amount").value);
    const category = document.getElementById("category").value;

    if(!title || amount<=0 || !category){
        alert("Fill all fields correctly");
        return;
    }

    const expense = {
        title,
        amount,
        category,
        date: new Date()
    };

    if(editIndex === -1)
        expenses.push(expense);
    else{
        expenses[editIndex] = expense;
        editIndex = -1;
    }

    saveData();
    renderExpenses();
    form.reset();
});

// DELETE
function deleteExpense(i){
    expenses.splice(i,1);
    saveData();
    renderExpenses();
}

// EDIT
function editExpense(i){
    const exp = expenses[i];

    document.getElementById("title").value = exp.title;
    document.getElementById("amount").value = exp.amount;
    document.getElementById("category").value = exp.category;

    editIndex = i;
}

// CHART
function updateChart(){

    const categoryTotals = {};

    expenses.forEach(exp=>{
        categoryTotals[exp.category] =
            (categoryTotals[exp.category] || 0) + exp.amount;
    });

    const data = {
        labels: Object.keys(categoryTotals),
        datasets:[{
            data:Object.values(categoryTotals)
        }]
    };

    if(chart) chart.destroy();

    chart = new Chart(
        document.getElementById("expenseChart"),
        {
            type:'pie',
            data:data
        }
    );
}

// DARK MODE
toggleMode.addEventListener("click", ()=>{
    document.body.classList.toggle("dark");
});

// INITIAL LOAD
renderExpenses();