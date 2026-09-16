/* =========================================================
   1. DEFAULT DATA
========================================================= */

const defaultTransactions = [
  {
    id: 1,
    name: "Shopping",
    type: "expense",
    amount: 8500,
    category: "Shopping",
    date: "Today · 10:42 AM"
  },

  {
    id: 2,
    name: "Monthly salary",
    type: "income",
    amount: 180000,
    category: "Income",
    date: "Yesterday · 09:00 AM"
  },

  {
    id: 3,
    name: "Restaurant",
    type: "expense",
    amount: 3200,
    category: "Food & Dining",
    date: "Sep 14 · 07:35 PM"
  },

  {
    id: 4,
    name: "Transport",
    type: "expense",
    amount: 1850,
    category: "Transport",
    date: "Sep 14 · 08:10 AM"
  }
];


const defaultGoals = [
  {
    id: 1,
    name: "Emergency fund",
    current: 136000,
    target: 200000
  },

  {
    id: 2,
    name: "Dream vacation",
    current: 84500,
    target: 150000
  }
];


/* =========================================================
   2. APPLICATION STATE
========================================================= */

let transactions =
  JSON.parse(localStorage.getItem("finovaTransactions")) ||
  defaultTransactions;

let goals =
  JSON.parse(localStorage.getItem("finovaGoals")) ||
  defaultGoals;


/* =========================================================
   3. DOM ELEMENTS
========================================================= */

const transactionModal =
  document.getElementById("transactionModal");

const goalModal =
  document.getElementById("goalModal");

const addTransactionButton =
  document.getElementById("addTransactionButton");

const closeTransactionModal =
  document.getElementById("closeTransactionModal");

const closeGoalModal =
  document.getElementById("closeGoalModal");

const transactionForm =
  document.getElementById("transactionForm");

const goalForm =
  document.getElementById("goalForm");

const transactionList =
  document.getElementById("transactionList");

const totalBalance =
  document.getElementById("totalBalance");

const incomeTotal =
  document.getElementById("incomeTotal");

const expenseTotal =
  document.getElementById("expenseTotal");

const savingsTotal =
  document.getElementById("savingsTotal");

const newGoalButton =
  document.getElementById("newGoalButton");

const addGoalCard =
  document.getElementById("addGoalCard");

const imageGoalButton =
  document.getElementById("imageGoalButton");

const menuButton =
  document.getElementById("menuButton");

const sidebar =
  document.getElementById("sidebar");

const themeToggle =
  document.getElementById("themeToggle");

const periodSelect =
  document.getElementById("periodSelect");

const notificationButton =
  document.querySelector(".notification-button");


/* =========================================================
   4. FORMAT MONEY
========================================================= */

function formatMoney(amount) {

  return new Intl.NumberFormat("en-KE", {
    maximumFractionDigits: 0
  }).format(amount);

}


/* =========================================================
   5. SAVE DATA
========================================================= */

function saveData() {

  localStorage.setItem(
    "finovaTransactions",
    JSON.stringify(transactions)
  );

  localStorage.setItem(
    "finovaGoals",
    JSON.stringify(goals)
  );

}


/* =========================================================
   6. CALCULATE FINANCIAL TOTALS
========================================================= */

function calculateTotals() {

  let income = 0;
  let expenses = 0;

  transactions.forEach(transaction => {

    if (transaction.type === "income") {

      income += Number(transaction.amount);

    } else {

      expenses += Number(transaction.amount);

    }

  });


  /*
    Savings = income - expenses
  */

  const savings = income - expenses;


  /*
    The balance uses a starting balance
    plus the difference created by transactions.
  */

  const startingBalance = 143500;

  const balance =
    startingBalance + income - expenses;


  return {
    income,
    expenses,
    savings,
    balance
  };

}


/* =========================================================
   7. UPDATE DASHBOARD TOTALS
========================================================= */

function updateDashboardTotals() {

  const totals = calculateTotals();


  incomeTotal.textContent =
    formatMoney(totals.income);


  expenseTotal.textContent =
    formatMoney(totals.expenses);


  savingsTotal.textContent =
    formatMoney(totals.savings);


  totalBalance.textContent =
    formatMoney(totals.balance);


  updateSmartInsight(totals);

}


/* =========================================================
   8. SMART INSIGHT
========================================================= */

