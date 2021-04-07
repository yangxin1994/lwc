/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

export type HostNode = any;
export type HostElement = any;

/**
 * API contract that `@lwc/engine-core` relies on to render content in a given environment.
 * @interface
 */
export interface Renderer<N = HostNode, E = HostElement> {
    /** If true, use server side rendering */
    ssr: boolean;
    /** If true, environment relies on `@lwc/synthetic-shadow` */
    syntheticShadow: boolean;
    /** Insert element into DOM tree*/
    insert(node: N, parent: E, anchor: N | null): void;
    /** Remove element from DOM tree */
    remove(node: N, parent: E): void;
    /** Create an element with specified tag name */
    createElement(tagName: string, namespace?: string): E;
    /** Create a text node */
    createText(content: string): N;
    /** Get the next sibling of a node */
    nextSibling(node: N): N | null;
    /** Attach shadow tree to an element */
    attachShadow(element: E, options: ShadowRootInit): N;
    /** Get value of public property of node */
    getProperty(node: N, key: string): any;
    /** Set value of public property of node */
    setProperty(node: N, key: string, value: any): void;
    /** Set text content of node */
    setText(node: N, content: string): void;
    /** Get attribute value of node */
    getAttribute(element: E, name: string, namespace?: string | null): string | null;
    /** Set attribute value of node */
    setAttribute(element: E, name: string, value: string, namespace?: string | null): void;
    /** Remove attribute from node */
    removeAttribute(element: E, name: string, namespace?: string | null): void;
    /** Add an event listener to target node */
    addEventListener(
        target: E,
        type: string,
        callback: (event: Event) => any,
        options?: AddEventListenerOptions | boolean
    ): void;
    /** Remove an event listener from target node */
    removeEventListener(
        target: E,
        type: string,
        callback: (event: Event) => any,
        options?: EventListenerOptions | boolean
    ): void;
    /** Dispatch given event on target node */
    dispatchEvent(target: N, event: Event): boolean;
    /** Get style class list of element */
    getClassList(element: E): DOMTokenList;
    setCSSStyleProperty(element: E, name: string, value: string): void;
    getBoundingClientRect(element: E): ClientRect;
    /** Query for first descendant of given node that matches selector */
    querySelector(element: E, selectors: string): E | null;
    /** Query for all descendants of given node that matches selector */
    querySelectorAll(element: E, selectors: string): NodeList;
    /** Query for all descendants of given node that matches tagName */
    getElementsByTagName(element: E, tagNameOrWildCard: string): HTMLCollection;
    /** Query for all descendants of given node that matches class */
    getElementsByClassName(element: E, names: string): HTMLCollection;
    /** Is node connected to the context object( e.g. the Document) */
    isConnected(node: N): boolean;
    insertGlobalStylesheet(content: string): void;
    assertInstanceOfHTMLElement?(elm: any, msg: string): void;
    /** Register a constructor for the given tagName */
    defineCustomElement(
        name: string,
        constructor: CustomElementConstructor,
        options?: ElementDefinitionOptions
    ): void;
    /** Get registered constructor for given tagName */
    getCustomElement(name: string): CustomElementConstructor | undefined;
    HTMLElement: typeof HTMLElement;
}

// This is a temporary workaround to get the @lwc/engine-server to evaluate in node without having
// to inject at runtime.
export const HTMLElementConstructor: typeof HTMLElement =
    typeof HTMLElement !== 'undefined' ? HTMLElement : (function () {} as any);
export const HTMLElementPrototype = HTMLElementConstructor.prototype;
