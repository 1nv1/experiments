function fsquare(data, radius) {
  data.n = data.j * 2 + 1;
  data.r = radius * (4 / (data.n * Math.PI));
  data.x += data.r * cos(data.n * time * 2 * Math.PI);
  data.y += data.r * sin(data.n * time * 2 * Math.PI);
}

fncs.push({name: 'square', callback: fsquare});
