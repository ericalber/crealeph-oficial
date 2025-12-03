import { test, expect } from '@playwright/test';

test.describe('Smoke nav — header/footer', () => {
  const paths = ['/', '/services', '/services/marketing', '/services/websites', '/services/automation', '/modules', '/industries', '/projects', '/resources', '/pricing'];

  for (const p of paths) {
    test(`200 + H1 at ${p}`, async ({ page }) => {
      await page.goto(`http://localhost:3003${p}`);
      const h1 = page.locator('h1');
      await expect(h1.first()).toBeVisible();
    });
  }
});

