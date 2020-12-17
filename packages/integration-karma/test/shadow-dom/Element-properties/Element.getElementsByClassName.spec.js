import { createElement } from 'lwc';

import TestWithDiv from 'x/testWithDiv';

describe('Element.getElementsByClassName - LWC', () => {
    it('should return matching elements when are manually inserted in same shadow', () => {
        const elm = createElement('x-test-with-div', { is: TestWithDiv });
        document.body.appendChild(elm);

        const divInsideShadow = elm.shadowRoot.querySelector('div');
        const manuallyInsertedElement = document.createElement('span');
        manuallyInsertedElement.className = 'test-class';

        spyOn(console, 'error'); // ignore warning about manipulating node without lwc:dom="manual"
        divInsideShadow.appendChild(manuallyInsertedElement);

        const qsResult = divInsideShadow.getElementsByClassName('test-class');

        expect(qsResult.length).toBe(1);
        expect(qsResult[0]).toBe(manuallyInsertedElement);
    });
});

describe('Element.getElementsByClassName - Vanilla', () => {
    it('should return matching elements', () => {
        const host = document.createElement('div');
        const root = host.attachShadow({ mode: 'open' });
        const div = document.createElement('div');
        root.appendChild(div);
        const span = document.createElement('span');
        span.setAttribute('class', 'test-class');
        div.appendChild(span);

        const hostResult = host.getElementsByClassName('test-class');
        expect(hostResult.length).toBe(0);

        const divResult = div.getElementsByClassName('test-class');
        expect(divResult.length).toBe(1);
        expect(divResult[0]).toBe(span);
    });
});
