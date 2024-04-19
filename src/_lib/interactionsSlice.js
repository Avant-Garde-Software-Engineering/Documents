import { binState } from "@_model/Bin"
import Movement from "@_model/Movement";

export const createInteractionsSlice = (set, get) => ({
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
		const fromRow = get().selectedBin.split('-')[1];
		const fromCol = get().selectedBin.split('-')[2];

		if(get().shelves.bins[toRow][toCol].state === binState.EMPTY) {
			const newMovement = new Movement(fromId, fromRow, fromCol, toId, toRow, toCol);
			get().movements.push(newMovement);
			
			get().updateBinState(fromShelf, fromRow, fromCol, binState.OUTGOING);
			get().updateBinState(toShelf, toRow, toCol, binState.INCOMING);
		}
		else {
			get().setError("Il bin di destinazione è occupato. Si prega di sceglierne un altro.");
		}
		//TODO: ask external mechanism to approve the movement
	},
})