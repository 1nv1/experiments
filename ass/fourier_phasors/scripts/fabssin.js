function fabssin(data, radius) {
  let w = dt * 2 * data.n * Math.PI;
  if (data.n == 1) {
    data.x = 2 / Math.PI;
    data.y = 2 / Math.PI;
  }
  if ((data.n % 2) == 0) {
    let f = -4 / (Math.PI * ((4*data.n*data.n) - 1));
    data.r = radius * f;
    data.x += data.r * cos(w);
    data.y += data.r * sin(w);
  }
}

fncs.push({name: 'abs(sin)', callback: fabssin});
