import { test, expect } from '@playwright/test';
import {
  goToHomepage,
  addProductToCart,
  couponDiscountAmount,
  orderTotalAmount,
  roundMoney,
  summaryRowAmount,
  goToPopulatedCart,
  loginViaApi,
} from '../utils/common-utils';
import { cardDetails } from '../fixtures/cardDetails';

function assertOrderTotalFormula(
  subtotal: number,
  discount: number,
  shipping: number,
  total: number
) {
  expect(total).toBe(roundMoney(subtotal - discount + shipping));
}


test('allows a user to add a product to the cart with no discount code applied', async ({ page }) => {
    await goToPopulatedCart(page);
});

test('applies WARACLE25 so the order total is 25% lower than before the coupon', async ({
    page,
}) => {
    await goToHomepage(page);
    await addProductToCart(page, { index: 0 });

    await page.getByRole('link', { name: 'Cart', exact: true }).click();
    await expect(page).toHaveURL('/cart');
    await expect(page.getByTestId('order-total')).not.toHaveText('£0.00');

    const totalBefore = await orderTotalAmount(page);
    const totalExpected = roundMoney(totalBefore * (1 - 0.25));

    await page.getByTestId('coupon-code-input').fill('WARACLE25');
    await page.getByRole('button', { name: 'Apply' }).click();
    await expect(page.getByText('Coupon “WARACLE25” applied')).toBeVisible();

    const totalAfter = await orderTotalAmount(page);
    expect(totalAfter).toBe(totalExpected);
    await expect(page.getByText('Shipping£5.00')).toBeVisible();
});

test('does not allow an invalid coupon code to be applied', async ({ page }) => {
    await goToHomepage(page);
    await addProductToCart(page, { index: 0 });

    await page.getByRole('link', { name: 'Cart', exact: true }).click();
    await expect(page).toHaveURL('/cart');
    await expect(page.getByTestId('order-total')).not.toHaveText('£0.00');

    await page.getByTestId('coupon-code-input').fill('INVALID');
    await page.getByRole('button', { name: 'Apply' }).click();
    // Bug noticed where no error is shown when the coupon code is invalid. Placeholder error assertion added to fail test in the meantime
    await expect(page.getByText('Invalid coupon code')).toBeVisible();
    await expect(page.getByTestId('order-total')).not.toHaveText('£0.00');
    await expect(page.getByTestId('coupon-applied-message')).not.toBeVisible();
});

