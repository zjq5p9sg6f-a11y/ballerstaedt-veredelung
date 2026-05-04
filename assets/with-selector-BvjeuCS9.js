import { g as getDefaultExportFromCjs } from './_commonjsHelpers-B85MJLTf.js';
import { b as ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__ } from './ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__-D7cIg9rU.js';

const createStoreImpl = (createState) => {
  let state;
  const listeners = /* @__PURE__ */ new Set();
  const setState = (partial, replace) => {
    const nextState = typeof partial === "function" ? partial(state) : partial;
    if (!Object.is(nextState, state)) {
      const previousState = state;
      state = (replace != null ? replace : typeof nextState !== "object" || nextState === null) ? nextState : Object.assign({}, state, nextState);
      listeners.forEach((listener) => listener(state, previousState));
    }
  };
  const getState = () => state;
  const getInitialState = () => initialState;
  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  const api = { setState, getState, getInitialState, subscribe };
  const initialState = state = createState(setState, getState, api);
  return api;
};
const createStore = (createState) => createState ? createStoreImpl(createState) : createStoreImpl;

const isPromise = promise => typeof promise === 'object' && typeof promise.then === 'function';

const globalCache = [];

function shallowEqualArrays(arrA, arrB, equal = (a, b) => a === b) {
  if (arrA === arrB) return true;
  if (!arrA || !arrB) return false;
  const len = arrA.length;
  if (arrB.length !== len) return false;

  for (let i = 0; i < len; i++) if (!equal(arrA[i], arrB[i])) return false;

  return true;
}

function query(fn, keys = null, preload = false, config = {}) {
  // If no keys were given, the function is the key
  if (keys === null) keys = [fn];

  for (const entry of globalCache) {
    // Find a match
    if (shallowEqualArrays(keys, entry.keys, entry.equal)) {
      // If we're pre-loading and the element is present, just return
      if (preload) return undefined; // If an error occurred, throw

      if (Object.prototype.hasOwnProperty.call(entry, 'error')) throw entry.error; // If a response was successful, return

      if (Object.prototype.hasOwnProperty.call(entry, 'response')) {
        if (config.lifespan && config.lifespan > 0) {
          if (entry.timeout) clearTimeout(entry.timeout);
          entry.timeout = setTimeout(entry.remove, config.lifespan);
        }

        return entry.response;
      } // If the promise is still unresolved, throw


      if (!preload) throw entry.promise;
    }
  } // The request is new or has changed.


  const entry = {
    keys,
    equal: config.equal,
    remove: () => {
      const index = globalCache.indexOf(entry);
      if (index !== -1) globalCache.splice(index, 1);
    },
    promise: // Execute the promise
    (isPromise(fn) ? fn : fn(...keys) // When it resolves, store its value
    ).then(response => {
      entry.response = response; // Remove the entry in time if a lifespan was given

      if (config.lifespan && config.lifespan > 0) {
        entry.timeout = setTimeout(entry.remove, config.lifespan);
      }
    }) // Store caught errors, they will be thrown in the render-phase to bubble into an error-bound
    .catch(error => entry.error = error)
  }; // Register the entry

  globalCache.push(entry); // And throw the promise, this yields control back to React

  if (!preload) throw entry.promise;
  return undefined;
}

const suspend = (fn, keys, config) => query(fn, keys, false, config);

const preload = (fn, keys, config) => void query(fn, keys, true, config);

const clear = keys => {
  if (keys === undefined || keys.length === 0) globalCache.splice(0, globalCache.length);else {
    const entry = globalCache.find(entry => shallowEqualArrays(keys, entry.keys, entry.equal));
    if (entry) entry.remove();
  }
};

var withSelector = {exports: {}};

var withSelector_production = {};

var shim$2 = {exports: {}};

var useSyncExternalStoreShim_production = {};

/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var React$1 = ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__;
function is$1(x, y) {
  return (x === y && (0 !== x || 1 / x === 1 / y)) || (x !== x && y !== y);
}
var objectIs$1 = "function" === typeof Object.is ? Object.is : is$1,
  useState = React$1.useState,
  useEffect$1 = React$1.useEffect,
  useLayoutEffect = React$1.useLayoutEffect,
  useDebugValue$1 = React$1.useDebugValue;
