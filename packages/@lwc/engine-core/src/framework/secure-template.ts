/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { Template } from './template';

const signedTemplateSet: Set<Template> = new Set();

export function defaultEmptyTemplate() {
    return [];
}
signedTemplateSet.add(defaultEmptyTemplate);

export function isTemplateRegistered(tpl: Template): boolean {
    return signedTemplateSet.has(tpl);
}

/**
 * Register a compiled template.
 * This is a security measure to ensure that components can only use a template compiled by the lwc compiler.
 * INTERNAL: This function can only be invoked by compiled code. The compiler will prevent this
 * function from being imported by userland code.
 * @param tpl - Compiled template
 * @returns the registered template
 * @private
 */
export function registerTemplate(tpl: Template): Template {
    signedTemplateSet.add(tpl);
    // chaining this method as a way to wrap existing
    // assignment of templates easily, without too much transformation
    return tpl;
}

/**
 * EXPERIMENTAL: This function acts like a hook for Lightning Locker Service and other similar
 * libraries to sanitize vulnerable attributes.
 * This API is subject to change or being removed.
 * @param tagName - tag name of element
 * @param namespaceUri - namespace of the attribute
 * @param attrName - attribute name
 * @param attrValue - attribute value
 * @returns sanitized attribute value
 * @private
 */
export function sanitizeAttribute(
    tagName: string,
    namespaceUri: string,
    attrName: string,
    attrValue: any
) {
    // locker-service patches this function during runtime to sanitize vulnerable attributes.
    // when ran off-core this function becomes a noop and returns the user authored value.
    return attrValue;
}
