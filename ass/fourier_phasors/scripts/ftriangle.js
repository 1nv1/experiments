function ftriangle(data, radius) {
  if (data.j % 2 != 0) {
    let f = Math.pow(-1, (data.j - 1) / 2);
    data.n = 8 / (Math.pow(Math.PI, 2) * Math.pow(data.j, 2)) * f;
    data.r = radius * data.n;
    data.x += data.r * cos(data.j * time * 2 * Math.PI);
    data.y += data.r * sin(data.j * time * 2 * Math.PI);
  }
}

fncs.push({name: 'triangle', callback: ftriangle});
