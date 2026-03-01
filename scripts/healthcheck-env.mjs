import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const requiredVars = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
];

function readEnv(name) {
  const value = process.env[name]?.trim();
  return value && value.length > 0 ? value : null;
}

function loadDotEnvLocal() {
  const envPath = join(process.cwd(), ".env.local");
  if (!existsSync(envPath)) {
    return;
  }

  const content = readFileSync(envPath, "utf8");
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");
    if (separatorIndex < 1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const rawValue = line.slice(separatorIndex + 1).trim();
    if (!process.env[key]) {
      process.env[key] = rawValue.replace(/^['\"]|['\"]$/g, "");
    }
  }
}

function printStatus(label, passed, details) {
  const icon = passed ? "✅" : "❌";
  console.log(`${icon} ${label}${details ? ` — ${details}` : ""}`);
}

async function run() {
  loadDotEnvLocal();

  console.log("NightTable env healthcheck");
  console.log("-------------------------");

  let hasErrors = false;

  for (const name of requiredVars) {
    const value = readEnv(name);
    const exists = Boolean(value);
    printStatus(`ENV ${name}`, exists, exists ? "présente" : "manquante");
    if (!exists) {
      hasErrors = true;
    }
  }

  const supabaseUrl = readEnv("NEXT_PUBLIC_SUPABASE_URL");
  const anonKey = readEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  const serviceKey = readEnv("SUPABASE_SERVICE_ROLE_KEY");
  const stripeSecret = readEnv("STRIPE_SECRET_KEY");
  const stripePublishable = readEnv("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY");
  const webhookSecret = readEnv("STRIPE_WEBHOOK_SECRET");

  if (stripePublishable) {
    const validFormat = stripePublishable.startsWith("pk_");
    printStatus("Format Stripe publishable key", validFormat, validFormat ? "ok" : "attendu pk_");
    if (!validFormat) hasErrors = true;
  }

  if (webhookSecret) {
    const validFormat = webhookSecret.startsWith("whsec_");
    printStatus("Format Stripe webhook secret", validFormat, validFormat ? "ok" : "attendu whsec_");
    if (!validFormat) hasErrors = true;
  }

  if (supabaseUrl && anonKey) {
    try {
      const anonClient = createClient(supabaseUrl, anonKey);
      const { error } = await anonClient.auth.getSession();
      const passed = !error;
      printStatus("Supabase anon connectivity", passed, passed ? "ok" : error.message);
      if (!passed) hasErrors = true;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur inconnue";
      printStatus("Supabase anon connectivity", false, message);
      hasErrors = true;
    }
  }

  if (supabaseUrl && serviceKey) {
    try {
      const adminClient = createClient(supabaseUrl, serviceKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      });

      const { error } = await adminClient.from("profiles").select("id").limit(1);
      const passed = !error;
      printStatus("Supabase service role query", passed, passed ? "ok" : error.message);
      if (!passed) hasErrors = true;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur inconnue";
      printStatus("Supabase service role query", false, message);
      hasErrors = true;
    }
  }

  if (stripeSecret) {
    try {
      const stripe = new Stripe(stripeSecret, { apiVersion: "2025-02-24.acacia" });
      await stripe.paymentIntents.list({ limit: 1 });
      printStatus("Stripe secret key request", true, "ok");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur inconnue";
      printStatus("Stripe secret key request", false, message);
      hasErrors = true;
    }
  }

  console.log("-------------------------");
  if (hasErrors) {
    console.log("Healthcheck terminé avec erreurs.");
    process.exit(1);
  }

  console.log("Healthcheck terminé sans erreur.");
}

run();
