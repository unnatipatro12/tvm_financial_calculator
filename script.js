/**
 * script.js — TVM Calculator Application
 * BS3210: Finance for Engineers, Designers and Professionals
 * MIT Vishwaprayag University, Solapur
 *
 * All financial calculations are performed in full precision.
 * Values are only rounded when displayed to the user.
 */

"use strict";

/* ============================================================
   NAVIGATION
   ============================================================ */
function showCalculator(id) {
  document.querySelectorAll(".calculator").forEach(el => el.classList.remove("active"));
  document.querySelectorAll("nav button").forEach(el => el.classList.remove("active"));
  const target = document.getElementById(id);
  if (target) target.classList.add("active");
  const btn = document.querySelector(`nav button[data-target="${id}"]`);
  if (btn) btn.classList.add("active");
}

document.addEventListener("DOMContentLoaded", () => {
  // Wire up nav buttons
  document.querySelectorAll("nav button[data-target]").forEach(btn => {
    btn.addEventListener("click", () => showCalculator(btn.dataset.target));
  });
  // Show first calculator by default
  showCalculator("calc-fv");
});

/* ============================================================
   UTILITIES
   ============================================================ */

/** Format number as Indian currency string */
function fmt(n, decimals = 2) {
  if (!isFinite(n)) return "—";
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(n);
}

/** Format as currency with Rs. prefix */
function fmtCur(n) {
  return "Rs. " + fmt(n);
}

/** Get numeric value from input; returns NaN if invalid */
function getNum(id) {
  const val = document.getElementById(id).value.trim();
  if (val === "") return NaN;
  return parseFloat(val);
}

/** Show/hide result card */
function showResult(cardId) {
  document.getElementById(cardId).classList.add("visible");
}
function hideResult(cardId) {
  document.getElementById(cardId).classList.remove("visible");
}

/** Show/hide error alert */
function showError(id, msg) {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.classList.add("visible");
}
function hideError(id) {
  document.getElementById(id).classList.remove("visible");
}

/** Mark input as error */
function markErr(inputId, errId, msg) {
  document.getElementById(inputId).classList.add("error-input");
  const el = document.getElementById(errId);
  if (el) { el.textContent = msg; el.classList.add("visible"); }
}
function clearErr(inputId, errId) {
  document.getElementById(inputId).classList.remove("error-input");
  const el = document.getElementById(errId);
  if (el) el.classList.remove("visible");
}

/** Clear all field errors for a form */
function clearAllErrors(ids) {
  ids.forEach(([inputId, errId]) => clearErr(inputId, errId));
}

/** Reset an input field */
function resetField(id) {
  document.getElementById(id).value = "";
  document.getElementById(id).classList.remove("error-input");
}

/* ============================================================
   1. FUTURE VALUE CALCULATOR
   FV = P * (1 + r)^n
   ============================================================ */
function calcFV() {
  const fields = [
    ["fv-principal", "fv-err-principal"],
    ["fv-rate",      "fv-err-rate"],
    ["fv-time",      "fv-err-time"]
  ];
  clearAllErrors(fields);
  hideError("fv-alert");
  hideResult("fv-result");

  const P = getNum("fv-principal");
  const r = getNum("fv-rate");
  const n = getNum("fv-time");

  let valid = true;
  if (isNaN(P) || P <= 0)  { markErr("fv-principal","fv-err-principal","Enter a valid positive principal amount."); valid = false; }
  if (isNaN(r) || r < 0)   { markErr("fv-rate","fv-err-rate","Enter a valid interest rate (>= 0)."); valid = false; }
  if (r > 100)              { markErr("fv-rate","fv-err-rate","Interest rate seems too high (> 100%)."); valid = false; }
  if (isNaN(n) || n <= 0)  { markErr("fv-time","fv-err-time","Enter a valid time period (> 0 years)."); valid = false; }
  if (n > 100)              { markErr("fv-time","fv-err-time","Time period seems too long (> 100 years)."); valid = false; }
  if (!valid) return;

  const rate = r / 100;
  const FV = P * Math.pow(1 + rate, n);
  const interest = FV - P;

  document.getElementById("fv-out-fv").textContent       = fmtCur(FV);
  document.getElementById("fv-out-principal").textContent = fmtCur(P);
  document.getElementById("fv-out-interest").textContent  = fmtCur(interest);
  showResult("fv-result");
}

