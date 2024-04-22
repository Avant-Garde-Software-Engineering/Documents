import { render } from "../node_modules/@testing-library/react";
import TestComponent from "./TestComponent";
import { boundStore } from "@_lib/boundStore";

const initialStoreState = boundStore.getState();
beforeEach(() => { boundStore.setState(initialStoreState, true); });

test('whsSlice should set whs name correctly', () => { 
	const selector = (state) => ({
        whsName: state.whsName,
        setWhsName: state.setWhsName
    });

	let firstRender = true;
	let name = null;
	effect = jest.fn((items) => {
        name = items.whsName;

        if(firstRender) {
            items.setWhsName("MyNewWhs");
            firstRender = false;
        }        
    });

	render(<TestComponent elements={selector} effect={effect} />);

	expect(name).toEqual("MyNewWhs");
});

test('whsSlice should set polygon correctly', () => { 
	const selector = (state) => ({
        whsHeight: state.whsHeight,
        points: state.points,
		setWhsPolygon: state.setWhsPolygon
    });

	const newPoints = [
		{ x: 220, z: 10 },
		{ x: 300, z: 210 },
		{ x: 170, z: 250 },
		{ x: 123, z: 234 }
	];

	let firstRender = true;
	let points = null;
	let height = null;
	effect = jest.fn((items) => {
        height = items.whsHeight;
		points = items.points;

        if(firstRender) {
            items.setWhsPolygon(newPoints, 80);
            firstRender = false;
        }        
    });

	render(<TestComponent elements={selector} effect={effect} />);

	expect(height).toEqual(80);
	expect(points).toEqual(newPoints);
});


test('whsSlice should set rectangle correctly', () => { 
	const selector = (state) => ({
        whsHeight: state.whsHeight,
        points: state.points,
		setWhsRectangle: state.setWhsRectangle
    });

	let firstRender = true;
	let points = null;
	let height = null;
	effect = jest.fn((items) => {
        height = items.whsHeight;
		points = items.points;

        if(firstRender) {
            items.setWhsRectangle(40, 20, 10);
            firstRender = false;
        }
    });

	render(<TestComponent elements={selector} effect={effect} />);

	expect(height).toEqual(10);
	expect(points).toContainEqual({x: 0, z: 0});
	expect(points).toContainEqual({x: 0, z: 40});
	expect(points).toContainEqual({x: 20, z: 0});
	expect(points).toContainEqual({x: 20, z: 40});
});
