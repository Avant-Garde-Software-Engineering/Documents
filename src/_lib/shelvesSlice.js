import Shelf from "@_classes/Shelf"

export const createShelvesSlice = (set) => ({
	shelves: [new Shelf('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',1,2,3), new Shelf('bx', 1,2,3, 's_a')],      // test, to remove data

	setShelves: (shelves) => set({ shelves }),
	generateShelfIdNo: () => {
		const lastElement = store.getState().shelves.slice(-1)[0];
		if (lastElement) {
			return parseInt(lastElement.id.split('_')[1]);
		} else {
			return 0;
		}
	},
	addShelf: (newShelf) => set((state) => ({ shelves: [...state.shelves, newShelf] })),
	removeShelf: (id) => {   
		// TODO: check if empty ?
		set((state) => ({
			shelves: state.shelves.filter(shelf => shelf.id !== id)
		}));
	},
	// TODO: other functions
})