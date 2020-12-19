import { createElement } from 'lwc';
import { extractShadowDataIds } from 'test-utils';

import NoDirectChild from 'x/noDirectChild';
import Basic from 'x/basic';
import SlotsInSlots from 'x/slotsInSlots';
import Complex from 'x/complex';

describe('HTMLElement.[assignedNodes|assignedElements] - LWC', () => {
    describe('ignore non direct host children', () => {
        let elm;
        let nodes;

        beforeAll(() => {
            elm = createElement('x-no-direct-child', { is: NoDirectChild });
            document.body.appendChild(elm);

            nodes = extractShadowDataIds(elm.shadowRoot);
        });

        it('assignedNodes', () => {
            expect(nodes.default1.assignedNodes()).toEqual([nodes.slotted3]);
            expect(nodes.slot1.assignedNodes()).toEqual([nodes.slotted1, nodes.slotted2]);

            expect(nodes.default1.assignedNodes({ flatten: true })).toEqual([nodes.slotted3]);
            expect(nodes.slot1.assignedNodes({ flatten: true })).toEqual([
                nodes.slotted1,
                nodes.slotted2,
            ]);
        });

        it('assignedElements', () => {
            expect(nodes.default1.assignedElements()).toEqual([nodes.slotted3]);
            expect(nodes.slot1.assignedElements()).toEqual([nodes.slotted1, nodes.slotted2]);

            expect(nodes.default1.assignedElements({ flatten: true })).toEqual([nodes.slotted3]);
            expect(nodes.slot1.assignedElements({ flatten: true })).toEqual([
                nodes.slotted1,
                nodes.slotted2,
            ]);
        });
    });

    describe('fallback content basic', () => {
        let elm;
        let nodes;

        beforeAll(() => {
            elm = createElement('x-basic', { is: Basic });
            document.body.appendChild(elm);

            nodes = extractShadowDataIds(elm.shadowRoot);
        });

        it('assignedNodes', () => {
            expect(nodes.default1.assignedNodes()).toEqual([]);
            expect(nodes.slot1.assignedNodes()).toEqual([]);

            expect(nodes.default1.assignedNodes({ flatten: true })).toEqual([
                nodes.default1.firstChild,
                nodes.fallback1,
                nodes.default1.lastChild,
            ]);
            expect(nodes.slot1.assignedNodes({ flatten: true })).toEqual([]);
        });

        it('assignedElements', () => {
            expect(nodes.default1.assignedElements()).toEqual([]);
            expect(nodes.slot1.assignedElements()).toEqual([]);

            expect(nodes.default1.assignedElements({ flatten: true })).toEqual([nodes.fallback1]);
            expect(nodes.slot1.assignedElements({ flatten: true })).toEqual([]);
        });
    });

    describe('fallback content slots in slots', () => {
        let elm;
        let nodes;

        beforeAll(() => {
            elm = createElement('x-slots-in-slots', { is: SlotsInSlots });
            document.body.appendChild(elm);

            nodes = extractShadowDataIds(elm.shadowRoot);
        });

        it('assignedNodes', () => {
            expect(nodes.slot1.assignedNodes()).toEqual([]);
            expect(nodes.slot2.assignedNodes()).toEqual([]);

            expect(nodes.slot1.assignedNodes({ flatten: true })).toEqual([nodes.fallback1]);
            expect(nodes.slot2.assignedNodes({ flatten: true })).toEqual([nodes.fallback1]);
        });

        it('assignedElements', () => {
            expect(nodes.slot1.assignedElements()).toEqual([]);
            expect(nodes.slot2.assignedElements()).toEqual([]);

            expect(nodes.slot1.assignedElements({ flatten: true })).toEqual([nodes.fallback1]);
            expect(nodes.slot2.assignedElements({ flatten: true })).toEqual([nodes.fallback1]);
        });
    });

    describe('fallback content complex', () => {
        let elm;
        let nodes;

        beforeAll(() => {
            elm = createElement('x-complex', { is: Complex });
            document.body.appendChild(elm);

            nodes = extractShadowDataIds(elm.shadowRoot);
        });

        it('assignedNodes', () => {
            expect(nodes.slot1.assignedNodes()).toEqual([nodes.slotted1]);
            expect(nodes.slot2.assignedNodes()).toEqual([]);
            expect(nodes.slot3.assignedNodes()).toEqual([nodes.slot2]);
            expect(nodes.slot4.assignedNodes()).toEqual([]);

            expect(nodes.slot1.assignedNodes({ flatten: true })).toEqual([nodes.slotted1]);
            expect(nodes.slot2.assignedNodes({ flatten: true })).toEqual([
                nodes.slotted1,
                nodes.fallback2,
            ]);
            expect(nodes.slot3.assignedNodes({ flatten: true })).toEqual([
                nodes.slotted1,
                nodes.fallback2,
            ]);
            expect(nodes.slot4.assignedNodes({ flatten: true })).toEqual([
                nodes.slotted1,
                nodes.fallback2,
                nodes.fallback3,
            ]);
        });

        it('assignedElements', () => {
            expect(nodes.slot1.assignedElements()).toEqual([nodes.slotted1]);
            expect(nodes.slot2.assignedElements()).toEqual([]);
            expect(nodes.slot3.assignedElements()).toEqual([nodes.slot2]);
            expect(nodes.slot4.assignedElements()).toEqual([]);

            expect(nodes.slot1.assignedElements({ flatten: true })).toEqual([nodes.slotted1]);
            expect(nodes.slot2.assignedElements({ flatten: true })).toEqual([
                nodes.slotted1,
                nodes.fallback2,
            ]);
            expect(nodes.slot3.assignedElements({ flatten: true })).toEqual([
                nodes.slotted1,
                nodes.fallback2,
            ]);
            expect(nodes.slot4.assignedElements({ flatten: true })).toEqual([
                nodes.slotted1,
                nodes.fallback2,
                nodes.fallback3,
            ]);
        });
    });
});

