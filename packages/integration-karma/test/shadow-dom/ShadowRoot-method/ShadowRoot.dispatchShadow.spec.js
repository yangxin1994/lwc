import { createElement } from 'lwc';

import Container from 'x/container';

describe('ShadowRoot.dispatchEvent - LWC', () => {
    function testEventing(eventInit, expectedLogs) {
        it(`should invoke listeners as expected for ${JSON.stringify(eventInit)}`, () => {
            const elm = createElement('x-container', { is: Container });
            document.body.appendChild(elm);
            elm.rootDispatchEvent(eventInit);
            expect(elm.getLogs()).toEqual(expectedLogs);
        });
    }

    testEventing({ bubbles: false, composed: false }, [
        'listen-on-root-from-instance',
        'listen-on-root-from-element',
    ]);

    testEventing({ bubbles: false, composed: true }, [
        'listen-on-root-from-instance',
        'listen-on-root-from-element',
        'listen-on-host-from-template',
        'listen-on-host-from-instance',
        'listen-on-host-from-element',
    ]);

    testEventing({ bubbles: true, composed: false }, [
        'listen-on-root-from-instance',
        'listen-on-root-from-element',
    ]);

    testEventing({ bubbles: true, composed: true }, [
        'listen-on-root-from-instance',
        'listen-on-root-from-element',
        'listen-on-host-from-template',
        'listen-on-host-from-instance',
        'listen-on-host-from-element',
    ]);
});

describe('ShadowRoot.dispatchEvent - Vanilla', () => {
    function testEventing(eventInit, expectedLog) {
        it(`should invoke listeners as expected for ${JSON.stringify(eventInit)}`, () => {
            const host = document.createElement('div');
            const root = host.attachShadow({ mode: 'open' });

            const logs = [];
            host.addEventListener('test', () => {
                logs.push('listen-on-host');
            });
            root.addEventListener('test', () => {
                logs.push('listen-on-root');
            });

            const evt = new CustomEvent('test', eventInit);
            root.dispatchEvent(evt);

            expect(logs).toEqual(expectedLog);
        });
    }

    testEventing({ bubbles: false, composed: false }, ['listen-on-root']);

    testEventing({ bubbles: false, composed: true }, ['listen-on-root', 'listen-on-host']);

    testEventing({ bubbles: true, composed: false }, ['listen-on-root']);

    testEventing({ bubbles: true, composed: true }, ['listen-on-root', 'listen-on-host']);
});
