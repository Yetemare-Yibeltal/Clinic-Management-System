// chapa.config.js — Chapa sandbox test credentials and Ethiopian payment test data
// Use these during development — no real money is charged in sandbox mode
// Replace with real credentials when going to production

export const CHAPA_TEST_CONFIG = {
  // ── Chapa sandbox base URL ─────────────────────────
  baseUrl: 'https://api.chapa.co/v1',

  // ── Test card numbers ──────────────────────────────
  // Use these on the Chapa checkout page during testing
  testCards: [
    {
      type: 'Visa (Success)',
      number: '4200000000000000',
      expiry: '12/30',
      cvv: '123',
      name: 'Test User',
      description: 'Always succeeds in sandbox mode',
    },
    {
      type: 'Visa (Decline)',
      number: '4000000000000002',
      expiry: '12/30',
      cvv: '123',
      name: 'Test User',
      description: 'Always declines in sandbox mode',
    },
    {
      type: 'Mastercard (Success)',
      number: '5200000000000007',
      expiry: '12/30',
      cvv: '123',
      name: 'Test User',
      description: 'Always succeeds in sandbox mode',
    },
  ],

  // ── Test TeleBirr credentials ──────────────────────
  // Use these when testing TeleBirr payment on Chapa checkout
  testTeleBirr: {
    phoneNumber: '0911223344',
    otp: '123456',
    description: 'Use this phone and OTP on Chapa TeleBirr test page',
  },

  // ── Test CBE Birr credentials ──────────────────────
  testCBEBirr: {
    accountNumber: '1000123456789',
    pin: '1234',
    description: 'Use this account and PIN on Chapa CBE Birr test page',
  },

  // ── Test Awash Birr credentials ────────────────────
  testAwashBirr: {
    phoneNumber: '0911223344',
    pin: '1234',
    description: 'Use this phone and PIN on Chapa Awash Birr test page',
  },

  // ── Test HelloCash credentials ─────────────────────
  testHelloCash: {
    phoneNumber: '0911223344',
    pin: '1234',
    description: 'Use this phone and PIN on Chapa HelloCash test page',
  },

  // ── Test patient data ──────────────────────────────
  // Use this data when testing payment initialization
  testPatient: {
    firstName:   'Selam',
    lastName:    'Tesfaye',
    email:       'selam.tesfaye@test.et',
    phoneNumber: '+251911223344',
  },

  // ── Test amounts in Ethiopian Birr ────────────────
  testAmounts: {
    minimum:     10,    // 10 ETB minimum Chapa allows
    consultation:500,   // Standard Kidus Yared consultation fee
    specialist:  800,   // Specialist doctor fee
    emergency:   1000,  // Emergency consultation fee
  },

  // ── Webhook test payload ───────────────────────────
  // Use this to simulate a Chapa webhook call in Postman
  testWebhookPayload: {
    event:   'charge.success',
    tx_ref:  'KY-TEST-1234567890-ABC123',
    status:  'success',
    ref_id:  'CHAPA-TEST-REF-001',
    type:    'API',
    currency:'ETB',
    amount:  '500',
    charge:  '15',
    email:   'selam.tesfaye@test.et',
  },
}

// ── Payment method display config ─────────────────────
// Used by frontend to show payment method options
// with correct labels, icons and descriptions
export const PAYMENT_METHODS_CONFIG = [
  {
    id:          'chapa',
    label:       'Pay Online (Chapa)',
    description: 'Pay securely online using TeleBirr, CBE Birr, Awash Birr, HelloCash or Card',
    icon:        'credit-card',
    isOnline:    true,
    isManual:    false,
    subMethods: [
      { id: 'telebirr',   label: 'TeleBirr'   },
      { id: 'cbe_birr',   label: 'CBE Birr'   },
      { id: 'awash',      label: 'Awash Birr'  },
      { id: 'hellocash',  label: 'HelloCash'   },
      { id: 'card',       label: 'Visa/Mastercard' },
    ],
  },
  {
    id:          'telebirr',
    label:       'TeleBirr (Manual)',
    description: 'Send payment manually via TeleBirr and submit your transaction ID',
    icon:        'smartphone',
    isOnline:    false,
    isManual:    true,
    accountInfo: {
      number: '0911223344',
      name:   'Kidus Yared Healthcare',
    },
  },
  {
    id:          'cbe-birr',
    label:       'CBE Birr (Manual)',
    description: 'Send payment manually via CBE Birr and submit your transaction ID',
    icon:        'smartphone',
    isOnline:    false,
    isManual:    true,
    accountInfo: {
      number: '1000123456789',
      name:   'Kidus Yared Healthcare',
    },
  },
  {
    id:          'awash-birr',
    label:       'Awash Birr (Manual)',
    description: 'Send payment manually via Awash Birr and submit your transaction ID',
    icon:        'smartphone',
    isOnline:    false,
    isManual:    true,
    accountInfo: {
      number: '01234567890',
      name:   'Kidus Yared Healthcare',
    },
  },
  {
    id:          'hellocash',
    label:       'HelloCash (Manual)',
    description: 'Send payment manually via HelloCash and submit your transaction ID',
    icon:        'smartphone',
    isOnline:    false,
    isManual:    true,
    accountInfo: {
      number: '0911223344',
      name:   'Kidus Yared Healthcare',
    },
  },
  {
    id:          'mobile-banking',
    label:       'Mobile Banking',
    description: 'Transfer via CBE, Awash, Abyssinia, Dashen or any Ethiopian bank app',
    icon:        'building',
    isOnline:    false,
    isManual:    true,
    banks: [
      { name: 'Commercial Bank of Ethiopia (CBE)', account: '1000123456789' },
      { name: 'Awash Bank',                        account: '01234567890'   },
      { name: 'Abyssinia Bank',                    account: '66234567890'   },
      { name: 'Dashen Bank',                       account: '77234567890'   },
      { name: 'Bank of Abyssinia',                 account: '88234567890'   },
    ],
  },
  {
    id:          'bank-transfer',
    label:       'Direct Bank Transfer',
    description: 'Transfer directly to Kidus Yared Healthcare bank account',
    icon:        'building',
    isOnline:    false,
    isManual:    true,
    accountInfo: {
      bankName:      'Commercial Bank of Ethiopia',
      accountNumber: '1000123456789',
      accountName:   'Kidus Yared Healthcare',
      branchName:    'Addis Ababa Main Branch',
      swiftCode:     'CBETETAA',
    },
  },
  {
    id:          'cash',
    label:       'Cash at Clinic',
    description: 'Pay in cash at Kidus Yared Healthcare reception desk',
    icon:        'banknotes',
    isOnline:    false,
    isManual:    true,
    locationInfo: {
      address:      'Addis Ababa, Ethiopia',
      workingHours: 'Monday - Saturday: 8:00 AM - 5:00 PM',
    },
  },
]