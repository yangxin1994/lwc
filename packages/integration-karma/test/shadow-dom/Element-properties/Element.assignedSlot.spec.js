import { createElement } from 'lwc';
import { getHostChildNodes } from 'test-utils';

import SimpleParent from 'x/simpleParent';
import SlottedParent from 'x/slotted';
import SlottedCustomElement from 'x/slottedCustomElement';
import SlotReceiver from 'x/slot';
import CustomElementAsDefaultSlot from 'x/customElementAsDefaultSlot';
import TextSlotted from 'x/textSlotted';

describe('assignedSlot - LWC', () => {
    it('should return null when custom element is not in slot', () => {
        const elm = createElement('x-assigned-slot', { is: SimpleParent });
        document.body.appendChild(elm);

        const child = elm.shadowRoot.querySelector('x-no-slot');
        expect(child.assignedSlot).toBe(null);
    });

    it('should return null when native element is not in slot', () => {
        const elm = createElement('x-assigned-slot', { is: SimpleParent });
        document.body.appendChild(elm);

        const child = elm.shadowRoot.querySelector('div');
        expect(child.assignedSlot).toBe(null);
    });

    it('should return the correct slot when native element is slotted', () => {
        const elm = createElement('x-native-slotted-component', { is: SlottedParent });
        document.body.appendChild(elm);

        const slot = elm.shadowRoot.querySelector('x-slot').shadowRoot.querySelector('slot');
        const child = elm.shadowRoot.querySelector('div');
        expect(child.assignedSlot).toBe(slot);
    });

    it('should return the correct slot when custom element is slotted', () => {
        const elm = createElement('x-custom-slotted-component', { is: SlottedCustomElement });
        document.body.appendChild(elm);

        const slot = elm.shadowRoot.querySelector('x-slot').shadowRoot.querySelector('slot');
        const child = elm.shadowRoot.querySelector('x-child');
        expect(child.assignedSlot).toBe(slot);
    });

    it('should return the correct named slot when native element is slotted', () => {
        const elm = createElement('x-native-slotted-component', { is: SlottedParent });
        document.body.appendChild(elm);

        const slot = elm.shadowRoot.querySelector('x-named-slot').shadowRoot.querySelector('slot');
        const child = elm.shadowRoot.querySelector('div.named');
        expect(child.assignedSlot).toBe(slot);
    });

    it('should return the correct named slot when custom element is slotted', () => {
        const elm = createElement('x-custom-slotted-component', { is: SlottedCustomElement });
        document.body.appendChild(elm);

        const slot = elm.shadowRoot.querySelector('x-named-slot').shadowRoot.querySelector('slot');
        const child = elm.shadowRoot.querySelector('x-child.named');
        expect(child.assignedSlot).toBe(slot);
    });

    it('should return null when native element default slot fallback content', () => {
        const elm = createElement('x-assigned-slot', { is: SlotReceiver });
        document.body.appendChild(elm);

        const child = elm.shadowRoot.querySelector('div');
        expect(child.assignedSlot).toBe(null);
    });

    it('should return null when custom element default slot fallback content', () => {
        const elm = createElement('x-assigned-slot', { is: CustomElementAsDefaultSlot });
        document.body.appendChild(elm);

        const child = elm.shadowRoot.querySelector('x-child');
        expect(child.assignedSlot).toBe(null);
    });

    it('should return the correct slot when text is slotted', () => {
        const elm = createElement('x-native-slotted-component', { is: TextSlotted });
        document.body.appendChild(elm);

        const slot = elm.shadowRoot.querySelector('x-slot').shadowRoot.querySelector('slot');
        const text = getHostChildNodes(elm.shadowRoot.querySelector('x-slot'))[0];
        expect(text.assignedSlot).toBe(slot);
    });
});

describe('assignedSlot - Vanilla', () => {
    it('should return null when element is not in slot', () => {
        const div = document.createElement('div');

        expect(div.assignedSlot).toBe(null);
    });

    it('should return null when text is not in slot', () => {
        const text = document.createTextNode('hello');

        expect(text.assignedSlot).toBe(null);
    });

    it('should return the correct slot when element is slotted', () => {
        const host = document.createElement('div');
        const root = host.attachShadow({ mode: 'open' });
        const slot = document.createElement('slot');
        root.appendChild(slot);
        const slotted = document.createElement('p');
        host.appendChild(slotted);

        expect(slotted.assignedSlot).toBe(slot);
    });

    it('should return the correct slot when text is slotted', () => {
        const host = document.createElement('div');
        const root = host.attachShadow({ mode: 'open' });
        const slot = document.createElement('slot');
        root.appendChild(slot);
        const slotted = document.createTextNode('Hello');
        host.appendChild(slotted);

        expect(slotted.assignedSlot).toBe(slot);
    });

    it('should return the correct named slot when element is slotted', () => {
        const host = document.createElement('div');
        const root = host.attachShadow({ mode: 'open' });
        const slot = document.createElement('slot');
        root.appendChild(slot);
        const namedSlot = document.createElement('slot');
        namedSlot.setAttribute('name', 'foo');
        root.appendChild(namedSlot);
        const slotted = document.createElement('p');
        slotted.setAttribute('slot', 'foo');
        host.appendChild(slotted);

        expect(slotted.assignedSlot).toBe(namedSlot);
    });

    it('should return null when native element default slot fallback content', () => {
        const host = document.createElement('div');
        const root = host.attachShadow({ mode: 'open' });
        const slot = document.createElement('slot');
        root.appendChild(slot);
        const content = document.createElement('p');
        slot.appendChild(content);

        expect(content.assignedSlot).toBe(null);
    });
});
