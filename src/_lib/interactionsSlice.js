export const createInteractionsSlice = (set) => ({
	intersectingIds: [],
	selectedShelf: null,
	selectedBin: null,
	selectedProduct: null,

	setSelectedShelf: (id = null) => set({ selectedShelf: id }),
	setSelectedProduct: (id = null) => set({ selectedProduct: id }),
	setSelectedBin: (id = null) => set({ selectedBin: id }),
	setIntersectingIds: (newIds) => set({ intersectingIds: newIds }),
	orderMovementFromSelected: (toShelf, toRow, toCol) => {
	// move selectedProduct from selected bin to toShelf 
	// specifically to the bin toRow-toCol
	},
})