import { createElement } from 'lwc';

import Test from 'x/test';
import SlottedParent from 'x/slotted';

describe('DocumentFragment.querySelector - LWC', () => {
    it('should allow searching for one element from template', () => {
        const elm = createElement('x-foo', { is: Test });
        document.body.appendChild(elm);
        const node = elm.shadowRoot.querySelector('p');
        expect(node.tagName).toBe('P');
    });

    it('should ignore slotted elements when queried via querySelector', () => {
        const elm = createElement('x-foo', { is: SlottedParent });
        document.body.appendChild(elm);

        expect(elm.shadowRoot.querySelector('p')).not.toBeNull();

        const xChild = elm.shadowRoot.querySelector('x-child');
        expect(xChild.shadowRoot.querySelector('p')).toBeNull();
    });
});

describe('DocumentFragment.querySelector - Vanilla', () => {
    it('should allow searching for one element in the shadow tree', () => {
        const host = document.createElement('div');
        const root = host.attachShadow({ mode: 'open' });
        const child = document.createElement('p');
        root.appendChild(child);

        expect(root.querySelector('p')).toBe(child);
    });

    it('should ignore slotted elements when queried via querySelector', () => {
        const host = document.createElement('div');
        const root = host.attachShadow({ mode: 'open' });
        const child = document.createElement('p');
        host.appendChild(child);
        const slot = document.createElement('slot');
        root.appendChild(slot);

        expect(root.querySelector('slot')).toBe(slot);
        expect(root.querySelector('p')).toBe(null);
    });
});
