import { createElement } from 'lwc';

import Slotted from 'x/slotted';
import TestWithDiv from 'x/testWithDiv';

describe('Element.querySelector - LWC', () => {
    it('should return null if no Element match', () => {
        const elm = createElement('x-slotted', { is: Slotted });
        document.body.appendChild(elm);

        expect(elm.querySelector('.foo')).toBe(null);
        expect(elm.shadowRoot.querySelector('.foo')).toBe(null);
        expect(elm.shadowRoot.firstChild.querySelector('.foo')).toBe(null);
    });

    it('should return the first matching element', () => {
        const elm = createElement('x-slotted', { is: Slotted });
        document.body.appendChild(elm);

        const slotted1 = elm.shadowRoot.firstChild.firstChild;
        expect(elm.shadowRoot.querySelector('.slotted')).toBe(slotted1);
    });

    it('should return matching elements when are manually inserted in same shadow', () => {
        const elm = createElement('x-test-with-div', { is: TestWithDiv });
        document.body.appendChild(elm);

        const divInsideShadow = elm.shadowRoot.querySelector('div');
        const manuallyInsertedElement = document.createElement('span');

        spyOn(console, 'error'); // ignore warning about manipulating node without lwc:dom="manual"
        divInsideShadow.appendChild(manuallyInsertedElement);

        const qsResult = divInsideShadow.querySelector('span');

        expect(qsResult).toBe(manuallyInsertedElement);
    });
});

describe('Element.querySelector - Vanilla', () => {
    it('should return null if no Element match', () => {
        const host = document.createElement('div');
        const root = host.attachShadow({ mode: 'open' });

        expect(host.querySelector('.foo')).toBe(null);
        expect(root.querySelector('.foo')).toBe(null);
    });

    it('should return the first matching element', () => {
        const host = document.createElement('div');
        const root = host.attachShadow({ mode: 'open' });
        const foo1 = document.createElement('div');
        foo1.setAttribute('class', 'foo');
        const foo2 = document.createElement('div');
        foo2.setAttribute('class', 'foo');
        root.append(foo1, foo2);

        expect(root.querySelector('.foo')).toBe(foo1);
    });
});
