// chapa.service.js — Real Chapa API integration for Kidus Yared Healthcare
// API docs: https://developer.chapa.co
import crypto from "crypto";
import { ENV } from "../config/env.js";

const CHAPA_BASE_URL = "https://api.chapa.co/v1";

// ── Core HTTP helper ──────────────────────────────────
async function chapaRequest(endpoint, method = "GET", body = null) {
  const options = {
    method,
    headers: {
      Authorization: `Bearer ${ENV.CHAPA_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${CHAPA_BASE_URL}${endpoint}`, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `Chapa API error: ${response.status}`);
  }

  return data;
}

// ── Initialize Payment ────────────────────────────────
// Called when patient clicks "Pay Now" on the appointment booking page
// Returns a checkout_url to redirect the patient to Chapa's payment page
// Chapa will handle TeleBirr, CBE Birr, Awash Birr, HelloCash, Card internally
export async function initializePayment({
  txRef,
  amount,
  currency = "ETB",
  email,
  firstName,
  lastName,
  phone,
  callbackUrl,
  returnUrl,
  description,
}) {
  const payload = {
    tx_ref: txRef,
    amount: String(amount),
    currency,
    email,
    first_name: firstName,
    last_name: lastName,
    phone_number: phone,
    callback_url: callbackUrl,
    return_url: returnUrl,
    description: description || "Kidus Yared Healthcare Appointment Payment",
    customization: {
      title: "Kidus Yared Healthcare",
      description: "Appointment consultation fee",
      logo: "https://kidusyared.et/logo.png", // update with real logo URL
    },
  };

  const response = await chapaRequest(
    "/transaction/initialize",
    "POST",
    payload,
  );

  return {
    checkoutUrl: response.data?.checkout_url,
    txRef,
    status: response.status,
    message: response.message,
  };
}

// ── Verify Payment ─────────────────────────────────────
// Called after patient is redirected back from Chapa
// or when webhook fires — verifies the payment actually succeeded
export async function verifyPayment(txRef) {
  const response = await chapaRequest(`/transaction/verify/${txRef}`);

  const data = response.data || {};

  return {
    txRef: data.tx_ref,
    status: data.status, // 'success' | 'failed' | 'pending'
    amount: data.amount,
    currency: data.currency,
    email: data.email,
    firstName: data.first_name,
    lastName: data.last_name,
    phone: data.phone_number,
    paymentMethod: data.payment_method, // e.g. 'telebirr', 'cbe_birr', 'card'
    chargeId: data.charge_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    fullResponse: response,
  };
}

// ── Verify Webhook Signature ───────────────────────────
// Chapa sends a webhook when payment is complete
// We must verify the signature to confirm it really came from Chapa
// Header: x-chapa-signature contains HMAC-SHA256 of the payload
export function verifyWebhookSignature(rawBody, chapaSignature) {
  if (!ENV.CHAPA_WEBHOOK_SECRET) {
    console.warn(
      "CHAPA_WEBHOOK_SECRET not set — skipping webhook verification",
    );
    return true; // allow in development if secret not set
  }

  if (!chapaSignature) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac("sha256", ENV.CHAPA_WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");

  // Use timingSafeEqual to prevent timing attacks
  try {
    const sigBuffer = Buffer.from(chapaSignature, "hex");
    const expectedBuffer = Buffer.from(expectedSignature, "hex");

    if (sigBuffer.length !== expectedBuffer.length) return false;

    return crypto.timingSafeEqual(sigBuffer, expectedBuffer);
  } catch {
    return false;
  }
}

// ── Get List of Banks ─────────────────────────────────
// Returns all Ethiopian banks available for transfer via Chapa
// Used to show bank list on the payment page
export async function getBanks() {
  const response = await chapaRequest("/banks");
  return response.data || [];
}

// ── Get Supported Payment Channels ────────────────────
// Returns what Chapa currently supports (TeleBirr, CBE Birr, etc.)
export async function getPaymentChannels() {
  const response = await chapaRequest("/payment-channels");
  return response.data || [];
}
