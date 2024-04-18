export const createWhsSlice = (set) => ({
	whsName: null,
	whsHeight: null,
	filePath: null,
	points: [],

	setWhsName: (name) => set({ whsName: name }),
	setFilePath: (path) => set({ filePath: path }),
	setWhsRectangle: (depth, width, height) => set({ 
		whsHeight: height, 
		points: 
			[{ x: 0, z: 0 },
			{ x: 0, z: depth },
			{ x: width, z: 0 },
			{ x: width, z: depth }]
	}), 
	setWhsPolygon: (points, height) => set({ points: points, whsHeight: height })
})