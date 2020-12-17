import { createElement } from 'lwc';

import Test from 'x/test';
import Text from 'x/text';
import Slotted from 'x/slotted';

describe('ParentNode.childElementCount - LWC', () => {
    it('should return the number of children elements', () => {
        const elm = createElement('x-test', { is: Test });
        document.body.appendChild(elm);

        expect(elm.childElementCount).toBe(0);
        expect(elm.shadowRoot.childElementCount).toBe(2);
    });

    it("should return 0 if component doesn't have element child", () => {
        const elm = createElement('x-text', { is: Text });
        document.body.appendChild(elm);
        expect(elm.shadowRoot.childElementCount).toBe(0);
    });

    it('should return the right number of elements for content children', () => {
        const elm = createElement('x-slotted', { is: Slotted });
        document.body.appendChild(elm);

        const container = elm.shadowRoot.querySelector('x-container');
        expect(container.childElementCount).toBe(1);
        expect(container.shadowRoot.querySelector('slot').childElementCount).toBe(0);
    });
});

describe('ParentNode.childElementCount - Vanilla', () => {
    it('should return the number of children elements on standard Element', () => {
        const elm = document.createElement('div');
        const childA = document.createElement('span');
        const childB = document.createElement('span');
        elm.appendChild(childA);
        elm.appendChild(childB);

        expect(elm.childElementCount).toBe(2);
    });

    it('should return the number of children elements on the host element and the shadow root', () => {
        const elm = document.createElement('div');
        const root = elm.attachShadow({ mode: 'open' });
        const elmChild = document.createElement('span');
        const rootChild = document.createElement('span');
        elm.appendChild(elmChild);
        root.appendChild(rootChild);

        expect(elm.childElementCount).toBe(1);
        expect(root.childElementCount).toBe(1);
    });

    // TODO [#2135]: Synthetic shadow doesn't preserve HTMLSlotElement.prototype.children behavior
    it('should return the number of children elements on HTMLSlotElement', () => {
        const elm = document.createElement('div');
        const root = elm.attachShadow({ mode: 'open' });
        const slot = document.createElement('slot');
        const child = document.createElement('span');
        root.appendChild(slot);
        slot.appendChild(child);

        expect(slot.childElementCount).toBe(1);
    });
});
