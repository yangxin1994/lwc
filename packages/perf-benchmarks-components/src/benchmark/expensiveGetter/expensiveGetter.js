/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { LightningElement, api } from 'lwc';

const isPrime = (n) => {
    const limit = Math.sqrt(n);
    for (let i = 2; i <= limit; i++) {
        if (n % i === 0) return false;
    }
    return true;
};

export default class ExpensiveGetter extends LightningElement {
    @api
    get bigPrimeNumber() {
        let prime = 0;
        for (let i = 0; i < 10000; i++) {
            if (isPrime(i)) {
                prime = i;
            }
        }
        return prime;
    }
}
