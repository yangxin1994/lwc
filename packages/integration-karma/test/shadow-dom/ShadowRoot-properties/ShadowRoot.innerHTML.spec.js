import { createElement } from 'lwc';

import Test from 'x/test';

describe('ShadowRoot.innerHTML- LWC', () => {
    it('get - should enforce the shadow DOM semantic', () => {
        const elm = createElement('x-test', { is: Test });
        document.body.appendChild(elm);

        expect(elm.shadowRoot.innerHTML).toBe('<x-container><div>Slotted Text</div></x-container>');
        expect(elm.shadowRoot.querySelector('x-container').shadowRoot.innerHTML).toBe(
            '<div>Before[<slot></slot>]After</div>'
        );
    });

    it('set - should throw an error', () => {
        const elm = createElement('x-test', { is: Test });
        document.body.appendChild(elm);

        expect(() => {
            elm.shadowRoot.innerHTML = '<span>Hello World!</span>';
        }).toThrowError();
    });
});

describe('ShadowRoot.innerHTML - Vanilla', () => {
    it('set - should create the right DOM nodes', () => {
        const host = document.createElement('div');
        const root = host.attachShadow({ mode: 'open' });
        root.innerHTML = '<span>Hello World!</span>';

        expect(root.childNodes.length).toBe(1);
        expect(root.childNodes[0].tagName).toBe('SPAN');
        expect(root.childNodes[0].childNodes.length).toBe(1);
        expect(root.childNodes[0].childNodes[0].textContent).toBe('Hello World!');
    });

    it('get - should return the right content', () => {
        const container = document.createElement('div');
        const host = document.createElement('x-container');
        container.appendChild(host);
        const root = host.attachShadow({ mode: 'open' });

        const hostChild = document.createElement('div');
        host.appendChild(hostChild);
        hostChild.textContent = 'Slotted Text';

        const rootChild = document.createElement('div');
        root.appendChild(rootChild);
        rootChild.appendChild(document.createTextNode('Before['));
        rootChild.appendChild(document.createElement('slot'));
        rootChild.appendChild(document.createTextNode(']After'));

        expect(container.innerHTML).toBe('<x-container><div>Slotted Text</div></x-container>');
        expect(root.innerHTML).toBe('<div>Before[<slot></slot>]After</div>');
    });
});
