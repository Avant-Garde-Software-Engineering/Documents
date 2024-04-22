import { binState } from "@_model/Bin"
import Movement from "@_model/Movement";

export const interactionsSlice = (set, get) => ({
	intersectingIds: [],
	selectedShelf: null,
	selectedBin: null,
	selectedProduct: null,
	movements: [],

	setMovements: (movements) => set({ movements: movements }),

	selectShelf: (id = null) => set({ selectedShelf: id, selectedProduct: null, selectedBin: null }),

	selectProduct: (id = null) => set({ selectedProduct: id, selectedShelf: null, selectedBin: null }),

	selectBin: (id = null) => set({ selectedBin: id, selectedProduct: null, selectedShelf: null }),

	setIntersectingIds: (newIds) => set({ intersectingIds: newIds }),
	
	orderMovementFromSelected: (toShelf, toRow, toCol) => {
		const fromShelf = get().selectedBin.split('-')[0];
		const fromRow = Number(get().selectedBin.split('-')[1]);
		const fromCol = Number(get().selectedBin.split('-')[2]);

		const shelf = get().shelves.filter(obj => {
			return obj.id === toShelf;
		})[0];

		if(shelf.bins[toRow][toCol].state === binState.EMPTY) {
			const newMovement = new Movement(fromShelf, fromRow, fromCol, toShelf, toRow, toCol);
			set((state) => ({
				movements: [...state.movements, newMovement]
			}));
			
			get().updateBinState(fromShelf, fromRow, fromCol, binState.OUTGOING);
			get().updateBinState(toShelf, toRow, toCol, binState.INCOMING);
		}
		else {
			get().setError("Il bin di destinazione è occupato. Si prega di sceglierne un altro.");
		}
		//TODO: ask external mechanism to approve the movement
	},
})