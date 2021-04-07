/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const {
    assign,
    create,
    defineProperties,
    defineProperty,
    freeze,
    getOwnPropertyDescriptor,
    getOwnPropertyNames,
    getPrototypeOf,
    hasOwnProperty,
    isFrozen,
    keys,
    seal,
    setPrototypeOf,
} = Object;

const { isArray } = Array;

const {
    filter: ArrayFilter,
    find: ArrayFind,
    indexOf: ArrayIndexOf,
    join: ArrayJoin,
    map: ArrayMap,
    push: ArrayPush,
    reduce: ArrayReduce,
    reverse: ArrayReverse,
    slice: ArraySlice,
    splice: ArraySplice,
    unshift: ArrayUnshift,
    forEach,
} = Array.prototype;

const { fromCharCode: StringFromCharCode } = String;

const {
    charCodeAt: StringCharCodeAt,
    replace: StringReplace,
    slice: StringSlice,
    toLowerCase: StringToLowerCase,
} = String.prototype;

export {
    ArrayFilter,
    ArrayFind,
    ArrayIndexOf,
    ArrayJoin,
    ArrayMap,
    ArrayPush,
    ArrayReduce,
    ArrayReverse,
    ArraySlice,
    ArraySplice,
    ArrayUnshift,
    assign,
    create,
    defineProperties,
    defineProperty,
    forEach,
    freeze,
    getOwnPropertyDescriptor,
    getOwnPropertyNames,
    getPrototypeOf,
    hasOwnProperty,
    isArray,
    isFrozen,
    keys,
    seal,
    setPrototypeOf,
    StringCharCodeAt,
    StringReplace,
    StringSlice,
    StringToLowerCase,
    StringFromCharCode,
};

/**
 * Check if given value is a undefined
 * @param obj value to check
 * @returns {obj is undefined}
 */
export function isUndefined(obj: any): obj is undefined {
    return obj === undefined;
}

/**
 * Check if given value is null
 * @param obj value to check
 * @returns {obj is null}
 */
export function isNull(obj: any): obj is null {
    return obj === null;
}

/**
 * Check if given value is true
 * @param obj value to check
 * @returns {obj is true}
 */
export function isTrue(obj: any): obj is true {
    return obj === true;
}

/**
 * Check if given value is false
 * @param obj value to check
 * @returns {obj is false}
 */
export function isFalse(obj: any): obj is false {
    return obj === false;
}

/**
 * Check if given value is a boolean
 * @param obj value to check
 * @returns {obj is boolean}
 */
export function isBoolean(obj: any): obj is boolean {
    return typeof obj === 'boolean';
}

/**
 * Check if given value is a function
 * @param obj value to check
 * @returns {obj is function}
 */
export function isFunction(obj: any): obj is Function {
    return typeof obj === 'function';
}

/**
 * Check if given value is an object
 * @param obj value to check
 * @returns {obj is object}
 */
export function isObject(obj: any): obj is object {
    return typeof obj === 'object';
}

/**
 * Check if given value is a string
 * @param obj value to check
 * @returns {obj is string}
 */
export function isString(obj: any): obj is string {
    return typeof obj === 'string';
}

/**
 * Check if given value is a number
 * @param obj value to check
 * @returns {obj is number}
 */
export function isNumber(obj: any): obj is number {
    return typeof obj === 'number';
}

const OtS = {}.toString;
export function toString(obj: any): string {
    if (obj && obj.toString) {
        // Arrays might hold objects with "null" prototype So using
        // Array.prototype.toString directly will cause an error Iterate through
        // all the items and handle individually.
        if (isArray(obj)) {
            return ArrayJoin.call(ArrayMap.call(obj, toString), ',');
        }
        return obj.toString();
    } else if (typeof obj === 'object') {
        return OtS.call(obj);
    } else {
        return obj + '';
    }
}

export function getPropertyDescriptor(o: any, p: PropertyKey): PropertyDescriptor | undefined {
    do {
        const d = getOwnPropertyDescriptor(o, p);
        if (!isUndefined(d)) {
            return d;
        }
        o = getPrototypeOf(o);
    } while (o !== null);
}
