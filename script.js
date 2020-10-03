const creditText = document.getElementById("creditText");
const creditRange = document.getElementById("creditRange");
const firstPaymentText = document.getElementById("firstPaymentText");
const firstPaymentRange = document.getElementById("firstPaymentRange");
const creditTermText = document.getElementById("creditTermText");
const creditTermRange = document.getElementById("creditTermRange");
let result = document.getElementById("result");
let rate = document.getElementById("interestRateText");
const common = document.getElementById("common");
const subpayment = document.getElementById("subpayment");

const formatterNumber = new Intl.NumberFormat("ru");

const formatterCurrency = new Intl.NumberFormat("ru", {
  style: "currency",
  currency: "BYN",
  minimumFractionDigits: 0,
});

const formatterDate = {
  format(years) {
    years = parseInt(years);

    if (years < 5 && years >= 2) {
      return (this.value = `${years} года `);
    }

    if (years > 4) {
      return (this.value = `${years} лет `);
    }

    if (years == 1) {
      return (this.value = `${years} год `);
    }
  },
};

const CREDIT_MIN = 0;
const CREDIT_MAX = 15000000;

const FIRSTPAYMENT_MIN = 0;
const FIRSTPAYMENT_MAX = 15000000;

const CREDITTERM_MAX = 20;
const CREDITTERM_MIN = 0;

setElementDependencies(
  creditText,
  creditRange,
  formatterNumber,
  formatterCurrency,
  CREDIT_MIN,
  CREDIT_MAX
);

setElementDependencies(
  firstPaymentText,
  firstPaymentRange,
  formatterNumber,
  formatterCurrency,
  FIRSTPAYMENT_MIN,
  FIRSTPAYMENT_MAX
);

setElementDependencies(
  creditTermText,
  creditTermRange,
  formatterNumber,
  formatterDate,
  CREDITTERM_MIN,
  CREDITTERM_MAX
);

setReaction(
  creditText,
  creditRange,
  firstPaymentText,
  firstPaymentRange,
  creditTermText,
  creditTermRange,
  function () {
    const credit = parseInt(creditRange.value);
    const firstPayment = parseInt(firstPaymentRange.value);
    const creditTerm = parseInt(creditTermRange.value);

    let percent = 10 + Math.log(creditTerm) / Math.log(0.5);
    percent = parseInt(percent * 100 + 1) / 100;
    rate.value = `${percent} %`;

    let commonDebit = ((credit - firstPayment) * (1 + percent)) ^ creditTerm;
    common.textContent = formatterCurrency.format(commonDebit);

    let payment = commonDebit - (credit - firstPayment);
    subpayment.textContent = formatterCurrency.format(payment);

    const pay = payment / (creditTerm + 12);
    result.textContent = formatterCurrency.format(pay);
  }
);

function setElementDependencies(
  textElement,
  textRange,
  formatterNumber,
  formatterGoal,
  min,
  max
) {
  textElement.addEventListener("input", inputHandler);

  function inputHandler(event) {
    let number = "";

    for (const letter of this.value) {
      if ("0123456789".includes(letter)) {
        number += letter;
      }
    }
    number = parseInt(number);

    if (number < min) {
      number = min;
    }

    if (number > max) {
      number = max;
    }

    this.value = formatterNumber.format(number);
    textRange.value = number;
  }

  textElement.addEventListener("blur", function (event) {
    let number = "";

    for (const letter of this.value) {
      if ("0123456789".includes(letter)) {
        number += letter;
      }
    }
    number = parseInt(number);
    this.value = formatterGoal.format(number);
  });

  textRange.addEventListener("input", function (event) {
    textElement.value = formatterGoal.format(parseInt(this.value));
  });
}

function setReaction(...args) {
  const handler = args.splice(-1)[0];

  for (const element of args) {
    element.addEventListener("input", function () {
      handler.call(this, args.slice());
    });
  }
}
