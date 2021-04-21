import { create, isUndefined } from '@lwc/shared';

const elementsToStyleContents = new WeakMap<Element, { [content: string]: true } | undefined>();
const elementsToStyleElements = new WeakMap<Element, HTMLStyleElement | undefined>();

export function insertStylesheet(element: Element, content: string) {
    let styleContents = elementsToStyleContents.get(element);
    if (isUndefined(styleContents)) {
        styleContents = create(null);
        elementsToStyleContents.set(element, styleContents);
    }
    if (!isUndefined(styleContents![content])) {
        return;
    }
    styleContents![content] = true;

    let style = elementsToStyleElements.get(element);
    if (isUndefined(style)) {
        style = document.createElement('style');
        style.type = 'text/css';
        style.textContent = content;
        element.insertBefore(style, element.firstChild);
        elementsToStyleElements.set(element, style);
    } else {
        style.textContent += '\n' + content;
    }
}
