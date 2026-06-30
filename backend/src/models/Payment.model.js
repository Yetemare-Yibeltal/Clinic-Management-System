// Payment.model.js — Complete payment transaction record for Kidus Yared Healthcare
// Covers: Chapa (TeleBirr, CBE Birr, Awash Birr, HelloCash, Card), Cash, Bank Transfer
import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    // ── Core references ───────────────────────────────
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ── Amount ────────────────────────────────────────
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "ETB", // Ethiopian Birr
    },

    // ── Payment method ────────────────────────────────
    // 'chapa'         → patient pays online via Chapa checkout page
    //                   (Chapa internally handles TeleBirr, CBE Birr,
    //                    Awash Birr, HelloCash, Visa, Mastercard)
    // 'telebirr'      → patient sends TeleBirr manually, admin confirms
    // 'cbe-birr'      → patient sends CBE Birr manually, admin confirms
    // 'awash-birr'    → patient sends Awash Birr manually, admin confirms
    // 'hellocash'     → patient sends HelloCash manually, admin confirms
    // 'mobile-banking'→ patient uses CBE/Awash/Abyssinia/Dashen app, admin confirms
    // 'cash'          → patient pays at clinic in person, admin confirms
    // 'bank-transfer' → patient transfers to clinic bank account, admin confirms
    method: {
      type: String,
      enum: [
        "chapa",
        "telebirr",
        "cbe-birr",
        "awash-birr",
        "hellocash",
        "mobile-banking",
        "cash",
        "bank-transfer",
      ],
      required: true,
    },

    // ── Overall payment status ────────────────────────
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded", "cancelled"],
      default: "pending",
    },

    // ── CHAPA SPECIFIC FIELDS ─────────────────────────
    // Only filled when method === 'chapa'
    // These match exactly what Chapa API sends/receives

    // tx_ref: unique reference we generate before calling Chapa
    // Format: KY-{appointmentId}-{timestamp}
    chapaTxRef: {
      type: String,
      unique: true,
      sparse: true, // allows null for non-chapa payments
    },

    // checkout_url: URL we redirect patient to for payment
    // Returned by POST /v1/transaction/initialize
    chapaCheckoutUrl: {
      type: String,
    },

    // Fields returned by Chapa after successful payment
    // (from webhook or verify endpoint)
    chapaPaymentRef: { type: String }, // ref from Chapa after payment
    chapaStatus: { type: String }, // 'success' | 'failed' | 'pending'
    chapaChannel: { type: String }, // 'telebirr' | 'cbe_birr' | 'awash' | 'card' etc

    // Full response from Chapa verify endpoint stored for audit
    chapaVerifyResponse: {
      type: mongoose.Schema.Types.Mixed,
    },

    // Webhook payload from Chapa stored for audit + duplicate prevention
    chapaWebhookPayload: {
      type: mongoose.Schema.Types.Mixed,
    },

    // Chapa webhook signature for verification
    chapaWebhookSignature: { type: String },

    // Whether webhook was received and verified
    webhookReceived: { type: Boolean, default: false },
    webhookVerified: { type: Boolean, default: false },

    // Timestamps for Chapa flow
    chapaInitiatedAt: { type: Date },
    chapaCompletedAt: { type: Date },

    // ── MANUAL PAYMENT FIELDS ─────────────────────────
    // Used for: telebirr manual, cbe-birr manual, awash-birr manual,
    //           hellocash manual, mobile-banking, cash, bank-transfer

    // Transaction ID the patient provides as proof of payment
    // e.g. TeleBirr transaction ID, bank reference number
    manualTransactionId: { type: String },

    // Screenshot or receipt uploaded by patient (file path)
    manualReceiptPath: { type: String },

    // Note from patient about payment
    // e.g. "Paid via TeleBirr to 0911223344"
    manualNote: { type: String },

    // Admin who confirmed the manual payment
    confirmedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    confirmedAt: { type: Date },

    // Reason if admin rejected manual payment proof
    rejectionReason: { type: String },

    // ── MANUAL PAYMENT INSTRUCTIONS ───────────────────
    // Kidus Yared Healthcare payment account details
    // Shown to patient after they choose a manual method

    // TeleBirr account: clinic's TeleBirr number
    teleBirrAccount: {
      type: String,
      default: "0911223344", // Replace with real clinic TeleBirr number
    },

    // CBE Birr account: clinic's CBE Birr number
    cbeBirrAccount: {
      type: String,
      default: "1000123456789", // Replace with real clinic CBE account
    },

    // Awash Birr account
    awashBirrAccount: {
      type: String,
      default: "01234567890", // Replace with real clinic Awash account
    },

    // HelloCash account
    helloCashAccount: {
      type: String,
      default: "0911223344", // Replace with real clinic HelloCash number
    },

    // Bank transfer details for Kidus Yared Healthcare
    bankDetails: {
      bankName: { type: String, default: "Commercial Bank of Ethiopia" },
      accountName: { type: String, default: "Kidus Yared Healthcare" },
      accountNumber: { type: String, default: "1000123456789" }, // Replace with real
      branchName: { type: String, default: "Addis Ababa Main Branch" },
    },

    // ── Refund fields ─────────────────────────────────
    refundedAmount: { type: Number, default: 0 },
    refundReason: { type: String },
    refundedAt: { type: Date },
    refundedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // ── Audit trail ───────────────────────────────────
    ipAddress: { type: String }, // patient's IP when payment was initiated
    userAgent: { type: String }, // patient's browser/device
    notes: { type: String }, // any admin notes about this payment
  },
  {
    timestamps: true, // createdAt, updatedAt
  },
);

// ── Indexes for fast lookups ──────────────────────────
paymentSchema.index({ appointment: 1 });
paymentSchema.index({ patient: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ method: 1 });
paymentSchema.index({ chapaPaymentRef: 1 });
paymentSchema.index({ createdAt: -1 });

// ── Virtual: is this a Chapa online payment? ─────────
paymentSchema.virtual("isChapaPayment").get(function () {
  return this.method === "chapa";
});

// ── Virtual: is this a manual payment? ───────────────
paymentSchema.virtual("isManualPayment").get(function () {
  return this.method !== "chapa";
});

// ── Virtual: is confirmed? ────────────────────────────
paymentSchema.virtual("isConfirmed").get(function () {
  return this.status === "completed";
});

// ── Static: generate unique Chapa tx_ref ─────────────
paymentSchema.statics.generateTxRef = function (appointmentId) {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `KY-${appointmentId}-${timestamp}-${random}`;
};

export default mongoose.model("Payment", paymentSchema);