function updateSmartInsight(totals) {

  const insightHeading =
    document.querySelector(".insight-content h3");

  const insightParagraph =
    document.querySelector(".insight-content > p");

  const progressFill =
    document.querySelector(".progress-fill");

  const progressPercentage =
    document.querySelector(".progress-labels strong");


  if (!insightHeading ||
      !insightParagraph ||
      !progressFill ||
      !progressPercentage) {

    return;

  }


  /*
    Savings rate
  */

  let savingsRate = 0;

  if (totals.income > 0) {

    savingsRate =
      (totals.savings / totals.income) * 100;

  }


  const roundedRate =
    Math.max(0, Math.round(savingsRate));


  /*
    Keep progress between 0 and 100.
  */

  const progress =
    Math.min(100, Math.max(0, roundedRate));


  progressFill.style.width = `${progress}%`;

  progressPercentage.textContent = `${progress}%`;

  /*
    Smart message
  */

  if (savingsRate >= 20) {

    insightHeading.textContent =
      "You're building strong savings momentum.";

    insightParagraph.innerHTML =
      `You've saved <strong>${roundedRate}%</strong> of your income this month. Keep protecting that progress.`;

  }

  else if (savingsRate >= 15) {

    insightHeading.textContent =
      "Your spending is looking healthy.";

    insightParagraph.innerHTML =
      `You've saved <strong>${roundedRate}%</strong> of your income this month. That's above your current monthly target of 15%.`;

  }

  else if (savingsRate > 0) {

    insightHeading.textContent =
      "There's room to grow your savings.";

    insightParagraph.innerHTML =
      `You're currently saving <strong>${roundedRate}%</strong> of your income. Try reducing one flexible expense this month.`;

  }

  else {

    insightHeading.textContent =
      "Let's get your savings moving.";

    insightParagraph.innerHTML =
      "Your current expenses are higher than your recorded income. Review your recent transactions and identify opportunities to save.";

  }

}


/* =========================================================
   9. OPEN TRANSACTION MODAL
========================================================= */

function openTransactionModal() {

  transactionModal.classList.add("active");

  document.body.style.overflow = "hidden";

  setTimeout(() => {

    const nameInput =
      document.getElementById("transactionName");

    if (nameInput) {

      nameInput.focus();

    }

  }, 100);

}


/* =========================================================
   10. CLOSE TRANSACTION MODAL
========================================================= */

function closeTransactionWindow() {

  transactionModal.classList.remove("active");

  document.body.style.overflow = "";

}


/* =========================================================
   11. OPEN GOAL MODAL
========================================================= */

function openGoalModal() {

  goalModal.classList.add("active");

  document.body.style.overflow = "hidden";

  setTimeout(() => {

    const goalInput =
      document.getElementById("goalName");

    if (goalInput) {

      goalInput.focus();

    }

  }, 100);

}


/* =========================================================
   12. CLOSE GOAL MODAL
========================================================= */

function closeGoalWindow() {

  goalModal.classList.remove("active");

  document.body.style.overflow = "";

}


/* =========================================================
   13. ADD TRANSACTION
========================================================= */

function addTransaction(event) {

  event.preventDefault();

  const name =
    document
      .getElementById("transactionName")
      .value
      .trim();

  const type =
    document
      .getElementById("transactionType")
      .value;

  const amount =
    Number(
      document
        .getElementById("transactionAmount")
        .value
    );

  const category =
    document
      .getElementById("transactionCategory")
      .value;

  if (!name || !amount || amount <= 0) {
    alert("Please enter a valid transaction.");
    return;
  }

  const now = new Date();
  const time = now.toLocaleTimeString("en-KE", {
    hour: "2-digit",
    minute: "2-digit"
  });

  const newTransaction = {
    id: Date.now(),
    name,
    type,
    amount,
    category,
    date: `Today · ${time}`
  };

  transactions.unshift(newTransaction);
  saveData();
  renderTransactions();
  updateDashboardTotals();
  updateChart();
  transactionForm.reset();
  closeTransactionWindow();

  showToast(
    type === "income"
      ? "Income added successfully."
      : "Expense added successfully."
  );

}


/* =========================================================
   14. RENDER TRANSACTIONS
========================================================= */

function renderTransactions() {

  if (!transactionList) {
    return;
  }


  transactionList.innerHTML = "";


  /*
    Show the latest six transactions.
  */

  const visibleTransactions =
    transactions.slice(0, 6);


  visibleTransactions.forEach(transaction => {

    const item =
      document.createElement("div");

    item.className =
      "transaction-item";


    const icon =
      getTransactionIcon(
        transaction.category,
        transaction.type
      );


    const iconClass =
      getTransactionIconClass(
        transaction.category,
        transaction.type
      );


    const amountPrefix =
      transaction.type === "income"
        ? "+"
        : "-";


    item.innerHTML = `

      <div class="transaction-icon ${iconClass}">
        ${icon}
      </div>

      <div class="transaction-details">

        <strong>
          ${escapeHTML(transaction.name)}
        </strong>

        <span>
          ${escapeHTML(transaction.date)}
        </span>

      </div>

      <div class="transaction-amount ${transaction.type}">
        ${amountPrefix} KSh ${formatMoney(transaction.amount)}
      </div>

    `;


    transactionList.appendChild(item);

  });

}


