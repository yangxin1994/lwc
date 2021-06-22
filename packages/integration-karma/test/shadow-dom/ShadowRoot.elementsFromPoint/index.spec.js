import { createElement } from 'lwc';
import Container from 'x/container';

function test(element, expectedElementsFromPoint) {
    const { x, y } = element.getBoundingClientRect();
    const rootNode = element.getRootNode();
    const elementsFromPoint = rootNode.elementsFromPoint(x, y);
    expect(elementsFromPoint).toEqual(expectedElementsFromPoint);
    const elementFromPoint = rootNode.elementFromPoint(x, y);
    expect(elementFromPoint).toEqual(expectedElementsFromPoint[0]);
}

describe('ShadowRoot.elementsFromPoint', () => {
    it('has correct elementsFromPoint and elementFromPoint', () => {
        const elm = createElement('x-container', { is: Container });
        document.body.appendChild(elm);

        const { body } = document;
        const html = body.parentElement;
        const h1 = elm.shadowRoot.querySelector('h1');
        const inContainer = elm.shadowRoot.querySelector('.in-container');
        const slottable = elm.shadowRoot.querySelector('x-slottable');
        const slotted = elm.shadowRoot.querySelector('.slotted');
        const component = elm.shadowRoot.querySelector('x-component');
        const inComponent = component.shadowRoot.querySelector('.in-component');
        const inComponentInner = component.shadowRoot.querySelector('.in-component-inner');
        const slotWrapper = slottable.shadowRoot.querySelector('.slot-wrapper');
        const inSlottable = slottable.shadowRoot.querySelector('.in-slottable');
        const inSlottableInner = slottable.shadowRoot.querySelector('.in-slottable-inner');

        test(elm, [elm, body, html]);
        test(h1, [h1, elm, body, html]);
        test(inContainer, [slottable, inContainer, elm, body, html]);
        test(slottable, [slottable, inContainer, elm, body, html]);
        test(slotted, [slotted, slottable, inContainer, elm, body, html]);
        test(component, [component, slottable, inContainer, elm, body, html]);
        test(inComponent, [
            inComponentInner,
            inComponent,
            component,
            slottable,
            inContainer,
            elm,
            body,
            html,
        ]);
        test(inComponentInner, [
            inComponentInner,
            inComponent,
            component,
            slottable,
            inContainer,
            elm,
            body,
            html,
        ]);
        test(slotWrapper, [slotted, slotWrapper, slottable, inContainer, elm, body, html]);
        test(inSlottable, [inSlottableInner, inSlottable, slottable, inContainer, elm, body, html]);
        test(inSlottableInner, [
            inSlottableInner,
            inSlottable,
            slottable,
            inContainer,
            elm,
            body,
            html,
        ]);
    });
});
