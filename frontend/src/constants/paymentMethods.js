// paymentMethods.js — Ethiopian payment method constants
export const PAYMENT_METHODS = [
  {
    id: "chapa",
    label: "Pay Online (Chapa)",
    description:
      "Pay securely online via TeleBirr, CBE Birr, Awash Birr, HelloCash or Card",
    icon: "💳",
    isOnline: true,
    isManual: false,
    color: "blue",
  },
  {
    id: "telebirr",
    label: "TeleBirr",
    description: "Send payment via TeleBirr and submit your transaction ID",
    icon: "📱",
    isOnline: false,
    isManual: true,
    color: "green",
    accountInfo: {
      number: "0911000001",
      name: "Kidus Yared Healthcare",
    },
  },
  {
    id: "cbe-birr",
    label: "CBE Birr",
    description: "Send payment via CBE Birr and submit your transaction ID",
    icon: "🏦",
    isOnline: false,
    isManual: true,
    color: "blue",
    accountInfo: {
      number: "1000000000001",
      name: "Kidus Yared Healthcare",
    },
  },
  {
    id: "awash-birr",
    label: "Awash Birr",
    description: "Send payment via Awash Birr and submit your transaction ID",
    icon: "📱",
    isOnline: false,
    isManual: true,
    color: "orange",
    accountInfo: {
      number: "0100000000001",
      name: "Kidus Yared Healthcare",
    },
  },
  {
    id: "hellocash",
    label: "HelloCash",
    description: "Send payment via HelloCash and submit your transaction ID",
    icon: "💰",
    isOnline: false,
    isManual: true,
    color: "yellow",
    accountInfo: {
      number: "0911000001",
      name: "Kidus Yared Healthcare",
    },
  },
  {
    id: "mobile-banking",
    label: "Mobile Banking",
    description:
      "Transfer via CBE, Awash, Abyssinia, Dashen or any Ethiopian bank app",
    icon: "🏧",
    isOnline: false,
    isManual: true,
    color: "indigo",
  },
  {
    id: "bank-transfer",
    label: "Bank Transfer",
    description: "Direct bank transfer to Kidus Yared Healthcare account",
    icon: "🏦",
    isOnline: false,
    isManual: true,
    color: "slate",
    accountInfo: {
      bankName: "Commercial Bank of Ethiopia",
      accountNumber: "1000000000001",
      accountName: "Kidus Yared Healthcare",
      branchName: "Addis Ababa Main Branch",
    },
  },
  {
    id: "cash",
    label: "Cash at Clinic",
    description: "Pay in cash at Kidus Yared Healthcare reception desk",
    icon: "💵",
    isOnline: false,
    isManual: true,
    color: "green",
    locationInfo: {
      address: "Addis Ababa, Ethiopia",
      workingHours: "Monday - Saturday: 8:00 AM - 5:00 PM",
    },
  },
];

export const PAYMENT_METHOD_MAP = Object.fromEntries(
  PAYMENT_METHODS.map((m) => [m.id, m]),
);

export const getPaymentMethodLabel = (id) =>
  PAYMENT_METHOD_MAP[id]?.label || id;

export const getPaymentMethodIcon = (id) =>
  PAYMENT_METHOD_MAP[id]?.icon || "💳";