/* =========================================================
   15. TRANSACTION ICON
========================================================= */

function getTransactionIcon(category, type) {

  if (type === "income") {

    return "↗️";

  }


  const icons = {

    "Shopping": "🛍️",

    "Food & Dining": "☕",

    "Transport": "⌁",

    "Housing": "⌂",

    "Lifestyle": "✦",

    "Other": "•"

  };


  return icons[category] || "•";

}


/* =========================================================
   16. TRANSACTION ICON CLASS
========================================================= */

function getTransactionIconClass(category, type) {

  if (type === "income") {

    return "salary";

  }


  const classes = {

    "Shopping": "shopping",

    "Food & Dining": "food",

    "Transport": "transport",

    "Housing": "housing",

    "Lifestyle": "lifestyle",

    "Other": "other"

  };


  return classes[category] || "other";

}


/* =========================================================
   17. ESCAPE HTML
========================================================= */

function escapeHTML(value) {

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


/* =========================================================
   18. CREATE SAVINGS GOAL
========================================================= */

function createGoal(event) {

  event.preventDefault();

  const name =
    document
      .getElementById("goalName")
      .value
      .trim();

  const target =
    Number(
      document
        .getElementById("goalTarget")
        .value
    );

  if (!name || !target || target <= 0) {
    alert("Please enter a valid goal.");
    return;
  }

  const newGoal = {
    id: Date.now(),
    name,
    current: 0,
    target
  };

  goals.push(newGoal);
  saveData();
  renderGoals();
  goalForm.reset();
  closeGoalWindow();

  showToast(`${name} goal created successfully.`);
}


/* =========================================================
   19. RENDER GOALS
========================================================= */

function renderGoals() {

  const goalsGrid =
    document.querySelector(".goals-grid");


  if (!goalsGrid) {
    return;
  }


  /*
    Keep the original image card and
    add-goal card at the end.
  */

  const imageCard =
    document.querySelector(".image-goal-card");

  const addCard =
    document.querySelector(".add-goal-card");


  /*
    Remove dynamically created goal cards.
  */

  document
    .querySelectorAll(".dynamic-goal-card")
    .forEach(card => card.remove());


  goals.forEach(goal => {

    const card =
      document.createElement("article");


    card.className =
      "goal-card dynamic-goal-card";


    const percentage =
      Math.min(
        100,
        Math.round(
          (goal.current / goal.target) * 100
        )
      );


    card.innerHTML = `

      <div class="goal-card-top">

        <div class="goal-icon emergency">
          ✦
        </div>

        <button
          class="more-button delete-goal"
          type="button"
          data-id="${goal.id}"
          aria-label="Delete goal"
        >
          ×
        </button>

      </div>

      <h3>
        ${escapeHTML(goal.name)}
      </h3>

      <p>
        A personal savings milestone created in FINOVA.
      </p>

      <div class="goal-money">

        <strong>
          KSh ${formatMoney(goal.current)}
        </strong>

        <span>
          of KSh ${formatMoney(goal.target)}
        </span>

      </div>

      <div class="goal-progress">

        <div style="width: ${percentage}%;"></div>

      </div>

      <div class="goal-footer">

        <span>
          ${percentage}% complete
        </span>

        <strong>
          Goal
        </strong>

      </div>

    `;


    /*
      Insert before the image card.
    */

    if (imageCard) {

      goalsGrid.insertBefore(
        card,
        imageCard
      );

    } else if (addCard) {

      goalsGrid.insertBefore(
        card,
        addCard
      );

    } else {

      goalsGrid.appendChild(card);

    }

  });


  /*
    Delete goal buttons
  */

  document
    .querySelectorAll(".delete-goal")
    .forEach(button => {

      button.addEventListener(
        "click",
        deleteGoal
      );

    });

}


/* =========================================================
   20. DELETE GOAL
========================================================= */

function deleteGoal(event) {

  const id =
    Number(
      event.currentTarget.dataset.id
    );


  const confirmed =
    confirm(
      "Delete this savings goal?"
    );


  if (!confirmed) {
    return;
  }


  goals =
    goals.filter(
      goal => goal.id !== id
    );


  saveData();

  renderGoals();


  showToast(
    "Savings goal removed."
  );

}


/* =========================================================
   21. DARK MODE
========================================================= */

function toggleTheme() {

  document.body.classList.toggle(
    "dark-mode"
  );


  const darkMode =
    document.body.classList.contains(
      "dark-mode"
    );


  localStorage.setItem(
    "finovaDarkMode",
    darkMode
  );


  themeToggle.textContent =
    darkMode ? "☀️" : "◐";


  themeToggle.setAttribute(
    "aria-label",
    darkMode
      ? "Switch to light mode"
      : "Switch to dark mode"
  );

}


/* =========================================================
   22. LOAD SAVED THEME
========================================================= */

function loadTheme() {

  const darkMode =
    localStorage.getItem(
      "finovaDarkMode"
    );


  if (darkMode === "true") {

    document.body.classList.add(
      "dark-mode"
    );

    themeToggle.textContent =
      "☀️";

    themeToggle.setAttribute(
      "aria-label",
      "Switch to light mode"
    );

  }

}


/* =========================================================
   23. MOBILE SIDEBAR
========================================================= */

function toggleSidebar() {

  sidebar.classList.toggle(
    "open"
  );

}


/* =========================================================
   24. CLOSE MOBILE SIDEBAR
========================================================= */

function closeSidebar() {

  sidebar.classList.remove(
    "open"
  );

}


/* =========================================================
   25. CLOSE MODALS WHEN CLICKING OUTSIDE
========================================================= */

function closeModalOnOutsideClick(event) {

  if (
    event.target ===
    transactionModal
  ) {

    closeTransactionWindow();

  }


  if (
    event.target ===
    goalModal
  ) {

    closeGoalWindow();

  }

}


/* =========================================================
   26. ESCAPE KEY
========================================================= */

function handleEscapeKey(event) {

  if (event.key !== "Escape") {
    return;
  }


  closeTransactionWindow();

  closeGoalWindow();

  closeSidebar();

}


/* =========================================================
   27. INTERACTIVE PERIOD SELECT
========================================================= */

function handlePeriodChange() {

  const selectedPeriod = periodSelect.value;

  updateChart(selectedPeriod);

  showToast(`Showing ${getPeriodLabel(selectedPeriod)} spending.`);
}


/* =========================================================
   28. PERIOD LABEL
========================================================= */

function getPeriodLabel(period) {

  const labels = {

    month: "this month",

    week: "this week",

    year: "this year"

  };


  return labels[period] || "this month";

}


/* =========================================================
   29. UPDATE CHART
========================================================= */

function updateChart(period = "month") {

  const bars = document.querySelectorAll(".bar");

  if (!bars.length) {
    return;
  }

  const chartData = {
    month: [48, 66, 38, 78, 56, 31, 44],
    week: [35, 58, 72, 46, 65, 39, 53],
    year: [52, 70, 45, 82, 61, 48, 68]
  };

  const values = chartData[period] || chartData.month;

  bars.forEach((bar, index) => {
    bar.style.height = `${values[index]}%`;
  });
}


/* =========================================================
   30. NOTIFICATION
========================================================= */

function handleNotifications() {

  showToast(
    "You have 3 new financial updates."
  );

}


/* =========================================================
   31. TOAST NOTIFICATION
========================================================= */

function showToast(message) {

  /*
    Remove an existing toast.
  */

  const existingToast =
    document.querySelector(
      ".finova-toast"
    );


  if (existingToast) {

    existingToast.remove();

  }


  const toast =
    document.createElement("div");


  toast.className =
    "finova-toast";


  toast.innerHTML = `

    <span class="toast-icon">
      ✓
    </span>

    <span>
      ${escapeHTML(message)}
    </span>

  `;


  document.body.appendChild(toast);


  /*
    Small inline styling so the
    notification works immediately.
  */

  Object.assign(
    toast.style,
    {
      position: "fixed",
      bottom: "24px",
      right: "24px",
      zIndex: "5000",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "13px 16px",
      background: "#0f172a",
      color: "#ffffff",
      borderRadius: "12px",
      boxShadow: "0 15px 40px rgba(15,23,42,0.2)",
      fontSize: "12px",
      fontWeight: "600",
      transform: "translateY(20px)",
      opacity: "0",
      transition: "0.25s ease"
    }
  );


  const icon =
    toast.querySelector(
      ".toast-icon"
    );


  if (icon) {

    Object.assign(
      icon.style,
      {
        width: "22px",
        height: "22px",
        borderRadius: "50%",
        display: "grid",
        placeItems: "center",
        background: "#14b8a6",
        color: "#ffffff",
        fontSize: "11px"
      }
    );

  }


  requestAnimationFrame(() => {

    toast.style.transform =
      "translateY(0)";

    toast.style.opacity =
      "1";

  });


  setTimeout(() => {

    toast.style.transform =
      "translateY(20px)";

    toast.style.opacity =
      "0";


    setTimeout(() => {

      toast.remove();

    }, 250);

  }, 2800);

}


/* =========================================================
   32. NAVIGATION ACTIVE STATE
========================================================= */

function setupNavigation() {

  const navLinks =
    document.querySelectorAll(
      ".nav-link"
    );


  navLinks.forEach(link => {

    link.addEventListener(
      "click",
      () => {

        navLinks.forEach(
          item =>
            item.classList.remove(
              "active"
            )
        );


        if (
          link.closest(".main-nav")
        ) {

          link.classList.add(
            "active"
          );

        }


        closeSidebar();

      }
    );

  });

}


/* =========================================================
   33. BUTTON FOR IMAGE GOAL
========================================================= */

function setupImageGoalButton() {

  if (!imageGoalButton) {
    return;
  }


  imageGoalButton.addEventListener(
    "click",
    openGoalModal
  );

}


/* =========================================================
   34. ADD GOAL CARD BUTTON
========================================================= */

function setupAddGoalCard() {

  if (!addGoalCard) {
    return;
  }


  addGoalCard.addEventListener(
    "click",
    event => {

      /*
        Don't trigger twice if the
        button itself was clicked.
      */

      if (
        event.target.closest("button")
      ) {

        return;

      }


      openGoalModal();

    }
  );


  const createButton =
    addGoalCard.querySelector(
      ".outline-button"
    );


  if (createButton) {

    createButton.addEventListener(
      "click",
      openGoalModal
    );

  }

}


/* =========================================================
   35. KEYBOARD ACCESSIBILITY
========================================================= */

function setupKeyboardSupport() {

  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Enter" &&
        document.activeElement &&
        document.activeElement.classList.contains(
          "add-goal-card"
        )
      ) {

        openGoalModal();

      }

    }
  );

}


