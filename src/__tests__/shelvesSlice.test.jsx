import Shelf from "@_model/Shelf";
import { render } from "../node_modules/@testing-library/react";
import TestComponent from "./TestComponent";
import { boundStore } from "@_lib/boundStore";
import { binState } from "@_model/Bin";

const initialStoreState = boundStore.getState();
beforeEach(() => { boundStore.setState(initialStoreState, true); });

test('shelvesSlice should set shelves correctly', () => { 
    let myShelves = [];
    myShelves.push(new Shelf("firstShelf", 4, 3, 8, {x: 4, y: 5, z: 7}, true, "firstShelfID"));
    myShelves.push(new Shelf("secondShelf", 6, 2, 9, {x: 5, y: 20, z: 10}, false, "secondShelfID"));

    const selector = (state) => ({
        shelves: state.shelves,
        setShelves: state.setShelves
    });

	let firstRender = true;
	let shelves = null;
	effect = jest.fn((items) => {
        shelves = items.shelves;

        if(firstRender) {
            items.setShelves(myShelves);
            firstRender = false;
        }        
    });

	render(<TestComponent elements={selector} effect={effect} />);

	expect(shelves).toEqual(myShelves);
});

test('shelvesSlice should add new shelf correctly', () => {
    const selector = (state) => ({
        shelves: state.shelves,
        addShelf: state.addShelf
    });

	let firstRender = true;
	let shelves = null;
	effect = jest.fn((items) => {
        shelves = items.shelves;

        if(firstRender) {
            items.addShelf("myShelf", 8, 2, 3);
            firstRender = false;
        }        
    });

	render(<TestComponent elements={selector} effect={effect} />);

    let shelfFound = false;
    for (let index = 0; index < shelves.length; index++) {
        if(
            shelves[index].name === "myShelf" && 
            shelves[index].binSize === 8 &&
            shelves[index].height === 2 &&
            shelves[index].width === 3
        ){
            shelfFound = true;
            break;
        }
    }

	expect(shelfFound).toEqual(true);
});

test('shelvesSlice should insert product correctly in EMPTY bin', () => { 
    let myShelves = [];
    myShelves.push(new Shelf("firstShelf", 4, 3, 8, {x: 4, y: 5, z: 7}, true, "firstShelfID"));
    myShelves.push(new Shelf("secondShelf", 6, 2, 9, {x: 5, y: 20, z: 10}, false, "secondShelfID"));

    const selector = (state) => ({
        shelves: state.shelves,
        setShelves: state.setShelves,
        insertProduct: state.insertProduct
    });

	let firstRender = true;
    let secondRender = false;
	let shelves = null;
	effect = jest.fn((items) => {
        shelves = items.shelves;

        if(firstRender) {
            items.setShelves(myShelves);
            firstRender = false;
            secondRender = true;
        } if(secondRender) {
            items.insertProduct("myProdId", "secondShelfID", 3, 1);
            secondRender = false;
        }
    });

	render(<TestComponent elements={selector} effect={effect} />);

    let shelfWithProduct = null;
    for (let index = 0; index < shelves.length; index++) {
        if(shelves[index].id === "secondShelfID") {
            shelfWithProduct = shelves[index];
            break;
        }
    }

    expect(shelfWithProduct.bins[3][1].productId).toEqual("myProdId");
});

test('shelvesSlice should set state to STILL when inserting product in EMPTY bin', () => { 
    let myShelves = [];
    myShelves.push(new Shelf("firstShelf", 4, 3, 8, {x: 4, y: 5, z: 7}, true, "firstShelfID"));
    myShelves.push(new Shelf("secondShelf", 6, 2, 9, {x: 5, y: 20, z: 10}, false, "secondShelfID"));

    const selector = (state) => ({
        shelves: state.shelves,
        setShelves: state.setShelves,
        insertProduct: state.insertProduct
    });

	let firstRender = true;
    let secondRender = false;
	let shelves = null;
	effect = jest.fn((items) => {
        shelves = items.shelves;

        if(firstRender) {
            items.setShelves(myShelves);
            firstRender = false;
            secondRender = true;
        } if(secondRender) {
            items.insertProduct("myProdId", "secondShelfID", 3, 1);
            secondRender = false;
        }
    });

	render(<TestComponent elements={selector} effect={effect} />);

    let shelfWithProduct = null;
    for (let index = 0; index < shelves.length; index++) {
        if(shelves[index].id === "secondShelfID") {
            shelfWithProduct = shelves[index];
            break;
        }
    }

    expect(shelfWithProduct.bins[3][1].state).toEqual(binState.STILL);
});

