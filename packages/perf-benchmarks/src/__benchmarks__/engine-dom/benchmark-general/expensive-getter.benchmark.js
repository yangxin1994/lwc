/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { createElement } from 'lwc';

import ExpensiveGetter from 'perf-benchmarks-components/dist/dom/benchmark/expensiveGetter/expensiveGetter.js';
import { insertComponent, destroyComponent } from '../../../utils/utils.js';

benchmark(`benchmark-table/append/1k`, () => {
    let element;

    before(async () => {
        element = createElement('expensive-getter', { is: ExpensiveGetter });
    });

    run(async () => {
        await insertComponent(element);
    });

    after(() => {
        destroyComponent(element);
    });
});