function resetFV() {
  ["fv-principal","fv-rate","fv-time"].forEach(resetField);
  ["fv-err-principal","fv-err-rate","fv-err-time"].forEach(id => {
    const el = document.getElementById(id); if(el) el.classList.remove("visible");
  });
  hideError("fv-alert");
  hideResult("fv-result");
}

/* ============================================================
   2. PRESENT VALUE CALCULATOR
   PV = FV / (1 + r)^n
   ============================================================ */
function calcPV() {
  const fields = [
    ["pv-fv",   "pv-err-fv"],
    ["pv-rate", "pv-err-rate"],
    ["pv-time", "pv-err-time"]
  ];
  clearAllErrors(fields);
  hideResult("pv-result");

  const FV = getNum("pv-fv");
  const r  = getNum("pv-rate");
  const n  = getNum("pv-time");

  let valid = true;
  if (isNaN(FV) || FV <= 0)  { markErr("pv-fv","pv-err-fv","Enter a valid positive future value."); valid = false; }
  if (isNaN(r)  || r < 0)    { markErr("pv-rate","pv-err-rate","Enter a valid discount rate (>= 0)."); valid = false; }
  if (r > 100)                { markErr("pv-rate","pv-err-rate","Discount rate seems too high (> 100%)."); valid = false; }
  if (isNaN(n)  || n <= 0)   { markErr("pv-time","pv-err-time","Enter a valid time period (> 0 years)."); valid = false; }
  if (n > 100)                { markErr("pv-time","pv-err-time","Time period seems too long (> 100 years)."); valid = false; }
  if (!valid) return;

  const rate = r / 100;
  const PV = FV / Math.pow(1 + rate, n);
  const discount = FV - PV;

  document.getElementById("pv-out-pv").textContent       = fmtCur(PV);
  document.getElementById("pv-out-fv").textContent       = fmtCur(FV);
  document.getElementById("pv-out-discount").textContent = fmtCur(discount);
  showResult("pv-result");
}

function resetPV() {
  ["pv-fv","pv-rate","pv-time"].forEach(resetField);
  ["pv-err-fv","pv-err-rate","pv-err-time"].forEach(id => {
    const el = document.getElementById(id); if(el) el.classList.remove("visible");
  });
  hideResult("pv-result");
}

/* ============================================================
   3. SIMPLE INTEREST CALCULATOR
   SI = P * r * t
   Maturity = P + SI
   ============================================================ */
function calcSI() {
  const fields = [
    ["si-principal","si-err-principal"],
    ["si-rate",     "si-err-rate"],
    ["si-time",     "si-err-time"]
  ];
  clearAllErrors(fields);
  hideResult("si-result");

  const P = getNum("si-principal");
  const r = getNum("si-rate");
  const t = getNum("si-time");

  let valid = true;
  if (isNaN(P) || P <= 0)  { markErr("si-principal","si-err-principal","Enter a valid positive principal."); valid = false; }
  if (isNaN(r) || r < 0)   { markErr("si-rate","si-err-rate","Enter a valid interest rate (>= 0)."); valid = false; }
  if (r > 100)              { markErr("si-rate","si-err-rate","Interest rate too high (> 100%)."); valid = false; }
  if (isNaN(t) || t <= 0)  { markErr("si-time","si-err-time","Enter a valid time period (> 0 years)."); valid = false; }
  if (t > 100)              { markErr("si-time","si-err-time","Time period too long (> 100 years)."); valid = false; }
  if (!valid) return;

  const SI = P * (r / 100) * t;
  const maturity = P + SI;

  document.getElementById("si-out-si").textContent       = fmtCur(SI);
  document.getElementById("si-out-maturity").textContent = fmtCur(maturity);
  document.getElementById("si-out-principal").textContent= fmtCur(P);
  showResult("si-result");
}

function resetSI() {
  ["si-principal","si-rate","si-time"].forEach(resetField);
  ["si-err-principal","si-err-rate","si-err-time"].forEach(id => {
    const el = document.getElementById(id); if(el) el.classList.remove("visible");
  });
  hideResult("si-result");
}

/* ============================================================
   4. COMPOUND INTEREST CALCULATOR
   A = P * (1 + r/n)^(n*t)
   CI = A - P
   ============================================================ */
