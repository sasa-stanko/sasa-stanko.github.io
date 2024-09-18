class drawer_t {
  static cell_size = 40;
  static line_width = 1;
  static wall_extra_width = 1;

  static background_color = "#0e1a2c";
  static grid_line_color = "#456096";
  static line_color = "#e9eff8"
  static color_by_code = new Map([['r', "#f00"], ['g', "#2d5"], ['b', "#09f"], ['y', "#fc1"]]);

  canvas;
  rows;
  cols;

  constructor(canvas, rows, cols) {
    this.canvas = canvas;
    this.rows = rows;
    this.cols = cols;
  }

  resize_canvas() {
    const line_width = drawer_t.line_width;
    const cell_size = drawer_t.cell_size;
    const wall_padding = drawer_t.wall_extra_width;
    this.canvas.width = line_width + this.cols * (cell_size + line_width) + 2 * wall_padding;
    this.canvas.height = line_width + this.rows * (cell_size + line_width) + 2 * wall_padding;
  }

  clear() {
    this._get_ctx().clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  draw_cell(r, c) {
    const ctx = this._get_ctx();
    const line_width = drawer_t.line_width;
    const cell_size = drawer_t.cell_size;
    const [x, y] = this._to_top_left(r, c);
    ctx.save();
    ctx.fillStyle = drawer_t.grid_line_color;
    ctx.fillRect(x, y, cell_size + 2 * line_width, cell_size + 2 * line_width);
    ctx.fillStyle = drawer_t.background_color;
    ctx.fillRect(x + line_width, y + line_width, cell_size, cell_size);
    ctx.restore();
  }

  draw_grid() {
    for (let r = 0; r < this.rows; ++r)
      for (let c = 0; c < this.cols; ++c)
        this.draw_cell(r, c);
  }

  draw_wall(r, c, vertical, length) {
    const ctx = this._get_ctx();
    const line_width = drawer_t.line_width;
    const cell_size = drawer_t.cell_size;
    const wall_padding = drawer_t.wall_extra_width;
    const step = cell_size + line_width;
    const [x, y] = this._to_top_left(r, c);
    const l = length * step + line_width;
    ctx.save();
    ctx.fillStyle = drawer_t.line_color;
    if (vertical)
      ctx.fillRect(x - wall_padding, y, line_width + 2 * wall_padding, l);
    else
      ctx.fillRect(x, y - wall_padding, l, line_width + 2 * wall_padding);
    ctx.restore();
  }

  draw_robot(color, r, c, dir) {
    const ctx = this._get_ctx();
    const a = 0.5 * (drawer_t.cell_size / 2);
    const [x, y] = this._to_center(r, c);
    ctx.save();
    ctx.fillStyle = drawer_t.color_by_code.get(color);
    ctx.translate(x, y);
    ctx.rotate(-this._to_angle(dir));
    ctx.beginPath();
    ctx.moveTo(-a, -0.85 * a);
    ctx.lineTo(a, 0);
    ctx.lineTo(-a, 0.85 * a);
    ctx.fill();
    ctx.restore();
  }

  draw_gem(r, c) {
    const ctx = this._get_ctx();
    const a = 0.3 * (drawer_t.cell_size / 2);
    const [x, y] = this._to_center(r, c);
    ctx.save();
    ctx.strokeStyle = drawer_t.line_color;
    ctx.lineWidth = 2;
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.moveTo(0, a);
    ctx.lineTo(a, 0.5 * a);
    ctx.lineTo(a, -0.5 * a);
    ctx.lineTo(0, -a);
    ctx.lineTo(-a, -0.5 * a);
    ctx.lineTo(-a, +0.5 * a);
    ctx.lineTo(0, a);
    ctx.stroke();
    ctx.restore();
  }

  draw_bug(r, c) {
    const ctx = this._get_ctx();
    const a = 0.35 * (drawer_t.cell_size / 2);
    const [x, y] = this._to_center(r, c);
    ctx.save();
    ctx.strokeStyle = drawer_t.line_color;
    ctx.lineWidth = 1;
    ctx.translate(x, y);
    for (let i = 0; i < 4; ++i) {
      ctx.beginPath();
      ctx.moveTo(-0.25 * a, 0);
      ctx.lineTo(0, a);
      ctx.lineTo(0.25 * a, 0);
      ctx.lineTo(0, -a);
      ctx.lineTo(-0.25 * a, 0);
      ctx.stroke();
      ctx.rotate(Math.PI / 4);
    }
    ctx.restore();
  }

  draw_chip(color, r, c) {
    const ctx = this._get_ctx();
    const a = 0.3 * (drawer_t.cell_size / 2);
    const [x, y] = this._to_center(r, c);
    ctx.save();
    ctx.strokeStyle = drawer_t.color_by_code.get(color);
    ctx.lineWidth = 1;
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.moveTo(-a, -a);
    ctx.lineTo(-a, a);
    ctx.lineTo(a, a);
    ctx.lineTo(a, -a);
    ctx.lineTo(-a, -a);
    ctx.stroke();
    ctx.lineWidth = 2;
    for (let i = 0; i < 4; ++i) {
      ctx.beginPath();
      ctx.moveTo(-0.6 * a, a);
      ctx.lineTo(-0.6 * a, 1.5 * a);
      ctx.stroke();
      ctx.moveTo(0.6 * a, a);
      ctx.lineTo(0.6 * a, 1.5 * a);
      ctx.stroke();
      ctx.rotate(Math.PI / 2);
    }
    ctx.restore();
  }

  draw_text(text) {
    const ctx = drawer._get_ctx();
    ctx.save();
    ctx.font = "28px Arial";
    ctx.lineWidth = 4;
    ctx.fillStyle = drawer_t.line_color;
    ctx.strokeStyle = drawer_t.background_color;
    ctx.textAlign = "center";
    ctx.strokeText(text, 0.5 * canvas.width, 0.5 * canvas.height);
    ctx.fillText(text, 0.5 * canvas.width, 0.5 * canvas.height);
    ctx.restore();
  }

  _get_ctx() {
    return this.canvas.getContext("2d");
  }

  _to_top_left(r, c, inside = false) {
    const line_width = drawer_t.line_width;
    const cell_size = drawer_t.cell_size;
    const wall_padding = drawer_t.wall_extra_width;
    const x = wall_padding + c * (cell_size + line_width) + (inside ? line_width : 0);
    const y = wall_padding + r * (cell_size + line_width) + (inside ? line_width : 0);
    return [x, y];
  }

  _to_center(r, c) {
    const cs = drawer_t.cell_size;
    const [x, y] = this._to_top_left(r, c, true);
    return [x + 0.5 * cs, y + 0.5 * cs];
  }

  _to_angle(dir) {
    return dir * Math.PI / 180;
  }
};

class level_t {
  constructor(description) {
    this.m = new Map(JSON.parse(description));
    this._encoded_walls = this._encode_walls();
    this._cells = this._compute_reachable_cells();
    this._gems = new Set(this.m.get("gems").map((gem) => this._encode_cell(...gem)));
  }

  rows() { return this.m.get("rows"); }
  cols() { return this.m.get("cols"); }
  walls() { return this.m.get("walls"); }
  cells() { return this._cells; }
  robots() { return this.m.get("robots"); }
  gems() { return Array.from(this._gems).map((cell) => this._decode_cell(cell)); }
  bugs() { const bugs = this.m.get("bugs"); if (bugs) return bugs; else return []; }
  chips() { const chips = this.m.get("chips"); if (chips) return chips; else return []; }

  _encode_cell(r, c) {
    return r * this.cols() + c;
  }

  _decode_cell(cell) {
    const c = cell % this.cols();
    const r = (cell / this.cols()) >> 0;
    return [r, c];
  }

  _encode_wall(r, c, vertical) {
    return (r * (this.cols() + 1) + c) * 2 + (vertical ? 1 : 0);
  }

  _encode_walls() {
    const ret = new Set();
    for (const wall of this.walls()) {
      const length = wall.length > 3 ? wall[3] : 1;
      const vertical = wall[2] === "v";
      for (let i = 0; i < length; ++i)
        ret.add(this._encode_wall(wall[0] + (vertical ? i : 0), wall[1] + (vertical ? 0 : i), vertical));
    }
    return ret;
  }

  _compute_reachable_cells() {
    const ret = new Set();
    const encoded_cells = new Set();
    const stack = [];
    for (const robot of this.robots()) {
      ret.add([robot[1], robot[2]]);
      encoded_cells.add(this._encode_cell(robot[1], robot[2]));
      stack.push([robot[1], robot[2]]);
    }
    const dr = [0, 1, 0, -1];
    const dc = [1, 0, -1, 0];
    while (stack.length > 0) {
      const [r, c] = stack[stack.length-1];
      stack.pop();
      for (let i = 0; i < 4; ++i) {
        const [to_r, to_c] = [r + dr[i], c + dc[i]];
        const ec = this._encode_cell(to_r, to_c);
        if (encoded_cells.has(ec) || !this.is_move_allowed(r, c, to_r, to_c))
          continue;
        ret.add([to_r, to_c]);
        encoded_cells.add(ec);
        stack.push([to_r, to_c]);
      }
    }
    return ret;
  }

  _is_inside_grid(r, c) {
    return 0 <= r && r < this.rows() && 0 <= c && c < this.cols();
  }

  _is_blocked_by_wall(from_r, from_c, to_r, to_c) {
    const r = Math.max(from_r, to_r);
    const c = Math.max(from_c, to_c);
    return this._encoded_walls.has(this._encode_wall(r, c, from_r == to_r));
  }

  is_move_allowed(from_r, from_c, to_r, to_c) {
    if (from_r == to_r && from_c == to_c)
      return true;
    return this._is_inside_grid(to_r, to_c) && !this._is_blocked_by_wall(from_r, from_c, to_r, to_c);
  }

  visit_cell(r, c) {
    this._gems.delete(this._encode_cell(r, c));
  }
}

class process_t {
  constructor(procedures_by_name, initial_procedure) {
    this._procedures = procedures_by_name;
    this._procedure_names = new Set(procedures_by_name.keys());
    this._stack = [[initial_procedure, 0]];
  }

  get_current_instruction() {
    const [name, idx] = this._stack[this._stack.length - 1];
    const procedure = this._procedures.get(name);
    if (idx < procedure.length)
      return procedure[idx];
    else
      return undefined;
  }

  _is_current_procedure_done() {
    return this.get_current_instruction() === undefined;
  }

  is_done() {
    return this._is_current_procedure_done() && this._stack.length == 1;
  }

  get_current_procedure() {
    return this._stack[this._stack.length - 1][0];
  }

  _is_procedure_call(instruction) {
    return this._procedure_names.has(instruction);
  }

  _do_returns() {
    while (this._is_current_procedure_done() && !this.is_done()) {
      this._stack.pop();
      this._stack[this._stack.length - 1][1] += 1;
    }
  }

  step_once() {
    const instruction = this.get_current_instruction();
    if (!instruction)
      return;
    if (this._is_procedure_call(instruction))
      this._stack.push([instruction, 0]);
    else {
      this._stack[this._stack.length - 1][1] += 1;
      this._do_returns();
    }
  }

  step_calls() {
    while (!this.is_done() && this._is_procedure_call(this.get_current_instruction()))
      this.step_once();
  }
};

class pos_t {
  constructor(r, c, dir) {
    this.r = r;
    this.c = c;
    this.dir = dir;
  }

  update(new_pos) {
    this.r = new_pos.r;
    this.c = new_pos.c;
    this.dir = new_pos.dir;
  }

  moved() {
    if (this.dir == 90)
      return new pos_t(this.r - 1, this.c, this.dir);
    else if (this.dir == 180)
      return new pos_t(this.r, this.c - 1, this.dir);
    else if (this.dir == 270)
      return new pos_t(this.r + 1, this.c, this.dir);
    else
      return new pos_t(this.r, this.c + 1, this.dir);
  }

  rotated_left() {
    return new pos_t(this.r, this.c, (this.dir + 90) % 360)
  }

  rotated_right() {
    return new pos_t(this.r, this.c, (this.dir + 270) % 360)
  }
};

class robot_t {
  constructor(pos, process) {
    this._pos = pos;
    this._process = process;
  }

  pos() {
    return this._pos;
  }

  move_to(new_pos) {
    this._pos = new_pos;
  }

  process() {
    return this._process;
  }

  color() {
    return this._process.get_current_procedure();
  }
};

// ---

let level = null;
let drawer = null;

function load_level() {
  level = new level_t(document.getElementById("level_description").value);
  drawer = new drawer_t(document.getElementById("canvas"), level.rows(), level.cols());
  drawer.resize_canvas();
}

let program = null;

function load_program() {
  program = new Map();
  program.set('r', document.getElementById("r").value.split(""));
  program.set('g', document.getElementById("g").value.split(""));
  program.set('b', document.getElementById("b").value.split(""));
  program.set('y', document.getElementById("y").value.split(""));
}

let robots = null;

function load_robots() {
  robots = [];
  for (const [color, r, c, dir] of level.robots())
    robots.push(new robot_t(new pos_t(r, c, dir), new process_t(program, color)));
}

function prepare() {
  load_level();
  load_program();
  load_robots();
  draw();
}

prepare();

// ---

let interval_id = null;

function start_main_loop() {
  const time_step = 400;
  interval_id = setInterval(main_loop, time_step);
}

function stop_main_loop() {
  clearInterval(interval_id);
  interval_id = null;
}

function on_start() {
  prepare();
  start_main_loop();
  document.getElementById("run_button").innerText = "Stop";
}

function on_stop() {
  stop_main_loop();
  prepare();
  document.getElementById("run_button").innerText = "Start";
}

function is_win() {
  return level.gems().length == 0;
}

function is_done() {
  return is_win() || robots.every((r) => r.process().is_done());
}

function on_done() {
  stop_main_loop();
  if (is_win())
    drawer.draw_text("LEVEL COMPLETED!");
  else
    drawer.draw_text("PROCESS STOPPED!");
  document.getElementById("run_button").innerText = "Reset";
}

function on_run_click() {
  if (interval_id || document.getElementById("run_button").innerText === "Reset")
    on_stop();
  else
    on_start();
}

function on_load_click() {
  on_stop();
}

// ---

function draw() {
  drawer.clear();
  for (const cell of level.cells())
    drawer.draw_cell(...cell);
  for (const wall of level.walls())
    drawer.draw_wall(wall[0], wall[1], wall[2] === "v", wall.length > 3 ? wall[3] : 1)
  for (const gem of level.gems())
    drawer.draw_gem(...gem);
  for (const bug of level.bugs())
    drawer.draw_bug(...bug);
  for (const chip of level.chips())
    drawer.draw_chip(...chip);
  for (const robot of robots)
    drawer.draw_robot(robot.color(), robot.pos().r, robot.pos().c, robot.pos().dir);
}


function get_next_pos(pos, instruction) {
  if (instruction === "m")
    return pos.moved();
  else if (instruction === "<")
    return pos.rotated_left();
  else if (instruction === ">")
    return pos.rotated_right();
  else
    return pos;
}

function step_robots() {
  for (let robot of robots) {
    if (robot.process().is_done())
      continue;
    robot.process().step_calls();
    const instr = robot.process().get_current_instruction();
    let from = robot.pos();
    let to = get_next_pos(from, instr);
    if (level.is_move_allowed(from.r, from.c, to.r, to.c)) {
      from.update(to);
      level.visit_cell(to.r, to.c);
    }
    robot.process().step_once();
    robot.process().step_calls();
  }
}

function main_loop() {
  if (is_done()) {
    on_done();
    return;
  }
  step_robots();
  draw();
}
