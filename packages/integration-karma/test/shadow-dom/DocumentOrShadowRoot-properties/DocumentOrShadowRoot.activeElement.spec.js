import { createElement } from 'lwc';

import WithInput from 'x/withInput';
import WithInputDeep from 'x/withInputDeep';
import WithLwcDomManual from 'x/withLwcDomManual';
import SlottedInput from 'x/slottedInput';

beforeEach(() => {
    // Reset the active element if needed
    if (document.activeElement.blur) {
        document.activeElement.blur();
    }
});

describe('DocumentOrShadowRoot.activeElement - LWC', () => {
    describe('Document', () => {
        it('should return the host element', () => {
            const elm = createElement('x-with-input', { is: WithInput });
            document.body.appendChild(elm);

            const input = elm.shadowRoot.querySelector('input');
            input.focus();

            expect(document.activeElement).toBe(elm);
        });

        it('should return the most outer host element', () => {
            const elm = createElement('x-with-input-deep', { is: WithInputDeep });
            document.body.appendChild(elm);

            const withInput = elm.shadowRoot.querySelector('x-with-input');
            const input = withInput.shadowRoot.querySelector('input');
            input.focus();

            expect(document.activeElement).toBe(elm);
        });
    });

    describe('ShadowRoot', () => {
        it('should return the focused element in the shadow tree', () => {
            const elm = createElement('x-with-input', { is: WithInput });
            document.body.appendChild(elm);

            expect(elm.shadowRoot.activeElement).toBe(null);

            const input = elm.shadowRoot.querySelector('input');
            input.focus();
            expect(elm.shadowRoot.activeElement).toBe(input);

            // Losing the focus when removing the element from the document
            document.body.removeChild(elm);
            expect(elm.shadowRoot.activeElement).toBe(null);
        });

        it('should retarget the active element in the context of the current shadow', () => {
            const elm = createElement('x-with-input-deep', { is: WithInputDeep });
            document.body.appendChild(elm);

            const withInput = elm.shadowRoot.querySelector('x-with-input');
            const input = withInput.shadowRoot.querySelector('input');
            input.focus();

            expect(elm.shadowRoot.activeElement).toBe(withInput);
        });

        it("should return the focus element even if it's added manually in the DOM", () => {
            const elm = createElement('x-with-lwc-dom-manual', { is: WithLwcDomManual });
            document.body.appendChild(elm);

            const input = document.createElement('input');
            elm.shadowRoot.querySelector('div').appendChild(input);
            input.focus();

            expect(elm.shadowRoot.activeElement).toBe(input);
        });

        it('should return null if no element is active', () => {
            const elm = createElement('x-with-lwc-dom-manual', { is: WithLwcDomManual });
            document.body.appendChild(elm);

            expect(elm.shadowRoot.activeElement).toBe(null);
        });

        it('should return null if the active element is outside the shadow tree', () => {
            const elm = createElement('x-with-lwc-dom-manual', { is: WithLwcDomManual });
            document.body.appendChild(elm);

            const input = document.createElement('input');
            document.body.appendChild(input);
            input.focus();

            expect(elm.shadowRoot.activeElement).toBe(null);
        });

        it('should return the right active element when slotted', () => {
            const elm = createElement('x-slotted-input', { is: SlottedInput });
            document.body.appendChild(elm);

            const container = elm.shadowRoot.querySelector('x-container');
            const withInput = elm.shadowRoot.querySelector('x-with-input');
            const input = withInput.shadowRoot.querySelector('input');

            input.focus();

            expect(container.shadowRoot.activeElement).toBe(null);
            expect(withInput.shadowRoot.activeElement).toBe(input);
            expect(elm.shadowRoot.activeElement).toBe(withInput);
        });
    });
});

describe('DocumentOrShadowRoot.activeElement - Vanilla', () => {
    describe('Document', () => {
        it('should return the host element', () => {
            const host = document.createElement('div');
            document.body.appendChild(host);
            const root = host.attachShadow({ mode: 'open' });
            const input = document.createElement('input');
            root.appendChild(input);

            input.focus();

            expect(document.activeElement).toBe(host);
        });
    });

    describe('ShadowRoot', () => {
        it('should return the focused element in the shadow tree', () => {
            const host = document.createElement('div');
            document.body.appendChild(host);
            const root = host.attachShadow({ mode: 'open' });
            const input = document.createElement('input');
            root.appendChild(input);

            expect(root.activeElement).toBe(null);

            input.focus();
            expect(root.activeElement).toBe(input);

            // Losing the focus when removing the element from the document
            document.body.appendChild(host);
            expect(root.activeElement).toBe(null);
        });

        it('should retarget the active element in the context of the current shadow', () => {
            const host = document.createElement('div');
            document.body.appendChild(host);
            const root = host.attachShadow({ mode: 'open' });
            const deepHost = document.createElement('div');
            root.appendChild(deepHost);
            const deepRoot = deepHost.attachShadow({ mode: 'open' });
            const input = document.createElement('input');
            deepRoot.appendChild(input);

            input.focus();

            expect(root.activeElement).toBe(deepHost);
            expect(deepRoot.activeElement).toBe(input);
        });

        it('should return the right active element when slotted', () => {
            const host = document.createElement('div');
            document.body.appendChild(host);
            const root = host.attachShadow({ mode: 'open' });
            const deepHost = document.createElement('div');
            root.appendChild(deepHost);
            const deepRoot = deepHost.attachShadow({ mode: 'open' });
            const deepSlot = document.createElement('slot');
            deepRoot.appendChild(deepSlot);
            const input = document.createElement('input');
            deepHost.appendChild(input);

            input.focus();

            expect(root.activeElement).toBe(input);
            expect(deepRoot.activeElement).toBe(null);
        });
    });
});
