import { createElement } from 'lwc';

import TestWithDiv from 'x/testWithDiv';

describe('Element.getElementsByTagName - LWC', () => {
    it('should return matching elements when are manually inserted in same shadow', () => {
        const elm = createElement('x-test-with-div', { is: TestWithDiv });
        document.body.appendChild(elm);

        const divInsideShadow = elm.shadowRoot.querySelector('div');
        const manuallyInsertedElement = document.createElement('span');

        spyOn(console, 'error'); // ignore warning about manipulating node without lwc:dom="manual"
        divInsideShadow.appendChild(manuallyInsertedElement);

        const qsResult = divInsideShadow.getElementsByTagName('span');

        expect(qsResult.length).toBe(1);
        expect(qsResult[0]).toBe(manuallyInsertedElement);
    });
});

describe('Element.getElementsByTagName - Vanilla', () => {
    it('should return matching elements', () => {
        const host = document.createElement('div');
        const root = host.attachShadow({ mode: 'open' });
        const div = document.createElement('div');
        root.appendChild(div);
        const span = document.createElement('span');
        div.appendChild(span);

        const hostResult = host.getElementsByTagName('span');
        expect(hostResult.length).toBe(0);

        const divResult = div.getElementsByTagName('span');
        expect(divResult.length).toBe(1);
        expect(divResult[0]).toBe(span);
    });
});
