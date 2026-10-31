// smoke-test.js — Calls every API endpoint the frontend uses, per role, and reports pass/fail
// Run from /backend with the server running:  npm run smoke
// Side effect: creates ONE test appointment and cancels it.
const BASE = process.env.API_URL || "http://localhost:5000/api";
const results = [];

async function call(name, method, path, { token, body, ok = [200, 201] } = {}) {
  try {
    const res = await fetch(BASE + path, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    let data = null;
    try {
      data = await res.json();
    } catch {
      /* no body */
    }
    const pass = ok.includes(res.status);
    results.push({
      test: name,
      result: pass ? "PASS" : "FAIL",
      status: res.status,
      note: pass ? "" : String(data?.error || data?.message || "").slice(0, 80),
    });
    return { status: res.status, data };
  } catch (err) {
    results.push({
      test: name,
      result: "FAIL",
      status: "ERR",
      note: err.message,
    });
    return { status: 0, data: null };
  }
}

async function login(email, password, role) {
  const { data } = await call(`login ${role}`, "POST", "/auth/login", {
    body: { email, password, role },
  });
  return data?.token;
}

function nextWeekday() {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

async function run() {
  console.log(`\nSmoke testing ${BASE}\n`);

  await call("health", "GET", "/health".replace("/health", "/health"), {
    ok: [200],
  });

  // ── Login ────────────────────────────────────────────
  const admin = await login("admin@kidusyared.et", "Admin@2025", "admin");
  const doctor = await login(
    "abebe.bekele@kidusyared.et",
    "Doctor@2025",
    "doctor",
  );
  const patient = await login(
    "selam.tesfaye@gmail.com",
    "Patient@2025",
    "patient",
  );
  if (!admin || !doctor || !patient) {
    console.table(results);
    console.log("\nCannot continue: a login failed. Re-run the seed.");
    process.exit(1);
  }

  await call("auth/me (patient)", "GET", "/auth/me", { token: patient });
  await call("login wrong password rejected", "POST", "/auth/login", {
    body: { email: "admin@kidusyared.et", password: "wrong", role: "admin" },
    ok: [400, 401],
  });
  await call("no token rejected", "GET", "/appointments", { ok: [401] });
  await call("patient blocked from admin route", "GET", "/admin/users", {
    token: patient,
    ok: [403],
  });

  // ── Auth endpoints the frontend expects ──────────────
  await call("forgot-password exists", "POST", "/auth/forgot-password", {
    body: { email: "selam.tesfaye@gmail.com" },
    ok: [200],
  });
  await call("reset-password exists", "PATCH", "/auth/reset-password", {
    body: { token: "invalid", newPassword: "Abc12345" },
    ok: [400],
  });
  await call("change-password exists", "PATCH", "/auth/change-password", {
    token: patient,
    body: { currentPassword: "wrong", newPassword: "Abc12345" },
    ok: [400, 401],
  });

  // ── Doctors ──────────────────────────────────────────
  const docs = await call("doctors list", "GET", "/doctors", {
    token: patient,
  });
  const list = Array.isArray(docs.data) ? docs.data : docs.data?.doctors || [];
  const doctorId = list[0]?._id;
  await call(
    "doctors specializations",
    "GET",
    "/doctors/specializations/list",
    { token: patient },
  );
  if (doctorId)
    await call("doctor detail", "GET", `/doctors/${doctorId}`, {
      token: patient,
    });
  await call("search doctors", "GET", "/search/doctors?q=a", {
    token: patient,
  });
  await call("global search", "GET", "/search?q=ab", { token: admin });

  // ── Schedule + booking flow ──────────────────────────
  const date = nextWeekday();
  if (doctorId) {
    await call("schedule get", "GET", `/schedules/${doctorId}`, {
      token: patient,
    });
    const slots = await call(
      "available slots",
      "GET",
      `/schedules/${doctorId}/available?date=${date}`,
      { token: patient },
    );
    const time = slots.data?.availableSlots?.[0];
    if (time) {
      const created = await call(
        "create appointment",
        "POST",
        "/appointments",
        {
          token: patient,
          body: {
            doctorId,
            date,
            time,
            type: "consultation",
            visitMode: "in-person",
            symptoms: "Smoke test",
            priority: "normal",
          },
        },
      );
      const aptId = created.data?._id || created.data?.appointment?._id;
      if (aptId) {
        await call("appointment detail", "GET", `/appointments/${aptId}`, {
          token: patient,
        });
        await call("double booking blocked", "POST", "/appointments", {
          token: patient,
          body: {
            doctorId,
            date,
            time,
            type: "consultation",
            visitMode: "in-person",
          },
          ok: [400, 409],
        });
        await call(
          "admin confirms appointment",
          "PATCH",
          `/appointments/${aptId}/status`,
          {
            token: admin,
            body: { status: "confirmed" },
          },
        );
        await call(
          "patient cancels appointment",
          "PATCH",
          `/appointments/${aptId}/status`,
          {
            token: patient,
            body: { status: "cancelled", cancellationNote: "smoke test" },
          },
        );
      }
    } else {
      results.push({
        test: "available slots returned a slot",
        result: "FAIL",
        status: 200,
        note: "no availableSlots in response",
      });
    }
  }
  await call("appointments (patient)", "GET", "/appointments", {
    token: patient,
  });
  await call("appointments (doctor)", "GET", "/appointments", {
    token: doctor,
  });
  await call("appointments (admin)", "GET", "/appointments", { token: admin });

  // ── Payments ─────────────────────────────────────────
  await call("payments list (admin)", "GET", "/payments", { token: admin });
  await call(
    "payment instructions",
    "GET",
    "/payments/instructions/telebirr?amount=500",
    { token: patient },
  );

  // ── Notifications ────────────────────────────────────
  await call("notifications", "GET", "/notifications", { token: patient });
  await call("unread count", "GET", "/notifications/unread-count", {
    token: patient,
  });
  await call("mark all read", "PATCH", "/notifications/read-all", {
    token: patient,
  });

  // ── Reviews, records, departments, patients ──────────
  await call("my reviews", "GET", "/reviews/my", { token: patient });
  if (doctorId)
    await call("doctor reviews", "GET", `/reviews/doctor/${doctorId}`, {
      token: patient,
    });
  await call("reviews moderation list", "GET", "/reviews", { token: admin });
  await call("medical records (patient)", "GET", "/medical-records", {
    token: patient,
  });
  await call("medical records (doctor)", "GET", "/medical-records", {
    token: doctor,
  });
  await call("departments", "GET", "/departments", { token: patient });
  await call("patient profile", "GET", "/patients/profile", { token: patient });
  await call("patients list (admin)", "GET", "/patients", { token: admin });

  // ── Admin + reports + settings ───────────────────────
  await call("admin users", "GET", "/admin/users", { token: admin });
  await call("audit logs", "GET", "/admin/audit-logs", { token: admin });
  await call("system stats", "GET", "/admin/system-stats", { token: admin });
  for (const r of [
    "dashboard",
    "today",
    "top-doctors",
    "monthly-revenue",
    "appointments-status",
    "payment-methods",
    "appointments",
    "revenue",
    "doctors",
    "patients",
  ]) {
    await call(`report ${r}`, "GET", `/reports/${r}`, { token: admin });
  }
  await call("clinic settings", "GET", "/clinic-settings", { token: admin });
  await call("payment accounts", "GET", "/clinic-settings/payment-accounts", {
    token: admin,
  });
  await call("holidays", "GET", "/holidays", { token: patient });
  await call("holiday check", "GET", `/holidays/check?date=${date}`, {
    token: patient,
  });

  await call("logout exists", "POST", "/auth/logout", {
    token: patient,
    ok: [200],
  });

  console.table(results);
  const failed = results.filter((r) => r.result === "FAIL");
  console.log(
    `\n${results.length - failed.length}/${results.length} passed, ${failed.length} failed\n`,
  );
  process.exit(failed.length ? 1 : 0);
}

run();
