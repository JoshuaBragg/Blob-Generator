let pi = Math.PI;
let c_x = 500;
let c_y = 220;
let a = random(0.1, 0.7);
let b = random(0.1, 0.7);
let c = random(0, 2 * pi);

let MIN_POINTS = 4;
let MAX_POINTS = 7;
let G_SCALE = 60;
let H_SCALE = 30;
let FIX_A = 0;
let FIX_B = 0;
let FIX_C = 0;
let RUN = 0;
let HANDLES = 0;
let ENFORCE_SMOOTH = 1;

function f1(t, b) {
	return Math.sin(4 * (t + pi / b));
}

function f2(t, a) {
	return Math.cos(2 * (t + pi / a));
}

function f3(t, a, b) {
	return 0.5 * Math.sin(2 * (t + pi / b)) - 0.5 * Math.cos(4 * (t - 2 * pi / b / a));
}

function g(t, a, b, c) {
	return Math.abs(f1(t + c, b)) + Math.abs(f2(t + 2 * c, a)) + Math.abs(f3(t + 3 * c, a, b)) + 0.0001;
}

function h(t, a, b, c) {
	return Math.abs(f1(t + 3 * c, b)) + Math.abs(f2(t + c, a)) + Math.abs(f3(t + 2 * c, a, b)) + 1;
}

function random(min, max) {
	return Math.random() * (max - min) + min;
}

function convert_bezier_proper(x_coords, y_coords, init_handle_x, init_handle_y) {
	let proper_x = [];
	let proper_y = [];

	proper_x.push(x_coords[x_coords.length - 1]);
	proper_x.push(2 * x_coords[x_coords.length - 1] - init_handle_x);
	proper_x.push(x_coords[0]);
	proper_x.push(x_coords[1]);

	proper_y.push(y_coords[y_coords.length - 1]);
	proper_y.push(2 * y_coords[y_coords.length - 1] - init_handle_y);
	proper_y.push(y_coords[0]);
	proper_y.push(y_coords[1]);

	for (let i = 2; i < x_coords.length - 2; i += 2) {
		proper_x.push(2 * x_coords[i - 1] - x_coords[i - 2]);
		proper_x.push(x_coords[i]);
		proper_x.push(x_coords[i + 1]);

		proper_y.push(2 * y_coords[i - 1] - y_coords[i - 2]);
		proper_y.push(y_coords[i]);
		proper_y.push(y_coords[i + 1]);
	}

	proper_x.push(2 * x_coords[x_coords.length - 3] - x_coords[x_coords.length - 4]);
	proper_x.push(init_handle_x);
	proper_x.push(x_coords[x_coords.length - 1]);

	proper_y.push(2 * y_coords[y_coords.length - 3] - y_coords[y_coords.length - 4]);
	proper_y.push(init_handle_y);
	proper_y.push(y_coords[y_coords.length - 1]);

	return [proper_x, proper_y]
}

// https://pomax.github.io/bezierinfo/#canonical
// http://graphics.pixar.com/people/derose/publications/CubicClassification/paper.pdf
function is_smooth(proper_x, proper_y) {
	for (let i = 0; i < proper_x.length - 3; i += 3) {
		let x2 = proper_x[i + 1];
		let x3 = proper_x[i + 2];
		let x4 = proper_x[i + 3];

		let y2 = proper_y[i + 1];
		let y3 = proper_y[i + 2];
		let y4 = proper_y[i + 3];

		let f32 = y3 / y2;
		let f42 = y4 / y2;

		let canonical_x = (x4 - x2 * f42) / (x3 - x2 * f32);
		let canonical_y = f42 + (1 - f32) * canonical_x;
		
		if (canonical_y >= 1) {
			continue;
		}

		if (canonical_x >= 1) {
			continue;
		}

		if (canonical_x <= 0) {
			if (canonical_y < (3 * canonical_x - Math.pow(canonical_x, 2)) / 3) {
				continue;
			} else {
				return false;
			}
		}

		if (canonical_y < (Math.pow(12 * canonical_x - 3 * Math.pow(canonical_x, 2), 0.5) - canonical_x) / 2) {
			continue;
		} else {
			return false;
		}
	}

	return true;
}

