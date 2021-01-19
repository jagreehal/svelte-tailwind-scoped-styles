var __defProp = Object.defineProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, {get: all[name], enumerable: true});
};

// _snowpack/env.js
var env_exports = {};
__export(env_exports, {
  MODE: () => MODE,
  NODE_ENV: () => NODE_ENV,
  SSR: () => SSR
});
var MODE = "production";
var NODE_ENV = "production";
var SSR = false;

// _snowpack/pkg/svelte/internal.js
function noop() {
}
function run(fn) {
  return fn();
}
function blank_object() {
  return Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function is_function(thing) {
  return typeof thing === "function";
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
function is_empty(obj) {
  return Object.keys(obj).length === 0;
}
function append(target, node) {
  target.appendChild(node);
}
function insert(target, node, anchor) {
  target.insertBefore(node, anchor || null);
}
function detach(node) {
  node.parentNode.removeChild(node);
}
function element(name) {
  return document.createElement(name);
}
function text(data) {
  return document.createTextNode(data);
}
function space() {
  return text(" ");
}
function listen(node, event, handler, options) {
  node.addEventListener(event, handler, options);
  return () => node.removeEventListener(event, handler, options);
}
function attr(node, attribute, value) {
  if (value == null)
    node.removeAttribute(attribute);
  else if (node.getAttribute(attribute) !== value)
    node.setAttribute(attribute, value);
}
function children(element2) {
  return Array.from(element2.childNodes);
}
var current_component;
function set_current_component(component) {
  current_component = component;
}
var dirty_components = [];
var binding_callbacks = [];
var render_callbacks = [];
var flush_callbacks = [];
var resolved_promise = Promise.resolve();
var update_scheduled = false;
function schedule_update() {
  if (!update_scheduled) {
    update_scheduled = true;
    resolved_promise.then(flush);
  }
}
function add_render_callback(fn) {
  render_callbacks.push(fn);
}
var flushing = false;
var seen_callbacks = new Set();
function flush() {
  if (flushing)
    return;
  flushing = true;
  do {
    for (let i = 0; i < dirty_components.length; i += 1) {
      const component = dirty_components[i];
      set_current_component(component);
      update(component.$$);
    }
    set_current_component(null);
    dirty_components.length = 0;
    while (binding_callbacks.length)
      binding_callbacks.pop()();
    for (let i = 0; i < render_callbacks.length; i += 1) {
      const callback = render_callbacks[i];
      if (!seen_callbacks.has(callback)) {
        seen_callbacks.add(callback);
        callback();
      }
    }
    render_callbacks.length = 0;
  } while (dirty_components.length);
  while (flush_callbacks.length) {
    flush_callbacks.pop()();
  }
  update_scheduled = false;
  flushing = false;
  seen_callbacks.clear();
}
function update($$) {
  if ($$.fragment !== null) {
    $$.update();
    run_all($$.before_update);
    const dirty = $$.dirty;
    $$.dirty = [-1];
    $$.fragment && $$.fragment.p($$.ctx, dirty);
    $$.after_update.forEach(add_render_callback);
  }
}
var outroing = new Set();
var outros;
function transition_in(block, local) {
  if (block && block.i) {
    outroing.delete(block);
    block.i(local);
  }
}
function transition_out(block, local, detach2, callback) {
  if (block && block.o) {
    if (outroing.has(block))
      return;
    outroing.add(block);
    outros.c.push(() => {
      outroing.delete(block);
      if (callback) {
        if (detach2)
          block.d(1);
        callback();
      }
    });
    block.o(local);
  }
}
function create_component(block) {
  block && block.c();
}
function mount_component(component, target, anchor) {
  const {fragment, on_mount, on_destroy, after_update} = component.$$;
  fragment && fragment.m(target, anchor);
  add_render_callback(() => {
    const new_on_destroy = on_mount.map(run).filter(is_function);
    if (on_destroy) {
      on_destroy.push(...new_on_destroy);
    } else {
      run_all(new_on_destroy);
    }
    component.$$.on_mount = [];
  });
  after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
  const $$ = component.$$;
  if ($$.fragment !== null) {
    run_all($$.on_destroy);
    $$.fragment && $$.fragment.d(detaching);
    $$.on_destroy = $$.fragment = null;
    $$.ctx = [];
  }
}
function make_dirty(component, i) {
  if (component.$$.dirty[0] === -1) {
    dirty_components.push(component);
    schedule_update();
    component.$$.dirty.fill(0);
  }
  component.$$.dirty[i / 31 | 0] |= 1 << i % 31;
}
function init(component, options, instance, create_fragment4, not_equal, props, dirty = [-1]) {
  const parent_component = current_component;
  set_current_component(component);
  const prop_values = options.props || {};
  const $$ = component.$$ = {
    fragment: null,
    ctx: null,
    props,
    update: noop,
    not_equal,
    bound: blank_object(),
    on_mount: [],
    on_destroy: [],
    before_update: [],
    after_update: [],
    context: new Map(parent_component ? parent_component.$$.context : []),
    callbacks: blank_object(),
    dirty,
    skip_bound: false
  };
  let ready = false;
  $$.ctx = instance ? instance(component, prop_values, (i, ret, ...rest) => {
    const value = rest.length ? rest[0] : ret;
    if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
      if (!$$.skip_bound && $$.bound[i])
        $$.bound[i](value);
      if (ready)
        make_dirty(component, i);
    }
    return ret;
  }) : [];
  $$.update();
  ready = true;
  run_all($$.before_update);
  $$.fragment = create_fragment4 ? create_fragment4($$.ctx) : false;
  if (options.target) {
    if (options.hydrate) {
      const nodes = children(options.target);
      $$.fragment && $$.fragment.l(nodes);
      nodes.forEach(detach);
    } else {
      $$.fragment && $$.fragment.c();
    }
    if (options.intro)
      transition_in(component.$$.fragment);
    mount_component(component, options.target, options.anchor);
    flush();
  }
  set_current_component(parent_component);
}
var SvelteComponent = class {
  $destroy() {
    destroy_component(this, 1);
    this.$destroy = noop;
  }
  $on(type, callback) {
    const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
    callbacks.push(callback);
    return () => {
      const index = callbacks.indexOf(callback);
      if (index !== -1)
        callbacks.splice(index, 1);
    };
  }
  $set($$props) {
    if (this.$$set && !is_empty($$props)) {
      this.$$.skip_bound = true;
      this.$$set($$props);
      this.$$.skip_bound = false;
    }
  }
};

// dist/TailwindClassComponent.svelte.js
function create_fragment(ctx) {
  let button;
  return {
    c() {
      button = element("button");
      button.textContent = "I use Tailwind classes";
      attr(button, "class", "border border-green-500 bg-green-500 text-white rounded-md px-4 py-2 m-2");
    },
    m(target, anchor) {
      insert(target, button, anchor);
    },
    p: noop,
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(button);
    }
  };
}
var TailwindClassComponent = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, null, create_fragment, safe_not_equal, {});
  }
};
var TailwindClassComponent_svelte_default = TailwindClassComponent;

