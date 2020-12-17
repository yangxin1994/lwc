import { createElement } from 'lwc';

import Slotted from 'x/slotted';
import Nested from 'x/nested';
import NestedFallback from 'x/nestedFallback';

describe('Element.querySelector(All)', () => {
    it('should not match on elements in a different shadow tree', () => {
        const elm = createElement('x-slotted', { is: Slotted });
        document.body.appendChild(elm);

        expect(elm.querySelector('x-slot')).toBe(null);
        expect([...elm.querySelectorAll('x-slot')]).toEqual([]);

        expect(elm.shadowRoot.querySelector('slot')).toBe(null);
        expect([...elm.shadowRoot.querySelectorAll('slot')]).toEqual([]);
    });

    it('should match on elements in the same shadow tree', () => {
        const elm = createElement('x-slotted', { is: Slotted });
        document.body.appendChild(elm);

        const slotHost = elm.shadowRoot.firstChild;
        const slotted1 = elm.shadowRoot.firstChild.firstChild;
        const slotted2 = elm.shadowRoot.firstChild.lastChild;

        expect(elm.shadowRoot.querySelector('x-slot')).toBe(slotHost);
        expect([...elm.shadowRoot.querySelectorAll('x-slot')]).toEqual([slotHost]);

        expect(elm.shadowRoot.querySelector('.slotted')).toBe(slotted1);
        expect([...elm.shadowRoot.querySelectorAll('.slotted')]).toEqual([slotted1, slotted2]);

        expect(slotHost.querySelector('.slotted')).toBe(slotted1);
        expect([...slotHost.querySelectorAll('.slotted')]).toEqual([slotted1, slotted2]);
    });

    it('should not match on slotted content', () => {
        const elm = createElement('x-slotted', { is: Slotted });
        document.body.appendChild(elm);

        const slotHost = elm.shadowRoot.firstChild;
        const slot = slotHost.shadowRoot.firstChild.firstChild;

        expect(slotHost.shadowRoot.querySelector('.slotted')).toBe(null);
        expect([...slotHost.shadowRoot.querySelectorAll('.slotted')]).toEqual([]);

        expect(slot.querySelector('.slotted')).toBe(null);
        expect([...slot.querySelectorAll('.slotted')]).toEqual([]);
    });

    it('should support chaining querySelectors', () => {
        const elm = createElement('x-slotted', { is: Slotted });
        document.body.appendChild(elm);

        const slotted = elm.shadowRoot.firstChild.firstChild;

        expect(elm.shadowRoot.querySelector('x-slot').querySelector('.slotted')).toBe(slotted);
    });

    it('should support nested slots - multi-level', () => {
        const elm = createElement('x-nested', { is: Nested });
        document.body.appendChild(elm);

        const slotHost = elm.shadowRoot.firstChild;
        const slotsInSlotsHost = slotHost.firstChild;
        const slotted = slotsInSlotsHost.firstChild;

        expect(elm.shadowRoot.querySelector('.slotted')).toBe(slotted);
        expect(slotHost.querySelector('.slotted')).toBe(slotted);
        expect(slotsInSlotsHost.querySelector('.slotted')).toBe(slotted);

        expect(elm.querySelector('.slotted')).toBe(null);
        expect(slotHost.shadowRoot.querySelector('.slotted')).toBe(null);
        expect(slotsInSlotsHost.shadowRoot.querySelector('.slotted')).toBe(null);
    });

    it('should support nested slots - slotted fallback content', () => {
        const elm = createElement('x-nested-fallback', { is: NestedFallback });
        document.body.appendChild(elm);

        const slotHost = elm.shadowRoot.firstChild;
        const slot = slotHost.firstChild;
        const slotFallback = slot.firstChild;

        expect(elm.shadowRoot.querySelector('.slotted-fallback')).toBe(slotFallback);
        expect(slotHost.querySelector('.slotted-fallback')).toBe(slotFallback);
        expect(slot.querySelector('.slotted-fallback')).toBe(slotFallback);

        expect(elm.querySelector('.slotted-fallback')).toBe(null);
        expect(slotHost.shadowRoot.querySelector('.slotted-fallback')).toBe(null);
    });
});
