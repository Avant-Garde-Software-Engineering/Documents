export const whsSlice = (set, get) => ({
	whsName: null,
	whsHeight: null,
	points: [],

	setWhsName: (name) => set({ whsName: name }),

	setWhsRectangle: (depth, width, height) => set({ 
		whsHeight: height, 
		points: 
			[{ x: 0, z: 0 },
			{ x: 0, z: depth },
			{ x: width, z: 0 },
			{ x: width, z: depth }]
	}), 

	setWhsPolygon: (points, height) => set({ points: points, whsHeight: height }),
})