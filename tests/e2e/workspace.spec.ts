import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const report = {
  id: "jNQXAC9IVRw",
  platform: "youtube",
  url: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
  title: "Me at the zoo",
  author: "jawed",
  fetchedAt: "2026-10-22T12:00:00Z",
  source: "public-oembed",
  metrics: { views: null, likes: null, comments: null, shares: null },
  publishedAt: null,
  interactionRate: null,
  observations: [
    "The public title/caption contains 13 characters and 0 hashtags.",
  ],
  limitations: ["Public metadata only. No private analytics."],
};
test("landing and dashboard render without horizontal page overflow", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: "Good content starts with a better question.",
    }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("link", { name: "Explore your workspace" }).click();
  await expect(
    page.getByRole("heading", { name: "Make your next post count." }),
  ).toBeVisible();
  await expect(
    page.getByText("Sample workspace", { exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
});
test("sample filters alter the actual post set; search, details, and CSV export work", async ({
  page,
}) => {
  await page.goto("/dashboard");
  await expect(page.getByText("Showing 6 of 6 sample posts")).toBeVisible();
  await page.getByLabel("Publication window").selectOption("7");
  await expect(page.getByText("Showing 3 of 3 sample posts")).toBeVisible();
  await page.getByLabel("Search content").fill("morning");
  await expect(page.getByText("Showing 1 of 3 sample posts")).toBeVisible();
  await page.getByRole("button", { name: /A slower morning/ }).click();
  await expect(page.getByText(/Sample record. Engagement =/)).toBeVisible();
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export CSV" }).click();
  expect((await download).suggestedFilename()).toBe(
    "creatorpulse-sample-content.csv",
  );
});
test("invalid link and upstream failure show actionable errors and no stale result", async ({
  page,
}) => {
  await page.goto("/dashboard/analyzer");
  await page.getByLabel("Video URL").fill("https://evil.example/video");
  await page
    .getByRole("button", { name: "Analyze video", exact: true })
    .click();
  await expect(page.locator(".error-message[role=alert]")).toContainText(
    "not supported",
  );
  await page.route("**/api/analytics", (route) =>
    route.fulfill({
      status: 502,
      contentType: "application/json",
      body: JSON.stringify({
        ok: false,
        message:
          "The video provider is temporarily unavailable. Try again later.",
      }),
    }),
  );
  await page.getByLabel("Video URL").fill(report.url);
  await page
    .getByRole("button", { name: "Analyze video", exact: true })
    .click();
  await expect(page.locator(".error-message[role=alert]")).toContainText(
    "temporarily unavailable",
  );
  await expect(page.getByRole("region", { name: "Video report" })).toHaveCount(
    0,
  );
});
test("video report success, persistence, export, and deletion form a complete workflow", async ({
  page,
}) => {
  await page.goto("/dashboard/analyzer");
  await page.route("**/api/analytics", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true, report }),
    }),
  );
  await page.getByLabel("Video URL").fill("https://youtu.be/jNQXAC9IVRw");
  await page
    .getByRole("button", { name: "Analyze video", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: report.title, exact: true }),
  ).toBeVisible();
  await expect(page.getByText("Report saved in this browser.")).toBeVisible();
  const download = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Export report", exact: true })
    .click();
  expect((await download).suggestedFilename()).toBe(
    "creatorpulse-jNQXAC9IVRw.json",
  );
  await page.reload();
  await expect(
    page.getByRole("button", { name: /Me at the zoo/ }),
  ).toBeVisible();
  await page.getByRole("button", { name: /Me at the zoo/ }).click();
  await expect(
    page.getByRole("region", { name: "Video report" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Workspace settings" }).click();
  await page
    .getByRole("button", { name: "Delete local reports", exact: true })
    .click();
  await page.getByRole("button", { name: "Confirm deletion" }).click();
  await expect(page.getByText("All local reports deleted.")).toBeVisible();
  await page.getByRole("link", { name: "Content library" }).click();
  await expect(
    page.getByRole("heading", { name: "Your first report belongs here." }),
  ).toBeVisible();
});
test("revenue planner calculates and validates explicit scenarios", async ({
  page,
}) => {
  await page.goto("/dashboard/revenue");
  await expect(page.getByText("$40.00 – $100.00")).toBeVisible();
  await page.getByLabel("Eligible views").fill("200000");
  await expect(page.getByText("$80.00 – $200.00")).toBeVisible();
  await page.getByLabel("Low RPM (USD)").fill("2");
  await expect(page.getByText("Check your assumptions")).toBeVisible();
});
test("auth forms no longer collect passwords or grant fake accounts", async ({
  page,
  request,
}) => {
  for (const path of ["/login", "/signup"]) {
    await page.goto(path);
    await expect(
      page.getByRole("heading", { name: "No account needed." }),
    ).toBeVisible();
    await expect(page.locator('input[type="password"]')).toHaveCount(0);
  }
  const response = await request.post("/api/auth/login", {
    data: { email: "a@example.test", password: "fake" },
  });
  expect(response.status()).toBe(503);
});
test("important pages meet automated WCAG AA checks", async ({ page }) => {
  for (const path of [
    "/",
    "/dashboard",
    "/dashboard/analyzer",
    "/dashboard/revenue",
    "/dashboard/settings",
  ]) {
    await page.goto(path);
    const scan = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      scan.violations,
      JSON.stringify(
        scan.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => n.target),
        })),
      ),
    ).toEqual([]);
  }
});
test("real server accepts its browser origin and rejects unsupported URLs with 400", async ({
  request,
}) => {
  const response = await request.post("/api/analytics", {
    headers: { origin: "http://127.0.0.1:3000" },
    data: { url: "https://unsupported.example/video" },
  });
  expect(response.status()).toBe(400);
  expect((await response.json()).code).toBe("INVALID_URL");
});