function calcCI() {
  const fields = [
    ["ci-principal","ci-err-principal"],
    ["ci-rate",     "ci-err-rate"],
    ["ci-time",     "ci-err-time"],
    ["ci-freq",     "ci-err-freq"]
  ];
  clearAllErrors(fields);
  hideResult("ci-result");

  const P = getNum("ci-principal");
  const r = getNum("ci-rate");
  const t = getNum("ci-time");
  const n = getNum("ci-freq");

  let valid = true;
  if (isNaN(P) || P <= 0)  { markErr("ci-principal","ci-err-principal","Enter a valid positive principal."); valid = false; }
  if (isNaN(r) || r < 0)   { markErr("ci-rate","ci-err-rate","Enter a valid interest rate (>= 0)."); valid = false; }
  if (r > 100)              { markErr("ci-rate","ci-err-rate","Interest rate too high (> 100%)."); valid = false; }
  if (isNaN(t) || t <= 0)  { markErr("ci-time","ci-err-time","Enter a valid time period (> 0 years)."); valid = false; }
  if (t > 100)              { markErr("ci-time","ci-err-time","Time period too long (> 100 years)."); valid = false; }
  if (isNaN(n) || n <= 0 || !Number.isInteger(n)) { markErr("ci-freq","ci-err-freq","Select a valid compounding frequency."); valid = false; }
  if (!valid) return;

  const A  = P * Math.pow(1 + (r / 100) / n, n * t);
  const CI = A - P;

  document.getElementById("ci-out-ci").textContent       = fmtCur(CI);
  document.getElementById("ci-out-maturity").textContent = fmtCur(A);
  document.getElementById("ci-out-principal").textContent= fmtCur(P);
  showResult("ci-result");
}

function resetCI() {
  ["ci-principal","ci-rate","ci-time"].forEach(resetField);
  document.getElementById("ci-freq").value = "12";
  ["ci-err-principal","ci-err-rate","ci-err-time","ci-err-freq"].forEach(id => {
    const el = document.getElementById(id); if(el) el.classList.remove("visible");
  });
  hideResult("ci-result");
}

/* ============================================================
   5. EMI CALCULATOR
   EMI = [P * r * (1 + r)^n] / [(1 + r)^n - 1]
   r = monthly rate = annual rate / 12 / 100
   n = tenure in months
   ============================================================ */
function calcEMI() {
  const fields = [
    ["emi-loan",   "emi-err-loan"],
    ["emi-rate",   "emi-err-rate"],
    ["emi-tenure", "emi-err-tenure"]
  ];
  clearAllErrors(fields);
  hideResult("emi-result");

  const P      = getNum("emi-loan");
  const annR   = getNum("emi-rate");
  const tenure = getNum("emi-tenure");

  let valid = true;
  if (isNaN(P)      || P <= 0)      { markErr("emi-loan","emi-err-loan","Enter a valid positive loan amount."); valid = false; }
  if (isNaN(annR)   || annR <= 0)   { markErr("emi-rate","emi-err-rate","Enter a valid interest rate (> 0)."); valid = false; }
  if (annR > 100)                   { markErr("emi-rate","emi-err-rate","Interest rate too high (> 100%)."); valid = false; }
  if (isNaN(tenure) || tenure <= 0) { markErr("emi-tenure","emi-err-tenure","Enter a valid loan tenure (> 0 months)."); valid = false; }
  if (tenure > 600)                 { markErr("emi-tenure","emi-err-tenure","Tenure too long (> 600 months / 50 years)."); valid = false; }
  if (!valid) return;

  const r = annR / 12 / 100;  // monthly interest rate
  const n = Math.round(tenure); // months

  let EMI;
  if (r === 0) {
    // zero interest edge case
    EMI = P / n;
  } else {
    const factor = Math.pow(1 + r, n);
    EMI = (P * r * factor) / (factor - 1);
  }

  const totalPayment = EMI * n;
  const totalInterest = totalPayment - P;

  document.getElementById("emi-out-emi").textContent       = fmtCur(EMI);
  document.getElementById("emi-out-total").textContent     = fmtCur(totalPayment);
  document.getElementById("emi-out-interest").textContent  = fmtCur(totalInterest);
  document.getElementById("emi-out-principal").textContent = fmtCur(P);
  showResult("emi-result");
}

function resetEMI() {
  ["emi-loan","emi-rate","emi-tenure"].forEach(resetField);
  ["emi-err-loan","emi-err-rate","emi-err-tenure"].forEach(id => {
    const el = document.getElementById(id); if(el) el.classList.remove("visible");
  });
  hideResult("emi-result");
}

