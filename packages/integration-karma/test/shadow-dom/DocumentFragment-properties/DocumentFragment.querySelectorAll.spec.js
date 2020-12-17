import { createElement } from 'lwc';

import Test from 'x/test';
import SlottedParent from 'x/slotted';

describe('DocumentFragment.querySelectorAll - LWC', () => {
    it('should allow searching for elements from template', () => {
        const elm = createElement('x-foo', { is: Test });
        document.body.appendChild(elm);

        const nodes = elm.shadowRoot.querySelectorAll('p');
        expect(nodes.length).toBe(1);
    });

    it('should ignore slotted elements when queried via querySelectorAll', () => {
        const elm = createElement('x-foo', { is: SlottedParent });
        document.body.appendChild(elm);

        expect(elm.shadowRoot.querySelectorAll('p').length).toBe(1);

        const xChild = elm.shadowRoot.querySelector('x-child');
        expect(xChild.shadowRoot.querySelectorAll('p').length).toBe(0);
    });
});

describe('DocumentFragment.querySelectorAll - Vanilla', () => {
    it('should allow searching for elements from template', () => {
        const host = document.createElement('div');
        const root = host.attachShadow({ mode: 'open' });
        const child = document.createElement('p');
        root.appendChild(child);

        const res = root.querySelectorAll('p');
        expect(res.length).toBe(1);
        expect(res[0]).toBe(child);
    });

    it('should ignore slotted elements when queried via querySelectorAll', () => {
        const host = document.createElement('div');
        const root = host.attachShadow({ mode: 'open' });
        const child = document.createElement('p');
        host.appendChild(child);
        const slot = document.createElement('slot');
        root.appendChild(slot);

        const slotRes = root.querySelectorAll('slot');
        expect(slotRes.length).toBe(1);
        expect(slotRes[0]).toBe(slot);

        const pRes = root.querySelectorAll('p');
        expect(pRes.length).toBe(0);
    });
});
