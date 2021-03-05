function fsawtooth(data, radius) {
  let w = dt * 2 * Math.PI * data.n;
  let f = (-1 / (data.n * Math.PI));
  data.r = 2 * radius * f;
  data.x += data.r * cos(w);
  data.y += data.r * sin(w);
}

fncs.push({name: 'sawtooth', callback: fsawtooth});
