import { createElement } from 'lwc';

import Test from 'x/test';
import Text from 'x/text';
import Slotted from 'x/slotted';

describe('ParentNode.children - LWC', () => {
    it('should return all the element children', () => {
        const elm = createElement('x-test', { is: Test });
        document.body.appendChild(elm);

        expect(elm.children.length).toBe(0);

        const { children } = elm.shadowRoot;
        expect(children.length).toBe(2);
        expect(children[0]).toBe(elm.shadowRoot.querySelector('div'));
        expect(children[1]).toBe(elm.shadowRoot.querySelector('p'));
    });

    it('should omit nodes that are node elements', () => {
        const elm = createElement('x-text', { is: Text });
        document.body.appendChild(elm);

        const { children } = elm.shadowRoot;
        expect(children.length).toBe(0);
    });

    it('should return the right elements for slotted children', () => {
        const elm = createElement('x-slotted', { is: Slotted });
        document.body.appendChild(elm);

        const container = elm.shadowRoot.querySelector('x-container');
        expect(container.children.length).toBe(1);
        expect(container.shadowRoot.querySelector('slot').children.length).toBe(0);
    });
});

describe('ParentNode.children - Vanilla', () => {
    it('should return the element children on standard Element', () => {
        const elm = document.createElement('div');
        const childA = document.createElement('span');
        const childB = document.createElement('span');
        elm.appendChild(childA);
        elm.appendChild(childB);

        const { children } = elm;
        expect(children.length).toBe(2);
        expect(children[0]).toBe(childA);
        expect(children[1]).toBe(childB);
    });

    it('should return the children on the host element and the shadow root', () => {
        const elm = document.createElement('div');
        const root = elm.attachShadow({ mode: 'open' });
        const elmChild = document.createElement('span');
        const rootChild = document.createElement('span');
        elm.appendChild(elmChild);
        root.appendChild(rootChild);

        expect(elm.children.length).toBe(1);
        expect(elm.children[0]).toBe(elmChild);
        expect(root.children.length).toBe(1);
        expect(root.children[0]).toBe(rootChild);
    });

    // TODO [#2135]: Synthetic shadow doesn't preserve HTMLSlotElement.prototype.children behavior
    it('should return the element children on HTMLSlotElement', () => {
        const elm = document.createElement('div');
        const root = elm.attachShadow({ mode: 'open' });
        const slot = document.createElement('slot');
        const child = document.createElement('span');
        root.appendChild(slot);
        slot.appendChild(child);

        const { children } = slot;
        expect(children.length).toBe(1);
        expect(children[0]).toBe(child);
    });
});
