import { createElement } from 'lwc';

import Parent from 'x/parent';

// Macro-task timing is used because MutationObserver used in
// slotchange implementation is not exactly micro-task timing.
function waitForSlotChange() {
    return new Promise(setTimeout);
}

describe('HTMLSlotElement.slotchange - LWC', () => {
    let parent;
    let child;

    beforeEach(async () => {
        parent = createElement('x-parent', { is: Parent });
        document.body.appendChild(parent);
        child = parent.shadowRoot.querySelector('x-child');

        await waitForSlotChange();
    });

    it('should fire slotchange on initial render', () => {
        expect(child.getSlotChangeCount()).toBe(1);
    });

    it('should fire non-composed slotchange', () => {
        expect(parent.getSlotChangeCount()).toBe(0);
    });

    it('should fire slotchange on add', () => {
        child.setSlotChangeCount(0);
        parent.add();

        return waitForSlotChange().then(() => {
            expect(child.getSlotChangeCount()).toBe(1);
        });
    });

    it('should fire slotchange on remove', () => {
        child.setSlotChangeCount(0);
        parent.clear();

        return waitForSlotChange().then(() => {
            expect(child.getSlotChangeCount()).toBe(1);
        });
    });

    it('should fire slotchange on replace', () => {
        child.setSlotChangeCount(0);
        parent.replace();

        return waitForSlotChange().then(() => {
            expect(child.getSlotChangeCount()).toBe(1);
        });
    });

    it('should fire slotchange when listener added programmatically', () => {
        let count = 0;

        child.shadowRoot.querySelector('slot').addEventListener('slotchange', () => {
            count += 1;
        });

        parent.add();

        return waitForSlotChange().then(() => {
            expect(count).toBe(1);
        });
    });
});

describe('HTMLSlotElement.slotchange - Vanilla', () => {
    it('should fire slotchange on element insertion', () => {
        const host = document.createElement('div');
        const root = host.attachShadow({ mode: 'open' });
        const slot = document.createElement('slot');
        root.appendChild(slot);

        const handler = jasmine.createSpy();
        slot.addEventListener('slotchange', handler);

        const child = document.createElement('span');
        host.appendChild(child);

        return waitForSlotChange().then(() => {
            expect(handler).toHaveBeenCalledTimes(1);
        });
    });

    it('should fire slotchange on text content change', () => {
        const host = document.createElement('div');
        const root = host.attachShadow({ mode: 'open' });
        const slot = document.createElement('slot');
        root.appendChild(slot);

        const handler = jasmine.createSpy();
        slot.addEventListener('slotchange', handler);

        host.textContent = 'New content';

        return waitForSlotChange().then(() => {
            expect(handler).toHaveBeenCalledTimes(1);
        });
    });

    it('should fire slotchange on element remove', () => {
        const host = document.createElement('div');
        const child = document.createElement('span');
        host.appendChild(child);
        const root = host.attachShadow({ mode: 'open' });
        const slot = document.createElement('slot');
        root.appendChild(slot);

        const handler = jasmine.createSpy();
        slot.addEventListener('slotchange', handler);

        host.removeChild(child);

        return waitForSlotChange().then(() => {
            expect(handler).toHaveBeenCalledTimes(1);
        });
    });
});