/* ============================================================
   6. LOAN AMORTIZATION SCHEDULE
   Same EMI formula; build month-by-month table.
   Opening + Interest - Principal Repaid = Closing
   Final closing balance forced to exactly 0.
   ============================================================ */
function calcAmort() {
  const fields = [
    ["amort-loan",   "amort-err-loan"],
    ["amort-rate",   "amort-err-rate"],
    ["amort-tenure", "amort-err-tenure"]
  ];
  clearAllErrors(fields);
  document.getElementById("amort-table-wrap").classList.remove("visible");

  const P      = getNum("amort-loan");
  const annR   = getNum("amort-rate");
  const tenure = getNum("amort-tenure");

  let valid = true;
  if (isNaN(P)      || P <= 0)      { markErr("amort-loan","amort-err-loan","Enter a valid positive loan amount."); valid = false; }
  if (isNaN(annR)   || annR <= 0)   { markErr("amort-rate","amort-err-rate","Enter a valid interest rate (> 0)."); valid = false; }
  if (annR > 100)                   { markErr("amort-rate","amort-err-rate","Interest rate too high (> 100%)."); valid = false; }
  if (isNaN(tenure) || tenure <= 0) { markErr("amort-tenure","amort-err-tenure","Enter a valid tenure (> 0 months)."); valid = false; }
  if (tenure > 600)                 { markErr("amort-tenure","amort-err-tenure","Tenure too long (> 600 months)."); valid = false; }
  if (!valid) return;

  const r = annR / 12 / 100;
  const n = Math.round(tenure);

  let EMI;
  if (r === 0) { EMI = P / n; }
  else {
    const factor = Math.pow(1 + r, n);
    EMI = (P * r * factor) / (factor - 1);
  }

  const totalPayment  = EMI * n;
  const totalInterest = totalPayment - P;

  // Summary row
  document.getElementById("amort-sum-emi").textContent       = fmtCur(EMI);
  document.getElementById("amort-sum-total").textContent     = fmtCur(totalPayment);
  document.getElementById("amort-sum-interest").textContent  = fmtCur(totalInterest);

  // Build table
  const tbody = document.getElementById("amort-tbody");
  const tfoot = document.getElementById("amort-tfoot");
  tbody.innerHTML = "";

  let balance = P;
  let cumInterest   = 0;
  let cumPrincipal  = 0;
  let cumEMI        = 0;

  for (let month = 1; month <= n; month++) {
    const openingBalance = balance;
    let interest = openingBalance * r;
    let principal;
    let closingBalance;
    let rowEMI = EMI;

    if (month === n) {
      // Final month: principal is whatever remains, adjust EMI
      principal       = openingBalance;
      interest        = openingBalance * r;
      rowEMI          = principal + interest;
      closingBalance  = 0;
    } else {
      principal      = EMI - interest;
      closingBalance = openingBalance - principal;
      // guard against floating-point drift
      if (closingBalance < 0) closingBalance = 0;
    }

    cumInterest  += interest;
    cumPrincipal += principal;
    cumEMI       += rowEMI;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${month}</td>
      <td>${fmtCur(openingBalance)}</td>
      <td>${fmtCur(interest)}</td>
      <td>${fmtCur(principal)}</td>
      <td>${fmtCur(rowEMI)}</td>
      <td>${fmtCur(closingBalance)}</td>
    `;
    tbody.appendChild(tr);

    balance = closingBalance;
  }

  // Totals footer
  tfoot.innerHTML = `
    <tr>
      <td>Total</td>
      <td>—</td>
      <td>${fmtCur(cumInterest)}</td>
      <td>${fmtCur(cumPrincipal)}</td>
      <td>${fmtCur(cumEMI)}</td>
      <td>0.00</td>
    </tr>
  `;

  document.getElementById("amort-table-wrap").classList.add("visible");
}

function resetAmort() {
  ["amort-loan","amort-rate","amort-tenure"].forEach(resetField);
  ["amort-err-loan","amort-err-rate","amort-err-tenure"].forEach(id => {
    const el = document.getElementById(id); if(el) el.classList.remove("visible");
  });
  document.getElementById("amort-table-wrap").classList.remove("visible");
  document.getElementById("amort-tbody").innerHTML = "";
  document.getElementById("amort-tfoot").innerHTML = "";
}

/* ============================================================
   7. SCENARIO ANALYSIS
   Compare FV, PV, EMI, Total Interest at 8%, 10%, 12%, 15%
   Uses user-provided principal/loan, time, etc.
   ============================================================ */
const SCENARIO_RATES = [8, 10, 12, 15];

function calcScenario() {
  const fields = [
    ["sc-principal",  "sc-err-principal"],
    ["sc-fvtime",     "sc-err-fvtime"],
    ["sc-loan",       "sc-err-loan"],
    ["sc-tenure",     "sc-err-tenure"]
  ];
  clearAllErrors(fields);
  document.getElementById("scenario-table-wrap").classList.remove("visible");

  const P       = getNum("sc-principal");
  const fvTime  = getNum("sc-fvtime");
  const loan    = getNum("sc-loan");
  const tenure  = getNum("sc-tenure");

  let valid = true;
  if (isNaN(P)      || P <= 0)      { markErr("sc-principal","sc-err-principal","Enter a valid investment/principal amount."); valid = false; }
  if (isNaN(fvTime) || fvTime <= 0) { markErr("sc-fvtime","sc-err-fvtime","Enter a valid investment period (years)."); valid = false; }
  if (fvTime > 100)                 { markErr("sc-fvtime","sc-err-fvtime","Period too long (> 100 years)."); valid = false; }
  if (isNaN(loan)   || loan <= 0)   { markErr("sc-loan","sc-err-loan","Enter a valid loan amount."); valid = false; }
  if (isNaN(tenure) || tenure <= 0) { markErr("sc-tenure","sc-err-tenure","Enter a valid tenure (months)."); valid = false; }
  if (tenure > 600)                 { markErr("sc-tenure","sc-err-tenure","Tenure too long (> 600 months)."); valid = false; }
  if (!valid) return;

  const tbody = document.getElementById("scenario-tbody");
  tbody.innerHTML = "";

  // Collect values to find best/worst
  const rows = SCENARIO_RATES.map(pct => {
    const rate = pct / 100;
    // Future Value (annual compounding)
    const FV = P * Math.pow(1 + rate, fvTime);
    // Present Value of FV (discounted back)
    const PV = FV / Math.pow(1 + rate, fvTime); // = P (for sanity check; use loan PV)
    // Loan PV (what loan is worth at this rate) — we show PV of loan amount at same rate & time
    const loanPV = loan / Math.pow(1 + rate, fvTime / 12 * 12); // loan PV over tenure years
    // EMI
    const r = pct / 12 / 100;
    const n = Math.round(tenure);
    const factor = Math.pow(1 + r, n);
    const EMI = (loan * r * factor) / (factor - 1);
    const totalPmt = EMI * n;
    const totalInt = totalPmt - loan;

    return { pct, FV, EMI, totalPmt, totalInt };
  });

  // Find best/worst for each metric
  const maxFV   = Math.max(...rows.map(r => r.FV));
  const minFV   = Math.min(...rows.map(r => r.FV));
  const minEMI  = Math.min(...rows.map(r => r.EMI));
  const maxEMI  = Math.max(...rows.map(r => r.EMI));
  const minInt  = Math.min(...rows.map(r => r.totalInt));
  const maxInt  = Math.max(...rows.map(r => r.totalInt));

  rows.forEach(row => {
    const fvClass  = row.FV === maxFV  ? "best" : (row.FV === minFV ? "worst" : "");
    const emiClass = row.EMI === minEMI ? "best" : (row.EMI === maxEMI ? "worst" : "");
    const intClass = row.totalInt === minInt ? "best" : (row.totalInt === maxInt ? "worst" : "");

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><span class="rate-badge">${row.pct}%</span></td>
      <td class="${fvClass}">${fmtCur(row.FV)}</td>
      <td class="${emiClass}">${fmtCur(row.EMI)}</td>
      <td>${fmtCur(row.totalPmt)}</td>
      <td class="${intClass}">${fmtCur(row.totalInt)}</td>
    `;
    tbody.appendChild(tr);
  });

  document.getElementById("scenario-table-wrap").classList.add("visible");
}

function resetScenario() {
  ["sc-principal","sc-fvtime","sc-loan","sc-tenure"].forEach(resetField);
  ["sc-err-principal","sc-err-fvtime","sc-err-loan","sc-err-tenure"].forEach(id => {
    const el = document.getElementById(id); if(el) el.classList.remove("visible");
  });
  document.getElementById("scenario-table-wrap").classList.remove("visible");
  document.getElementById("scenario-tbody").innerHTML = "";
}
