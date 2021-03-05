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
  var w = 150;
  var element = document.getElementById('p5canvas');
  var positionInfo = element.getBoundingClientRect();
  canvas_h = positionInfo.height;
  canvas_w = positionInfo.width;

  kv = new kvdb('ass:phasors');
  console.log(kv.id());

  createCanvas(canvas_w, canvas_h);
  text('Segmentos: ');

  label_terms = createDiv('Segmentos: ');
  label_terms.position(15, 15);
  label_terms.style('color', '#FFFFFF');
  slider_terms = createSlider(1, 20, kv.get('terms'));
  slider_terms.parent(label_terms);
  w += w;

  label_time = createDiv('Velocidad: ');
  label_time.position(w, 15);
  label_time.style('color', '#FFFFFF');
  slider_time = createSlider(1, 100, kv.get('time'));
  slider_time.parent(label_time);
  w += w;

  label_amp = createDiv('Tamaño: ');
  label_amp.position(w, 15);
  label_amp.style('color', '#FFFFFF');
  slider_amp = createSlider(10, canvas_h / 4, kv.get('amp'));
  slider_amp.parent(label_amp);
  w += w;

  label_func = createDiv('Funciones: ');
  label_func.position(w, 15);
  label_func.style('color', '#FFFFFF');
  sel = createSelect();

  fncs.forEach(function(item, idx) {
    sel.option(item.name);
  });
  sel.parent(label_func);

  sel.selected(kv.get('function'));

  if (kv.get('data') != 'undefined') {
    old.data = kv.get('data');
  }

  if (kv.get('wave') != 'undefined') {
    old.wave = kv.get('wave');
  }
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
