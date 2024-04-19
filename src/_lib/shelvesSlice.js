import Shelf from "@_model/Shelf"
import { binState } from "@_model/Bin"

export const shelvesSlice = (set, get) => ({
	shelves: [],

	setShelves: (shelves) => set({ shelves: shelves }),

	addShelf: (name, binSize, height, width) => { 
		const newShelf = new Shelf(name, binSize, width, height);

		set((state) => ({
			shelves: [...state.shelves, newShelf] 
		}));
	},

	removeShelf: (id) => {   
		const shelf = get().shelves.find(shelf => shelf.id == id);
		
		let isEmpty = true;
		for (let i = 0; i < shelf.height && isEmpty; i++) {
			for (let j = 0; j < shelf.width && isEmpty; j++) {
				if(shelf.bins[i][j].state != binState.EMPTY)
					isEmpty = false;
			}
		}
		if(!isEmpty) {
			get().setError("Impossibile eliminare. La scaffalatura non è vuota.");	// to test (not sure)
		}
		else {
			set((state) => ({
				shelves: state.shelves.filter(shelf => shelf.id !== id)
			}));
		}
	},

	updateShelfInfo: (id, binSize, width, height) => {
		set((state) => ({	
			shelves: state.shelves.map(shelf => {
				if (shelf.id === id) {
					return {
						...shelf,
						binSize: binSize,
						width: width,
						height: height,
						position: {x: binSize * width / 2, y: binSize * height / 2, z: binSize / 2}
					};
				} else {
					return shelf;
				}
			})
		}));
	},

	updateShelfPosition: (id, x, z) => {	
		set((state) => ({
			shelves: state.shelves.map(shelf => {
				if (shelf.id === id) {
					return {
						...shelf,
						position: {
							...shelf.position,
							x: x,
							z: z,
						},
					};
				} else {
					return shelf;
				}
			})
		}));
	},

	updateBinState: (shelfId, row, col, binState) => {
		set((state) => ({
			shelves: state.shelves.map(shelf => {
				if(shelf.id === shelfId) {
					return {
						...shelf,
						bins: shelf.bins.map(bin => {
							if (bin.id === `${id}-${row}-${col}`) {
								return {
									...bin,
									state: binState,
								}
							}
							else {
								return bin;
							}
						}),
					};
				} else {
					return shelf;
				}
			})
		}));
	},

	flipShelf: (id) => {
		set((state) => ({
			shelves: state.shelves.map(shelf => {
				if (shelf.id === id) {
					return {
						...shelf,
						isFlipped: true,
					};
				} else {
					return shelf;
				}
			})
		}));
	},

	insertProduct: (productId, shelfId, row, col) => {
		set((state) => ({
			shelves: state.shelves.map(shelf => {
				if(shelf.id === shelfId) {
					if(shelf.bins[row][col].state === binState.EMPTY) {
						get().setError("Impossibile inserire il prodotto. Il bin è occupato.");	// to test (not sure)
						return shelf;
					} else {
						return {
							...shelf,
							bins: shelf.bins.map(bin => {
								if (bin.id === `${id}-${row}-${col}`) {
									return {
										...bin,
										state: binState.STILL,
										productId: productId,
									}
								}
								else {
									return bin;
								}
							}),
						};
					}
					
				} else {
					return shelf;
				}
			})
		}));
	},

	removeProductFromBin: (id, row, col) => {
		set((state) => ({
			shelves: state.shelves.map(shelf => {
				if(shelf.id == id) {
					if(shelf.bins[row][col].state == binState.EMPTY) { 
						get().setError("Impossibile eliminare il prodotto. Il bin è vuoto.");	// to test (not sure)
						return shelf;
					} else {
						return {
							...shelf,
							bins: shelf.bins.map(bin => {
								if (bin.id === `${id}-${row}-${col}`) {
									return {
										...bin,
										state: binState.EMPTY,
										productId: null,
									}
								}
								else {
									return bin;
								}
							}),
						};
					}
				}
				else {
					return shelf;
				}
			})
		}));
	},

	getBinsWithProduct: (productId) => {
		let binsIds = [];
		const shelves = get().shelves;
		
		for(let s = 0; s < shelves.length; s++){
			const shelf = shelves[s];
			for (let i = 0; i < shelf.height; i++) {
				for (let j = 0; j < shelf.width; j++) {
					if(shelf.bins[i][j].productId == productId)
						binsIds.push(bins[i][j].id);
				}
			}
		}
		return binsIds;
	}
})