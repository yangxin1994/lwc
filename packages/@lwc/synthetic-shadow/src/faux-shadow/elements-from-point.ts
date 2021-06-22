import { elementsFromPoint as nativeElementsFromPoint } from '../env/document';

export function elementsFromPoint(
    context: Node,
    doc: Document,
    left: number,
    top: number
): Element[] {
    const elements = nativeElementsFromPoint.call(doc, left, top);
    const retargetedElements = [];

    const getAllRootNodes = (element: Node) => {
        const rootNodes = [];
        let currentRootNode = element.getRootNode();
        while (currentRootNode) {
            rootNodes.push(currentRootNode);
            currentRootNode = (currentRootNode as any)?.host?.getRootNode();
        }
        return rootNodes;
    };

    const rootNodes = getAllRootNodes(context);

    const isInThisShadowTree = (element: Element) => {
        const otherRootNodes = getAllRootNodes(element);
        return otherRootNodes.every((node) => rootNodes.includes(node));
    };

    for (let i = 0; i < elements.length; i++) {
        if (isInThisShadowTree(elements[i])) {
            retargetedElements.push(elements[i]);
        }
    }
    return retargetedElements;
}
