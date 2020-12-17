import { createElement } from 'lwc';

import Test from 'x/test';

describe('ShadowRoot.host - LWC', () => {
    it('should return the shadow tree host element', () => {
        const elm = createElement('x-test', { is: Test });
        document.body.appendChild(elm);

        expect(elm.shadowRoot.host).toBe(elm);
    });
});

describe('ShadowRoot.host - Vanilla', () => {
    it('should return the shadow tree host element', () => {
        const host = document.createElement('div');
        const root = host.attachShadow({ mode: 'open' });

        expect(root.host).toBe(host);
    });
});