test('shelvesSlice should NOT insert product in non-EMPTY bin', () => { 
    let myShelves = [];
    myShelves.push(new Shelf("firstShelf", 4, 3, 8, {x: 4, y: 5, z: 7}, true, "firstShelfID"));
    myShelves.push(new Shelf("secondShelf", 6, 2, 9, {x: 5, y: 20, z: 10}, false, "secondShelfID"));
    myShelves[0].bins[0][0].state = binState.STILL;
    myShelves[0].bins[0][0].productId = "someOtherProduct";

    const selector = (state) => ({
        shelves: state.shelves,
        setShelves: state.setShelves,
        insertProduct: state.insertProduct
    });

	let firstRender = true;
    let secondRender = false;
	let shelves = null;
	effect = jest.fn((items) => {
        shelves = items.shelves;

        if(firstRender) {
            items.setShelves(myShelves);
            firstRender = false;
            secondRender = true;
        } if(secondRender) {
            items.insertProduct("myProdId", "firstShelfID", 0, 0);
            secondRender = false;
        }
    });

	render(<TestComponent elements={selector} effect={effect} />);

    let shelfWithProduct = null;
    for (let index = 0; index < shelves.length; index++) {
        if(shelves[index].id === "firstShelfID") {
            shelfWithProduct = shelves[index];
            break;
        }
    }

    expect(shelfWithProduct.bins[0][0].productId).toEqual("someOtherProduct");
});

test('shelvesSlice should change bin state when product is inserted', () => { 
    let myShelves = [];
    myShelves.push(new Shelf("firstShelf", 2, 6, 2, {x: 4, y: 5, z: 7}, true, "firstShelfID"));
    myShelves.push(new Shelf("secondShelf", 1, 7, 5, {x: 5, y: 20, z: 10}, false, "secondShelfID"));

    const selector = (state) => ({
        shelves: state.shelves,
        setShelves: state.setShelves,
        insertProduct: state.insertProduct
    });

	let firstRender = true;
    let secondRender = false;
	let shelves = null;
	effect = jest.fn((items) => {
        shelves = items.shelves;

        if(firstRender) {
            items.setShelves(myShelves);
            firstRender = false;
            secondRender = true;
        } if(secondRender) {
            items.insertProduct("myProdId", "firstShelfID", 1, 4);
            secondRender = false;
        }
    });

	render(<TestComponent elements={selector} effect={effect} />);

    let shelfWithProduct = null;
    for (let index = 0; index < shelves.length; index++) {
        if(shelves[index].id === "firstShelfID") {
            shelfWithProduct = shelves[index];
            break;
        }
    }

    expect(shelfWithProduct.bins[1][4].state).toEqual(binState.STILL);
});

test('shelvesSlice should remove shelf correctly', () => {
    let myShelves = [];
    myShelves.push(new Shelf("firstShelf", 4, 3, 8, {x: 4, y: 5, z: 7}, true, "firstShelfID"));
    myShelves.push(new Shelf("secondShelf", 6, 2, 9, {x: 5, y: 20, z: 10}, false, "secondShelfID"));
    
    const selector = (state) => ({
        shelves: state.shelves,
        setShelves: state.setShelves,
        removeShelf: state.removeShelf
    });

    let firstRender = true;
    let secondRender = false;
	let shelves = null;
	effect = jest.fn((items) => {
        shelves = items.shelves;

        if(firstRender) {
            items.setShelves(myShelves);
            firstRender = false;
            secondRender = true;
        } if(secondRender) {
            items.removeShelf("firstShelfID");
            secondRender = false;
        }
    });

	render(<TestComponent elements={selector} effect={effect} />);

    let shelfFound = false;
    for (let index = 0; index < shelves.length; index++) {
        if(shelves[index].id === "firstShelfID") {
            shelfFound = true;
            break;
        }        
    }

	expect(shelfFound).toEqual(false);
});

