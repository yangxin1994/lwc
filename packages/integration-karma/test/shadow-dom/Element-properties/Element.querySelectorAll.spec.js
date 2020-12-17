import { createElement } from 'lwc';

import Slotted from 'x/slotted';
import TestWithDiv from 'x/testWithDiv';

describe('Element.querySelectorAll', () => {
    it('should return an empty NodeList if no Elements match', () => {
        const elm = createElement('x-slotted', { is: Slotted });
        document.body.appendChild(elm);

        const hostQuery = elm.querySelectorAll('.foo');
        expect(hostQuery instanceof NodeList).toBe(true);
        expect(hostQuery.length).toBe(0);

        const shadowRootQuery = elm.shadowRoot.querySelectorAll('.foo');
        expect(shadowRootQuery instanceof NodeList).toBe(true);
        expect(shadowRootQuery.length).toBe(0);

        const shadowTreeQuery = elm.shadowRoot.firstChild.querySelectorAll('.foo');
        expect(shadowTreeQuery instanceof NodeList).toBe(true);
        expect(shadowTreeQuery.length).toBe(0);
    });

    it('should return the all the matching elements', () => {
        const elm = createElement('x-slotted', { is: Slotted });
        document.body.appendChild(elm);

        const slotted1 = elm.shadowRoot.firstChild.firstChild;
        const slotted2 = elm.shadowRoot.firstChild.lastChild;

        const nodeList = elm.shadowRoot.querySelectorAll('.slotted');
        expect(nodeList.length).toBe(2);
        expect(nodeList[0]).toBe(slotted1);
        expect(nodeList[1]).toBe(slotted2);
    });

    it('should return matching elements when are manually inserted in same shadow', () => {
        const elm = createElement('x-test-with-div', { is: TestWithDiv });
        document.body.appendChild(elm);

        const divInsideShadow = elm.shadowRoot.querySelector('div');
        const manuallyInsertedElement = document.createElement('span');

        spyOn(console, 'error'); // ignore warning about manipulating node without lwc:dom="manual"
        divInsideShadow.appendChild(manuallyInsertedElement);

        const qsResult = divInsideShadow.querySelectorAll('span');

        expect(qsResult.length).toBe(1);
        expect(qsResult[0]).toBe(manuallyInsertedElement);
    });
});

describe('Element.querySelector - Vanilla', () => {
    it('should return an empty NodeList if no Elements match', () => {
        const host = document.createElement('div');
        const root = host.attachShadow({ mode: 'open' });

        const hostQuery = host.querySelectorAll('.foo');
        expect(hostQuery instanceof NodeList).toBe(true);
        expect(hostQuery.length).toBe(0);

        const rootQuery = root.querySelectorAll('.foo');
        expect(rootQuery instanceof NodeList).toBe(true);
        expect(rootQuery.length).toBe(0);
    });

    it('should return the all the matching elements', () => {
        const host = document.createElement('div');
        const root = host.attachShadow({ mode: 'open' });
        const foo1 = document.createElement('div');
        foo1.setAttribute('class', 'foo');
        const foo2 = document.createElement('div');
        foo2.setAttribute('class', 'foo');
        root.append(foo1, foo2);

        const nodeList = root.querySelectorAll('.foo');
        expect(nodeList.length).toBe(2);
        expect(nodeList[0]).toBe(foo1);
        expect(nodeList[1]).toBe(foo2);
    });
});
