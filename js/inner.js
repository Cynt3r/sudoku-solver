function read_grid() {
	var grid = [];
	for (var i = 0; i < 81; i++) {
		var val = document.getElementById('cell-'+i).value;
		if (is_int(val) && val > 0 && val < 10) val = parseInt(val);
		else val = 0;
		grid.push(val);
	}

	return grid;
}

function write_grid(grid, read_only) {
	for (var i = 0; i < 81; i++) {
		if (grid[i] === 0) document.getElementById('cell-'+i).value = '';
		else {
			document.getElementById('cell-'+i).value = grid[i];
				if (read_only) {
				document.getElementById('cell-'+i).readOnly = true;
				document.getElementById('cell-'+i).classList.add('cell-readonly');
			}
		}
	}
}

function find_solution(grid) {
	var new_grid = grid.slice();
	var possibilities = [];

	for (var i = 0; i < 81; i++) {
		if (grid[i] !== 0) continue;
		var item = {};
		item.index = i;
		item.poss = get_possibilities(grid, i);
		possibilities.push(item);
	}

	//completed
	if (possibilities.length === 0) return grid;

	//sort
	possibilities.sort((a,b) => (a.poss.length > b.poss.length) ? 1 : ((b.poss.length > a.poss.length) ? -1 : 0));
	//console.log(possibilities);return grid;

	//bereme col s nejmenším počtem možností
	if (possibilities[0].poss.length === 0) return grid;
	//for each possibility
	for (const val of possibilities[0].poss) {
		new_grid[possibilities[0].index] = val;
		new_grid = find_solution(new_grid);
		if (is_completed(new_grid)) return new_grid;
		new_grid = grid.slice();
	}

	//pokud se to dostalo sem, už by nemělo existovat řešení
	return grid;
}

function get_possibilities(grid, i) {
	var possibilities = [1,2,3,4,5,6,7,8,9];

	possibilities = check_row(grid, i, possibilities);
	possibilities = check_column(grid, i, possibilities);
	possibilities = check_square(grid, i, possibilities);

	return possibilities;
}

function check_square(grid, i, possibilities) {
	for (const j of get_square(i)) {
		if (grid[j] !== 0) possibilities = remove_from_arr(possibilities, grid[j]);
	}

	return possibilities;
}

function check_row(grid, i, possibilities) {
	for (const j of get_row(i)) {
		if (grid[j] !== 0) possibilities = remove_from_arr(possibilities, grid[j]);
	}

	return possibilities;
}

function check_column(grid, i, possibilities) {
	for (const j of get_column(i)) {
		if (grid[j] !== 0) possibilities = remove_from_arr(possibilities, grid[j]);
	}

	return possibilities;
}

function is_completed(grid) {
	for (var i = 0; i < 81; i++) {
		if (grid[i] === 0) return false;
	}

	return true;
}

function is_valid(grid) {
	var arr = [];

	//rows
	for (var i = 0; i < 73; i += 9) {
		for (const j of get_row(i)) {
			if (grid[j] === 0) continue;
			if (arr.includes(grid[j])) return false;
			arr.push(grid[j]);
		}
		arr = [];
	}

	//columns
	for (var i = 0; i < 9; i++) {
		for (const j of get_column(i)) {
			if (grid[j] === 0) continue;
			if (arr.includes(grid[j])) return false;
			arr.push(grid[j]);
		}
		arr = [];
	}

	//squares
	for (const i of [0,3,6,27,30,33,54,57,60]) {
		for (const j of get_square(i)) {
			if (grid[j] === 0) continue;
			if (arr.includes(grid[j])) return false;
			arr.push(grid[j]);
		}
		arr = [];
	}

	return true;
}

function generate_sudoku_old(x) {
	var empty_indexes = [];
	for (var i = 0; i < 81; i++) empty_indexes.push(i);

	clean();
	var grid = read_grid();

	for (var i = 0; i < x; i++) {
		var index, val;

		while (1) {
			var previous_grid = grid.slice();
			index = empty_indexes[get_rand_int(0, empty_indexes.length-1)];

			//generating value for index
			val = get_rand_int(1, 9);
			grid[index] = val;
			if (is_valid(grid) && is_completed(find_solution(grid))) {
				empty_indexes = remove_from_arr(empty_indexes, index);
				break;
			}
			grid = previous_grid.slice();
		}
	}
	write_grid(grid, true);
}

function generate_sudoku(x) {
	var empty_indexes = [];
	for (var i = 0; i < 81; i++) empty_indexes.push(i);

	clean();
	var grid = read_grid();

	for (var i = 0; i < x; i++) {
		var index, val;

		while (1) {
			var previous_grid = grid.slice();
			index = empty_indexes[get_rand_int(0, empty_indexes.length-1)];

			//get all possibilities for this index
			var possibilities = get_possibilities(grid, index);
			if (possibilities.length === 0) continue;
			//generating value for index

			val = possibilities[get_rand_int(0, possibilities.length-1)];
			grid[index] = val;
			if (is_valid(grid) && is_completed(find_solution(grid))) {
				empty_indexes = remove_from_arr(empty_indexes, index);
				break;
			}
			grid = previous_grid.slice();
		}
	}
	write_grid(grid, true);
}

function validate_cell_inner(id) {
	var element = document.getElementById('cell-'+id);

	if (element.value.length == 0) return true;
	if (!is_int(element.value)) return false;
	var val = parseInt(element.value);

	var possibilities = [val];
	var grid = read_grid();
	grid[id] = 0;

	if (check_row(grid, id, possibilities).length === 0) {
		for (const i of get_row(id)) document.getElementById('cell-'+i).classList.add('cell-wrong');
		return false;
	}
	if (check_column(grid, id, possibilities).length === 0) {
		for (const i of get_column(id)) document.getElementById('cell-'+i).classList.add('cell-wrong');
		return false;
	}
	if (check_square(grid, id, possibilities).length === 0) {
		for (const i of get_square(id)) document.getElementById('cell-'+i).classList.add('cell-wrong');
		return false;
	}

	return true;
}

function get_row(i) {
	var res = [];
	var row_num = Math.floor(i / 9);

	for (var j = row_num*9; j < (row_num*9 + 9); j++) res.push(j);

	return res;
}

function get_column(i) {
	var res = [];
	var column_num = i % 9;

	for (var j = column_num; j < 81; j += 9) res.push(j);

	return res;
}

function get_square(i) {
	var res = [];
	var squares = [
		[0,1,2,9,10,11,18,19,20],
		[3,4,5,12,13,14,21,22,23],
		[6,7,8,15,16,17,24,25,26],

		[27,28,29,36,37,38,45,46,47],
		[30,31,32,39,40,41,48,49,50],
		[33,34,35,42,43,44,51,52,53],

		[54,55,56,63,64,65,72,73,74],
		[57,58,59,66,67,68,75,76,77],
		[60,61,62,69,70,71,78,79,80]
	];

	for (var j = 0; j < 9; j++) {
		if (!squares[j].includes(i)) continue;
		squares[j].forEach(el => {res.push(el)});
	}

	return res;
}
