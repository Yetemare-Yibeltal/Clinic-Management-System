// manual.payment.service.js — Manual Ethiopian payment methods for Kidus Yared Healthcare
// Covers: TeleBirr, CBE Birr, Awash Birr, HelloCash, Mobile Banking, Cash, Bank Transfer

// ── Kidus Yared Healthcare Payment Accounts ───────────
// Update these with real clinic payment details before going live
const CLINIC_PAYMENT_ACCOUNTS = {
  name: "Kidus Yared Healthcare",
  address: "Addis Ababa, Ethiopia",

  telebirr: {
    accountNumber: "0911223344", // Replace with real TeleBirr number
    accountName: "Kidus Yared Healthcare",
    instruction: "Open TeleBirr app → Send Money → Enter number → Enter amount",
  },

  cbeBirr: {
    accountNumber: "1000123456789", // Replace with real CBE Birr number
    accountName: "Kidus Yared Healthcare",
    instruction:
      "Open CBE Birr app → Transfer → Enter account number → Enter amount",
  },

  awashBirr: {
    accountNumber: "01234567890", // Replace with real Awash Birr number
    accountName: "Kidus Yared Healthcare",
    instruction:
      "Open Awash Birr app → Send Money → Enter number → Enter amount",
  },

  helloCash: {
    accountNumber: "0911223344", // Replace with real HelloCash number
    accountName: "Kidus Yared Healthcare",
    instruction: "Open HelloCash app → Send → Enter number → Enter amount",
  },

  mobileBanking: {
    banks: [
      {
        bankName: "Commercial Bank of Ethiopia (CBE)",
        accountNumber: "1000123456789", // Replace with real account
        accountName: "Kidus Yared Healthcare",
        instruction:
          "Login to CBE Mobile Banking → Transfer → Enter account number",
      },
      {
        bankName: "Awash Bank",
        accountNumber: "01234567890", // Replace with real account
        accountName: "Kidus Yared Healthcare",
        instruction: "Login to Awash Mobile → Transfer → Enter account number",
      },
      {
        bankName: "Abyssinia Bank",
        accountNumber: "66234567890", // Replace with real account
        accountName: "Kidus Yared Healthcare",
        instruction:
          "Login to Abyssinia Mobile → Transfer → Enter account number",
      },
      {
        bankName: "Dashen Bank",
        accountNumber: "77234567890", // Replace with real account
        accountName: "Kidus Yared Healthcare",
        instruction: "Login to Dashen Mobile → Transfer → Enter account number",
      },
      {
        bankName: "Bank of Abyssinia",
        accountNumber: "88234567890", // Replace with real account
        accountName: "Kidus Yared Healthcare",
        instruction: "Login to BOA Mobile → Transfer → Enter account number",
      },
    ],
  },

  bankTransfer: {
    bankName: "Commercial Bank of Ethiopia",
    accountNumber: "1000123456789", // Replace with real account
    accountName: "Kidus Yared Healthcare",
    branchName: "Addis Ababa Main Branch",
    swiftCode: "CBETETAA",
    instruction:
      "Visit any CBE branch or use internet banking → Transfer to account",
  },

  cash: {
    location: "Kidus Yared Healthcare Reception",
    address: "Addis Ababa, Ethiopia",
    workingHours: "Monday - Saturday: 8:00 AM - 5:00 PM",
    instruction:
      "Visit the clinic reception desk and pay in cash before your appointment",
  },
};

