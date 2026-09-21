# 📈 TVM Calculator — Time Value of Money

> **BS3210: Finance for Engineers, Designers and Professionals**  
> MIT Vishwaprayag University, Solapur — Assignment 1

A fully-featured, browser-based **Time Value of Money (TVM) Calculator** built with pure HTML5, CSS3, and Vanilla JavaScript. No frameworks, no dependencies — just open `index.html` in any modern browser and start calculating.

---

## 🚀 How to Run

Simply clone or download the repository, then open `index.html` directly in your browser. No server setup required.

`ash
git clone https://github.com/KartikMangalpalli/TVM-Calculator.git
cd TVM-Calculator
# Open index.html in your browser
`

---

## 📐 Calculators

The application includes **7 financial calculators**, accessible via a sticky navigation bar:

| # | Calculator | Formula |
|---|---|---|
| 1 | **Future Value** | `FV = P × (1 + r)^n` |
| 2 | **Present Value** | `PV = FV ÷ (1 + r)^n` |
| 3 | **Simple Interest** | `SI = P × r × t` |
| 4 | **Compound Interest** | `A = P × (1 + r/n)^(n×t)` |
| 5 | **EMI Calculator** | `EMI = [P × r × (1+r)^n] ÷ [(1+r)^n − 1]` |
| 6 | **Loan Amortization Schedule** | Month-by-month repayment breakdown |
| 7 | **Scenario Analysis** | Compare metrics across 8%, 10%, 12%, 15% rates |

---

## ✨ Features

- ✅ 7 fully functional TVM calculators in a single-page app
- ✅ Input validation — catches empty, negative, zero, and extreme values
- ✅ Real-time inline error messages per field
- ✅ Reset buttons on every calculator
- ✅ Indian number formatting (en-IN locale)
- ✅ Responsive design — desktop, tablet, and mobile
- ✅ Colour-coded Scenario Analysis (green = best, red = worst)
- ✅ Full amortization table with row-by-row balance tracking
- ✅ Formula display boxes on every calculator for education
- ✅ Sticky navigation bar for instant switching
- ✅ Zero external dependencies — works fully offline

---

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Page structure and semantic markup |
| CSS3 | Styling, responsive layout, CSS custom properties |
| Vanilla JavaScript (ES6+) | Financial logic, DOM manipulation, validation |
| Intl.NumberFormat (en-IN) | Indian number system formatting |

---

## 📂 Project Structure

`
TVM-Calculator/
├── index.html          # Main HTML — all 7 calculator sections + navigation
├── style.css           # Complete stylesheet — theming, layout, responsive
├── script.js           # All financial calculations and UI logic
├── README.md           # Project documentation
├── DEVELOPMENT_LOG.md  # Development history and decisions
├── PROJECT_CONTEXT.md  # Assignment context and formula reference
├── TEST_REPORT.md      # Manual test cases and verified results
└── Assignment 1.pdf    # Original assignment specification
`

---

## ✅ Test Results

All 7 calculators verified against known financial values — all tests PASS.  
See `TEST_REPORT.md` for full details.

---

## 📄 License

Created as an academic assignment for BS3210 at MIT Vishwaprayag University, Solapur.  
All calculations are for **educational purposes only**.

---

*Built with ❤️ using pure HTML, CSS, and JavaScript — no frameworks needed.*
