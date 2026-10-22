// External-network smoke test, separate from deterministic CI tests. Requires a running production server.
import { chromium, devices } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { writeFileSync } from "node:fs";
const browser = await chromium.launch();
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1100 },
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("http://127.0.0.1:3000/dashboard");
  await page
    .getByRole("heading", { name: "Make your next post count." })
    .waitFor();
  await page.screenshot({
    path: "evidence/dashboard-desktop.png",
    fullPage: true,
  });
  await page.goto("http://127.0.0.1:3000/dashboard/analyzer");
  await page.getByLabel("Video URL").fill("https://youtu.be/jNQXAC9IVRw");
  await page
    .getByRole("button", { name: "Analyze video", exact: true })
    .click();
  await page
    .getByRole("heading", { name: "Me at the zoo", exact: true })
    .waitFor({ timeout: 45000 });
  await page.screenshot({
    path: "evidence/live-youtube-report.png",
    fullPage: true,
  });
  console.log("LIVE_UI_YOUTUBE=PASS title=Me at the zoo");
  const scan = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  console.log(
    "LIVE_REPORT_AXE=" + JSON.stringify(scan.violations.map((v) => v.id)),
  );
  await page
    .getByLabel("Video URL")
    .fill("https://www.tiktok.com/@scout2015/video/6718335390845095173");
  await page
    .getByRole("button", { name: "Analyze video", exact: true })
    .click();
  await page
    .getByRole("region", { name: "Video report" })
    .waitFor({ timeout: 45000 });
  await page
    .getByRole("heading", {
      name: "TikTok video (title not supplied)",
      exact: true,
    })
    .waitFor();
  console.log("LIVE_UI_TIKTOK=PASS embed confirmed, caption unavailable");
  await page.screenshot({
    path: "evidence/live-tiktok-report.png",
    fullPage: true,
  });
  const mobile = await browser.newContext({ ...devices["iPhone 13"] });
  const mobilePage = await mobile.newPage();
  await mobilePage.goto("http://127.0.0.1:3000/dashboard");
  await mobilePage
    .getByRole("heading", { name: "Make your next post count." })
    .waitFor();
  await mobilePage.screenshot({
    path: "evidence/dashboard-mobile.png",
    fullPage: true,
  });
  console.log("PAGE_ERRORS=" + JSON.stringify(errors));
  writeFileSync(
    "evidence/live-browser.json",
    JSON.stringify(
      {
        youtube: "PASS: Me at the zoo by jawed",
        tiktok: "PASS: official embed; title unavailable",
        reportAccessibility: scan.violations,
        pageErrors: errors,
      },
      null,
      2,
    ),
  );
  if (errors.length || scan.violations.length) process.exitCode = 1;
} finally {
  await browser.close();
}
