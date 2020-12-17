import { createElement } from 'lwc';

import Test from 'x/test';

describe('Element.outerHTML - LWC', () => {
    describe('get', () => {
        it('should enforce the shadow DOM semantic - x-test', () => {
            const elm = createElement('x-test', { is: Test });
            document.body.appendChild(elm);

            expect(elm.outerHTML).toBe('<x-test></x-test>');
            expect(elm.shadowRoot.querySelector('x-container').outerHTML).toBe(
                '<x-container><div>Slotted Text<input name="slotted"></div></x-container>'
            );
            expect(elm.shadowRoot.querySelector('div').outerHTML).toBe(
                '<div>Slotted Text<input name="slotted"></div>'
            );
        });

        it('should enforce the shadow DOM semantic - x-container', () => {
            const elm = createElement('x-test', { is: Test });
            document.body.appendChild(elm);

            const container = elm.shadowRoot.querySelector('x-container');
            expect(container.shadowRoot.querySelector('div').outerHTML).toBe(
                '<div class="container">Before[<slot></slot>]After</div>'
            );
            expect(container.shadowRoot.querySelector('slot').outerHTML).toBe('<slot></slot>');
        });
    });

    describe('set', () => {
        it('should throw when invoking setter on the host element', () => {
            const elm = createElement('x-test', { is: Test });
            document.body.appendChild(elm);

            expect(() => {
                elm.outerHTML = '<span>Hello World!</span>';
            }).toThrowError(TypeError);
        });

        it('should log an error when invoking setter for an element in the shadow', () => {
            const elm = createElement('x-test', { is: Test });
            document.body.appendChild(elm);

            expect(() => {
                const div = elm.shadowRoot.querySelector('div');
                div.outerHTML = '<span>Hello World!</span>';
            }).toThrowError(TypeError);
        });
    });
});

describe('Element.outerHTML - Vanilla', () => {
    describe('get', () => {
        it('should enforce the shadow DOM semantic', () => {
            const host = document.createElement('div');
            const root = host.attachShadow({ mode: 'open' });
            const deepHost = document.createElement('div');
            root.appendChild(deepHost);
            const deepHostChild = document.createElement('p');
            deepHostChild.textContent = 'Slotted';
            deepHost.appendChild(deepHostChild);
            const deepRoot = deepHost.attachShadow({ mode: 'open' });
            const deepRootChild = document.createElement('div');
            deepRoot.appendChild(deepRootChild);
            deepRootChild.append(
                document.createTextNode('Before['),
                document.createElement('slot'),
                document.createTextNode(']After')
            );

            expect(host.outerHTML).toBe('<div></div>');
            expect(deepHost.outerHTML).toBe('<div><p>Slotted</p></div>');
            expect(deepRootChild.outerHTML).toBe('<div>Before[<slot></slot>]After</div>');
        });
    });

    describe('set', () => {
        it('should not throw when invoking setter on the host element', () => {
            const container = document.createElement('div');
            document.body.appendChild(container);
            const host = document.createElement('div');
            host.attachShadow({ mode: 'open' });
            container.appendChild(host);

            expect(() => {
                host.outerHTML = '<span>Hello World!</span>';
            }).not.toThrowError();
            expect(container.firstChild.tagName).toBe('SPAN');
        });
    });
});
