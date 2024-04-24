import { binState } from "@_model/Bin"
import Movement from "@_model/Movement";

export const interactionsSlice = (set, get) => ({
	intersectingIds: [],
	selectedShelf: null,
	selectedBin: null,
	selectedProduct: null,
	movements: [],

	setMovements: (movements) => set({ movements: movements.map(movement => {
		return new Movement(movement.fromId, movement.fromRow, movement.fromCol, movement.toId, movement.toRow, movement.toCol, movement.id);
	}) }),

	selectShelf: (id = null) => set({ selectedShelf: id, selectedProduct: null, selectedBin: null }),

	selectProduct: (id = null) => set({ selectedProduct: id, selectedShelf: null, selectedBin: null }),

	selectBin: (id = null) => set({ selectedBin: id, selectedProduct: null, selectedShelf: null }),

	setIntersectingIds: (newIds) => set({ intersectingIds: newIds }),

	orderMovementFromSelected: (toShelf, toRow, toCol) => {
		const fromShelf = get().selectedBin.split('+')[0];
		const fromRow = Number(get().selectedBin.split('+')[1]);
		const fromCol = Number(get().selectedBin.split('+')[2]);
	
		const shelf = get().shelves.filter(obj => {
		  	return obj.id === toShelf;
		})[0];
	
		const initialShelf = get().shelves.filter(obj => {
		  	return obj.id === fromShelf;
		})[0];
	
		if(initialShelf.bins[fromRow][fromCol].state === binState.STILL){
		  	if(shelf.bins[toRow][toCol].state === binState.EMPTY) {
				const newMovement = new Movement(fromShelf, fromRow, fromCol, toShelf, toRow, toCol);
				set((state) => ({
			  		movements: [...state.movements, newMovement]
				}));
			
				const movedProductId = get().shelves.find(shelf => shelf.id === fromShelf).bins[fromRow][fromCol].productId;
		
				get().updateBinState(fromShelf, fromRow, fromCol, binState.OUTGOING);
				get().insertProduct(movedProductId, toShelf, toRow, toCol);
				get().updateBinState(toShelf, toRow, toCol, binState.INCOMING);
		  	}
		  	else {
				get().setError("Il bin di destinazione è occupato. Si prega di sceglierne un altro.");
		  	}
		} else {
		  	get().setError("Il prodotto che si sta cercando di spostare è già in movimentazione.");
		} 
	  	//TODO: ask external mechanism to approve the movement
	},
	/*
	orderMovementFromSelected: (toShelf, toRow, toCol) => {
		const fromShelf = get().selectedBin.split('+')[0];
		const fromRow = Number(get().selectedBin.split('+')[1]);
		const fromCol = Number(get().selectedBin.split('+')[2]);

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
	},*/
})