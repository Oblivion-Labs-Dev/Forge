import { test, expect } from '@playwright/test';



test.describe('Command Center smoke', () => {

  test('loads dashboard with all sections', async ({ page }) => {

    await page.goto('/?static=1');

    await page.waitForSelector('[data-testid="command-center"]');

    await page.waitForSelector('[data-testid="section-blueprint"]');

    await page.waitForSelector('[data-testid="section-artisans"]');

    await page.waitForSelector('[data-testid="section-activity"]');

    await page.waitForSelector('[data-testid="section-health"]');

    await page.waitForSelector('[data-testid="forge-sidebar"]');



    await expect(page.getByTestId('section-blueprint').getByText('Command Center')).toBeVisible();

    await expect(page.getByText('● LIVE').first()).toBeVisible();

    await expect(page.getByRole('heading', { name: 'Implement Dark Mode' })).toBeVisible();

  });



  test('sidebar navigation is interactive', async ({ page }) => {

    await page.goto('/?static=1');

    await page.getByRole('button', { name: /Live Timeline/ }).click();

    await expect(page.getByTestId('timeline-page')).toBeVisible();

  });



  test('hammerstrike events panel shows timeline', async ({ page }) => {

    await page.goto('/?static=1');

    await expect(page.getByText('Hammerstrike Events')).toBeVisible();

    await expect(page.getByText('View Full Timeline')).toBeVisible();

  });

});

