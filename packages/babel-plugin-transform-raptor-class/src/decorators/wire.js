const { decamelize, findClassProperty, staticClassProperty } = require('../utils');

const WIRE_DECORATOR = 'wire';
const WIRE_CLASS_PROPERTY = 'wire';
const WIRE_PARAM_PREFIX = '$';

const OBSERVED_ATTRIBUTES_CLASS_PROPERTY = 'observedAttributes';
const RENAMED_OBSERVED_ATTRIBUTES_CLASS_PROPERTY = 'originalObservedAttributes';

module.exports = function wireVisitor ({ types: t }) {
    function isObservedProperty(configProperty) {
        const propertyValue = configProperty.get('value');
        return propertyValue.isStringLiteral() &&
            propertyValue.node.value.startsWith(WIRE_PARAM_PREFIX);
    }

    function getObservedAttributesFromWiredValues(wiredValues) {
        return wiredValues.reduce((acc, wiredValue) => {
            return [
                ...acc,
                ...wiredValue.params.map(param => param.value.value),
            ]
        }, []);
    }

    function getWiredStatic(wireConfig) {
        return wireConfig.get('properties')
            .filter(property => !isObservedProperty(property))
            .map(path => path.node);
    }

    function getWiredParams(wireConfig) {
        return wireConfig.get('properties')
            .filter(property => isObservedProperty(property))
            .map(path => {
                // Need to clone deep the observed property to remove the param prefix
                const clonedProperty = t.cloneDeep(path.node);
                clonedProperty.value.value = clonedProperty.value.value.slice(1);

                return clonedProperty;
            });
    }

    function buildWireConfigValue(wiredValues) {
        return t.objectExpression(wiredValues.map(wiredValue => {
            const wireConfig = [
                t.objectProperty(
                    t.identifier('type'),
                    t.stringLiteral(wiredValue.type)
                ),
                t.objectProperty(
                    t.identifier('params'),
                    t.objectExpression(wiredValue.params)
                ),
                t.objectProperty(
                    t.identifier('static'),
                    t.objectExpression(wiredValue.static)
                )
            ];

            if (wiredValue.isClassMethod) {
                wireConfig.push(
                    t.objectProperty(
                        t.identifier('method'),
                        t.numericLiteral(1)
                    )
                );
            }

            return t.objectProperty(
                t.identifier(wiredValue.propertyName),
                t.objectExpression(wireConfig)
            );
        }));
    }

    function getObservedAttributeProperty(classBody) {
        let observedAttribute = findClassProperty(classBody, OBSERVED_ATTRIBUTES_CLASS_PROPERTY , { static: true });

        if (observedAttribute) {
            observedAttribute = observedAttribute.node;

            const clonedObservedProperty = t.cloneDeep(observedAttribute);
            clonedObservedProperty.key.name = RENAMED_OBSERVED_ATTRIBUTES_CLASS_PROPERTY;
            classBody.pushContainer('body', clonedObservedProperty);
        } else {
            observedAttribute = staticClassProperty(
                t,
                OBSERVED_ATTRIBUTES_CLASS_PROPERTY,
                t.arrayExpression([])
            );

            classBody.pushContainer('body', observedAttribute);
        }


        return observedAttribute;
    }

    function buildObservedAttributesValue(wiredValues) {
        const observedAttributes = getObservedAttributesFromWiredValues(wiredValues);
        return observedAttributes.map(attrName => (
            t.stringLiteral(decamelize(attrName))
        ));
    }

    const decoratorVisitor = {
        Decorator(path, { wiredValues }) {
            const isWireDecorator = path.get('expression').isCallExpression() &&
                                    path.get('expression.callee').isIdentifier({ name: WIRE_DECORATOR });

            if (isWireDecorator) {
                const [id, config] = path.get('expression.arguments');

                if (!id || !config) {
                    throw path.buildCodeFrameError(
                        `@wire(<adapterId>, <adapterConfig>) expects 2 parameters.`
                    );
                }

                if (!id.isStringLiteral()) {
                    throw id.buildCodeFrameError(
                        `@wire expects a string as first parameter.`
                    );
                }

                if (!config.isObjectExpression()) {
                    throw config.buildCodeFrameError(
                        `@wire expects a configuration object expression as second parameter.`
                    );
                }

                const propertyName = path.parentPath.get('key.name').node;
                const isClassMethod = path.parentPath.isClassMethod({
                    kind: 'method'
                });

                wiredValues.push({
                    propertyName,
                    isClassMethod,
                    type: id.node.value,
                    static: getWiredStatic(config),
                    params: getWiredParams(config),
                });

                path.remove();
            }
        },
        Class(path) {
            // Only treat the current class and not the nested one
            path.skip();
        }
    };

    return {
        Class(path) {
            const classBody = path.get('body');
            const wiredValues = [];

            path.traverse(decoratorVisitor, { wiredValues });

            if (wiredValues.length) {
                classBody.pushContainer('body', staticClassProperty(
                    t,
                    WIRE_CLASS_PROPERTY,
                    buildWireConfigValue(wiredValues)
                ));

                const observedAttributes = getObservedAttributeProperty(classBody);
                observedAttributes.value.elements.push(
                    ...buildObservedAttributesValue(wiredValues)
                )
            }
        },
    };
}
