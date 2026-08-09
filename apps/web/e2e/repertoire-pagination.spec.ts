import { expect, test } from '@playwright/test';

/**
 * Covers the pagination round-trip: a page click writes `?page`, the param
 * reaches the API, and a different slice of tracks comes back. The default
 * "All Repertoires" view holds more than one page of seeded tracks, so the
 * control is present on load.
 *
 * See docs/features/repertoire-pagination.md.
 */

/** Waits for the table to settle after the query changes. */
async function tracksTable(page: import('@playwright/test').Page) {
  const table = page.getByRole('table', { name: /repertoire/i });
  await expect(table).toBeVisible();
  await expect(table).toHaveAttribute('aria-busy', 'false');
  return table;
}

test.beforeEach(async ({ page }) => {
  await page.goto('/repertoire');
});

test('shows the pagination control when the list spans multiple pages', async ({ page }) => {
  await tracksTable(page);
  await expect(page.getByRole('navigation', { name: /pagination/i })).toBeVisible();
});

test('caps the first page at the page size', async ({ page }) => {
  const table = await tracksTable(page);
  // header row + up to 10 track rows
  expect(await table.getByRole('row').count()).toBeLessThanOrEqual(11);
});

test('going to page 2 writes the param and changes the rows', async ({ page }) => {
  const table = await tracksTable(page);
  const firstBefore = await table.getByRole('row').nth(1).textContent();

  await page.getByRole('button', { name: 'Go to page 2' }).click();

  await expect(page).toHaveURL(/page=2/);
  const settled = await tracksTable(page);
  const firstAfter = await settled.getByRole('row').nth(1).textContent();
  expect(firstAfter).not.toBe(firstBefore);
});

test('row numbers continue across pages instead of restarting at 1', async ({ page }) => {
  const table = await tracksTable(page);
  // first page: the first row is numbered 1
  await expect(table.getByRole('row').nth(1).getByText('1', { exact: true })).toBeVisible();

  await page.getByRole('button', { name: 'Go to page 2' }).click();
  await expect(page).toHaveURL(/page=2/);

  // second page: numbering continues from 11, not back to 1
  const settled = await tracksTable(page);
  await expect(settled.getByRole('row').nth(1).getByText('11', { exact: true })).toBeVisible();
});

test('the current page survives a reload', async ({ page }) => {
  await tracksTable(page);
  await page.getByRole('button', { name: 'Go to page 2' }).click();
  await expect(page).toHaveURL(/page=2/);

  await page.reload();

  await tracksTable(page);
  await expect(page).toHaveURL(/page=2/);
  await expect(
    page.getByRole('button', { name: 'Go to page 2' }).first(),
  ).toHaveAttribute('aria-current', 'page');
});

test('changing a filter resets back to page 1', async ({ page }) => {
  await tracksTable(page);
  await page.getByRole('button', { name: 'Go to page 2' }).click();
  await expect(page).toHaveURL(/page=2/);

  await page.getByRole('button', { name: 'Ready', exact: true }).click();

  await expect(page).toHaveURL(/status=ready/);
  await expect(page).not.toHaveURL(/page=/);
});
