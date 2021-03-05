// Based on Daniel Shiffman works
// https://thecodingtrain.com/CodingChallenges/125-fourier-series.html
// https://youtu.be/Mm2eYfj0SgA

let time = 0;
let wave = [];
let path = [];

let slider_terms;
let slider_time;
let slider_amp;
let sel;

let canvas_h;
let canvas_w;

let kv;
let old = {
  data: { x: 0, y: 0, j: 0, n: 0, r: 0},
  wave: []
};
let data = { x: 0, y: 0, j: 0, n: 0, r: 0};

function setup() {
  let kh = 30;
  let h = 30;
  let element = document.getElementById('p5canvas');
  let positionInfo = element.getBoundingClientRect();
  canvas_h = positionInfo.height;
  canvas_w = positionInfo.width;

  kv = new kvdb('ass:phasors');
  console.log(kv.id());

  createCanvas(canvas_w, canvas_h);
  frameRate(30);

  gterms = createDiv('');
  gterms.position(15, h);
  slider_terms = createSlider(1, 20, kv.get('terms'));
  slider_terms.parent(gterms);
  label_terms = createSpan(' Segmentos');
  label_terms.style('color', '#FFFFFF');
  label_terms.parent(gterms);
  h += kh;

  gtime = createDiv('');
  gtime.position(15, h);
  slider_time = createSlider(1, 100, kv.get('time'));
  slider_time.parent(gtime);
  label_time = createSpan(' Velocidad');
  label_time.style('color', '#FFFFFF');
  label_time.parent(gtime);
  h += kh;

  gamp = createDiv('');
  gamp.position(15, h);
  slider_amp = createSlider(10, canvas_h / 4, kv.get('amp'));
  slider_amp.parent(gamp);
  label_amp = createSpan(' Tamaño');
  label_amp.style('color', '#FFFFFF');
  label_amp.parent(gamp);
  h += kh;

  gfunc = createDiv('');
  gfunc.position(15, h);
  sel = createSelect();
  sel.parent(gfunc);
  label_func = createSpan(' Función');
  label_func.style('color', '#FFFFFF');
  label_func.parent(gfunc);

  fncs.forEach(function(item, idx) {
    sel.option(item.name);
  });

  sel.selected(kv.get('function'));

  if (kv.get('data') != 'undefined') {
    old.data = kv.get('data');
  }

  if (kv.get('wave') != 'undefined') {
    old.wave = kv.get('wave');
  }
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
  return confirmationMessage;                            //Webkit, Safari, Chrome
});

function draw() {
  background(0);
  translate(canvas_w / 4, canvas_h / 2);
  let radius = slider_amp.value();
  let i;
  data = old.data;
  wave = old.wave;
  old.data = { x: 0, y: 0, j: 0, n: 0, r: 0};

  for (i = data.j; i < slider_terms.value(); i++) {
    let prevx = data.x;
    let prevy = data.y;

    data.j = i;

    fncs.forEach(function(item, idx) {
      if (sel.value() == item.name) {
        item.callback(data, radius);
      }
    });

    fill(255);

    stroke('rgb(255, 0, 0)');
    noFill();
    ellipse(prevx, prevy, data.r * 2);

    stroke('rgb(0, 255,0)');
    line(prevx, prevy, data.x, data.y);
    ellipse(data.x, data.y, 4);
  }
  wave.unshift(data.y);

  translate((canvas_h / 2) + data.r * 1.2, 0);
  stroke('rgb(0, 0, 255)');
  line(data.x - (canvas_h / 2) - data.r * 1.2, data.y, 0, wave[0]);
  beginShape();
  noFill();
  stroke('rgb(0, 255, 0)');
  for (i = 0; i < wave.length; i++) {
    vertex(i, wave[i]);
  }
  endShape();

  time += 0.0001 * slider_time.value();

  if (wave.length > canvas_w / 2) {
    wave.pop();
  }
  old.wave = wave;
}
