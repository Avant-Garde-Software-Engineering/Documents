import { binState } from "@_model/Bin";
import { render } from "../node_modules/@testing-library/react";
import TestComponent from "./TestComponent";
import { boundStore } from "@_lib/boundStore";
import Product from "@_model/Product";
import Shelf from "@_model/Shelf";

const initialStoreState = boundStore.getState();
beforeEach(() => { boundStore.setState(initialStoreState, true); });

test('productsSlice should set products correctly', () => { 
    let myProducts = [];
    myProducts.push(new Product("firstProd", {r: 2, g: 20, b: 200}, "firstProd"));
    myProducts.push(new Product("secondProd", {r: 2, g: 20, b: 200}, "secondProd"));

    const selector = (state) => ({
        products: state.products,
        setProducts: state.setProducts
    });

	let firstRender = true;
	let products = null;
	effect = jest.fn((items) => {
        products = items.products;

        if(firstRender) {
            items.setProducts(myProducts);
            firstRender = false;
        }        
    });

	render(<TestComponent elements={selector} effect={effect} />);

	expect(products).toEqual(myProducts);
});

test('productsSlice should add new product correctly', () => {
    const selector = (state) => ({
        products: state.products,
        addProduct: state.addProduct
    });

	let firstRender = true;
	let products = null;
	effect = jest.fn((items) => {
        products = items.products;

        if(firstRender) {
            items.addProduct("myProduct", {r: 2, g: 20, b: 200});
            firstRender = false;
        }        
    });

	render(<TestComponent elements={selector} effect={effect} />);

    let productFound = false;
    for (let index = 0; index < products.length; index++) {
        if(products[index].name === "myProduct" && JSON.stringify(products[index].color) === JSON.stringify({r: 2, g: 20, b: 200}))
            productFound = true;
    }

	expect(productFound).toEqual(true);
});

test('productsSlice should remove products correctly', () => {
    let myProducts = [];
    myProducts.push(new Product("firstProd", {r: 2, g: 20, b: 200}, "firstProd"));
    myProducts.push(new Product("secondProd", {r: 2, g: 20, b: 200}, "secondProd"));

    const selector = (state) => ({
        products: state.products,
        setProducts: state.setProducts,
        removeProduct: state.removeProduct
    });

	let firstRender = true;
    let secondRender = false;
	let products = null;
	effect = jest.fn((items) => {
        products = items.products;

        if(firstRender) {
            items.setProducts(myProducts);
            firstRender = false;
            secondRender = true;
        }
        if(secondRender) {
            items.removeProduct("secondProd");
            secondRender = false;
        }
    });

	render(<TestComponent elements={selector} effect={effect} />);

    let productFound = false;
    for (let index = 0; index < products.length; index++) {
        if(products[index].id === "secondProd") {
            productFound = true;
            break;
        }
    }

	expect(productFound).toEqual(false);
});

test('productsSlice should update product name correctly', () => { 
    let myProducts = [];
    myProducts.push(new Product("firstProd", {r: 2, g: 20, b: 200}, "firstProd"));
    myProducts.push(new Product("secondProd", {r: 2, g: 20, b: 200}, "secondProd"));

    const selector = (state) => ({
        products: state.products,
        setProducts: state.setProducts,
        updateName: state.updateName
    });

	let firstRender = true;
    let secondRender = false;
	let products = null;
	effect = jest.fn((items) => {
        products = items.products;

        if(firstRender) {
            items.setProducts(myProducts);
            firstRender = false;
            secondRender = true;
        }
        if(secondRender) {
            items.updateName("secondProd", "myNewSecondProd");
            secondRender = false;
        }
    });

	render(<TestComponent elements={selector} effect={effect} />);

    let productName = '';
    for (let index = 0; index < products.length; index++) {
        if(products[index].id === "secondProd") {
            productName = products[index].name;
            break;
        }
    }

	expect(productName).toEqual("myNewSecondProd");
});

test('productsSlice should update product color correctly', () => { 
    let myProducts = [];
    myProducts.push(new Product("firstProd", {r: 2, g: 20, b: 200}, "firstProd"));
    myProducts.push(new Product("secondProd", {r: 2, g: 20, b: 200}, "secondProd"));

    const selector = (state) => ({
        products: state.products,
        setProducts: state.setProducts,
        updateColor: state.updateColor
    });

	let firstRender = true;
    let secondRender = false;
	let products = null;
	effect = jest.fn((items) => {
        products = items.products;

        if(firstRender) {
            items.setProducts(myProducts);
            firstRender = false;
            secondRender = true;
        }
        if(secondRender) {
            items.updateColor("secondProd", {r: 120, g: 0, b: 15});
            secondRender = false;
        }
    });

	render(<TestComponent elements={selector} effect={effect} />);

    let productColor = {};
    for (let index = 0; index < products.length; index++) {
        if(products[index].id === "secondProd") {
            productColor = products[index].color;
            break;
        }
    }

	expect(JSON.stringify(productColor)).toEqual(JSON.stringify({r: 120, g: 0, b: 15}));
});

test('productsSlice should empty shelves when removing product', () => {
    let myProduct = [new Product("firstProd", {r: 2, g: 20, b: 200}, "myProductId")];
    let myShelves = [];
    myShelves.push(new Shelf("firstShelf", 4, 3, 8, {x: 4, y: 5, z: 7}, true, "firstShelfID"));
    myShelves.push(new Shelf("secondShelf", 6, 2, 9, {x: 5, y: 20, z: 10}, false, "secondShelfID"));
    myShelves[1].bins[7][1].state = binState.STILL;
    myShelves[1].bins[7][1].productId = "myProductId";

    const selector = (state) => ({
        shelves: state.shelves,
        setShelves: state.setShelves,
        setProducts: state.setProducts,
        removeProduct: state.removeProduct
    });

	let firstRender = true;
    let secondRender = false;
	let shelves = null;
	effect = jest.fn((items) => {
        shelves = items.shelves;

        if(firstRender) {
            items.setProducts(myProduct);
            items.setShelves(myShelves);
            firstRender = false;
            secondRender = true;
        }
        if(secondRender) {
            items.removeProduct("myProductId");
            secondRender = false;
        }
    });

	render(<TestComponent elements={selector} effect={effect} />);

    let implicatedShelf = null;
    for (let index = 0; index < shelves.length; index++) {
        console.log(shelves[index].id)
        if(shelves[index].id === "secondShelfID") {
            implicatedShelf = shelves[index];
            break;
        }
    }

	expect(implicatedShelf.bins[7][1].state).toEqual(binState.EMPTY);
});