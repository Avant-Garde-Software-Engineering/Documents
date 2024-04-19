import fs from 'fs';

export const fileManagementSlice = (set, get) => ({
    filePath: null,

    jsonToState: () => {
        const fileData = fs.readFileSync(jsonFilePath, 'utf-8');

        const data = JSON.parse(fileData);

        get().setWhsName(data.whsName);
        get().setWhsHeight(data.whsHeight);
        get().setWhsPoints(data.whsPoints);
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
        
        const jsonString = JSON.stringify(jsonData, null, 4);
       
        fs.writeFileSync(get().filePath, jsonString, 'utf-8');
    },

    setFilePath: (path) => set({ filePath: path }),
})