// ── Get payment instructions for a specific method ────
// Called when patient selects a manual payment method
// Returns the exact instructions and account details to show them
export function getPaymentInstructions(method, amount) {
  const amountFormatted = `${amount.toLocaleString()} ETB`;

  const instructions = {
    telebirr: {
      method: "TeleBirr",
      amount: amountFormatted,
      accountNumber: CLINIC_PAYMENT_ACCOUNTS.telebirr.accountNumber,
      accountName: CLINIC_PAYMENT_ACCOUNTS.telebirr.accountName,
      instruction: CLINIC_PAYMENT_ACCOUNTS.telebirr.instruction,
      steps: [
        "Open your TeleBirr app on your phone",
        `Go to "Send Money"`,
        `Enter the clinic number: ${CLINIC_PAYMENT_ACCOUNTS.telebirr.accountNumber}`,
        `Enter the amount: ${amountFormatted}`,
        "Confirm the payment",
        "Take a screenshot of the confirmation",
        "Upload the screenshot as proof of payment",
      ],
    },

    "cbe-birr": {
      method: "CBE Birr",
      amount: amountFormatted,
      accountNumber: CLINIC_PAYMENT_ACCOUNTS.cbeBirr.accountNumber,
      accountName: CLINIC_PAYMENT_ACCOUNTS.cbeBirr.accountName,
      instruction: CLINIC_PAYMENT_ACCOUNTS.cbeBirr.instruction,
      steps: [
        "Open your CBE Birr app",
        `Go to "Transfer"`,
        `Enter the clinic account: ${CLINIC_PAYMENT_ACCOUNTS.cbeBirr.accountNumber}`,
        `Enter the amount: ${amountFormatted}`,
        "Confirm the transfer",
        "Save the transaction ID",
        "Enter the transaction ID as your payment reference",
      ],
    },

    "awash-birr": {
      method: "Awash Birr",
      amount: amountFormatted,
      accountNumber: CLINIC_PAYMENT_ACCOUNTS.awashBirr.accountNumber,
      accountName: CLINIC_PAYMENT_ACCOUNTS.awashBirr.accountName,
      instruction: CLINIC_PAYMENT_ACCOUNTS.awashBirr.instruction,
      steps: [
        "Open your Awash Birr app",
        `Go to "Send Money"`,
        `Enter the clinic number: ${CLINIC_PAYMENT_ACCOUNTS.awashBirr.accountNumber}`,
        `Enter the amount: ${amountFormatted}`,
        "Confirm the payment",
        "Save the transaction ID",
        "Enter the transaction ID as your payment reference",
      ],
    },

    hellocash: {
      method: "HelloCash",
      amount: amountFormatted,
      accountNumber: CLINIC_PAYMENT_ACCOUNTS.helloCash.accountNumber,
      accountName: CLINIC_PAYMENT_ACCOUNTS.helloCash.accountName,
      instruction: CLINIC_PAYMENT_ACCOUNTS.helloCash.instruction,
      steps: [
        "Open your HelloCash app",
        `Go to "Send"`,
        `Enter the clinic number: ${CLINIC_PAYMENT_ACCOUNTS.helloCash.accountNumber}`,
        `Enter the amount: ${amountFormatted}`,
        "Confirm the payment",
        "Save the transaction ID",
        "Enter the transaction ID as your payment reference",
      ],
    },

    "mobile-banking": {
      method: "Mobile Banking",
      amount: amountFormatted,
      banks: CLINIC_PAYMENT_ACCOUNTS.mobileBanking.banks,
      steps: [
        "Open your bank mobile banking app",
        'Go to "Transfer" or "Send Money"',
        "Select the bank and enter the account number shown above",
        `Enter the amount: ${amountFormatted}`,
        "Use your appointment ID as the transfer reference",
        "Confirm the transfer",
        "Save or screenshot the transaction reference",
        "Enter the reference number as proof of payment",
      ],
    },

    "bank-transfer": {
      method: "Bank Transfer",
      amount: amountFormatted,
      bankName: CLINIC_PAYMENT_ACCOUNTS.bankTransfer.bankName,
      accountNumber: CLINIC_PAYMENT_ACCOUNTS.bankTransfer.accountNumber,
      accountName: CLINIC_PAYMENT_ACCOUNTS.bankTransfer.accountName,
      branchName: CLINIC_PAYMENT_ACCOUNTS.bankTransfer.branchName,
      swiftCode: CLINIC_PAYMENT_ACCOUNTS.bankTransfer.swiftCode,
      steps: [
        "Visit any CBE branch or use CBE internet banking",
        `Transfer to account: ${CLINIC_PAYMENT_ACCOUNTS.bankTransfer.accountNumber}`,
        `Account name: ${CLINIC_PAYMENT_ACCOUNTS.bankTransfer.accountName}`,
        `Enter the amount: ${amountFormatted}`,
        "Use your appointment ID as the transfer description",
        "Keep your transfer receipt",
        "Upload the receipt as proof of payment",
      ],
    },

    cash: {
      method: "Cash Payment",
      amount: amountFormatted,
      location: CLINIC_PAYMENT_ACCOUNTS.cash.location,
      address: CLINIC_PAYMENT_ACCOUNTS.cash.address,
      workingHours: CLINIC_PAYMENT_ACCOUNTS.cash.workingHours,
      steps: [
        "Visit Kidus Yared Healthcare reception desk",
        `Pay ${amountFormatted} in cash`,
        "Ask for an official receipt",
        "Your appointment will be confirmed immediately",
      ],
    },
  };

  return instructions[method] || null;
}

// ── Validate manual payment submission ────────────────
// Checks that the patient provided the required proof fields
export function validateManualPaymentSubmission(method, data) {
  const errors = [];

  if (method === "cash") {
    // Cash just needs admin confirmation, no proof required from patient
    return { valid: true, errors: [] };
  }

  if (!data.manualTransactionId && !data.manualReceiptPath) {
    errors.push(
      "Please provide your transaction ID or upload a receipt as proof of payment",
    );
  }

  if (method === "bank-transfer" && !data.manualTransactionId) {
    errors.push("Please provide your bank transfer reference number");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ── Format payment summary for email/receipt ──────────
// Generates a human-readable payment summary
export function formatPaymentSummary(payment, appointment) {
  const methodLabels = {
    chapa: "Chapa Online Payment",
    telebirr: "TeleBirr",
    "cbe-birr": "CBE Birr",
    "awash-birr": "Awash Birr",
    hellocash: "HelloCash",
    "mobile-banking": "Mobile Banking",
    cash: "Cash",
    "bank-transfer": "Bank Transfer",
  };

  return {
    paymentId: payment._id,
    method: methodLabels[payment.method] || payment.method,
    amount: `${payment.amount.toLocaleString()} ETB`,
    status: payment.status,
    date: payment.createdAt,
    clinic: "Kidus Yared Healthcare",
    patientName: `${appointment.patient?.firstName} ${appointment.patient?.lastName}`,
    doctorName: `${appointment.doctor?.firstName} ${appointment.doctor?.lastName}`,
    appointmentDate: appointment.date,
    appointmentTime: appointment.time,
  };
}
