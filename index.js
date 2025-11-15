import { Stagehand } from "@browserbasehq/stagehand";
import { createClient } from "@supabase/supabase-js";

// Load env vars
const supabase = createClient(
  "https://wfpnqezrpahokjdccmfo.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmcG5xZXpycGFob2tqZGNjbWZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyMTcxNTUsImV4cCI6MjA3ODc5MzE1NX0.8DDVFbTMBPNxVTb42-tIqexWHlcyGsofX0p0RWBwk70"
);

function isBirthdayToday(day, month) {
  const today = new Date();
  return (
    today.getDate() === Number(day) && today.getMonth() + 1 === Number(month)
  );
}

async function loginIfNeeded(page) {
  const loginForm = await page.$('input[name="email"]');
  if (loginForm) {
    return true;
  } else {
    return false;
  }
}

async function main() {
  console.log("Checking birthdays...");

  // Fetch rows from Supabase
  const { data, error } = await supabase
    .from("birthdays")
    .select("profile_data");

  if (error) {
    console.error("Supabase error:", error);
    return;
  }

  let birthdayCountToday = 0;

  for (const row of data) {
    const profile = row.profile_data;
    if (!profile?.birthday) continue;

    const { day, month } = profile.birthday;

    if (isBirthdayToday(day, month)) {
      console.log(`Posting wishes for ${profile.name} 🎉`);
      birthdayCountToday++;
      // 🔥 TODO: call your actual post function here
    }
  }

  const stagehand = new Stagehand({
    env: "LOCAL",
    localBrowserLaunchOptions: {
      headless: false,
      userDataDir: "./user_data",
      viewport: { width: 1568, height: 768 },
    },
  });

  await stagehand.init();
  const page = stagehand.page;
  await page.goto("https://facebook.com/");

  // Conditionally login
  const decision = await loginIfNeeded(page);
  console.log("Login needed:", decision);
  if (decision) {
    await page.mouse.click(1072, 173);
    await page.keyboard.type("rajdama1234@gmail.com");
    await page.mouse.click(1071, 237);
    await page.keyboard.type("Rajdama@1729");
    await page.mouse.click(1071, 301);
  }

  await page.waitForTimeout(5000);
  await page.reload()
  await page.reload()
  await page.mouse.click(747, 119);
  await page.waitForTimeout(10000);
  await page.mouse.click(683, 318);
  await page.keyboard.type("9999");
  await page.mouse.click(783, 565);

  if (birthdayCountToday === 0) {
    console.log("No birthdays today.");
  }

  // Continue with your normal flow here
}

main();
