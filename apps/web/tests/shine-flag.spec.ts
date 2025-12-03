import { test, expect } from '@playwright/test';

test.describe('UI Shine flag', () => {
  test('ON: like-burst present and ptr hint on mobile', async ({ page, context, browserName }) => {
    await page.addInitScript(() => localStorage.setItem('ui_shine','on'));
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('http://localhost:3003/');
    await expect(page.locator('[data-test="like-burst"]').first()).toBeVisible();
    // section-shine wrappers visible on home blocks
    await expect.soft(page.locator('.section-shine')).toHaveCountGreaterThan(0);
    // soft expect for ptr hint (only top of page, may auto hide)
    await expect.soft(page.locator('[data-test="ptr-hint"]')).toHaveCount(1);
    // pricing page
    await page.goto('http://localhost:3003/pricing');
    await expect(page.locator('[data-test="like-burst"]').first()).toBeVisible();
  });

  test('OFF: like-burst and ptr hint absent', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('ui_shine','off'));
    await page.goto('http://localhost:3003/');
    await expect(page.locator('[data-test="like-burst"]')).toHaveCount(0);
    await expect(page.locator('[data-test="ptr-hint"]')).toHaveCount(0);
    await page.goto('http://localhost:3003/pricing');
    await expect(page.locator('[data-test="like-burst"]')).toHaveCount(0);
  });

  test('ServicesHub shows icons and no duplicates under Shine', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('ui_shine','on'));
    await page.goto('http://localhost:3003/');
    // icons present in 6 cards (svg under each card link)
    await expect(page.locator('[data-um^="home.servicesHub.card."] svg')).toHaveCount(6);
    // first demo banner hidden when shine on
    await expect.soft(page.locator('text=Demonstração guiada em 30 minutos')).toHaveCount(0);
  });
});
