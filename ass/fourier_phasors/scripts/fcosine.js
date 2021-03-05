function fcosine(data, radius) {
  if (data.j < 2) {
    data.y += radius * sin(time * Math.PI);
    data.x += radius * cos(time * Math.PI) * Math.pow(-1, data.j);
    data.r = radius;
  }
}

fncs.push({name: 'cosine', callback: fcosine});
