// Based on Daniel Shiffman works
// https://thecodingtrain.com/CodingChallenges/125-fourier-series.html
// https://youtu.be/Mm2eYfj0SgA

let dt = 0;
let wave = [];
let profile = [];
let path = [];

let slider_terms;
let slider_time;
let slider_amp;
let sel;

let canvas_h;
let canvas_w;

let kv;
let old = {
  data: { x: 0, y: 0, n: 0, r: 0, g: false},
  wave: []
};
let data = { x: 0, y: 0, n: 0, r: 0, g: false};

let old_dt = 0;
let del = false;

var step_w, step_h;

var sh = true;
var divs = [];

function fShowHide() {
  sh = sh == true ? false : true;
  for (var key in divs) {
    divs[key].style('display', sh == true ? 'block' : 'none');
  }
}

function setup() {
  let kh = 30;
  let h = 0;
  let element = document.getElementById('p5canvas');
  let positionInfo = element.getBoundingClientRect();
  canvas_h = positionInfo.height;
  canvas_w = positionInfo.width;

  step_w = canvas_w / 64;
  step_h = canvas_h / 64;

  kv = new kvdb('ass:phasors');
  console.log(kv.id());

  createCanvas(canvas_w, canvas_h);
  frameRate(30);

  btnShow = createButton('Show/Hide');
  btnShow.position(0, h);
  btnShow.mousePressed(fShowHide);
  h += kh;

  divs['armónicos'] = createDiv('');
  divs['armónicos'].position(15, h);
  slider_terms = createSlider(1, 30, kv.get('terms', 5));
  slider_terms.parent(divs['armónicos']);
  label_terms = createSpan(' - Armónicos +');
  label_terms.style('color', '#FFFFFF');
  label_terms.parent(divs['armónicos']);
  h += kh;

  divs['speed'] = createDiv('');
  divs['speed'].position(15, h);
  slider_time = createSlider(1, 30, kv.get('time', 5));
  slider_time.parent(divs['speed']);
  label_time = createSpan(' - Frecuencia +');
  label_time.style('color', '#FFFFFF');
  label_time.parent(divs['speed']);
  h += kh;

  divs['amplitude'] = createDiv('');
  divs['amplitude'].position(15, h);
  slider_amp = createSlider(1, canvas_h / 2, kv.get('amp', 5));
  slider_amp.parent(divs['amplitude']);
  label_amp = createSpan(' - Tamaño +');
  label_amp.style('color', '#FFFFFF');
  label_amp.parent(divs['amplitude']);
  h += kh;

  divs['functions'] = createDiv('');
  divs['functions'].position(15, h);
  sel = createSelect();
  sel.parent(divs['functions']);
  label_func = createSpan(' Función');
  label_func.style('color', '#FFFFFF');
  label_func.parent(divs['functions']);
  sel.changed(fChanged);
  h += kh;

  divs['orbites'] = createDiv('');
  divs['orbites'].position(15, h);
  selorb = createSelect();
  selorb.parent(divs['orbites']);
  label_orb = createSpan(' Órbitas');
  label_orb.style('color', '#FFFFFF');
  label_orb.parent(divs['orbites']);
  selorb.option('Con');
  selorb.option('Sin');
  selorb.selected(kv.get('orb', 'Con'));
  h += kh;

  divs['trace'] = createDiv('');
  divs['trace'].position(15, h);
  seltrace = createSelect();
  seltrace.parent(divs['trace']);
  label_trace = createSpan(' Trazo');
  label_trace.style('color', '#FFFFFF');
  label_trace.parent(divs['trace']);
  seltrace.option('Con');
  seltrace.option('Sin');
  seltrace.selected(kv.get('trace', 'Con'));

  fncs.forEach(function(item, idx) {
    sel.option(item.name);
  });

  sel.selected(kv.get('function', 'sine'));

  old.data = kv.get('data', old.data);

  old.wave = kv.get('wave', old.wave);

}

function windowResized() {
  let element = document.getElementById('p5canvas');
  let positionInfo = element.getBoundingClientRect();
  canvas_w = positionInfo.width;
  canvas_h = positionInfo.height;
  resizeCanvas(canvas_w, canvas_h);
}