/* =========================================================
   36. INITIALIZE APPLICATION
========================================================= */

function initializeFinova() {

  /*
    Make sure the default data exists.
  */

  saveData();


  /*
    Render dynamic content.
  */

  renderTransactions();

  renderGoals();

  updateDashboardTotals();

  updateChart();


  /*
    Load theme preference.
  */

  loadTheme();


  /*
    Navigation.
  */

  setupNavigation();


  /*
    Additional interactions.
  */

  setupImageGoalButton();

  setupAddGoalCard();

  setupKeyboardSupport();

}


/* =========================================================
   37. EVENT LISTENERS
========================================================= */


/* Add transaction */

if (addTransactionButton) {

  addTransactionButton.addEventListener(
    "click",
    openTransactionModal
  );

}


/* Close transaction modal */

if (closeTransactionModal) {

  closeTransactionModal.addEventListener(
    "click",
    closeTransactionWindow
  );

}


/* Close goal modal */

if (closeGoalModal) {

  closeGoalModal.addEventListener(
    "click",
    closeGoalWindow
  );

}


/* Transaction form */

if (transactionForm) {

  transactionForm.addEventListener(
    "submit",
    addTransaction
  );

}


/* Goal form */

if (goalForm) {

  goalForm.addEventListener(
    "submit",
    createGoal
  );

}


/* Outside modal click */

document.addEventListener(
  "click",
  closeModalOnOutsideClick
);


/* Escape key */

document.addEventListener(
  "keydown",
  handleEscapeKey
);


/* Mobile menu */

if (menuButton) {

  menuButton.addEventListener(
    "click",
    toggleSidebar
  );

}


/* Theme */

if (themeToggle) {

  themeToggle.addEventListener(
    "click",
    toggleTheme
  );

}


/* Period selector */

if (periodSelect) {

  periodSelect.addEventListener(
    "change",
    handlePeriodChange
  );

}


/* Notifications */

if (notificationButton) {

  notificationButton.addEventListener(
    "click",
    handleNotifications
  );

}


/* =========================================================
   38. START FINOVA
========================================================= */

initializeFinova();


/* =========================================================
   FINOVA IS READY 🚀
========================================================= */
