import { test, expect } from '@playwright/test';

const routes = [
  '/contact', '/developers', '/industries', '/industries/automotive', '/industries/cleaning',
  '/industries/construction', '/industries/education', '/industries/health', '/industries/marinas',
  '/modules', '/modules/aqua', '/modules/bridge', '/modules/insightscore', '/modules/market-twin',
  '/modules/pricing', '/modules/scout', '/pricing', '/pricing/enterprise', '/projects',
  '/projects/case-marina-vox', '/projects/case-clingroup', '/projects/case-construtora-norte',
  '/resources', '/resources/blog', '/resources/guides', '/resources/faq', '/resources/templates',
];

const viewports = [
  { width: 375, height: 800 },
  { width: 768, height: 900 },
  { width: 1024, height: 900 },
];

test.describe('Icon layout audit (non-destructive)', () => {
  for (const vp of viewports) {
    for (const path of routes) {
      test(`viewport ${vp.width}x${vp.height} — ${path}`, async ({ page }) => {
        await page.setViewportSize(vp);
        await page.goto(path);
        const svgs = page.locator('svg');
        const count = await svgs.count();
        for (let i = 0; i < count; i++) {
          const svg = svgs.nth(i);
          const box = await svg.boundingBox();
          if (!box) continue;
          const parent = svg.locator('xpath=..');
          const pbox = await parent.boundingBox();
          if (!pbox) continue;
          const outsideTop = box.y < pbox.y - 2;
          const outsideBottom = box.y + box.height > pbox.y + pbox.height + 2;
          expect(outsideTop || outsideBottom).toBeFalsy();
        }
      });
    }
  }
});

