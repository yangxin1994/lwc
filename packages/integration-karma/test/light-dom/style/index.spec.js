import { createElement } from 'lwc';
import Container from 'x/container';

describe('Light DOM styling', () => {
    it('styles bleed into other light DOM but not shadow DOM components', () => {
        const elm = createElement('x-container', { is: Container });
        document.body.appendChild(elm);

        expect(elm.shadowRoot).toBeNull();

        const getColor = (elm) => getComputedStyle(elm).color;

        expect(getColor(elm.querySelector('x-one p'))).toEqual('rgb(255, 0, 0)');
        expect(getColor(elm.querySelector('x-two p'))).toEqual('rgb(255, 0, 0)');
        expect(getColor(elm.querySelector('x-shadow').shadowRoot.querySelector('p'))).toEqual(
            'rgb(0, 0, 0)'
        );
    });
});
