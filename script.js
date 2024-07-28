const tips = document.querySelector(".tips-container");
const bill = document.querySelector(".bill-input");
const peopleCount = document.querySelector(".people-count-input");
const customTip = document.querySelector(".custom-tip");
let resetBtn = document.querySelector(".reset");
const mainDocument = document.querySelector("main");
const buttons = document.querySelectorAll(".percent-btn");

const billTracker = {
  bill: 0,
  tip: 0,
  people: 0,
};

resetBtn.disabled = true;

const setErrorMsg = (input, message) => {
  const errorMsg = input.closest(".header").querySelector(".error-msg");
  input.classList.remove("success-border");
  input.classList.add("error-border");
  errorMsg.textContent = message;
};

const confirmSuccess = (input) => {
  input.classList.add("success-border");
  input.classList.remove("error-border");
  input.closest(".header").querySelector(".error-msg").textContent = "";
};

const addToLocalStorage = () => {
  localStorage.setItem("bill", JSON.stringify(billTracker));
};

const validate = (input) => {
  // Validate inputs for correct values - bill, custom, people
  const inputValue = input.value.trim();
  if (inputValue === "") {
    setErrorMsg(input, "Can't be blank");
  } else if (isNaN(inputValue)) {
    setErrorMsg(input, "Must be a number");
  } else if (Number(inputValue) < 1) {
    setErrorMsg(input, "Can't be zero");
  } else {
    confirmSuccess(input);
    return inputValue;
  }
};

const getBillInput = () => {
  const billInput = validate(bill);
  billTracker.bill = Number(billInput);
  addToLocalStorage();
  getBillTracker();
};

const getPeopleInput = () => {
  const peopleInput = validate(peopleCount);
  billTracker.people = Number(peopleInput);
  addToLocalStorage();
  getBillTracker();
};

const getCustomTip = () => {
  const customInput = validate(customTip);
  billTracker.tip = Number(customInput);
  addToLocalStorage();
  getBillTracker();
};

const getTip = (e) => {
  e.preventDefault();
  // clear custom input
  customTip.value = "";
  customTip.classList.remove("success-border");
  customTip.classList.remove("error-border");
  customTip.closest(".header").querySelector(".error-msg").textContent = "";
  // get percent button value
  let tipPercent = e.target;
  buttons.forEach((button) => button.classList.remove("active"));
  if (tipPercent.className.includes("percent-btn")) {
    tipPercent.classList.add("active");
  }
  billTracker.tip = Number(tipPercent.dataset.percent);
  addToLocalStorage();
  getBillTracker();
};

const getBillTracker = () => {
  if (
    billTracker.bill === 0 ||
    billTracker.tip === 0 ||
    billTracker.people === 0
  ) {
    return;
  } else {
    resetBtn.disabled = false;
    resetBtn.classList.add("active-btn");
    calculateBill();
  }
};

const calculateBill = () => {
  const totalBill = JSON.parse(localStorage.getItem("bill"));

  const tipPerPerson =
    (totalBill.bill * (totalBill.tip / 100)) / totalBill.people;

  const costPerPerson =
    (totalBill.bill + (totalBill.tip / 100) * totalBill.bill) /
    totalBill.people;

  if (
    totalBill.bill === null ||
    totalBill.tip === null ||
    totalBill.people === null
  ) {
    return;
  } else {
    document.querySelector(
      ".tip-amount"
    ).textContent = `$${tipPerPerson.toFixed(2)}`;
    document.querySelector(
      ".total-per-person"
    ).textContent = `$${costPerPerson.toFixed(2)}`;
  }
};

const resetBill = () => {
  billTracker.bill = 0;
  billTracker.tip = 0;
  billTracker.people = 0;
  addToLocalStorage();
  bill.value = "";
  bill.classList.remove("success-border");
  customTip.value = "";
  customTip.classList.remove("success-border");
  peopleCount.value = "";
  peopleCount.classList.remove("success-border");
  resetBtn.disabled = true;
  resetBtn.classList.remove("active-btn");
  buttons.forEach((button) => button.classList.remove("active"));
  document.querySelector(".tip-amount").textContent = "$0.00";
  document.querySelector(".total-per-person").textContent = "$0.00";
  JSON.parse(localStorage.getItem("bill"));
};

// event listeners
bill.addEventListener("input", getBillInput);
peopleCount.addEventListener("input", getPeopleInput);
customTip.addEventListener("input", getCustomTip);
tips.addEventListener("click", getTip);
resetBtn.addEventListener("click", resetBill);