test('the total order amount is the sum of the subtotal, shipping, and discount', async ({ page }) => {
    await goToHomepage(page);
    await addProductToCart(page, { index: 0 });
    await page.getByRole('link', { name: 'Cart', exact: true }).click();
    await expect(page.getByTestId('order-total')).not.toHaveText('£0.00');
  
    assertOrderTotalFormula(
      await summaryRowAmount(page, 'Subtotal'),
      await couponDiscountAmount(page),
      await summaryRowAmount(page, 'Shipping'),
      await orderTotalAmount(page)
    );
  
    await page.getByTestId('coupon-code-input').fill('WARACLE25');
    await page.getByRole('button', { name: 'Apply' }).click();
    await expect(page.getByText('Coupon “WARACLE25” applied')).toBeVisible();
    await expect(page.getByText('Coupon (WARACLE25)')).toBeVisible();
  
    assertOrderTotalFormula(
      await summaryRowAmount(page, 'Subtotal'),
      await couponDiscountAmount(page),
      await summaryRowAmount(page, 'Shipping'),
      await orderTotalAmount(page)
    );
  });

  test('shipping remains the same when adding a second product to the cart', async ({ page }) => {
    await goToPopulatedCart(page);
    await page.getByRole('link', { name: 'Cart', exact: true }).click();
    await expect(page.getByTestId('order-total')).not.toHaveText('£0.00');
    await expect(page.getByText('Shipping£5.00')).toBeVisible();
    const orderTotal = await orderTotalAmount(page);

    await goToHomepage(page);
    await addProductToCart(page, { index: 1 }, 2);
    await page.getByRole('link', { name: 'Cart', exact: true }).click();
    await expect(page.getByText('Shipping£5.00')).toBeVisible();
    const orderTotalAfter = await orderTotalAmount(page);
    expect(orderTotalAfter).toBe(orderTotal * 2);
  });

  test('only applies the discount once when multiple products are added to the cart', async ({ page }) => {
    await goToHomepage(page);
    await addProductToCart(page, { index: 2 });
    await addProductToCart(page, { index: 3 }, 2);
    await page.getByRole('link', { name: 'Cart', exact: true }).click();
    await expect(page.getByText('Shipping£5.00')).toBeVisible();

    await page.getByTestId('coupon-code-input').fill('WARACLE25');
    await page.getByRole('button', { name: 'Apply' }).click();
    await expect(page.getByText('Coupon “WARACLE25” applied')).toBeVisible();
    const orderTotal = await orderTotalAmount(page);
    const totalExpected = roundMoney(orderTotal * (1 - 0.25));
    expect(orderTotal).toBe(totalExpected);
    await expect(page.getByTestId('order-total')).not.toHaveText('£0.00');
    await expect(page.getByText('Shipping£5.00')).toBeVisible();
  });

  test('shows no coupon and discount when checking out with no coupon applied', async ({ page }) => {
    await loginViaApi(page);
    await goToPopulatedCart(page);
    const orderTotal = await orderTotalAmount(page);
    await page.getByRole('button', { name: 'Proceed to Checkout' }).click();
    await expect(page).toHaveURL('/checkout');
    await expect(page.getByText(`Total£${orderTotal}`)).toBeVisible();
    await expect(page.getByText('iCoupon applied')).not.toBeVisible();
  });

  test('shows the correct coupon and discount when checking out with a coupon applied', async ({ page }) => {
    await loginViaApi(page);
    await goToPopulatedCart(page);
    await page.getByTestId('coupon-code-input').fill('WARACLE25');
    await page.getByRole('button', { name: 'Apply' }).click();
    await expect(page.getByText('Coupon “WARACLE25” applied')).toBeVisible();
    const orderTotal = await orderTotalAmount(page);
    await page.getByRole('button', { name: 'Proceed to Checkout' }).click();
    await expect(page).toHaveURL('/checkout');
    await expect(page.getByText(`Total£${orderTotal}`)).toBeVisible();
    await expect(page.getByText('iCoupon applied')).toBeVisible();
  });

  test('it shows correct discount details on the confirmation page', async ({ page }) => {
    await loginViaApi(page);
    await goToPopulatedCart(page);
    await page.getByTestId('coupon-code-input').fill('WARACLE25');
    await page.getByRole('button', { name: 'Apply' }).click();
    await expect(page.getByText('Coupon “WARACLE25” applied')).toBeVisible();
    await page.getByRole('button', { name: 'Proceed to Checkout' }).click();
    await expect(page).toHaveURL('/checkout');
    await page.getByTestId('email-field').fill(cardDetails.email);
    await page.getByTestId('full-name-field').fill(cardDetails.name);
    await page.getByTestId('address-line-1-field').fill(cardDetails.address);
    await page.getByTestId('city-field').fill(cardDetails.addressLine2);
    await page.getByTestId('postcode-field').fill(cardDetails.postcode);
    await page.getByTestId('card-number-field').fill(cardDetails.number);
    await page.getByTestId('expiry-date-field').fill(cardDetails.expiryDate);
    await page.getByTestId('cvc-field').fill(cardDetails.cvv);
    await page.getByTestId('place-order-button').click();
    await expect(page).toHaveURL(/.*\/order-success\/\d+/);
    await expect(page.getByRole('heading', { name: 'Thank you for your order!' })).toBeVisible();
    await expect(page.getByText('Coupon (WARACLE25)')).toBeVisible();
  });