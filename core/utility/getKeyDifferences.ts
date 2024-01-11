function getKeyDifferences(obj1: any, obj2: any): Record<string, [any, any]> {
    const differentPairs: Record<string, [any, any]> = {};

    // Helper function to check if two values are equal
    const isEqual = (value1: any, value2: any): boolean => {
        if (typeof value1 !== typeof value2) {
            return false;
        }

        if (typeof value1 !== 'object') {
            return value1 === value2;
        }

        return JSON.stringify(value1) === JSON.stringify(value2);
    };

    // Recursive function to compare objects
    const compareObjects = (objA: any, objB: any, path: string): void => {
        for (const key in objA) {
            if (objA.hasOwnProperty(key)) {
                const newPath = path ? `${path}.${key}` : key;

                if (!objB.hasOwnProperty(key)) {
                    differentPairs[newPath] = [objA[key], undefined];
                } else if (!isEqual(objA[key], objB[key])) {
                    if (typeof objA[key] === 'object' && typeof objB[key] === 'object') {
                        compareObjects(objA[key], objB[key], newPath);
                    } else {
                        differentPairs[newPath] = [objA[key], objB[key]];
                    }
                }
            }
        }

        for (const key in objB) {
            if (objB.hasOwnProperty(key) && !objA.hasOwnProperty(key)) {
                const newPath = path ? `${path}.${key}` : key;
                differentPairs[newPath] = [undefined, objB[key]];
            }
        }
    };

    // Start the comparison
    compareObjects(obj1, obj2, '');

    return differentPairs;
}

export default getKeyDifferences;
