import uuidv4 from "uuid/v4";
import Bin from '@_model/Bin'

class Shelf {
	#name;
	#id;
	#binSize;
	#width;
	#height;
	#position;
	#isFlipped;
	#bins;
	
	constructor(name, binSize, width, height, 
				position = {x: binSize*width/2, y: binSize*height/2, z: binSize/2}, 
				isFlipped = false, bins=this.createEmpty(), id='s_'+uuidv4()) {
		this.#name = name;
		this.#id = id;
		this.#binSize = binSize;
		this.#width = width;
		this.#height = height;
		this.#position = position;
		this.#isFlipped = isFlipped;
		this.#bins = bins;
	}

	createEmpty(){
		const matrix = [];
		for (let i = 0; i < this.#height; i++) {
			const row = [];
			for (let j = 0; j < this.#width; j++) {
				row.push(new Bin(`${this.id}-${i}-${j}`));		
			}
			matrix.push(row);
		}
		return matrix;
	}

	get position() {
		return this.#position;
	}

	set position(value) {
		this.#position = value;
	}

	get name() {
		return this.#name;
	}

	set name(value) {
		this.#name = value;
	}

	get id() {
		return this.#id;
	}

	get width() {
		return this.#width;
	}

	set width(value) {
		this.#width = value;
	}

	get height() {
		return this.#height;
	}

	set height(value) {
		this.#height = value;
	}

	get isFlipped() {
		return this.#isFlipped;
	}

	set isFlipped(value) {
		this.#isFlipped = value;
	}

	get binSize() {
		return this.#binSize;
	}

	set binSize(value) {
		this.#binSize = value;
	}

	get bins() {
		return this.#bins;
	}

	set bins(value) {
		this.#bins = value;
	}

}

export default Shelf;