test('shelvesSlice should remove shelf only with EMPTY bins', () => {
    let myShelves = [];
    myShelves.push(new Shelf("firstShelf", 4, 3, 8, {x: 4, y: 5, z: 7}, true, "firstShelfID"));
    myShelves.push(new Shelf("secondShelf", 6, 2, 9, {x: 5, y: 20, z: 10}, false, "secondShelfID"));
    myShelves[0].bins[0][0].state = binState.STILL;
    
    const selector = (state) => ({
        shelves: state.shelves,
        setShelves: state.setShelves,
        removeShelf: state.removeShelf
    });

    let firstRender = true;
    let secondRender = false;
	let shelves = null;
	effect = jest.fn((items) => {
        shelves = items.shelves;

        if(firstRender) {
            items.setShelves(myShelves);
            firstRender = false;
            secondRender = true;
        } if(secondRender) {
            items.removeShelf("firstShelfID");
            secondRender = false;
        }
    });

	render(<TestComponent elements={selector} effect={effect} />);

    let shelfFound = false;
    for (let index = 0; index < shelves.length; index++) {
        if(shelves[index].id === "firstShelfID") {
            shelfFound = true;
            break;
        }        
    }

	expect(shelfFound).toEqual(true);
});

test('shelvesSlice should update shelf binSize', () => {
    let myShelves = [];
    myShelves.push(new Shelf("firstShelf", 4, 3, 8, {x: 4, y: 5, z: 7}, true, "firstShelfID"));
    myShelves.push(new Shelf("secondShelf", 6, 2, 9, {x: 5, y: 20, z: 10}, false, "secondShelfID"));
    
    const selector = (state) => ({
        shelves: state.shelves,
        setShelves: state.setShelves,
        updateShelfInfo: state.updateShelfInfo
    });

    let firstRender = true;
    let secondRender = false;
	let shelves = null;
	effect = jest.fn((items) => {
        shelves = items.shelves;

        if(firstRender) {
            items.setShelves(myShelves);
            firstRender = false;
            secondRender = true;
        } if(secondRender) {
            items.updateShelfInfo("firstShelfID", 8, 3, 8);
            secondRender = false;
        }
    });

	render(<TestComponent elements={selector} effect={effect} />);

    let updatedShelf = null;
    for (let index = 0; index < shelves.length; index++) {
        if(shelves[index].id === "firstShelfID") {
            updatedShelf = shelves[index];
            break;
        }        
    }

	expect(updatedShelf.binSize).toEqual(8);
});

test('shelvesSlice should update shelf width', () => {
    let myShelves = [];
    myShelves.push(new Shelf("firstShelf", 4, 3, 8, {x: 4, y: 5, z: 7}, true, "firstShelfID"));
    myShelves.push(new Shelf("secondShelf", 6, 2, 9, {x: 5, y: 20, z: 10}, false, "secondShelfID"));
    
    const selector = (state) => ({
        shelves: state.shelves,
        setShelves: state.setShelves,
        updateShelfInfo: state.updateShelfInfo
    });

    let firstRender = true;
    let secondRender = false;
	let shelves = null;
	effect = jest.fn((items) => {
        shelves = items.shelves;

        if(firstRender) {
            items.setShelves(myShelves);
            firstRender = false;
            secondRender = true;
        } if(secondRender) {
            items.updateShelfInfo("secondShelfID", 3, 7, 1);
            secondRender = false;
        }
    });

	render(<TestComponent elements={selector} effect={effect} />);

    let updatedShelf = null;
    for (let index = 0; index < shelves.length; index++) {
        if(shelves[index].id === "secondShelfID") {
            updatedShelf = shelves[index];
            break;
        }        
    }

	expect(updatedShelf.width).toEqual(7);
});

