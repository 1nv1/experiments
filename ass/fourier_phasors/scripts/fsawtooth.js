function fsawtooth(data, radius) {
  data.n = data.j + 1;
  data.r = radius * (-4 / (data.n * Math.PI)) * Math.pow(-1, data.n);
  data.x += data.r * cos(data.n * time * 2 * Math.PI);
  data.y += data.r * sin(data.n * time * 2 * Math.PI);
}

fncs.push({name: 'sawtooth', callback: fsawtooth});
