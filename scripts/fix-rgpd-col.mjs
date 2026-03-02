async function run() {
  // Script intentionally informational: this repo uses migrations for schema changes.
  const projectRef = process.env.NEXT_PUBLIC_SUPABASE_URL
    .replace("https://", "")
    .split(".")[0];

  console.log(`Project: ${projectRef}`);
  console.log("Column rgpd_consent_at is missing from remote DB.");
  console.log("Action: apply pending migrations before enabling VIP profile field usage.");
}

run();