function useSyncExternalStore$2(subscribe, getSnapshot) {
  var value = getSnapshot(),
    _useState = useState({ inst: { value: value, getSnapshot: getSnapshot } }),
    inst = _useState[0].inst,
    forceUpdate = _useState[1];
  useLayoutEffect(
    function () {
      inst.value = value;
      inst.getSnapshot = getSnapshot;
      checkIfSnapshotChanged(inst) && forceUpdate({ inst: inst });
    },
    [subscribe, value, getSnapshot]
  );
  useEffect$1(
    function () {
      checkIfSnapshotChanged(inst) && forceUpdate({ inst: inst });
      return subscribe(function () {
        checkIfSnapshotChanged(inst) && forceUpdate({ inst: inst });
      });
    },
    [subscribe]
  );
  useDebugValue$1(value);
  return value;
}
function checkIfSnapshotChanged(inst) {
  var latestGetSnapshot = inst.getSnapshot;
  inst = inst.value;
  try {
    var nextValue = latestGetSnapshot();
    return !objectIs$1(inst, nextValue);
  } catch (error) {
    return true;
  }
}
function useSyncExternalStore$1(subscribe, getSnapshot) {
  return getSnapshot();
}
var shim$1 =
  "undefined" === typeof window ||
  "undefined" === typeof window.document ||
  "undefined" === typeof window.document.createElement
    ? useSyncExternalStore$1
    : useSyncExternalStore$2;
useSyncExternalStoreShim_production.useSyncExternalStore =
  undefined !== React$1.useSyncExternalStore ? React$1.useSyncExternalStore : shim$1;

{
  shim$2.exports = useSyncExternalStoreShim_production;
}

var shimExports = shim$2.exports;

/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var React = ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__,
  shim = shimExports;
function is(x, y) {
  return (x === y && (0 !== x || 1 / x === 1 / y)) || (x !== x && y !== y);
}
var objectIs = "function" === typeof Object.is ? Object.is : is,
  useSyncExternalStore = shim.useSyncExternalStore,
  useRef = React.useRef,
  useEffect = React.useEffect,
  useMemo = React.useMemo,
  useDebugValue = React.useDebugValue;
withSelector_production.useSyncExternalStoreWithSelector = function (
  subscribe,
  getSnapshot,
  getServerSnapshot,
  selector,
  isEqual
) {
  var instRef = useRef(null);
  if (null === instRef.current) {
    var inst = { hasValue: false, value: null };
    instRef.current = inst;
  } else inst = instRef.current;
  instRef = useMemo(
    function () {
      function memoizedSelector(nextSnapshot) {
        if (!hasMemo) {
          hasMemo = true;
          memoizedSnapshot = nextSnapshot;
          nextSnapshot = selector(nextSnapshot);
          if (undefined !== isEqual && inst.hasValue) {
            var currentSelection = inst.value;
            if (isEqual(currentSelection, nextSnapshot))
              return (memoizedSelection = currentSelection);
          }
          return (memoizedSelection = nextSnapshot);
        }
        currentSelection = memoizedSelection;
        if (objectIs(memoizedSnapshot, nextSnapshot)) return currentSelection;
        var nextSelection = selector(nextSnapshot);
        if (undefined !== isEqual && isEqual(currentSelection, nextSelection))
          return (memoizedSnapshot = nextSnapshot), currentSelection;
        memoizedSnapshot = nextSnapshot;
        return (memoizedSelection = nextSelection);
      }
      var hasMemo = false,
        memoizedSnapshot,
        memoizedSelection,
        maybeGetServerSnapshot =
          undefined === getServerSnapshot ? null : getServerSnapshot;
      return [
        function () {
          return memoizedSelector(getSnapshot());
        },
        null === maybeGetServerSnapshot
          ? undefined
          : function () {
              return memoizedSelector(maybeGetServerSnapshot());
            }
      ];
    },
    [getSnapshot, getServerSnapshot, selector, isEqual]
  );
  var value = useSyncExternalStore(subscribe, instRef[0], instRef[1]);
  useEffect(
    function () {
      inst.hasValue = true;
      inst.value = value;
    },
    [value]
  );
  useDebugValue(value);
  return value;
};

{
  withSelector.exports = withSelector_production;
}

var withSelectorExports = withSelector.exports;
const useSyncExternalStoreExports = /*@__PURE__*/getDefaultExportFromCjs(withSelectorExports);

export { clear as a, createStore as c, preload as p, suspend as s, useSyncExternalStoreExports as u };
