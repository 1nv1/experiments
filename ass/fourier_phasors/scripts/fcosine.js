function fcosine(data, radius) {
  if (data.n <= 2) {
    data.r = radius / 2;
    let w = dt * 2 * Math.PI;
    data.y += data.r * sin(w);
    data.x += data.r * cos(w) * Math.pow(-1, data.n);
  }
}

fncs.push({name: 'cosine', callback: fcosine});
