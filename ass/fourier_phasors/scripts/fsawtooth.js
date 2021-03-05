function fsawtooth(data, radius) {
  data.n = data.j + 1;
  data.r = radius * (-1 / (data.n * Math.PI));
  data.x += data.r * cos(data.n * time * 2 * Math.PI);
  data.y += data.r * sin(data.n * time * 2 * Math.PI);
}

fncs.push({name: 'sawtooth', callback: fsawtooth});