test('shelvesSlice should update shelf height', () => {
    let myShelves = [];
    myShelves.push(new Shelf("firstShelf", 4, 3, 8, {x: 4, y: 5, z: 7}, true, "firstShelfID"));
    myShelves.push(new Shelf("secondShelf", 6, 2, 9, {x: 5, y: 20, z: 10}, false, "secondShelfID"));
    
    const selector = (state) => ({
        shelves: state.shelves,
        setShelves: state.setShelves,
        updateShelfInfo: state.updateShelfInfo
    });

    let firstRender = true;
    let secondRender = false;
	let shelves = null;
	effect = jest.fn((items) => {
        shelves = items.shelves;

        if(firstRender) {
            items.setShelves(myShelves);
            firstRender = false;
            secondRender = true;
        } if(secondRender) {
            items.updateShelfInfo("firstShelfID", 2, 2, 1);
            secondRender = false;
        }
    });

	render(<TestComponent elements={selector} effect={effect} />);

    let updatedShelf = null;
    for (let index = 0; index < shelves.length; index++) {
        if(shelves[index].id === "firstShelfID") {
            updatedShelf = shelves[index];
            break;
        }        
    }

	expect(updatedShelf.height).toEqual(1);
});

test('shelvesSlice should update shelf position', () => {
    let myShelves = [];
    myShelves.push(new Shelf("firstShelf", 4, 3, 8, {x: 4, y: 5, z: 7}, true, "firstShelfID"));
    myShelves.push(new Shelf("secondShelf", 6, 2, 9, {x: 5, y: 20, z: 10}, false, "secondShelfID"));
    
    const selector = (state) => ({
        shelves: state.shelves,
        setShelves: state.setShelves,
        updateShelfPosition: state.updateShelfPosition
    });

    let firstRender = true;
    let secondRender = false;
	let shelves = null;
	effect = jest.fn((items) => {
        shelves = items.shelves;

        if(firstRender) {
            items.setShelves(myShelves);
            firstRender = false;
            secondRender = true;
        } if(secondRender) {
            items.updateShelfPosition("secondShelfID", 23, 47);
            secondRender = false;
        }
    });

	render(<TestComponent elements={selector} effect={effect} />);

    let updatedShelf = null;
    for (let index = 0; index < shelves.length; index++) {
        if(shelves[index].id === "secondShelfID") {
            updatedShelf = shelves[index];
            break;
        }        
    }

	expect(JSON.stringify(updatedShelf.position)).toEqual(JSON.stringify({x: 23, y: 20, z: 47}));
});

test('shelvesSlice should update shelf isFlipped', () => {
    let myShelves = [];
    myShelves.push(new Shelf("firstShelf", 4, 3, 8, {x: 4, y: 5, z: 7}, true, "firstShelfID"));
    myShelves.push(new Shelf("secondShelf", 6, 2, 9, {x: 5, y: 20, z: 10}, false, "secondShelfID"));
    
    const selector = (state) => ({
        shelves: state.shelves,
        setShelves: state.setShelves,
        flipShelf: state.flipShelf
    });

    let firstRender = true;
    let secondRender = false;
	let shelves = null;
	effect = jest.fn((items) => {
        shelves = items.shelves;

        if(firstRender) {
            items.setShelves(myShelves);
            firstRender = false;
            secondRender = true;
        } if(secondRender) {
            items.flipShelf("firstShelfID");
            secondRender = false;
        }
    });

	render(<TestComponent elements={selector} effect={effect} />);

    let updatedShelf = null;
    for (let index = 0; index < shelves.length; index++) {
        if(shelves[index].id === "firstShelfID") {
            updatedShelf = shelves[index];
            break;
        }        
    }

	expect(updatedShelf.isFlipped).toEqual(false);
});

test('shelvesSlice should update bin state', () => {
    let myShelves = [];
    myShelves.push(new Shelf("firstShelf", 4, 3, 8, {x: 4, y: 5, z: 7}, true, "firstShelfID"));
    myShelves.push(new Shelf("secondShelf", 6, 2, 9, {x: 5, y: 20, z: 10}, false, "secondShelfID"));
    
    const selector = (state) => ({
        shelves: state.shelves,
        setShelves: state.setShelves,
        updateBinState: state.updateBinState
    });

    let firstRender = true;
    let secondRender = false;
	let shelves = null;
	effect = jest.fn((items) => {
        shelves = items.shelves;

        if(firstRender) {
            items.setShelves(myShelves);
            firstRender = false;
            secondRender = true;
        } if(secondRender) {
            items.updateBinState("secondShelfID", 8, 0, binState.OUTGOING);
            secondRender = false;
        }
    });

	render(<TestComponent elements={selector} effect={effect} />);

    let updatedBin = null;
    for (let index = 0; index < shelves.length; index++) {
        if(shelves[index].id === "secondShelfID") {
            updatedBin = shelves[index].bins[8][0];
            break;
        }        
    }

	expect(updatedBin.state).toEqual(binState.OUTGOING);
});

