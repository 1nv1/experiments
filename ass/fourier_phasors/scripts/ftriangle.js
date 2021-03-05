function ftriangle(data, radius) {
  if (data.n % 2 != 0) {
    let w = dt * 2 * Math.PI * data.n;
    let f = Math.pow(-1, (data.n - 1) / 2);
    f *= 8 / (Math.pow(Math.PI, 2) * Math.pow(data.n, 2));
    data.r = radius * f;
    data.x += data.r * cos(w);
    data.y += data.r * sin(w);
  }
}

fncs.push({name: 'triangle', callback: ftriangle});
