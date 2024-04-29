import { boundStore } from '@_lib/boundStore';
import MovementView from '@_components/actions/MovementView';

const MovementManager = ({ open, closeView }) => {
    const movements = boundStore((state) => state.movements);
    const shelves = boundStore((state) => state.shelves);

	const dataSource = movements.map(item => ({
        movementId: item.id,
        fromShelfName: shelves.find(shelf => shelf.id === item.fromId).name,
        toShelfName: shelves.find(shelf => shelf.id === item.toId).name,
        fromBinString: "x: "+item.fromRow+" y: "+item.fromCol,
        toBinString: "x: "+item.toRow+" y: "+item.toCol,
	}));

    return (
        <MovementView
            open={open}
            closeView={closeView}
            movementsData={dataSource}
        />
    );
};

export default MovementManager;
