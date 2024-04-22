export const fileManagementSlice = (set, get) => ({
    jsonToState: (fileData) => {
        const data = JSON.parse(fileData);

        get().setWhsName(data.whsName);
        get().setWhsPolygon(data.whsPoints, data.whsHeight);
        get().setProducts(data.products);
        get().setShelves(data.shelves);
        get().setMovements(data.movements);
    },

    stateToJson: () => {
        const productJsonArray = JSON.stringify(get().products);
        const shelfJsonArray = JSON.stringify(get().shelves);
        const movementsJsonArray = JSON.stringify(get().movements);
        const pointsJsonData = JSON.stringify(get().points);
        
        const jsonData = {
            whsName: get().whsName,
            whsHeight: get().whsHeight,
            whsPoints: pointsJsonData,
            products: productJsonArray,
            shelves: shelfJsonArray,
            movements: movementsJsonArray
        };
        
        return JSON.stringify(jsonData, null, 4);
    },

    svgToState: (svgData, height) => {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgData, "image/svg+xml");
        const polygons = svgDoc.getElementsByTagName('polygon');
        
        const firstPolygon = Array.from(polygons).find(polygon => polygon.getAttribute('points'));
        const points = firstPolygon.getAttribute('points').trim().split(' ').map(point => {
            const [x, z] = point.split(',').map(Number).map(num => parseFloat(num.toFixed(2)));
            return { x, z };
        });

        // Translate the center of the polygon in (x: 0, z: 0)          TO CHECK: not sure
        const centroid = {
            x: points.reduce((sum, vertex) => sum + vertex.x, 0) / points.length,
            z: points.reduce((sum, vertex) => sum + vertex.z, 0) / points.length
        };

        const translatedPoints = points.map(vertex => ({
            x: parseFloat((vertex.x - centroid.x).toFixed(2)),
            z: parseFloat((vertex.z - centroid.z).toFixed(2))
        }));

        get().setWhsPolygon(translatedPoints, parseFloat(height));
    }
})