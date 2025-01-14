import { createElement } from 'lwc';

import Container from 'x/container';
import Two from 'x/two';
import Shadow from 'x/shadow';

describe('Light DOM styling at the global level', () => {
    it('styles bleed into other light DOM but not shadow DOM components in root context', () => {
        const elm = createElement('x-container', { is: Container });
        document.body.appendChild(elm);

        expect(elm.shadowRoot).toBeNull();

        const getColor = (elm) => getComputedStyle(elm).color;

        expect(getColor(elm.querySelector('x-one .globally-styled'))).toEqual('rgb(0, 0, 255)');
        expect(getColor(elm.querySelector('x-two .globally-styled'))).toEqual('rgb(0, 0, 255)');
        // synthetic shadow can't do this kind of style encapsulation
        if (process.env.DISABLE_SYNTHETIC === true) {
            expect(
                getColor(elm.querySelector('x-shadow').shadowRoot.querySelector('.globally-styled'))
            ).toEqual('rgb(0, 0, 0)');
        }

        // sibling elements should also be styled appropriately
        const two = createElement('x-two', { is: Two });
        const shadow = createElement('x-shadow', { is: Shadow });

        document.body.appendChild(two);
        document.body.appendChild(shadow);

        expect(getColor(two.querySelector('.globally-styled'))).toEqual('rgb(0, 0, 255)');
        // synthetic shadow can't do this kind of style encapsulation
        if (process.env.DISABLE_SYNTHETIC === true) {
            expect(getColor(shadow.shadowRoot.querySelector('.globally-styled'))).toEqual(
                'rgb(0, 0, 0)'
            );
        }
    });
});
