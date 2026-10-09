import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFile } from "node:fs/promises";

const source = await readFile(new URL("../webapp/controller/Main.controller.js", import.meta.url), "utf8");
function setup() {
  let definition;
  let visible = [0, 1];
  const expanded = [true, false, false];
  const state = { query: "SAP", count: 2 };
  const panels = expanded.map((value, index) => ({
    isA: () => true,
    getExpanded: () => expanded[index],
    setExpanded: (next) => { expanded[index] = next; },
    setExpandAnimation: () => {}
  }));
  const items = panels.map((panel, index) => ({
    getBindingContext: () => ({ getPath: () => `/experience/${index}` }),
    findAggregatedObjects: () => [panel]
  }));
  const binding = {
    filter: (filters) => { visible = filters.length ? [0, 1] : [0, 1, 2]; },
    getLength: () => visible.length
  };
  const list = { getBinding: () => binding, getItems: () => visible.map((index) => items[index]) };
  const timers = [];
  let prints = 0;
  vm.runInNewContext(source, {
    sap: { ui: { define: (deps, factory) => {
      factory({ extend: (name, methods) => { definition = methods; } }, function Filter(...args) { this.args = args; }, { Contains: "Contains" }, { show: () => {} }, {});
    } } },
    window: { setTimeout: (fn) => timers.push(fn), print: () => { prints++; } }
  });
  definition.byId = () => list;
  definition.getOwnerComponent = () => ({ getModel: () => ({
    getProperty: (key) => state[key.slice(1)],
    setProperty: (key, value) => { state[key.slice(1)] = value; }
  }) });
  return { controller: definition, state, expanded, timers, visible: () => visible, prints: () => prints };
}

test("printing includes filtered-out roles and expanded details, then restores the screen", () => {
  const s = setup();
  s.controller.onPrint();
  assert.deepEqual(s.visible(), [0, 1, 2]);
  assert.deepEqual(s.expanded, [true, true, true]);
  s.timers[0]();
  assert.equal(s.prints(), 1);
  s.controller._restoreAfterPrint();
  assert.deepEqual(s.visible(), [0, 1]);
  assert.deepEqual(s.expanded, [true, false, false]);
  assert.equal(s.state.query, "SAP");
  assert.equal(s.state.count, 2);
});

test("repeated print clicks do not overwrite the original screen state", () => {
  const s = setup();
  s.controller.onPrint();
  s.controller.onPrint();
  assert.equal(s.timers.length, 1);
  s.controller._restoreAfterPrint();
  assert.equal(s.expanded[1], false);
  s.controller._restoreAfterPrint();
});
