import { createElement } from 'lwc';

import Basic from 'x/basic';

describe('HTMLSlotElement.name - LWC', () => {
    it('should return the slot name attribute in the DOM', () => {
        const elm = createElement('x-basic', { is: Basic });
        document.body.appendChild(elm);

        const slots = elm.shadowRoot.querySelectorAll('slot');
        expect(slots[0].getAttribute('name')).toBe(null);
        expect(slots[1].getAttribute('name')).toBe('slot1');
    });

    it('should have property reflecting the attribute', () => {
        const elm = createElement('x-basic', { is: Basic });
        document.body.appendChild(elm);

        const slots = elm.shadowRoot.querySelectorAll('slot');
        expect(slots[0].name).toBe('');
        expect(slots[1].name).toBe('slot1');
    });
});

describe('HTMLSlotElement.name - Vanilla', () => {
    it('should reflect the name attribute', () => {
        const slot = document.createElement('slot');
        expect(slot.name).toBe('');

        slot.name = 'foo';
        expect(slot.getAttribute('name')).toBe('foo');

        slot.setAttribute('name', 'bar');
        expect(slot.name).toBe('bar');

        slot.removeAttribute('name');
        expect(slot.name).toBe('');
    });
});
