import { createElement } from 'lwc';

import Test from 'x/test';
import Text from 'x/text';
import Slotted from 'x/slotted';

describe('ParentNode.lastElementChild -LWC', () => {
    it('should return the last element child', () => {
        const elm = createElement('x-test', { is: Test });
        document.body.appendChild(elm);

        expect(elm.lastElementChild).toBe(null);
        expect(elm.shadowRoot.lastElementChild).toBe(elm.shadowRoot.querySelector('p'));
    });

    it("should return null if component doesn't have element child", () => {
        const elm = createElement('x-text', { is: Text });
        document.body.appendChild(elm);
        expect(elm.shadowRoot.lastElementChild).toBe(null);
    });

    it('should return the right elements for slotted children', () => {
        const elm = createElement('x-slotted', { is: Slotted });
        document.body.appendChild(elm);

        const container = elm.shadowRoot.querySelector('x-container');
        expect(container.lastElementChild).not.toBe(null);
        expect(container.shadowRoot.querySelector('slot').lastElementChild).toBe(null);
    });
});

describe('ParentNode.lastElementChild - Vanilla', () => {
    it('should return the first element child on standard Element', () => {
        const elm = document.createElement('div');
        const childA = document.createElement('span');
        const childB = document.createElement('span');
        elm.appendChild(childA);
        elm.appendChild(childB);

        expect(elm.lastChild).toBe(childB);
    });

    it('should return the first element child on the host element and the shadow root', () => {
        const elm = document.createElement('div');
        const root = elm.attachShadow({ mode: 'open' });
        const elmChildA = document.createElement('span');
        const elmChildB = document.createElement('span');
        const rootChildA = document.createElement('span');
        const rootChildB = document.createElement('span');
        elm.appendChild(elmChildA);
        elm.appendChild(elmChildB);
        root.appendChild(rootChildA);
        root.appendChild(rootChildB);

        expect(elm.lastChild).toBe(elmChildB);
        expect(root.lastChild).toBe(rootChildB);
    });

    it('should return the first element child on HTMLSlotElement', () => {
        const elm = document.createElement('div');
        const root = elm.attachShadow({ mode: 'open' });
        const slot = document.createElement('slot');
        const childA = document.createElement('span');
        const childB = document.createElement('span');
        root.appendChild(slot);
        slot.appendChild(childA);
        slot.appendChild(childB);

        expect(slot.lastChild).toBe(childB);
    });
});