function create_blob() {
	if (!FIX_A && !RUN) { a = random(0.1, 0.7); }
	if (!FIX_B && !RUN) { b = random(0.1, 0.7); }
	if (!FIX_C && !RUN) { c = random(0, 2 * pi); }

	let num_points = Math.floor(random(MIN_POINTS, MAX_POINTS)) * 2;

	// thetas
	let points = [];

	let interval_size = 2 * pi / num_points;

	for (let i = 0; i < num_points; i++) {
		points.push(random(interval_size * i, interval_size * (i + 1)));
	}

	// radius for thetas
	let r_points = [];

	for (let i = 0; i < num_points; i++) {
		if (i % 2 == 0) {
			r_points.push(H_SCALE * h(points[i], a, b, c));
		} else {
			r_points.push(G_SCALE * g(points[i], a, b, c));
		}
	}

	// cartesian coords
	let x_coords = [];
	let y_coords = [];

	for (let i = 0; i < num_points; i++) {
		x_coords.push(r_points[i] * Math.cos(points[i]));
		y_coords.push(r_points[i] * Math.sin(points[i]));
	}

	let init_handle_point = random(2 * (pi - interval_size), 2 * pi - interval_size);
	let init_handle = H_SCALE * h(init_handle_point, a, b, c);
	let init_handle_x = init_handle * Math.cos(init_handle_point);
	let init_handle_y = init_handle * Math.sin(init_handle_point);

	let path = 'M ' + (x_coords[x_coords.length - 1] + c_x) + ',' + (y_coords[y_coords.length - 1] + c_y) + ' C ' + (2 * x_coords[x_coords.length - 1] - init_handle_x + c_x) + ',' + (2 * y_coords[y_coords.length - 1] - init_handle_y + c_y)
				+ ' ' + (x_coords[0] + c_x) + ',' + (y_coords[0] + c_y)
				+ ' ' + (x_coords[1] + c_x) + ',' + (y_coords[1] + c_y);

	for (let i = 2; i < x_coords.length - 3; i += 2) {
		path += ' S ' + (x_coords[i] + c_x) + ',' + (y_coords[i] + c_y) + ' ' + (x_coords[i + 1] + c_x) + ',' + (y_coords[i + 1] + c_y);
	}

	// match the last handle with the first handle
	path += ' S ' + (init_handle_x + c_x) + ',' + (init_handle_y + c_y)
			+ ' ' + (x_coords[x_coords.length - 1] + c_x) + ',' + (y_coords[y_coords.length - 1] + c_y)

	$('#blob').attr('d', path);

	console.log('Generated new blob');

	let proper_xy = convert_bezier_proper(x_coords, y_coords, init_handle_x, init_handle_y);

	let smooth = is_smooth(proper_xy[0], proper_xy[1]) || !ENFORCE_SMOOTH;

	if (!smooth) {
		$('g').html('<path id="blob" d="" stroke="#2E2A33" fill="#544F5E" fill-opacity="' + $('#fill:checked').length + '" stroke-width="' + parseInt($('#stroke_width').val()) + '" stroke-linecap="round"></path>');
		create_blob();
	} else {
		$('g').html('<path id="blob" d="" stroke="#2E2A33" fill="#544F5E" fill-opacity="' + $('#fill:checked').length + '" stroke-width="' + parseInt($('#stroke_width').val()) + '" stroke-linecap="round"></path>');
		$('#blob').attr('d', path);
		if (!HANDLES) { return; }
		for (let i = 2; i < proper_xy[0].length - 3; i += 3) {
			$('g').html($('g').html() + '<path d=\"M ' + (proper_xy[0][i] + c_x) + ',' + (proper_xy[1][i] + c_y) + ' L ' + (proper_xy[0][i + 2] + c_x) + ',' + (proper_xy[1][i + 2] + c_y) + '\" stroke=\"#93B5C6\" fill-opacity=\"0\" stroke-width=\"3\" stroke-linecap=\"round\"></path>');
		}
		$('g').html($('g').html() + '<path d=\"M ' + (proper_xy[0][proper_xy[0].length - 2] + c_x) + ',' + (proper_xy[1][proper_xy[1].length - 2] + c_y) + ' L ' + (proper_xy[0][1] + c_x) + ',' + (proper_xy[1][1] + c_y) + '\" stroke=\"#93B5C6\" fill-opacity=\"0\" stroke-width=\"2\" stroke-linecap=\"round\"></path>');
		for (let i = 0; i < proper_xy[0].length; i++) {
			$('g').html($('g').html() + '<path d=\"M ' + (proper_xy[0][i] + c_x) + ',' + (proper_xy[1][i] + c_y) + ' l 0.1,0 \" stroke=\"#F0CF65\" fill-opacity=\"0\" stroke-width=\"7\" stroke-linecap=\"round\"></path>');
		}
	}
}

function run() {
	if (RUN) {
		$('#run_button').html('Stop');

		if (!FIX_A) {
			a += 0.00002;
		}

		if (!FIX_B) {
			b += 0.000021;
		}

		if (!FIX_C) {
			c += 0.022;
		}

		create_blob();
	} else {
		$('#run_button').html('Run');
	}
}

setInterval(run, 75);

$(document).ready(() => {
	create_blob();

	$('#generate_button').click(() => {
		create_blob()
	});

	$('#min_points').change(() => {
		MIN_POINTS = parseInt($('#min_points').val());
	});

	$('#max_points').change(() => {
		MAX_POINTS = parseInt($('#max_points').val());
	});

	$('#g_scale').change(() => {
		G_SCALE = parseInt($('#g_scale').val());
	});

	$('#h_scale').change(() => {
		H_SCALE = parseInt($('#h_scale').val());
	});

	$('#fill').change(() => {
		$('#blob').attr('fill-opacity', $('#fill:checked').length);
	});

	$('#stroke_width').change(() => {
		$('#blob').attr('stroke-width', parseInt($('#stroke_width').val()));
	});

	$('#fix_a').change(() => {
		FIX_A = parseInt($('#fix_a:checked').length);
	});

	$('#fix_b').change(() => {
		FIX_B = parseInt($('#fix_b:checked').length);
	});

	$('#fix_c').change(() => {
		FIX_C = parseInt($('#fix_c:checked').length);
	});

	$('#run_button').click(() => {
		RUN = !RUN;
	});

	$('#handles').change(() => {
		HANDLES = parseInt($('#handles:checked').length);
	});
	
	$('#enforce_smooth').change(() => {
		ENFORCE_SMOOTH = parseInt($('#enforce_smooth:checked').length);
	});
});