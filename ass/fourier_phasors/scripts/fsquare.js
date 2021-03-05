function fsquare(data, radius) {
  let w = dt * 2 * Math.PI * data.n;
  if (data.n % 2 != 0) {
    data.r = radius * (4 / (data.n * Math.PI));
    data.x += data.r * cos(w);
    data.y += data.r * sin(w);
  }
}

fncs.push({name: 'square', callback: fsquare});
