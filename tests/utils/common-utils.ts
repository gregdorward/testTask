import { expect, type Page } from '@playwright/test';
import type { ProductTile } from '../journeys/homepage.types';

const API_BASE = 'http://localhost:4000'

export const demoUser = {
  email: 'john.doe@example.com',
  //assumption that this is a test env only user, otherwise I would have added this to the .env file
  password: 'Password123',
};

/** Logs in via POST /api/auth/login to save exercising the login journey everytime */
export async function loginViaApi(
  page: Page,
  credentials: { email: string; password: string } = demoUser
) {
  const res = await page.request.post(`${API_BASE}/api/auth/login`, {
    data: credentials,
  });
  if (!res.ok()) {
    throw new Error(`Login failed (${res.status()}): ${await res.text()}`);
  }
  const { token } = (await res.json()) as { token: string };

  await page.goto('/');
  await page.evaluate((t) => localStorage.setItem('waracle_token', t), token);
  await page.reload();
}

export async function goToHomepage(page: Page) {
  await page.goto('/');
  await page.getByTestId('product-card').first().waitFor();
}

export async function addProductToCart(page: Page, tile: ProductTile, productCount?: number) {
  const card = page.getByTestId('product-card').nth(tile.index);
  const addButton = card.getByTestId('add-to-cart-button');

  await card.scrollIntoViewIfNeeded();
  await card.focus();
  await expect(addButton).toBeVisible();
  await addButton.click();
  await expect(page.getByTestId('cart-count')).toHaveText(productCount?.toString() || '1');
  await expect(page.getByText(/added to cart/i).last()).toBeVisible();
}

export async function goToPopulatedCart(page: Page) {
    await goToHomepage(page);
    await addProductToCart(page, { index: 0 });

    await expect(page).toHaveURL('/');

    await page.getByRole('link', { name: 'Cart', exact: true }).click();

    await expect(page).toHaveURL('/cart');
    await expect(page.getByTestId('cart-count')).toHaveText('1');
    await expect(page.getByTestId('order-total')).not.toHaveText('£0.00');
    await expect(page.getByTestId('order-total')).toHaveText(/£\d+\.\d{2}/);
    await expect(page.getByText('Shipping£5.00')).toBeVisible();
}

/** Converts an amount to GBP */
export function parseGbp(value: string): number {
  const match = value.replace(/\s/g, '').match(/£([\d,.]+)/);
  if (!match) throw new Error(`Not a GBP amount: ${value}`);
  return Number(match[1].replace(/,/g, ''));
}

export async function orderTotalAmount(page: Page): Promise<number> {
  const text = await page.getByTestId('order-total').innerText();
  return parseGbp(text);
}

/** Reads a value from an order-summary row label (e.g. Subtotal, Shipping). */
export async function summaryRowAmount(page: Page, label: string): Promise<number> {
  const row = page.locator('aside').getByText(label, { exact: true }).locator('..');
  const text = await row.locator('span.font-medium').innerText();
  return parseGbp(text);
}

export async function couponDiscountAmount(page: Page): Promise<number> {
  const row = page.locator('aside div.flex').filter({ hasText: /^Coupon \(/ });
  if ((await row.count()) === 0) return 0;
  return parseGbp(await row.locator('span.font-medium').innerText());
}

export function roundMoney(amount: number): number {
  return Math.round((amount + Number.EPSILON) * 100) / 100;
}
