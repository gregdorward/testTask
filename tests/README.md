Framework

Tests have been written using Playwright and Typescript

Executing tests

All tests can be run using the command `npx playwright test` from the /web folder

Due to time constraints, I focused on writing these tests primarily for the Chrome browser. Currently, 3 tests are failing but all for valid reasons. These are outlined, below.

Bugs discovered

The WARACLE25 discount code only reduces the sub total by 0.25 pence instead of a percentage value. This affects two of the three failing tests. I have deliberately left these in a failing state so that the fix could be immediately verified when the tests turn green.

The other issue was the lack of an error when an invalid discount code was entered. Again, I have left this failing with a placeholder error assertion in place to be updated once Product have supplied the real expected error

Notes

To make organising the tests easier, I used a common-utils file which held much of the reusable complexity. I chose to log in programatically to avoid wasteful UI time in future tests.

I have also added my own data-pw selector pattern when needed to make finding elements more robust and readable.

For some fields, I imported faker to generate realistic names, emails, addresses and card details.

Overall, I found the exercise challenging but enjoyable. I did run into an early issue with needing to add bcryptjs to my package.json but that was resolved quickly. I did utilise AI in places, primarily as an autocomplete assistant when writing tests that hooked into shared functions. I did try to time limit myself, which is why I did no mobile specific tests or any attempt to fix bugs myself.