window.addEventListener("beforeunload", function (e) {
  var confirmationMessage = "";
  (e || window.event).returnValue = confirmationMessage; //Gecko + IE
  kv.set('function', sel.value());
  kv.set('amp', slider_amp.value());
  kv.set('time', slider_time.value());
  kv.set('terms', slider_terms.value());
  kv.set('data', data);
  kv.set('wave', wave);
  kv.set('orb', selorb.value());
  kv.set('trace', seltrace.value());
  return confirmationMessage;
});

function draw() {
  background(0);
  let radius = slider_amp.value();
  let i, j;

  data = old.data;
  wave = old.wave;
  old.data = { x: 0, y: 0, n: 0, r: 0};

  translate(0, 0);

  strokeWeight(1);

  // Grid
  stroke('#88916b');
  for (i = 0; i <= canvas_w; i += step_w) {
    for (j = 0; j <= canvas_h; j += step_h) {
      point(i, j);
    }
  }

  // Axis
  translate(0, 0);
  stroke('rgb(255, 255, 255)');
  textSize(18);

  text('Im(Z)', canvas_w / 4 + 10, 18);
  line(canvas_w / 4, 0, canvas_w / 4, canvas_h - 10);

  text('Re(Z)', canvas_w / 2 - 70, canvas_h / 2 - 10);
  line(0, canvas_h / 2, canvas_w / 2 - 20, canvas_h / 2);

  text('f(t)', canvas_w / 2 + 10, 18);
  line(canvas_w / 2, 0, canvas_w / 2, canvas_h - 10);

  text('t', canvas_w - 20, canvas_h / 2 - 10);
  line(canvas_w / 2, canvas_h / 2, canvas_w, canvas_h / 2);

  // Reset start point
  translate(canvas_w / 4, canvas_h / 2);

  dt += 0.0005 * slider_time.value();
  old_dt += 0.0005 * slider_time.value();

  let prevx = 0, prevy = 0;
  let limit = slider_terms.value();
  let lastr = 0;

  label_terms.html('- Armónicos + (' + limit + ')');


  for (i = data.n; i < limit; i++) {

    data.n = i + 1;

    fncs.forEach(function(item, idx) {
      if (sel.value() == item.name) {
        item.callback(data, radius);
      }
    });

    fill(255);

    stroke('rgb(255, 0, 0)');
    noFill();
    if (selorb.value() == 'Con') {
      if (lastr != data.r) {
        ellipse(prevx, prevy, data.r * 2);
        lastr = data.r;
      }
    }

    stroke('rgb(0, 255,0)');
    line(prevx, prevy, data.x, data.y);
    ellipse(data.x, data.y, 4);

    prevx = data.x;
    prevy = data.y;
  }
  wave.unshift(data.y);

  let ref = (canvas_h / 2) + data.r;

  translate(ref, 0);
  stroke('rgb(0, 0, 255)');
  line(data.x - (canvas_h / 2) - data.r, data.y, canvas_w / 4 - ref, wave[0]);
  beginShape();
  noFill();
  stroke('rgb(0, 255, 0)');
  for (i = 0; i < wave.length; i++) {
    vertex(i + canvas_w / 4 - ref, wave[i]);
  }
  endShape();

  if (wave.length > canvas_w / 2) {
    wave.pop();
  }
  old.wave = wave;

  // Profile
  if (seltrace.value() == 'Con') {
    profile.unshift([data.x, data.y]);
    translate(-ref, 0);
    stroke('rgb(255, 120, 255)');
    strokeWeight(2);
    for (i = 0; i < profile.length; i++) {
      point(profile[i][0], profile[i][1]);
    }
    if (old_dt > 4) {
      profile.pop();
    }
  }

  // prevent default
  return false;
}

function mouseWheel(event) {
  let lsw = canvas_w / 8;
  let liw = canvas_w / 64;

  let lsh = canvas_h / 8;
  let lih = canvas_h / 64;

  let step = event.delta > 0 ? event.delta - 1 : event.delta + 1;
  step_w = step > 0 ? step_w * step : step_w / -step;
  step_w = step_w > lsw ? lsw : step_w;
  step_w = step_w < liw ? liw : step_w;

  step_h = step > 0 ? step_h * step : step_h / -step;
  step_h = step_h > lsh ? lsh : step_h;
  step_h = step_h < lih ? lih : step_h;
  //uncomment to block page scrolling
  return false;
}

function fChanged() {
  profile = [];
  old_dt = 0;
}
