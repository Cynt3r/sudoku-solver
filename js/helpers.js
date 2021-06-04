function is_int(value) {
  return !isNaN(value) && parseInt(Number(value)) == value && !isNaN(parseInt(value, 10));
}

function remove_from_arr(arr, item) {
	var new_arr = [];
	arr.forEach(el => {if (el !== item) new_arr.push(el)});

	return new_arr;
}

function get_rand_int(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
