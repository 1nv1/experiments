function fsine(data, radius) {
  if (data.j < 2) {
    data.y += radius * cos(time * Math.PI);
    data.x += radius * sin(time * Math.PI) * Math.pow(-1, data.j);
    data.r = radius;
  }
}

fncs.push({name: 'sine', callback: fsine});
