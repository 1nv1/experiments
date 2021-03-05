function fsine(data, radius) {
  if (data.n <= 2) {
    data.r = radius / 2;
    let w = dt * 2 * Math.PI;
    data.y += data.r * cos(w);
    data.x += data.r * sin(w) * Math.pow(-1, data.n);
  }
}

fncs.push({name: 'sine', callback: fsine});