test('shelvesSlice should remove product correctly', () => { 
    let myShelves = [];
    myShelves.push(new Shelf("firstShelf", 4, 3, 8, {x: 4, y: 5, z: 7}, true, "firstShelfID"));
    myShelves.push(new Shelf("secondShelf", 6, 2, 9, {x: 5, y: 20, z: 10}, false, "secondShelfID"));
    myShelves[1].bins[7][1].state = binState.STILL;
    myShelves[1].bins[7][1].productId = "myProductId";

    const selector = (state) => ({
        shelves: state.shelves,
        setShelves: state.setShelves,
        removeProductFromBin: state.removeProductFromBin
    });

	let firstRender = true;
    let secondRender = false;
	let shelves = null;
	effect = jest.fn((items) => {
        shelves = items.shelves;

        if(firstRender) {
            items.setShelves(myShelves);
            firstRender = false;
            secondRender = true;
        } if(secondRender) {
            items.removeProductFromBin("secondShelfID", 7, 1);
            secondRender = false;
        }
    });

	render(<TestComponent elements={selector} effect={effect} />);

    let shelfWithProduct = null;
    for (let index = 0; index < shelves.length; index++) {
        if(shelves[index].id === "secondShelfID") {
            shelfWithProduct = shelves[index];
            break;
        }
    }

    expect(shelfWithProduct.bins[7][1].productId).toEqual(null);
});

test('shelvesSlice should empty bin when removing product', () => { 
    let myShelves = [];
    myShelves.push(new Shelf("firstShelf", 4, 3, 8, {x: 4, y: 5, z: 7}, true, "firstShelfID"));
    myShelves.push(new Shelf("secondShelf", 6, 2, 9, {x: 5, y: 20, z: 10}, false, "secondShelfID"));
    myShelves[1].bins[7][1].state = binState.STILL;
    myShelves[1].bins[7][1].productId = "myProductId";

    const selector = (state) => ({
        shelves: state.shelves,
        setShelves: state.setShelves,
        removeProductFromBin: state.removeProductFromBin
    });

	let firstRender = true;
    let secondRender = false;
	let shelves = null;
	effect = jest.fn((items) => {
        shelves = items.shelves;

        if(firstRender) {
            items.setShelves(myShelves);
            firstRender = false;
            secondRender = true;
        } if(secondRender) {
            items.removeProductFromBin("secondShelfID", 7, 1);
            secondRender = false;
        }
    });

	render(<TestComponent elements={selector} effect={effect} />);

    let shelfWithProduct = null;
    for (let index = 0; index < shelves.length; index++) {
        if(shelves[index].id === "secondShelfID") {
            shelfWithProduct = shelves[index];
            break;
        }
    }

    expect(shelfWithProduct.bins[7][1].state).toEqual(binState.EMPTY);
});

test('shelvesSlice should set error when removing product from EMPTY bin', () => { 
    let myShelves = [];
    myShelves.push(new Shelf("firstShelf", 4, 3, 8, {x: 4, y: 5, z: 7}, true, "firstShelfID"));
    myShelves.push(new Shelf("secondShelf", 6, 2, 9, {x: 5, y: 20, z: 10}, false, "secondShelfID"));

    const selector = (state) => ({
        shelves: state.shelves,
        setShelves: state.setShelves,
        removeProductFromBin: state.removeProductFromBin,
        errorMsg: state.errorMsg
    });

	let firstRender = true;
    let secondRender = false;
	let error = null;
	effect = jest.fn((items) => {
        error = items.errorMsg;

        if(firstRender) {
            items.setShelves(myShelves);
            firstRender = false;
            secondRender = true;
        } if(secondRender) {
            items.removeProductFromBin("secondShelfID", 7, 1);
            secondRender = false;
        }
    });

	render(<TestComponent elements={selector} effect={effect} />);

    expect(error).not.toEqual(null);
})