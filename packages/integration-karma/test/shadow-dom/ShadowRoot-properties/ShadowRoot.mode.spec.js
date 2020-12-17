import { LightningElement } from 'lwc';
import { createElement } from 'lwc';

describe('ShadowRoot.mode - LWC', () => {
    function testShadowRootMode(mode, expectedMode) {
        it(`should return ${expectedMode} when creating element with mode=${mode}`, () => {
            let shadowRoot;

            class Test extends LightningElement {
                connectedCallback() {
                    shadowRoot = this.template;
                }
            }

            const elm = createElement('x-test', { is: Test, mode });
            document.body.appendChild(elm);

            expect(shadowRoot.mode).toBe(expectedMode);
        });
    }

    testShadowRootMode(undefined, 'open');
    testShadowRootMode('open', 'open');
    testShadowRootMode('closed', 'closed');
});

describe('ShadowRoot.mode - Vanilla', () => {
    function testShadowRootMode(mode, expectedMode) {
        it(`should return ${expectedMode} when creating element with mode=${mode}`, () => {
            const host = document.createElement('div');
            const root = host.attachShadow({ mode });

            expect(root.mode).toBe(expectedMode);
        });
    }

    testShadowRootMode('open', 'open');
    testShadowRootMode('closed', 'closed');
});