describe('HTMLElement.[assignedNodes|assignedElements] - Vanilla', () => {
    describe('fallback content', () => {
        let nodes;

        beforeAll(() => {
            const host = document.createElement('div');
            const root = host.attachShadow({ mode: 'open' });

            const defaultSlot = document.createElement('slot');
            defaultSlot.innerHTML = '<b id="fallback1">Default</b> slot fallback';
            root.appendChild(defaultSlot);

            const namedSlot = document.createElement('slot');
            namedSlot.setAttribute('name', 'named');
            namedSlot.innerHTML = '<b id="fallback2">Named</b> slot fallback';
            root.appendChild(namedSlot);

            nodes = {
                host,
                root,
                defaultSlot,
                namedSlot,
            };
        });

        it('assignedNodes', () => {
            expect(nodes.defaultSlot.assignedNodes()).toEqual([]);
            expect(nodes.namedSlot.assignedNodes()).toEqual([]);

            expect(nodes.defaultSlot.assignedNodes({ flatten: true })).toEqual([
                nodes.root.querySelector('#fallback1'),
                nodes.defaultSlot.childNodes[1],
            ]);
            expect(nodes.namedSlot.assignedNodes({ flatten: true })).toEqual([
                nodes.root.querySelector('#fallback2'),
                nodes.defaultSlot.childNodes[1],
            ]);
        });

        it('assignedElements', () => {
            expect(nodes.defaultSlot.assignedElements()).toEqual([]);
            expect(nodes.namedSlot.assignedElements()).toEqual([]);

            expect(nodes.defaultSlot.assignedElements({ flatten: true })).toEqual([
                nodes.root.querySelector('#fallback1'),
            ]);
            expect(nodes.namedSlot.assignedElements({ flatten: true })).toEqual([
                nodes.root.querySelector('#fallback2'),
            ]);
        });
    });
});