// dist/TailwindScopedComponent.svelte.js
function create_fragment2(ctx) {
  let button;
  return {
    c() {
      button = element("button");
      button.textContent = "I use Tailwind classes";
      attr(button, "class", "button svelte-3dek8t");
    },
    m(target, anchor) {
      insert(target, button, anchor);
    },
    p: noop,
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(button);
    }
  };
}
var TailwindScopedComponent = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, null, create_fragment2, safe_not_equal, {});
  }
};
var TailwindScopedComponent_svelte_default = TailwindScopedComponent;

// dist/App.svelte.js
function create_fragment3(ctx) {
  let div;
  let h1;
  let t1;
  let p;
  let t3;
  let tailwindclasscomponent;
  let t4;
  let tailwindscopedcomponent;
  let t5;
  let button;
  let current;
  let mounted;
  let dispose;
  tailwindclasscomponent = new TailwindClassComponent_svelte_default({});
  tailwindscopedcomponent = new TailwindScopedComponent_svelte_default({});
  return {
    c() {
      div = element("div");
      h1 = element("h1");
      h1.textContent = "Svelte Tailwind Scoped Style Example";
      t1 = space();
      p = element("p");
      p.textContent = "The two buttons below look the same, but one uses scoped styles. If a naming\n    conflict occurs, the button that uses scoped styles doesn't get affected.";
      t3 = space();
      create_component(tailwindclasscomponent.$$.fragment);
      t4 = space();
      create_component(tailwindscopedcomponent.$$.fragment);
      t5 = space();
      button = element("button");
      button.textContent = "Clicking on this adds a `.bg-green-500` class into the document";
      attr(h1, "class", "text-2xl font-bold");
      attr(button, "class", "border-2 border-blue-800 bg-blue-600 text-white rounded-md px-4 py-2 m-2");
      attr(div, "class", "flex flex-col space-y-4 m-8 max-w-md mx-auto text-gray-900");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      append(div, h1);
      append(div, t1);
      append(div, p);
      append(div, t3);
      mount_component(tailwindclasscomponent, div, null);
      append(div, t4);
      mount_component(tailwindscopedcomponent, div, null);
      append(div, t5);
      append(div, button);
      current = true;
      if (!mounted) {
        dispose = listen(button, "click", handleClick, {once: true});
        mounted = true;
      }
    },
    p: noop,
    i(local) {
      if (current)
        return;
      transition_in(tailwindclasscomponent.$$.fragment, local);
      transition_in(tailwindscopedcomponent.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(tailwindclasscomponent.$$.fragment, local);
      transition_out(tailwindscopedcomponent.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div);
      destroy_component(tailwindclasscomponent);
      destroy_component(tailwindscopedcomponent);
      mounted = false;
      dispose();
    }
  };
}
function handleClick() {
  const style = document.createElement("style");
  style.appendChild(document.createTextNode(".bg-green-500 {background-color:hotpink}"));
  document.getElementsByTagName("head")[0].appendChild(style);
}
var App = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, null, create_fragment3, safe_not_equal, {});
  }
};
var App_svelte_default = App;

// dist/index.js
import.meta.env = env_exports;
var app = new App_svelte_default({
  target: document.body
});
var dist_default = app;
if (void 0) {
  (void 0).accept();
  (void 0).dispose(() => {
    app.$destroy();
  });
}
export {
  dist_default as default
};
