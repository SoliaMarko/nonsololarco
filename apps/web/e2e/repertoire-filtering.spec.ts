import { expect, test } from '@playwright/test';

/**
 * Covers the round-trip that unit tests can't: a click writes a query param,
 * the param reaches the API, and the response changes what's on screen.
 *
 * See docs/features/repertoire-filtering.md.
 */

/** Waits for the table to settle after a filter or sort changes the query. */
async function tracksTable(page: import('@playwright/test').Page) {
  const table = page.getByRole('table', { name: /repertoire/i });
  await expect(table).toBeVisible();
  await expect(table).toHaveAttribute('aria-busy', 'false');
  return table;
}

test.beforeEach(async ({ page }) => {
  await page.goto('/repertoire');
});

test('shows the repertoire table for the signed-in user', async ({ page }) => {
  const table = await tracksTable(page);
  await expect(table.getByRole('row')).not.toHaveCount(0);
});

test('status filter writes the query param and narrows the list', async ({ page }) => {
  const table = await tracksTable(page);
  const totalRows = await table.getByRole('row').count();

  await page.getByRole('button', { name: 'Ready', exact: true }).click();

  await expect(page).toHaveURL(/status=ready/);
  const filtered = await tracksTable(page);
  await expect(filtered.getByText('Ready').first()).toBeVisible();
  expect(await filtered.getByRole('row').count()).toBeLessThanOrEqual(totalRows);
});

test('"All" clears the status param rather than setting status=all', async ({ page }) => {
  await page.getByRole('button', { name: 'New', exact: true }).click();
  await expect(page).toHaveURL(/status=new/);

  await page.getByRole('button', { name: 'All', exact: true }).click();
  await expect(page).not.toHaveURL(/status=/);
});

test('column header sorts and toggles direction', async ({ page }) => {
  await tracksTable(page);

  const titleHeader = page.getByRole('button', { name: /title/i });
  await titleHeader.click();
  await expect(page).toHaveURL(/sort=title/);
  await expect(page).toHaveURL(/order=asc/);

  await titleHeader.click();
  await expect(page).toHaveURL(/order=desc/);
});

test('sort survives a page reload', async ({ page }) => {
  await page.getByRole('button', { name: /bpm/i }).click();
  await expect(page).toHaveURL(/sort=bpm/);

  await page.reload();

  await tracksTable(page);
  await expect(page).toHaveURL(/sort=bpm/);
});

test.describe('within a band', () => {
  test.beforeEach(async ({ page }) => {
    // The first tab is "All Repertoires"; the second is Solo or a real band.
    await page.getByRole('button', { name: /Quiet Yard/i }).click();
    await expect(page).toHaveURL(/band=/);
  });

  test('"Only mine" filters to tracks the user participates in', async ({ page }) => {
    const table = await tracksTable(page);
    const dataRows = table.getByRole('rowgroup').getByRole('row');
    const totalRows = await dataRows.count();

    const onlyMine = page.getByRole('button', { name: /only mine/i });
    await expect(onlyMine).toBeVisible();

    // The badge count must match what the filter actually returns — this is
    // the bug the feature shipped with (it counted every track).
    const badgeCount = Number((await onlyMine.textContent())?.match(/\d+/)?.[0] ?? -1);

    await onlyMine.click();
    await expect(page).toHaveURL(/onlyMine=true/);

    const filtered = await tracksTable(page);
    const filteredRows = await filtered.getByRole('rowgroup').getByRole('row').count();

    expect(filteredRows).toBe(badgeCount);
    expect(filteredRows).toBeLessThanOrEqual(totalRows);
  });

  test('filters combine and reset together', async ({ page }) => {
    await page.getByRole('button', { name: 'Ready', exact: true }).click();
    await page.getByRole('button', { name: /only mine/i }).click();

    await expect(page).toHaveURL(/status=ready/);
    await expect(page).toHaveURL(/onlyMine=true/);

    // Band selection must survive a filter reset.
    await expect(page).toHaveURL(/band=/);
  });
});

test('Solo tab hides "Only mine" but keeps the page link', async ({ page }) => {
  const soloTab = page.getByRole('button', { name: /^Solo/i });
  test.skip(!(await soloTab.count()), 'seeded user has no solo tracks');

  await soloTab.click();
  await expect(page).toHaveURL(/band=solo/);

  await expect(page.getByRole('button', { name: /only mine/i })).toBeHidden();
  await expect(page.getByRole('link', { name: /page/i })).toBeVisible();
});
