/*Алгоритм построения графика функций от двух переменных.
Алгоритм строит изолинии (линии уровня) графика по заданному Z (значению уровня).*/
'use strict'
function buildPlane() {
	//Обновление canvas и создание context
	space.width = space.width;
	const context = space.getContext('2d');
	
	//Границы построение функции по X, Y, Z (Z = F(X, Y)) соответственно
	const ax = Number(val_ax.value), bx = Number(val_bx.value), ay = Number(val_ay.value), by = Number(val_by.value), az = Number(val_az.value), bz = Number(val_bz.value);
	//Шаг построения по X, Y, Z соответственновенно
	const hx = Number(val_hx.value), hy = Number(val_hy.value), st = Number(val_st.value);
	//Длина оси Z
	const zmax = Math.abs(bz-az), xmax = Math.abs(bx-ax), ymax = Math.abs(by-ay);
	//Строка в которой записана функция от x, y
	const func = val_func.value;
	//Функция от (x, y) возвращающая значение F(x, y) где F наша функция
	const F = (x, y) => {
		return eval(func);
	};
	
	const RGB = (z) => {
		let r, g, b;
		if (z < (zmax / 2)) {
			r = 0;
			g = Math.round((255 * 2 * z) / zmax);
			b = Math.round(255 - (255 * 2 * z) / zmax);
		} else {
			r = Math.round((255 * 2 * z) / zmax - 255);
			g = Math.round(255 * 2 - (255 * 2 * z) / zmax);
			b = 0;
		};
		return ('rgb(' + r + ', ' + g + ', ' + b + ')');
	};
	
	//Вспомогательные переменные
	const PI = Math.PI;
	const maxX = space.width;
	const maxY = space.height;
	const kx = 7, ky = 4.5;
	const R0 = maxX/(kx*Math.cos(10*PI/180)+ky*Math.cos(30*PI/180));
	const yd = kx*R0*Math.sin(10*PI/180), yu = ky*R0*Math.sin(30*PI/180);
	//Функция преобразующая координаты x, y, z пространства в координаты xc, yc плоскости canvas
	const GraphToCanvas = (x, y, z) => {
		let xc = 0, yc = 0;
		
		yc += yd+(z-az)*(maxY-yd-yu)/zmax;
		
		yc += (y-ay)*yu/ymax;
		xc += (y-ay)*(ky*R0*Math.cos(30*PI/180))/ymax;
		
		yc -= (x-ax)*yd/xmax;
		xc += (x-ax)*(kx*R0*Math.cos(10*PI/180))/xmax;
		
		yc = maxY-yc;
		
		return [xc, yc];
	};
	//Прорисовка осей координат
	context.moveTo(0, maxY-yd);
	context.lineTo(0, yu);
	context.moveTo(0, maxY-yd);
	context.lineTo(ky*R0*Math.cos(30*PI/180), maxY-yd-yu);
	context.moveTo(0, maxY-yd);
	context.lineTo(kx*R0*Math.cos(10*PI/180), maxY);
	context.strokeStyle = "#000";
	context.stroke();
	
	//Вспомогательные переменные
	let x, xg, y, yg, z, helparr, flag;
	//Основные алгоритмы потроения графика
	//Идет по Y
	for (y = ay; y <= by; y += hy) {
		flag = false;
		for (x = ax; x <= bx; x += hx) {
			z = F(x, y);
			if (z < az || z > bz) {
				flag = false;
				continue;
			};
			helparr = GraphToCanvas(x, y, z);
			if (flag) {
				context.lineTo(helparr[0], helparr[1]);
				context.moveTo(helparr[0], helparr[1]);
			} else {
				context.moveTo(helparr[0], helparr[1]);
				flag = true;
			};
		};
	};
	//Идет по X
	for (x = ax; x <= bx; x += hx) {
		flag = false;
		for (y = ay; y <= by; y += hy) {
			z = F(x, y);
			if (z < az || z > bz) {
				flag = false;
				continue;
			};
			helparr = GraphToCanvas(x, y, z);
			if (flag) {
				context.lineTo(helparr[0], helparr[1]);
				context.moveTo(helparr[0], helparr[1]);
			} else {
				context.moveTo(helparr[0], helparr[1]);
				flag = true;
			};
		};
	};
	context.strokeStyle = "#5A009D";
	context.stroke();
};
