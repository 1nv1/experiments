// Fourier Series
// Daniel Shiffman
// https://thecodingtrain.com/CodingChallenges/125-fourier-series.html
// https://youtu.be/Mm2eYfj0SgA

let time = 0;
let wave = [];
let path = [];

let slider_terms;
let slider_time;
let slider_amp;

let canvas_h;
let canvas_w;

function setup() {
  var element = document.getElementById('p5canvas');
  var positionInfo = element.getBoundingClientRect();
  canvas_h = positionInfo.height;
  canvas_w = positionInfo.width;
  createCanvas(canvas_w, canvas_h);
  slider_terms = createSlider(1, 20, 5);
  slider_time = createSlider(1, 100, 10);
  slider_amp = createSlider(20, canvas_h / 4, 75);
}

function draw() {
  background(0);
  translate(canvas_w / 4, canvas_h / 2);

  let x = 0;
  let y = 0;

  for (let i = 0; i < slider_terms.value(); i++) {
    let prevx = x;
    let prevy = y;
    let radius;

    // Series
    let n = i * 2 + 1;
    radius = slider_amp.value() * (4 / (n * PI));
    x += radius * cos(n * time);
    y += radius * sin(n * time);

    /*
    if (i < 2) {
      let n = i * 2 + 1;
      radius = slider_amp.value();
      y += radius * cos(time * Math.PI);
      x += radius * sin(time * Math.PI) * Math.pow(-1, i);
    }
    */

    stroke(255, 100);
    noFill();
    ellipse(prevx, prevy, radius * 2);

    fill(255);
    stroke(255);
    line(prevx, prevy, x, y, 16);
    //ellipse(x, y, 8);
  }
  wave.unshift(y);

  translate((canvas_h / 4) + slider_amp.value() * 1.2, 0);
  line(x - (canvas_h / 4) - slider_amp.value() * 1.2, y, 0, wave[0]);
  beginShape();
  noFill();
  for (let i = 0; i < wave.length; i++) {
    vertex(i, wave[i]);
  }
  endShape();

  time += 0.5 / slider_time.value();

  if (wave.length > canvas_w / 2) {
    wave.pop();
  }
}
