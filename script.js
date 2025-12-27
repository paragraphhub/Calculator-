let display = document.getElementById("display");

function append(value) {
  display.value += value;
}
function appendTrig(value) {
  display.value += value;
  isFraction = false;
}
function clearDisplay() {
  display.value = "";
}

function calculate() {
  try {
    let expr = display.value;

    // If current is fraction, convert to decimal first
    if (expr.includes("/")) {
      let parts = expr.split("/");
      let numerator = parseFloat(parts[0]);
      let denominator = parseFloat(parts[1]);
      if (isNaN(numerator) || isNaN(denominator) || denominator === 0) {
        display.value = "Error";
        return;
      }
      expr = numerator / denominator; // fraction converted to decimal
    }

    // Trigonometry mapping
    expr = expr.toString().replace(/sin\(/g, "Math.sin(");
    expr = expr.replace(/cos\(/g, "Math.cos(");
    expr = expr.replace(/tan\(/g, "Math.tan(");
    expr = expr.replace(/cot\(/g, "1/Math.tan(");
    expr = expr.replace(/sec\(/g, "1/Math.cos(");
    expr = expr.replace(/cosec\(/g, "1/Math.sin(");

    // PI
    expr = expr.replace(/π/g, "Math.PI");

    display.value = eval(expr);
    isFraction = false; // reset fraction mode after calculation
  } catch {
    display.value = "Error";
  }
}
let isFraction = false;

function toggleFraction() {
  let value = display.value;

  // Empty or error check
  if (!value || value === "Error") return;

  // If currently decimal → convert to fraction
  if (!isFraction) {
    let num = parseFloat(value);
    if (isNaN(num)) {
      display.value = "Error";
      return;
    }

    let tolerance = 1.0E-6;
    let h1 = 1, h2 = 0;
    let k1 = 0, k2 = 1;
    let b = num;

    while (Math.abs(num - h1 / k1) > num * tolerance) {
      let a = Math.floor(b);
      let aux = h1;
      h1 = a * h1 + h2;
      h2 = aux;

      aux = k1;
      k1 = a * k1 + k2;
      k2 = aux;

      b = 1 / (b - a);
    }

    display.value = h1 + "/" + k1;
    isFraction = true;
  }
  // If currently fraction → convert to decimal
  else {
    if (!value.includes("/")) {
      display.value = "Error";
      return;
    }

    let parts = value.split("/");
    let numerator = parseFloat(parts[0]);
    let denominator = parseFloat(parts[1]);

    if (isNaN(numerator) || isNaN(denominator) || denominator === 0) {
      display.value = "Error";
      return;
    }

    display.value = numerator / denominator;
    isFraction = false;
  }
}