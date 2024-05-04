import MovementView from "@_components/actions/MovementView";
import { render, screen } from "../../../node_modules/@testing-library/react";
import "../../../node_modules/@testing-library/jest-dom";
import "@__mocks__/matchMedia.mock"

const movements = [
    {
        movementId: "firstMovementId",
        fromShelfName: "fromFirst",
        toShelfName: "ToSecond",
        fromBinString: "x: 0 y: 2",
        toBinString: "x: 7 y: 6"
    }, 
    {
        movementId: "secondMovementId",
        fromShelfName: "FromThird",
        toShelfName: "ToFourth",
        fromBinString: "x: 3 y: 1",
        toBinString: "x: 5 y: 6"
    }
];

describe("Movement info render", () => {
    test('MovementView should display all movements ids', () => {
        render(<MovementView open={jest.fn()} closeView={jest.fn()} movementsData={movements}/>);
        
        expect(screen.getByText(movements[0].movementId, { exact: false })).toBeInTheDocument();
        expect(screen.getByText(movements[1].movementId, { exact: false })).toBeInTheDocument();
    });

    test('MovementView should display all movements shelf info', () => {
        render(<MovementView open={jest.fn()} closeView={jest.fn()} movementsData={movements}/>);
        
        expect(screen.getByText(movements[0].fromShelfName, { exact: false })).toBeInTheDocument();
        expect(screen.getByText(movements[1].fromShelfName, { exact: false })).toBeInTheDocument();
        expect(screen.getByText(movements[0].toShelfName, { exact: false })).toBeInTheDocument();
        expect(screen.getByText(movements[1].toShelfName, { exact: false })).toBeInTheDocument();
    });

    test('MovementView should display all movements bin info', () => {
        render(<MovementView open={jest.fn()} closeView={jest.fn()} movementsData={movements}/>);
        
        expect(screen.getByText(movements[0].fromBinString, { exact: false })).toBeInTheDocument();
        expect(screen.getByText(movements[1].fromBinString, { exact: false })).toBeInTheDocument();
        expect(screen.getByText(movements[0].toBinString, { exact: false })).toBeInTheDocument();
        expect(screen.getByText(movements[1].toBinString, { exact: false })).toBeInTheDocument();
    });
});