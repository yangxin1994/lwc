import { createElement } from 'lwc';

import Test from 'x/test';

describe('Element.innerHTML - LWC', () => {
    describe('get', () => {
        it('should enforce the shadow DOM semantic - x-test', () => {
            const elm = createElement('x-test', { is: Test });
            document.body.appendChild(elm);

            expect(elm.innerHTML).toBe('');
            expect(elm.shadowRoot.querySelector('x-container').innerHTML).toBe(
                '<div>Slotted Text<input name="slotted"></div>'
            );
            expect(elm.shadowRoot.querySelector('div').innerHTML).toBe(
                'Slotted Text<input name="slotted">'
            );
        });

        it('should enforce the shadow DOM semantic - x-container', () => {
            const elm = createElement('x-test', { is: Test });
            document.body.appendChild(elm);

            const container = elm.shadowRoot.querySelector('x-container');
            expect(container.shadowRoot.querySelector('div').innerHTML).toBe(
                'Before[<slot></slot>]After'
            );
            expect(container.shadowRoot.querySelector('slot').innerHTML).toBe('');
        });
    });

    describe('set', () => {
        it('should throw when invoking setter on the host element', () => {
            const elm = createElement('x-test', { is: Test });
            document.body.appendChild(elm);

            expect(() => {
                elm.innerHTML = '<span>Hello World!</span>';
            }).toThrowError(TypeError);
        });

        it('should log an error when invoking setter for an element in the shadow', () => {
            const elm = createElement('x-test', { is: Test });
            document.body.appendChild(elm);

            const div = elm.shadowRoot.querySelector('div');

            expect(() => {
                div.innerHTML = '<span>Hello World!</span>';
            }).toLogErrorDev(
                /\[LWC error\]: The `innerHTML` property is available only on elements that use the `lwc:dom="manual"` directive./
            );
        });
    });
});

describe('Element.innerHTML - Vanilla', () => {
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

            expect(host.innerHTML).toBe('');
            expect(deepHost.innerHTML).toBe('<p>Slotted</p>');
            expect(deepRootChild.innerHTML).toBe('Before[<slot></slot>]After');
        });
    });

    describe('set', () => {
        it('should not throw when invoking setter on the host element', () => {
            const host = document.createElement('div');
            host.attachShadow({ mode: 'open' });

            expect(() => {
                host.innerHTML = '<span>Hello World!</span>';
            }).not.toThrowError();

            expect(host.childNodes.length).toBe(1);
            expect(host.childNodes[0].tagName).toBe('SPAN');
            expect(host.childNodes[0].childNodes[0].textContent).toBe('Hello World!');
        });

        it('should not log an error when invoking setter for an element in the shadow', () => {
            const host = document.createElement('div');
            const root = host.attachShadow({ mode: 'open' });
            const child = document.createElement('div');
            root.appendChild(child);

            expect(() => {
                child.innerHTML = '<span>Hello World!</span>';
            }).not.toLogErrorDev(/.*/);

            expect(child.childNodes.length).toBe(1);
            expect(child.childNodes[0].tagName).toBe('SPAN');
            expect(child.childNodes[0].childNodes[0].textContent).toBe('Hello World!');
        });
    });
});
