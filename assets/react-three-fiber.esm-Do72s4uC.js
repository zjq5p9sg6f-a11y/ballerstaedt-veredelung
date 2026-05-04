import { b as ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__, T as THREE } from './ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__-UvYDSipU.js';
import { a as React, b as ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__ } from './ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__-D7cIg9rU.js';
import { c as createStore$1, u as useSyncExternalStoreExports, s as suspend, p as preload, a as clear } from './with-selector-BvjeuCS9.js';
import { g as getDefaultExportFromCjs } from './_commonjsHelpers-B85MJLTf.js';
import { j as jsxRuntimeExports } from './jsx-runtime-dGY4lsZt.js';
import './ballerstaedt_mf_2_veredelung__mf_v__runtimeInit__mf_v__-BrmfrqAs.js';

var constants = {exports: {}};

var reactReconcilerConstants_production = {};

/**
 * @license React
 * react-reconciler-constants.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
reactReconcilerConstants_production.ConcurrentRoot = 1;
reactReconcilerConstants_production.ContinuousEventPriority = 8;
reactReconcilerConstants_production.DefaultEventPriority = 32;
reactReconcilerConstants_production.DiscreteEventPriority = 2;
reactReconcilerConstants_production.IdleEventPriority = 268435456;
reactReconcilerConstants_production.LegacyRoot = 0;
reactReconcilerConstants_production.NoEventPriority = 0;

{
  constants.exports = reactReconcilerConstants_production;
}

var constantsExports = constants.exports;

const { useSyncExternalStoreWithSelector } = useSyncExternalStoreExports;
const identity = (arg) => arg;
function useStoreWithEqualityFn(api, selector = identity, equalityFn) {
  const slice = useSyncExternalStoreWithSelector(
    api.subscribe,
    api.getState,
    api.getInitialState,
    selector,
    equalityFn
  );
  React.useDebugValue(slice);
  return slice;
}
const createWithEqualityFnImpl = (createState, defaultEqualityFn) => {
  const api = createStore$1(createState);
  const useBoundStoreWithEqualityFn = (selector, equalityFn = defaultEqualityFn) => useStoreWithEqualityFn(api, selector, equalityFn);
  Object.assign(useBoundStoreWithEqualityFn, api);
  return useBoundStoreWithEqualityFn;
};
const createWithEqualityFn = (createState, defaultEqualityFn) => createState ? createWithEqualityFnImpl(createState, defaultEqualityFn) : createWithEqualityFnImpl;

var reactReconciler = {exports: {}};

var reactReconciler_production = {exports: {}};

var scheduler = {exports: {}};

var scheduler_production = {};

/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

(function (exports) {
	function push(heap, node) {
	  var index = heap.length;
	  heap.push(node);
	  a: for (; 0 < index; ) {
	    var parentIndex = (index - 1) >>> 1,
	      parent = heap[parentIndex];
	    if (0 < compare(parent, node))
	      (heap[parentIndex] = node), (heap[index] = parent), (index = parentIndex);
	    else break a;
	  }
	}
	function peek(heap) {
	  return 0 === heap.length ? null : heap[0];
	}
	function pop(heap) {
	  if (0 === heap.length) return null;
	  var first = heap[0],
	    last = heap.pop();
	  if (last !== first) {
	    heap[0] = last;
	    a: for (
	      var index = 0, length = heap.length, halfLength = length >>> 1;
	      index < halfLength;

	    ) {
	      var leftIndex = 2 * (index + 1) - 1,
	        left = heap[leftIndex],
	        rightIndex = leftIndex + 1,
	        right = heap[rightIndex];
	      if (0 > compare(left, last))
	        rightIndex < length && 0 > compare(right, left)
	          ? ((heap[index] = right),
	            (heap[rightIndex] = last),
	            (index = rightIndex))
	          : ((heap[index] = left),
	            (heap[leftIndex] = last),
	            (index = leftIndex));
	      else if (rightIndex < length && 0 > compare(right, last))
	        (heap[index] = right), (heap[rightIndex] = last), (index = rightIndex);
	      else break a;
	    }
	  }
	  return first;
	}
	function compare(a, b) {
	  var diff = a.sortIndex - b.sortIndex;
	  return 0 !== diff ? diff : a.id - b.id;
	}
	exports.unstable_now = undefined;
	if ("object" === typeof performance && "function" === typeof performance.now) {
	  var localPerformance = performance;
	  exports.unstable_now = function () {
	    return localPerformance.now();
	  };
	} else {
	  var localDate = Date,
	    initialTime = localDate.now();
	  exports.unstable_now = function () {
	    return localDate.now() - initialTime;
	  };
	}
	var taskQueue = [],
	  timerQueue = [],
	  taskIdCounter = 1,
	  currentTask = null,
	  currentPriorityLevel = 3,
	  isPerformingWork = false,
	  isHostCallbackScheduled = false,
	  isHostTimeoutScheduled = false,
	  localSetTimeout = "function" === typeof setTimeout ? setTimeout : null,
	  localClearTimeout = "function" === typeof clearTimeout ? clearTimeout : null,
	  localSetImmediate = "undefined" !== typeof setImmediate ? setImmediate : null;
	function advanceTimers(currentTime) {
	  for (var timer = peek(timerQueue); null !== timer; ) {
	    if (null === timer.callback) pop(timerQueue);
	    else if (timer.startTime <= currentTime)
	      pop(timerQueue),
	        (timer.sortIndex = timer.expirationTime),
	        push(taskQueue, timer);
	    else break;
	    timer = peek(timerQueue);
	  }
	}
	function handleTimeout(currentTime) {
	  isHostTimeoutScheduled = false;
	  advanceTimers(currentTime);
	  if (!isHostCallbackScheduled)
	    if (null !== peek(taskQueue))
	      (isHostCallbackScheduled = true), requestHostCallback();
	    else {
	      var firstTimer = peek(timerQueue);
	      null !== firstTimer &&
	        requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
	    }
	}
	var isMessageLoopRunning = false,
	  taskTimeoutID = -1,
	  frameInterval = 5,
	  startTime = -1;
	function shouldYieldToHost() {
	  return exports.unstable_now() - startTime < frameInterval ? false : true;
	}
	function performWorkUntilDeadline() {
	  if (isMessageLoopRunning) {
	    var currentTime = exports.unstable_now();
	    startTime = currentTime;
	    var hasMoreWork = true;
	    try {
	      a: {
	        isHostCallbackScheduled = !1;
	        isHostTimeoutScheduled &&
	          ((isHostTimeoutScheduled = !1),
	          localClearTimeout(taskTimeoutID),
	          (taskTimeoutID = -1));
	        isPerformingWork = !0;
	        var previousPriorityLevel = currentPriorityLevel;
	        try {
	          b: {
	            advanceTimers(currentTime);
	            for (
	              currentTask = peek(taskQueue);
	              null !== currentTask &&
	              !(
	                currentTask.expirationTime > currentTime && shouldYieldToHost()
	              );

	            ) {
	              var callback = currentTask.callback;
	              if ("function" === typeof callback) {
	                currentTask.callback = null;
	                currentPriorityLevel = currentTask.priorityLevel;
	                var continuationCallback = callback(
	                  currentTask.expirationTime <= currentTime
	                );
	                currentTime = exports.unstable_now();
	                if ("function" === typeof continuationCallback) {
	                  currentTask.callback = continuationCallback;
	                  advanceTimers(currentTime);
	                  hasMoreWork = !0;
	                  break b;
	                }
	                currentTask === peek(taskQueue) && pop(taskQueue);
	                advanceTimers(currentTime);
	              } else pop(taskQueue);
	              currentTask = peek(taskQueue);
	            }
	            if (null !== currentTask) hasMoreWork = !0;
	            else {
	              var firstTimer = peek(timerQueue);
	              null !== firstTimer &&
	                requestHostTimeout(
	                  handleTimeout,
	                  firstTimer.startTime - currentTime
	                );
	              hasMoreWork = !1;
	            }
	          }
	          break a;
	        } finally {
	          (currentTask = null),
	            (currentPriorityLevel = previousPriorityLevel),
	            (isPerformingWork = !1);
	        }
	        hasMoreWork = void 0;
	      }
	    } finally {
	      hasMoreWork
	        ? schedulePerformWorkUntilDeadline()
	        : (isMessageLoopRunning = false);
	    }
	  }
	}
	var schedulePerformWorkUntilDeadline;
	if ("function" === typeof localSetImmediate)
	  schedulePerformWorkUntilDeadline = function () {
	    localSetImmediate(performWorkUntilDeadline);
	  };
	else if ("undefined" !== typeof MessageChannel) {
	  var channel = new MessageChannel(),
	    port = channel.port2;
	  channel.port1.onmessage = performWorkUntilDeadline;
	  schedulePerformWorkUntilDeadline = function () {
	    port.postMessage(null);
	  };
	} else
	  schedulePerformWorkUntilDeadline = function () {
	    localSetTimeout(performWorkUntilDeadline, 0);
	  };
	function requestHostCallback() {
	  isMessageLoopRunning ||
	    ((isMessageLoopRunning = true), schedulePerformWorkUntilDeadline());
	}
	function requestHostTimeout(callback, ms) {
	  taskTimeoutID = localSetTimeout(function () {
	    callback(exports.unstable_now());
	  }, ms);
	}
	exports.unstable_IdlePriority = 5;
	exports.unstable_ImmediatePriority = 1;
	exports.unstable_LowPriority = 4;
	exports.unstable_NormalPriority = 3;
	exports.unstable_Profiling = null;
	exports.unstable_UserBlockingPriority = 2;
	exports.unstable_cancelCallback = function (task) {
	  task.callback = null;
	};
	exports.unstable_continueExecution = function () {
	  isHostCallbackScheduled ||
	    isPerformingWork ||
	    ((isHostCallbackScheduled = true), requestHostCallback());
	};
	exports.unstable_forceFrameRate = function (fps) {
	  0 > fps || 125 < fps
	    ? console.error(
	        "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
	      )
	    : (frameInterval = 0 < fps ? Math.floor(1e3 / fps) : 5);
	};
	exports.unstable_getCurrentPriorityLevel = function () {
	  return currentPriorityLevel;
	};
	exports.unstable_getFirstCallbackNode = function () {
	  return peek(taskQueue);
	};
	exports.unstable_next = function (eventHandler) {
	  switch (currentPriorityLevel) {
	    case 1:
	    case 2:
	    case 3:
	      var priorityLevel = 3;
	      break;
	    default:
	      priorityLevel = currentPriorityLevel;
	  }
	  var previousPriorityLevel = currentPriorityLevel;
	  currentPriorityLevel = priorityLevel;
	  try {
	    return eventHandler();
	  } finally {
	    currentPriorityLevel = previousPriorityLevel;
	  }
	};
	exports.unstable_pauseExecution = function () {};
	exports.unstable_requestPaint = function () {};
	exports.unstable_runWithPriority = function (priorityLevel, eventHandler) {
	  switch (priorityLevel) {
	    case 1:
	    case 2:
	    case 3:
	    case 4:
	    case 5:
	      break;
	    default:
	      priorityLevel = 3;
	  }
	  var previousPriorityLevel = currentPriorityLevel;
	  currentPriorityLevel = priorityLevel;
	  try {
	    return eventHandler();
	  } finally {
	    currentPriorityLevel = previousPriorityLevel;
	  }
	};
	exports.unstable_scheduleCallback = function (
	  priorityLevel,
	  callback,
	  options
	) {
	  var currentTime = exports.unstable_now();
	  "object" === typeof options && null !== options
	    ? ((options = options.delay),
	      (options =
	        "number" === typeof options && 0 < options
	          ? currentTime + options
	          : currentTime))
	    : (options = currentTime);
	  switch (priorityLevel) {
	    case 1:
	      var timeout = -1;
	      break;
	    case 2:
	      timeout = 250;
	      break;
	    case 5:
	      timeout = 1073741823;
	      break;
	    case 4:
	      timeout = 1e4;
	      break;
	    default:
	      timeout = 5e3;
	  }
	  timeout = options + timeout;
	  priorityLevel = {
	    id: taskIdCounter++,
	    callback: callback,
	    priorityLevel: priorityLevel,
	    startTime: options,
	    expirationTime: timeout,
	    sortIndex: -1
	  };
	  options > currentTime
	    ? ((priorityLevel.sortIndex = options),
	      push(timerQueue, priorityLevel),
	      null === peek(taskQueue) &&
	        priorityLevel === peek(timerQueue) &&
	        (isHostTimeoutScheduled
	          ? (localClearTimeout(taskTimeoutID), (taskTimeoutID = -1))
	          : (isHostTimeoutScheduled = true),
	        requestHostTimeout(handleTimeout, options - currentTime)))
	    : ((priorityLevel.sortIndex = timeout),
	      push(taskQueue, priorityLevel),
	      isHostCallbackScheduled ||
	        isPerformingWork ||
	        ((isHostCallbackScheduled = true), requestHostCallback()));
	  return priorityLevel;
	};
	exports.unstable_shouldYield = shouldYieldToHost;
	exports.unstable_wrapCallback = function (callback) {
	  var parentPriorityLevel = currentPriorityLevel;
	  return function () {
	    var previousPriorityLevel = currentPriorityLevel;
	    currentPriorityLevel = parentPriorityLevel;
	    try {
	      return callback.apply(this, arguments);
	    } finally {
	      currentPriorityLevel = previousPriorityLevel;
	    }
	  };
	}; 
} (scheduler_production));

{
  scheduler.exports = scheduler_production;
}

var schedulerExports = scheduler.exports;

/**
 * @license React
 * react-reconciler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

(function (module) {
	module.exports = function ($$$config) {
	  function createFiber(tag, pendingProps, key, mode) {
	    return new FiberNode(tag, pendingProps, key, mode);
	  }
	  function noop() {}
	  function formatProdErrorMessage(code) {
	    var url = "https://react.dev/errors/" + code;
	    if (1 < arguments.length) {
	      url += "?args[]=" + encodeURIComponent(arguments[1]);
	      for (var i = 2; i < arguments.length; i++)
	        url += "&args[]=" + encodeURIComponent(arguments[i]);
	    }
	    return (
	      "Minified React error #" +
	      code +
	      "; visit " +
	      url +
	      " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
	    );
	  }
	  function getIteratorFn(maybeIterable) {
	    if (null === maybeIterable || "object" !== typeof maybeIterable)
	      return null;
	    maybeIterable =
	      (MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL]) ||
	      maybeIterable["@@iterator"];
	    return "function" === typeof maybeIterable ? maybeIterable : null;
	  }
	  function getComponentNameFromType(type) {
	    if (null == type) return null;
	    if ("function" === typeof type)
	      return type.$$typeof === REACT_CLIENT_REFERENCE
	        ? null
	        : type.displayName || type.name || null;
	    if ("string" === typeof type) return type;
	    switch (type) {
	      case REACT_FRAGMENT_TYPE:
	        return "Fragment";
	      case REACT_PORTAL_TYPE:
	        return "Portal";
	      case REACT_PROFILER_TYPE:
	        return "Profiler";
	      case REACT_STRICT_MODE_TYPE:
	        return "StrictMode";
	      case REACT_SUSPENSE_TYPE:
	        return "Suspense";
	      case REACT_SUSPENSE_LIST_TYPE:
	        return "SuspenseList";
	    }
	    if ("object" === typeof type)
	      switch (type.$$typeof) {
	        case REACT_CONTEXT_TYPE:
	          return (type.displayName || "Context") + ".Provider";
	        case REACT_CONSUMER_TYPE:
	          return (type._context.displayName || "Context") + ".Consumer";
	        case REACT_FORWARD_REF_TYPE:
	          var innerType = type.render;
	          type = type.displayName;
	          type ||
	            ((type = innerType.displayName || innerType.name || ""),
	            (type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef"));
	          return type;
	        case REACT_MEMO_TYPE:
	          return (
	            (innerType = type.displayName || null),
	            null !== innerType
	              ? innerType
	              : getComponentNameFromType(type.type) || "Memo"
	          );
	        case REACT_LAZY_TYPE:
	          innerType = type._payload;
	          type = type._init;
	          try {
	            return getComponentNameFromType(type(innerType));
	          } catch (x) {}
	      }
	    return null;
	  }
	  function describeBuiltInComponentFrame(name) {
	    if (undefined === prefix)
	      try {
	        throw Error();
	      } catch (x) {
	        var match = x.stack.trim().match(/\n( *(at )?)/);
	        prefix = (match && match[1]) || "";
	        suffix =
	          -1 < x.stack.indexOf("\n    at")
	            ? " (<anonymous>)"
	            : -1 < x.stack.indexOf("@")
	              ? "@unknown:0:0"
	              : "";
	      }
	    return "\n" + prefix + name + suffix;
	  }
	  function describeNativeComponentFrame(fn, construct) {
	    if (!fn || reentry) return "";
	    reentry = true;
	    var previousPrepareStackTrace = Error.prepareStackTrace;
	    Error.prepareStackTrace = undefined;
	    try {
	      var RunInRootFrame = {
	        DetermineComponentFrameRoot: function () {
	          try {
	            if (construct) {
	              var Fake = function () {
	                throw Error();
	              };
	              Object.defineProperty(Fake.prototype, "props", {
	                set: function () {
	                  throw Error();
	                }
	              });
	              if ("object" === typeof Reflect && Reflect.construct) {
	                try {
	                  Reflect.construct(Fake, []);
	                } catch (x) {
	                  var control = x;
	                }
	                Reflect.construct(fn, [], Fake);
	              } else {
	                try {
	                  Fake.call();
	                } catch (x$0) {
	                  control = x$0;
	                }
	                fn.call(Fake.prototype);
	              }
	            } else {
	              try {
	                throw Error();
	              } catch (x$1) {
	                control = x$1;
	              }
	              (Fake = fn()) &&
	                "function" === typeof Fake.catch &&
	                Fake.catch(function () {});
	            }
	          } catch (sample) {
	            if (sample && control && "string" === typeof sample.stack)
	              return [sample.stack, control.stack];
	          }
	          return [null, null];
	        }
	      };
	      RunInRootFrame.DetermineComponentFrameRoot.displayName =
	        "DetermineComponentFrameRoot";
	      var namePropDescriptor = Object.getOwnPropertyDescriptor(
	        RunInRootFrame.DetermineComponentFrameRoot,
	        "name"
	      );
	      namePropDescriptor &&
	        namePropDescriptor.configurable &&
	        Object.defineProperty(
	          RunInRootFrame.DetermineComponentFrameRoot,
	          "name",
	          { value: "DetermineComponentFrameRoot" }
	        );
	      var _RunInRootFrame$Deter = RunInRootFrame.DetermineComponentFrameRoot(),
	        sampleStack = _RunInRootFrame$Deter[0],
	        controlStack = _RunInRootFrame$Deter[1];
	      if (sampleStack && controlStack) {
	        var sampleLines = sampleStack.split("\n"),
	          controlLines = controlStack.split("\n");
	        for (
	          namePropDescriptor = RunInRootFrame = 0;
	          RunInRootFrame < sampleLines.length &&
	          !sampleLines[RunInRootFrame].includes("DetermineComponentFrameRoot");

	        )
	          RunInRootFrame++;
	        for (
	          ;
	          namePropDescriptor < controlLines.length &&
	          !controlLines[namePropDescriptor].includes(
	            "DetermineComponentFrameRoot"
	          );

	        )
	          namePropDescriptor++;
	        if (
	          RunInRootFrame === sampleLines.length ||
	          namePropDescriptor === controlLines.length
	        )
	          for (
	            RunInRootFrame = sampleLines.length - 1,
	              namePropDescriptor = controlLines.length - 1;
	            1 <= RunInRootFrame &&
	            0 <= namePropDescriptor &&
	            sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor];

	          )
	            namePropDescriptor--;
	        for (
	          ;
	          1 <= RunInRootFrame && 0 <= namePropDescriptor;
	          RunInRootFrame--, namePropDescriptor--
	        )
	          if (
	            sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor]
	          ) {
	            if (1 !== RunInRootFrame || 1 !== namePropDescriptor) {
	              do
	                if (
	                  (RunInRootFrame--,
	                  namePropDescriptor--,
	                  0 > namePropDescriptor ||
	                    sampleLines[RunInRootFrame] !==
	                      controlLines[namePropDescriptor])
	                ) {
	                  var frame =
	                    "\n" +
	                    sampleLines[RunInRootFrame].replace(" at new ", " at ");
	                  fn.displayName &&
	                    frame.includes("<anonymous>") &&
	                    (frame = frame.replace("<anonymous>", fn.displayName));
	                  return frame;
	                }
	              while (1 <= RunInRootFrame && 0 <= namePropDescriptor);
	            }
	            break;
	          }
	      }
	    } finally {
	      (reentry = false), (Error.prepareStackTrace = previousPrepareStackTrace);
	    }
	    return (previousPrepareStackTrace = fn ? fn.displayName || fn.name : "")
	      ? describeBuiltInComponentFrame(previousPrepareStackTrace)
	      : "";
	  }
	  function describeFiber(fiber) {
	    switch (fiber.tag) {
	      case 26:
	      case 27:
	      case 5:
	        return describeBuiltInComponentFrame(fiber.type);
	      case 16:
	        return describeBuiltInComponentFrame("Lazy");
	      case 13:
	        return describeBuiltInComponentFrame("Suspense");
	      case 19:
	        return describeBuiltInComponentFrame("SuspenseList");
	      case 0:
	      case 15:
	        return (fiber = describeNativeComponentFrame(fiber.type, false)), fiber;
	      case 11:
	        return (
	          (fiber = describeNativeComponentFrame(fiber.type.render, false)), fiber
	        );
	      case 1:
	        return (fiber = describeNativeComponentFrame(fiber.type, true)), fiber;
	      default:
	        return "";
	    }
	  }
	  function getStackByFiberInDevAndProd(workInProgress) {
	    try {
	      var info = "";
	      do
	        (info += describeFiber(workInProgress)),
	          (workInProgress = workInProgress.return);
	      while (workInProgress);
	      return info;
	    } catch (x) {
	      return "\nError generating stack: " + x.message + "\n" + x.stack;
	    }
	  }
	  function getNearestMountedFiber(fiber) {
	    var node = fiber,
	      nearestMounted = fiber;
	    if (fiber.alternate) for (; node.return; ) node = node.return;
	    else {
	      fiber = node;
	      do
	        (node = fiber),
	          0 !== (node.flags & 4098) && (nearestMounted = node.return),
	          (fiber = node.return);
	      while (fiber);
	    }
	    return 3 === node.tag ? nearestMounted : null;
	  }
	  function assertIsMounted(fiber) {
	    if (getNearestMountedFiber(fiber) !== fiber)
	      throw Error(formatProdErrorMessage(188));
	  }
	  function findCurrentFiberUsingSlowPath(fiber) {
	    var alternate = fiber.alternate;
	    if (!alternate) {
	      alternate = getNearestMountedFiber(fiber);
	      if (null === alternate) throw Error(formatProdErrorMessage(188));
	      return alternate !== fiber ? null : fiber;
	    }
	    for (var a = fiber, b = alternate; ; ) {
	      var parentA = a.return;
	      if (null === parentA) break;
	      var parentB = parentA.alternate;
	      if (null === parentB) {
	        b = parentA.return;
	        if (null !== b) {
	          a = b;
	          continue;
	        }
	        break;
	      }
	      if (parentA.child === parentB.child) {
	        for (parentB = parentA.child; parentB; ) {
	          if (parentB === a) return assertIsMounted(parentA), fiber;
	          if (parentB === b) return assertIsMounted(parentA), alternate;
	          parentB = parentB.sibling;
	        }
	        throw Error(formatProdErrorMessage(188));
	      }
	      if (a.return !== b.return) (a = parentA), (b = parentB);
	      else {
	        for (var didFindChild = false, child$2 = parentA.child; child$2; ) {
	          if (child$2 === a) {
	            didFindChild = true;
	            a = parentA;
	            b = parentB;
	            break;
	          }
	          if (child$2 === b) {
	            didFindChild = true;
	            b = parentA;
	            a = parentB;
	            break;
	          }
	          child$2 = child$2.sibling;
	        }
	        if (!didFindChild) {
	          for (child$2 = parentB.child; child$2; ) {
	            if (child$2 === a) {
	              didFindChild = true;
	              a = parentB;
	              b = parentA;
	              break;
	            }
	            if (child$2 === b) {
	              didFindChild = true;
	              b = parentB;
	              a = parentA;
	              break;
	            }
	            child$2 = child$2.sibling;
	          }
	          if (!didFindChild) throw Error(formatProdErrorMessage(189));
	        }
	      }
	      if (a.alternate !== b) throw Error(formatProdErrorMessage(190));
	    }
	    if (3 !== a.tag) throw Error(formatProdErrorMessage(188));
	    return a.stateNode.current === a ? fiber : alternate;
	  }
	  function findCurrentHostFiberImpl(node) {
	    var tag = node.tag;
	    if (5 === tag || 26 === tag || 27 === tag || 6 === tag) return node;
	    for (node = node.child; null !== node; ) {
	      tag = findCurrentHostFiberImpl(node);
	      if (null !== tag) return tag;
	      node = node.sibling;
	    }
	    return null;
	  }
	  function findCurrentHostFiberWithNoPortalsImpl(node) {
	    var tag = node.tag;
	    if (5 === tag || 26 === tag || 27 === tag || 6 === tag) return node;
	    for (node = node.child; null !== node; ) {
	      if (
	        4 !== node.tag &&
	        ((tag = findCurrentHostFiberWithNoPortalsImpl(node)), null !== tag)
	      )
	        return tag;
	      node = node.sibling;
	    }
	    return null;
	  }
	  function createCursor(defaultValue) {
	    return { current: defaultValue };
	  }
	  function pop(cursor) {
	    0 > index$jscomp$0 ||
	      ((cursor.current = valueStack[index$jscomp$0]),
	      (valueStack[index$jscomp$0] = null),
	      index$jscomp$0--);
	  }
	  function push(cursor, value) {
	    index$jscomp$0++;
	    valueStack[index$jscomp$0] = cursor.current;
	    cursor.current = value;
	  }
	  function clz32Fallback(x) {
	    x >>>= 0;
	    return 0 === x ? 32 : (31 - ((log$1(x) / LN2) | 0)) | 0;
	  }
	  function getHighestPriorityLanes(lanes) {
	    var pendingSyncLanes = lanes & 42;
	    if (0 !== pendingSyncLanes) return pendingSyncLanes;
	    switch (lanes & -lanes) {
	      case 1:
	        return 1;
	      case 2:
	        return 2;
	      case 4:
	        return 4;
	      case 8:
	        return 8;
	      case 16:
	        return 16;
	      case 32:
	        return 32;
	      case 64:
	        return 64;
	      case 128:
	      case 256:
	      case 512:
	      case 1024:
	      case 2048:
	      case 4096:
	      case 8192:
	      case 16384:
	      case 32768:
	      case 65536:
	      case 131072:
	      case 262144:
	      case 524288:
	      case 1048576:
	      case 2097152:
	        return lanes & 4194176;
	      case 4194304:
	      case 8388608:
	      case 16777216:
	      case 33554432:
	        return lanes & 62914560;
	      case 67108864:
	        return 67108864;
	      case 134217728:
	        return 134217728;
	      case 268435456:
	        return 268435456;
	      case 536870912:
	        return 536870912;
	      case 1073741824:
	        return 0;
	      default:
	        return lanes;
	    }
	  }
	  function getNextLanes(root, wipLanes) {
	    var pendingLanes = root.pendingLanes;
	    if (0 === pendingLanes) return 0;
	    var nextLanes = 0,
	      suspendedLanes = root.suspendedLanes,
	      pingedLanes = root.pingedLanes,
	      warmLanes = root.warmLanes;
	    root = 0 !== root.finishedLanes;
	    var nonIdlePendingLanes = pendingLanes & 134217727;
	    0 !== nonIdlePendingLanes
	      ? ((pendingLanes = nonIdlePendingLanes & ~suspendedLanes),
	        0 !== pendingLanes
	          ? (nextLanes = getHighestPriorityLanes(pendingLanes))
	          : ((pingedLanes &= nonIdlePendingLanes),
	            0 !== pingedLanes
	              ? (nextLanes = getHighestPriorityLanes(pingedLanes))
	              : root ||
	                ((warmLanes = nonIdlePendingLanes & ~warmLanes),
	                0 !== warmLanes &&
	                  (nextLanes = getHighestPriorityLanes(warmLanes)))))
	      : ((nonIdlePendingLanes = pendingLanes & ~suspendedLanes),
	        0 !== nonIdlePendingLanes
	          ? (nextLanes = getHighestPriorityLanes(nonIdlePendingLanes))
	          : 0 !== pingedLanes
	            ? (nextLanes = getHighestPriorityLanes(pingedLanes))
	            : root ||
	              ((warmLanes = pendingLanes & ~warmLanes),
	              0 !== warmLanes &&
	                (nextLanes = getHighestPriorityLanes(warmLanes))));
	    return 0 === nextLanes
	      ? 0
	      : 0 !== wipLanes &&
	          wipLanes !== nextLanes &&
	          0 === (wipLanes & suspendedLanes) &&
	          ((suspendedLanes = nextLanes & -nextLanes),
	          (warmLanes = wipLanes & -wipLanes),
	          suspendedLanes >= warmLanes ||
	            (32 === suspendedLanes && 0 !== (warmLanes & 4194176)))
	        ? wipLanes
	        : nextLanes;
	  }
	  function checkIfRootIsPrerendering(root, renderLanes) {
	    return (
	      0 ===
	      (root.pendingLanes &
	        ~(root.suspendedLanes & ~root.pingedLanes) &
	        renderLanes)
	    );
	  }
	  function computeExpirationTime(lane, currentTime) {
	    switch (lane) {
	      case 1:
	      case 2:
	      case 4:
	      case 8:
	        return currentTime + 250;
	      case 16:
	      case 32:
	      case 64:
	      case 128:
	      case 256:
	      case 512:
	      case 1024:
	      case 2048:
	      case 4096:
	      case 8192:
	      case 16384:
	      case 32768:
	      case 65536:
	      case 131072:
	      case 262144:
	      case 524288:
	      case 1048576:
	      case 2097152:
	        return currentTime + 5e3;
	      case 4194304:
	      case 8388608:
	      case 16777216:
	      case 33554432:
	        return -1;
	      case 67108864:
	      case 134217728:
	      case 268435456:
	      case 536870912:
	      case 1073741824:
	        return -1;
	      default:
	        return -1;
	    }
	  }
	  function claimNextTransitionLane() {
	    var lane = nextTransitionLane;
	    nextTransitionLane <<= 1;
	    0 === (nextTransitionLane & 4194176) && (nextTransitionLane = 128);
	    return lane;
	  }
	  function claimNextRetryLane() {
	    var lane = nextRetryLane;
	    nextRetryLane <<= 1;
	    0 === (nextRetryLane & 62914560) && (nextRetryLane = 4194304);
	    return lane;
	  }
	  function createLaneMap(initial) {
	    for (var laneMap = [], i = 0; 31 > i; i++) laneMap.push(initial);
	    return laneMap;
	  }
	  function markRootUpdated$1(root, updateLane) {
	    root.pendingLanes |= updateLane;
	    268435456 !== updateLane &&
	      ((root.suspendedLanes = 0), (root.pingedLanes = 0), (root.warmLanes = 0));
	  }
	  function markRootFinished(
	    root,
	    finishedLanes,
	    remainingLanes,
	    spawnedLane,
	    updatedLanes,
	    suspendedRetryLanes
	  ) {
	    var previouslyPendingLanes = root.pendingLanes;
	    root.pendingLanes = remainingLanes;
	    root.suspendedLanes = 0;
	    root.pingedLanes = 0;
	    root.warmLanes = 0;
	    root.expiredLanes &= remainingLanes;
	    root.entangledLanes &= remainingLanes;
	    root.errorRecoveryDisabledLanes &= remainingLanes;
	    root.shellSuspendCounter = 0;
	    var entanglements = root.entanglements,
	      expirationTimes = root.expirationTimes,
	      hiddenUpdates = root.hiddenUpdates;
	    for (
	      remainingLanes = previouslyPendingLanes & ~remainingLanes;
	      0 < remainingLanes;

	    ) {
	      var index$7 = 31 - clz32(remainingLanes),
	        lane = 1 << index$7;
	      entanglements[index$7] = 0;
	      expirationTimes[index$7] = -1;
	      var hiddenUpdatesForLane = hiddenUpdates[index$7];
	      if (null !== hiddenUpdatesForLane)
	        for (
	          hiddenUpdates[index$7] = null, index$7 = 0;
	          index$7 < hiddenUpdatesForLane.length;
	          index$7++
	        ) {
	          var update = hiddenUpdatesForLane[index$7];
	          null !== update && (update.lane &= -536870913);
	        }
	      remainingLanes &= ~lane;
	    }
	    0 !== spawnedLane && markSpawnedDeferredLane(root, spawnedLane, 0);
	    0 !== suspendedRetryLanes &&
	      0 === updatedLanes &&
	      0 !== root.tag &&
	      (root.suspendedLanes |=
	        suspendedRetryLanes & ~(previouslyPendingLanes & ~finishedLanes));
	  }
	  function markSpawnedDeferredLane(root, spawnedLane, entangledLanes) {
	    root.pendingLanes |= spawnedLane;
	    root.suspendedLanes &= ~spawnedLane;
	    var spawnedLaneIndex = 31 - clz32(spawnedLane);
	    root.entangledLanes |= spawnedLane;
	    root.entanglements[spawnedLaneIndex] =
	      root.entanglements[spawnedLaneIndex] |
	      1073741824 |
	      (entangledLanes & 4194218);
	  }
	  function markRootEntangled(root, entangledLanes) {
	    var rootEntangledLanes = (root.entangledLanes |= entangledLanes);
	    for (root = root.entanglements; rootEntangledLanes; ) {
	      var index$8 = 31 - clz32(rootEntangledLanes),
	        lane = 1 << index$8;
	      (lane & entangledLanes) | (root[index$8] & entangledLanes) &&
	        (root[index$8] |= entangledLanes);
	      rootEntangledLanes &= ~lane;
	    }
	  }
	  function lanesToEventPriority(lanes) {
	    lanes &= -lanes;
	    return 2 < lanes
	      ? 8 < lanes
	        ? 0 !== (lanes & 134217727)
	          ? 32
	          : 268435456
	        : 8
	      : 2;
	  }
	  function onCommitRoot(root) {
	    if (injectedHook && "function" === typeof injectedHook.onCommitFiberRoot)
	      try {
	        injectedHook.onCommitFiberRoot(
	          rendererID,
	          root,
	          void 0,
	          128 === (root.current.flags & 128)
	        );
	      } catch (err) {}
	  }
	  function setIsStrictModeForDevtools(newIsStrictMode) {
	    "function" === typeof log && unstable_setDisableYieldValue(newIsStrictMode);
	    if (injectedHook && "function" === typeof injectedHook.setStrictMode)
	      try {
	        injectedHook.setStrictMode(rendererID, newIsStrictMode);
	      } catch (err) {}
	  }
	  function is(x, y) {
	    return (x === y && (0 !== x || 1 / x === 1 / y)) || (x !== x && y !== y);
	  }
	  function createCapturedValueAtFiber(value, source) {
	    if ("object" === typeof value && null !== value) {
	      var existing = CapturedStacks.get(value);
	      if (undefined !== existing) return existing;
	      source = {
	        value: value,
	        source: source,
	        stack: getStackByFiberInDevAndProd(source)
	      };
	      CapturedStacks.set(value, source);
	      return source;
	    }
	    return {
	      value: value,
	      source: source,
	      stack: getStackByFiberInDevAndProd(source)
	    };
	  }
	  function pushTreeFork(workInProgress, totalChildren) {
	    forkStack[forkStackIndex++] = treeForkCount;
	    forkStack[forkStackIndex++] = treeForkProvider;
	    treeForkProvider = workInProgress;
	    treeForkCount = totalChildren;
	  }
	  function pushTreeId(workInProgress, totalChildren, index) {
	    idStack[idStackIndex++] = treeContextId;
	    idStack[idStackIndex++] = treeContextOverflow;
	    idStack[idStackIndex++] = treeContextProvider;
	    treeContextProvider = workInProgress;
	    var baseIdWithLeadingBit = treeContextId;
	    workInProgress = treeContextOverflow;
	    var baseLength = 32 - clz32(baseIdWithLeadingBit) - 1;
	    baseIdWithLeadingBit &= ~(1 << baseLength);
	    index += 1;
	    var length = 32 - clz32(totalChildren) + baseLength;
	    if (30 < length) {
	      var numberOfOverflowBits = baseLength - (baseLength % 5);
	      length = (
	        baseIdWithLeadingBit &
	        ((1 << numberOfOverflowBits) - 1)
	      ).toString(32);
	      baseIdWithLeadingBit >>= numberOfOverflowBits;
	      baseLength -= numberOfOverflowBits;
	      treeContextId =
	        (1 << (32 - clz32(totalChildren) + baseLength)) |
	        (index << baseLength) |
	        baseIdWithLeadingBit;
	      treeContextOverflow = length + workInProgress;
	    } else
	      (treeContextId =
	        (1 << length) | (index << baseLength) | baseIdWithLeadingBit),
	        (treeContextOverflow = workInProgress);
	  }
	  function pushMaterializedTreeId(workInProgress) {
	    null !== workInProgress.return &&
	      (pushTreeFork(workInProgress, 1), pushTreeId(workInProgress, 1, 0));
	  }
	  function popTreeContext(workInProgress) {
	    for (; workInProgress === treeForkProvider; )
	      (treeForkProvider = forkStack[--forkStackIndex]),
	        (forkStack[forkStackIndex] = null),
	        (treeForkCount = forkStack[--forkStackIndex]),
	        (forkStack[forkStackIndex] = null);
	    for (; workInProgress === treeContextProvider; )
	      (treeContextProvider = idStack[--idStackIndex]),
	        (idStack[idStackIndex] = null),
	        (treeContextOverflow = idStack[--idStackIndex]),
	        (idStack[idStackIndex] = null),
	        (treeContextId = idStack[--idStackIndex]),
	        (idStack[idStackIndex] = null);
	  }
	  function pushHostContainer(fiber, nextRootInstance) {
	    push(rootInstanceStackCursor, nextRootInstance);
	    push(contextFiberStackCursor, fiber);
	    push(contextStackCursor, null);
	    fiber = getRootHostContext(nextRootInstance);
	    pop(contextStackCursor);
	    push(contextStackCursor, fiber);
	  }
	  function popHostContainer() {
	    pop(contextStackCursor);
	    pop(contextFiberStackCursor);
	    pop(rootInstanceStackCursor);
	  }
	  function pushHostContext(fiber) {
	    null !== fiber.memoizedState && push(hostTransitionProviderCursor, fiber);
	    var context = contextStackCursor.current,
	      nextContext = getChildHostContext(context, fiber.type);
	    context !== nextContext &&
	      (push(contextFiberStackCursor, fiber),
	      push(contextStackCursor, nextContext));
	  }
	  function popHostContext(fiber) {
	    contextFiberStackCursor.current === fiber &&
	      (pop(contextStackCursor), pop(contextFiberStackCursor));
	    hostTransitionProviderCursor.current === fiber &&
	      (pop(hostTransitionProviderCursor),
	      isPrimaryRenderer
	        ? (HostTransitionContext._currentValue = NotPendingTransition)
	        : (HostTransitionContext._currentValue2 = NotPendingTransition));
	  }
	  function throwOnHydrationMismatch(fiber) {
	    var error = Error(formatProdErrorMessage(418, ""));
	    queueHydrationError(createCapturedValueAtFiber(error, fiber));
	    throw HydrationMismatchException;
	  }
	  function prepareToHydrateHostInstance(fiber, hostContext) {
	    if (!supportsHydration) throw Error(formatProdErrorMessage(175));
	    hydrateInstance(
	      fiber.stateNode,
	      fiber.type,
	      fiber.memoizedProps,
	      hostContext,
	      fiber
	    ) || throwOnHydrationMismatch(fiber);
	  }
	  function popToNextHostParent(fiber) {
	    for (hydrationParentFiber = fiber.return; hydrationParentFiber; )
	      switch (hydrationParentFiber.tag) {
	        case 3:
	        case 27:
	          rootOrSingletonContext = true;
	          return;
	        case 5:
	        case 13:
	          rootOrSingletonContext = false;
	          return;
	        default:
	          hydrationParentFiber = hydrationParentFiber.return;
	      }
	  }
	  function popHydrationState(fiber) {
	    if (!supportsHydration || fiber !== hydrationParentFiber) return false;
	    if (!isHydrating) return popToNextHostParent(fiber), (isHydrating = true), false;
	    var shouldClear = false;
	    supportsSingletons
	      ? 3 !== fiber.tag &&
	        27 !== fiber.tag &&
	        (5 !== fiber.tag ||
	          (shouldDeleteUnhydratedTailInstances(fiber.type) &&
	            !shouldSetTextContent(fiber.type, fiber.memoizedProps))) &&
	        (shouldClear = true)
	      : 3 !== fiber.tag &&
	        (5 !== fiber.tag ||
	          (shouldDeleteUnhydratedTailInstances(fiber.type) &&
	            !shouldSetTextContent(fiber.type, fiber.memoizedProps))) &&
	        (shouldClear = true);
	    shouldClear && nextHydratableInstance && throwOnHydrationMismatch(fiber);
	    popToNextHostParent(fiber);
	    if (13 === fiber.tag) {
	      if (!supportsHydration) throw Error(formatProdErrorMessage(316));
	      fiber = fiber.memoizedState;
	      fiber = null !== fiber ? fiber.dehydrated : null;
	      if (!fiber) throw Error(formatProdErrorMessage(317));
	      nextHydratableInstance =
	        getNextHydratableInstanceAfterSuspenseInstance(fiber);
	    } else
	      nextHydratableInstance = hydrationParentFiber
	        ? getNextHydratableSibling(fiber.stateNode)
	        : null;
	    return true;
	  }
	  function resetHydrationState() {
	    supportsHydration &&
	      ((nextHydratableInstance = hydrationParentFiber = null),
	      (isHydrating = false));
	  }
	  function queueHydrationError(error) {
	    null === hydrationErrors
	      ? (hydrationErrors = [error])
	      : hydrationErrors.push(error);
	  }
	  function finishQueueingConcurrentUpdates() {
	    for (
	      var endIndex = concurrentQueuesIndex,
	        i = (concurrentlyUpdatedLanes = concurrentQueuesIndex = 0);
	      i < endIndex;

	    ) {
	      var fiber = concurrentQueues[i];
	      concurrentQueues[i++] = null;
	      var queue = concurrentQueues[i];
	      concurrentQueues[i++] = null;
	      var update = concurrentQueues[i];
	      concurrentQueues[i++] = null;
	      var lane = concurrentQueues[i];
	      concurrentQueues[i++] = null;
	      if (null !== queue && null !== update) {
	        var pending = queue.pending;
	        null === pending
	          ? (update.next = update)
	          : ((update.next = pending.next), (pending.next = update));
	        queue.pending = update;
	      }
	      0 !== lane && markUpdateLaneFromFiberToRoot(fiber, update, lane);
	    }
	  }
	  function enqueueUpdate$1(fiber, queue, update, lane) {
	    concurrentQueues[concurrentQueuesIndex++] = fiber;
	    concurrentQueues[concurrentQueuesIndex++] = queue;
	    concurrentQueues[concurrentQueuesIndex++] = update;
	    concurrentQueues[concurrentQueuesIndex++] = lane;
	    concurrentlyUpdatedLanes |= lane;
	    fiber.lanes |= lane;
	    fiber = fiber.alternate;
	    null !== fiber && (fiber.lanes |= lane);
	  }
	  function enqueueConcurrentHookUpdate(fiber, queue, update, lane) {
	    enqueueUpdate$1(fiber, queue, update, lane);
	    return getRootForUpdatedFiber(fiber);
	  }
	  function enqueueConcurrentRenderForLane(fiber, lane) {
	    enqueueUpdate$1(fiber, null, null, lane);
	    return getRootForUpdatedFiber(fiber);
	  }
	  function markUpdateLaneFromFiberToRoot(sourceFiber, update, lane) {
	    sourceFiber.lanes |= lane;
	    var alternate = sourceFiber.alternate;
	    null !== alternate && (alternate.lanes |= lane);
	    for (var isHidden = false, parent = sourceFiber.return; null !== parent; )
	      (parent.childLanes |= lane),
	        (alternate = parent.alternate),
	        null !== alternate && (alternate.childLanes |= lane),
	        22 === parent.tag &&
	          ((sourceFiber = parent.stateNode),
	          null === sourceFiber ||
	            sourceFiber._visibility & 1 ||
	            (isHidden = true)),
	        (sourceFiber = parent),
	        (parent = parent.return);
	    isHidden &&
	      null !== update &&
	      3 === sourceFiber.tag &&
	      ((parent = sourceFiber.stateNode),
	      (isHidden = 31 - clz32(lane)),
	      (parent = parent.hiddenUpdates),
	      (sourceFiber = parent[isHidden]),
	      null === sourceFiber
	        ? (parent[isHidden] = [update])
	        : sourceFiber.push(update),
	      (update.lane = lane | 536870912));
	  }
	  function getRootForUpdatedFiber(sourceFiber) {
	    if (50 < nestedUpdateCount)
	      throw (
	        ((nestedUpdateCount = 0),
	        (rootWithNestedUpdates = null),
	        Error(formatProdErrorMessage(185)))
	      );
	    for (var parent = sourceFiber.return; null !== parent; )
	      (sourceFiber = parent), (parent = sourceFiber.return);
	    return 3 === sourceFiber.tag ? sourceFiber.stateNode : null;
	  }
	  function ensureRootIsScheduled(root) {
	    root !== lastScheduledRoot &&
	      null === root.next &&
	      (null === lastScheduledRoot
	        ? (firstScheduledRoot = lastScheduledRoot = root)
	        : (lastScheduledRoot = lastScheduledRoot.next = root));
	    mightHavePendingSyncWork = true;
	    didScheduleMicrotask ||
	      ((didScheduleMicrotask = true),
	      scheduleImmediateTask(processRootScheduleInMicrotask));
	  }
	  function flushSyncWorkAcrossRoots_impl(syncTransitionLanes, onlyLegacy) {
	    if (!isFlushingWork && mightHavePendingSyncWork) {
	      isFlushingWork = true;
	      do {
	        var didPerformSomeWork = false;
	        for (var root = firstScheduledRoot; null !== root; ) {
	          if (0 !== syncTransitionLanes) {
	              var pendingLanes = root.pendingLanes;
	              if (0 === pendingLanes) var JSCompiler_inline_result = 0;
	              else {
	                var suspendedLanes = root.suspendedLanes,
	                  pingedLanes = root.pingedLanes;
	                JSCompiler_inline_result =
	                  (1 << (31 - clz32(42 | syncTransitionLanes) + 1)) - 1;
	                JSCompiler_inline_result &=
	                  pendingLanes & ~(suspendedLanes & ~pingedLanes);
	                JSCompiler_inline_result =
	                  JSCompiler_inline_result & 201326677
	                    ? (JSCompiler_inline_result & 201326677) | 1
	                    : JSCompiler_inline_result
	                      ? JSCompiler_inline_result | 2
	                      : 0;
	              }
	              0 !== JSCompiler_inline_result &&
	                ((didPerformSomeWork = true),
	                performSyncWorkOnRoot(root, JSCompiler_inline_result));
	            } else
	              (JSCompiler_inline_result = workInProgressRootRenderLanes),
	                (JSCompiler_inline_result = getNextLanes(
	                  root,
	                  root === workInProgressRoot ? JSCompiler_inline_result : 0
	                )),
	                0 === (JSCompiler_inline_result & 3) ||
	                  checkIfRootIsPrerendering(root, JSCompiler_inline_result) ||
	                  ((didPerformSomeWork = true),
	                  performSyncWorkOnRoot(root, JSCompiler_inline_result));
	          root = root.next;
	        }
	      } while (didPerformSomeWork);
	      isFlushingWork = false;
	    }
	  }
	  function processRootScheduleInMicrotask() {
	    mightHavePendingSyncWork = didScheduleMicrotask = false;
	    var syncTransitionLanes = 0;
	    0 !== currentEventTransitionLane &&
	      (shouldAttemptEagerTransition() &&
	        (syncTransitionLanes = currentEventTransitionLane),
	      (currentEventTransitionLane = 0));
	    for (
	      var currentTime = now(), prev = null, root = firstScheduledRoot;
	      null !== root;

	    ) {
	      var next = root.next,
	        nextLanes = scheduleTaskForRootDuringMicrotask(root, currentTime);
	      if (0 === nextLanes)
	        (root.next = null),
	          null === prev ? (firstScheduledRoot = next) : (prev.next = next),
	          null === next && (lastScheduledRoot = prev);
	      else if (
	        ((prev = root), 0 !== syncTransitionLanes || 0 !== (nextLanes & 3))
	      )
	        mightHavePendingSyncWork = true;
	      root = next;
	    }
	    flushSyncWorkAcrossRoots_impl(syncTransitionLanes);
	  }
	  function scheduleTaskForRootDuringMicrotask(root, currentTime) {
	    for (
	      var suspendedLanes = root.suspendedLanes,
	        pingedLanes = root.pingedLanes,
	        expirationTimes = root.expirationTimes,
	        lanes = root.pendingLanes & -62914561;
	      0 < lanes;

	    ) {
	      var index$5 = 31 - clz32(lanes),
	        lane = 1 << index$5,
	        expirationTime = expirationTimes[index$5];
	      if (-1 === expirationTime) {
	        if (0 === (lane & suspendedLanes) || 0 !== (lane & pingedLanes))
	          expirationTimes[index$5] = computeExpirationTime(lane, currentTime);
	      } else expirationTime <= currentTime && (root.expiredLanes |= lane);
	      lanes &= ~lane;
	    }
	    currentTime = workInProgressRoot;
	    suspendedLanes = workInProgressRootRenderLanes;
	    suspendedLanes = getNextLanes(
	      root,
	      root === currentTime ? suspendedLanes : 0
	    );
	    pingedLanes = root.callbackNode;
	    if (
	      0 === suspendedLanes ||
	      (root === currentTime && 2 === workInProgressSuspendedReason) ||
	      null !== root.cancelPendingCommit
	    )
	      return (
	        null !== pingedLanes &&
	          null !== pingedLanes &&
	          cancelCallback$1(pingedLanes),
	        (root.callbackNode = null),
	        (root.callbackPriority = 0)
	      );
	    if (
	      0 === (suspendedLanes & 3) ||
	      checkIfRootIsPrerendering(root, suspendedLanes)
	    ) {
	      currentTime = suspendedLanes & -suspendedLanes;
	      if (currentTime === root.callbackPriority) return currentTime;
	      null !== pingedLanes && cancelCallback$1(pingedLanes);
	      switch (lanesToEventPriority(suspendedLanes)) {
	        case 2:
	        case 8:
	          suspendedLanes = UserBlockingPriority;
	          break;
	        case 32:
	          suspendedLanes = NormalPriority$1;
	          break;
	        case 268435456:
	          suspendedLanes = IdlePriority;
	          break;
	        default:
	          suspendedLanes = NormalPriority$1;
	      }
	      pingedLanes = performWorkOnRootViaSchedulerTask.bind(null, root);
	      suspendedLanes = scheduleCallback$3(suspendedLanes, pingedLanes);
	      root.callbackPriority = currentTime;
	      root.callbackNode = suspendedLanes;
	      return currentTime;
	    }
	    null !== pingedLanes &&
	      null !== pingedLanes &&
	      cancelCallback$1(pingedLanes);
	    root.callbackPriority = 2;
	    root.callbackNode = null;
	    return 2;
	  }
	  function performWorkOnRootViaSchedulerTask(root, didTimeout) {
	    var originalCallbackNode = root.callbackNode;
	    if (flushPassiveEffects() && root.callbackNode !== originalCallbackNode)
	      return null;
	    var workInProgressRootRenderLanes$jscomp$0 = workInProgressRootRenderLanes;
	    workInProgressRootRenderLanes$jscomp$0 = getNextLanes(
	      root,
	      root === workInProgressRoot ? workInProgressRootRenderLanes$jscomp$0 : 0
	    );
	    if (0 === workInProgressRootRenderLanes$jscomp$0) return null;
	    performWorkOnRoot(root, workInProgressRootRenderLanes$jscomp$0, didTimeout);
	    scheduleTaskForRootDuringMicrotask(root, now());
	    return null != root.callbackNode &&
	      root.callbackNode === originalCallbackNode
	      ? performWorkOnRootViaSchedulerTask.bind(null, root)
	      : null;
	  }
	  function performSyncWorkOnRoot(root, lanes) {
	    if (flushPassiveEffects()) return null;
	    performWorkOnRoot(root, lanes, true);
	  }
	  function scheduleImmediateTask(cb) {
	    supportsMicrotasks
	      ? scheduleMicrotask(function () {
	          0 !== (executionContext & 6)
	            ? scheduleCallback$3(ImmediatePriority, cb)
	            : cb();
	        })
	      : scheduleCallback$3(ImmediatePriority, cb);
	  }
	  function requestTransitionLane() {
	    0 === currentEventTransitionLane &&
	      (currentEventTransitionLane = claimNextTransitionLane());
	    return currentEventTransitionLane;
	  }
	  function entangleAsyncAction(transition, thenable) {
	    if (null === currentEntangledListeners) {
	      var entangledListeners = (currentEntangledListeners = []);
	      currentEntangledPendingCount = 0;
	      currentEntangledLane = requestTransitionLane();
	      currentEntangledActionThenable = {
	        status: "pending",
	        value: undefined,
	        then: function (resolve) {
	          entangledListeners.push(resolve);
	        }
	      };
	    }
	    currentEntangledPendingCount++;
	    thenable.then(pingEngtangledActionScope, pingEngtangledActionScope);
	    return thenable;
	  }
	  function pingEngtangledActionScope() {
	    if (
	      0 === --currentEntangledPendingCount &&
	      null !== currentEntangledListeners
	    ) {
	      null !== currentEntangledActionThenable &&
	        (currentEntangledActionThenable.status = "fulfilled");
	      var listeners = currentEntangledListeners;
	      currentEntangledListeners = null;
	      currentEntangledLane = 0;
	      currentEntangledActionThenable = null;
	      for (var i = 0; i < listeners.length; i++) (0, listeners[i])();
	    }
	  }
	  function chainThenableValue(thenable, result) {
	    var listeners = [],
	      thenableWithOverride = {
	        status: "pending",
	        value: null,
	        reason: null,
	        then: function (resolve) {
	          listeners.push(resolve);
	        }
	      };
	    thenable.then(
	      function () {
	        thenableWithOverride.status = "fulfilled";
	        thenableWithOverride.value = result;
	        for (var i = 0; i < listeners.length; i++) (0, listeners[i])(result);
	      },
	      function (error) {
	        thenableWithOverride.status = "rejected";
	        thenableWithOverride.reason = error;
	        for (error = 0; error < listeners.length; error++)
	          (0, listeners[error])(undefined);
	      }
	    );
	    return thenableWithOverride;
	  }
	  function initializeUpdateQueue(fiber) {
	    fiber.updateQueue = {
	      baseState: fiber.memoizedState,
	      firstBaseUpdate: null,
	      lastBaseUpdate: null,
	      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
	      callbacks: null
	    };
	  }
	  function cloneUpdateQueue(current, workInProgress) {
	    current = current.updateQueue;
	    workInProgress.updateQueue === current &&
	      (workInProgress.updateQueue = {
	        baseState: current.baseState,
	        firstBaseUpdate: current.firstBaseUpdate,
	        lastBaseUpdate: current.lastBaseUpdate,
	        shared: current.shared,
	        callbacks: null
	      });
	  }
	  function createUpdate(lane) {
	    return { lane: lane, tag: 0, payload: null, callback: null, next: null };
	  }
	  function enqueueUpdate(fiber, update, lane) {
	    var updateQueue = fiber.updateQueue;
	    if (null === updateQueue) return null;
	    updateQueue = updateQueue.shared;
	    if (0 !== (executionContext & 2)) {
	      var pending = updateQueue.pending;
	      null === pending
	        ? (update.next = update)
	        : ((update.next = pending.next), (pending.next = update));
	      updateQueue.pending = update;
	      update = getRootForUpdatedFiber(fiber);
	      markUpdateLaneFromFiberToRoot(fiber, null, lane);
	      return update;
	    }
	    enqueueUpdate$1(fiber, updateQueue, update, lane);
	    return getRootForUpdatedFiber(fiber);
	  }
	  function entangleTransitions(root, fiber, lane) {
	    fiber = fiber.updateQueue;
	    if (null !== fiber && ((fiber = fiber.shared), 0 !== (lane & 4194176))) {
	      var queueLanes = fiber.lanes;
	      queueLanes &= root.pendingLanes;
	      lane |= queueLanes;
	      fiber.lanes = lane;
	      markRootEntangled(root, lane);
	    }
	  }
	  function enqueueCapturedUpdate(workInProgress, capturedUpdate) {
	    var queue = workInProgress.updateQueue,
	      current = workInProgress.alternate;
	    if (
	      null !== current &&
	      ((current = current.updateQueue), queue === current)
	    ) {
	      var newFirst = null,
	        newLast = null;
	      queue = queue.firstBaseUpdate;
	      if (null !== queue) {
	        do {
	          var clone = {
	            lane: queue.lane,
	            tag: queue.tag,
	            payload: queue.payload,
	            callback: null,
	            next: null
	          };
	          null === newLast
	            ? (newFirst = newLast = clone)
	            : (newLast = newLast.next = clone);
	          queue = queue.next;
	        } while (null !== queue);
	        null === newLast
	          ? (newFirst = newLast = capturedUpdate)
	          : (newLast = newLast.next = capturedUpdate);
	      } else newFirst = newLast = capturedUpdate;
	      queue = {
	        baseState: current.baseState,
	        firstBaseUpdate: newFirst,
	        lastBaseUpdate: newLast,
	        shared: current.shared,
	        callbacks: current.callbacks
	      };
	      workInProgress.updateQueue = queue;
	      return;
	    }
	    workInProgress = queue.lastBaseUpdate;
	    null === workInProgress
	      ? (queue.firstBaseUpdate = capturedUpdate)
	      : (workInProgress.next = capturedUpdate);
	    queue.lastBaseUpdate = capturedUpdate;
	  }
	  function suspendIfUpdateReadFromEntangledAsyncAction() {
	    if (didReadFromEntangledAsyncAction) {
	      var entangledActionThenable = currentEntangledActionThenable;
	      if (null !== entangledActionThenable) throw entangledActionThenable;
	    }
	  }
	  function processUpdateQueue(
	    workInProgress$jscomp$0,
	    props,
	    instance$jscomp$0,
	    renderLanes
	  ) {
	    didReadFromEntangledAsyncAction = false;
	    var queue = workInProgress$jscomp$0.updateQueue;
	    hasForceUpdate = false;
	    var firstBaseUpdate = queue.firstBaseUpdate,
	      lastBaseUpdate = queue.lastBaseUpdate,
	      pendingQueue = queue.shared.pending;
	    if (null !== pendingQueue) {
	      queue.shared.pending = null;
	      var lastPendingUpdate = pendingQueue,
	        firstPendingUpdate = lastPendingUpdate.next;
	      lastPendingUpdate.next = null;
	      null === lastBaseUpdate
	        ? (firstBaseUpdate = firstPendingUpdate)
	        : (lastBaseUpdate.next = firstPendingUpdate);
	      lastBaseUpdate = lastPendingUpdate;
	      var current = workInProgress$jscomp$0.alternate;
	      null !== current &&
	        ((current = current.updateQueue),
	        (pendingQueue = current.lastBaseUpdate),
	        pendingQueue !== lastBaseUpdate &&
	          (null === pendingQueue
	            ? (current.firstBaseUpdate = firstPendingUpdate)
	            : (pendingQueue.next = firstPendingUpdate),
	          (current.lastBaseUpdate = lastPendingUpdate)));
	    }
	    if (null !== firstBaseUpdate) {
	      var newState = queue.baseState;
	      lastBaseUpdate = 0;
	      current = firstPendingUpdate = lastPendingUpdate = null;
	      pendingQueue = firstBaseUpdate;
	      do {
	        var updateLane = pendingQueue.lane & -536870913,
	          isHiddenUpdate = updateLane !== pendingQueue.lane;
	        if (
	          isHiddenUpdate
	            ? (workInProgressRootRenderLanes & updateLane) === updateLane
	            : (renderLanes & updateLane) === updateLane
	        ) {
	          0 !== updateLane &&
	            updateLane === currentEntangledLane &&
	            (didReadFromEntangledAsyncAction = true);
	          null !== current &&
	            (current = current.next =
	              {
	                lane: 0,
	                tag: pendingQueue.tag,
	                payload: pendingQueue.payload,
	                callback: null,
	                next: null
	              });
	          a: {
	            var workInProgress = workInProgress$jscomp$0,
	              update = pendingQueue;
	            updateLane = props;
	            var instance = instance$jscomp$0;
	            switch (update.tag) {
	              case 1:
	                workInProgress = update.payload;
	                if ("function" === typeof workInProgress) {
	                  newState = workInProgress.call(
	                    instance,
	                    newState,
	                    updateLane
	                  );
	                  break a;
	                }
	                newState = workInProgress;
	                break a;
	              case 3:
	                workInProgress.flags = (workInProgress.flags & -65537) | 128;
	              case 0:
	                workInProgress = update.payload;
	                updateLane =
	                  "function" === typeof workInProgress
	                    ? workInProgress.call(instance, newState, updateLane)
	                    : workInProgress;
	                if (null === updateLane || undefined === updateLane) break a;
	                newState = assign({}, newState, updateLane);
	                break a;
	              case 2:
	                hasForceUpdate = true;
	            }
	          }
	          updateLane = pendingQueue.callback;
	          null !== updateLane &&
	            ((workInProgress$jscomp$0.flags |= 64),
	            isHiddenUpdate && (workInProgress$jscomp$0.flags |= 8192),
	            (isHiddenUpdate = queue.callbacks),
	            null === isHiddenUpdate
	              ? (queue.callbacks = [updateLane])
	              : isHiddenUpdate.push(updateLane));
	        } else
	          (isHiddenUpdate = {
	            lane: updateLane,
	            tag: pendingQueue.tag,
	            payload: pendingQueue.payload,
	            callback: pendingQueue.callback,
	            next: null
	          }),
	            null === current
	              ? ((firstPendingUpdate = current = isHiddenUpdate),
	                (lastPendingUpdate = newState))
	              : (current = current.next = isHiddenUpdate),
	            (lastBaseUpdate |= updateLane);
	        pendingQueue = pendingQueue.next;
	        if (null === pendingQueue)
	          if (((pendingQueue = queue.shared.pending), null === pendingQueue))
	            break;
	          else
	            (isHiddenUpdate = pendingQueue),
	              (pendingQueue = isHiddenUpdate.next),
	              (isHiddenUpdate.next = null),
	              (queue.lastBaseUpdate = isHiddenUpdate),
	              (queue.shared.pending = null);
	      } while (1);
	      null === current && (lastPendingUpdate = newState);
	      queue.baseState = lastPendingUpdate;
	      queue.firstBaseUpdate = firstPendingUpdate;
	      queue.lastBaseUpdate = current;
	      null === firstBaseUpdate && (queue.shared.lanes = 0);
	      workInProgressRootSkippedLanes |= lastBaseUpdate;
	      workInProgress$jscomp$0.lanes = lastBaseUpdate;
	      workInProgress$jscomp$0.memoizedState = newState;
	    }
	  }
	  function callCallback(callback, context) {
	    if ("function" !== typeof callback)
	      throw Error(formatProdErrorMessage(191, callback));
	    callback.call(context);
	  }
	  function commitCallbacks(updateQueue, context) {
	    var callbacks = updateQueue.callbacks;
	    if (null !== callbacks)
	      for (
	        updateQueue.callbacks = null, updateQueue = 0;
	        updateQueue < callbacks.length;
	        updateQueue++
	      )
	        callCallback(callbacks[updateQueue], context);
	  }
	  function shallowEqual(objA, objB) {
	    if (objectIs(objA, objB)) return true;
	    if (
	      "object" !== typeof objA ||
	      null === objA ||
	      "object" !== typeof objB ||
	      null === objB
	    )
	      return false;
	    var keysA = Object.keys(objA),
	      keysB = Object.keys(objB);
	    if (keysA.length !== keysB.length) return false;
	    for (keysB = 0; keysB < keysA.length; keysB++) {
	      var currentKey = keysA[keysB];
	      if (
	        !hasOwnProperty.call(objB, currentKey) ||
	        !objectIs(objA[currentKey], objB[currentKey])
	      )
	        return false;
	    }
	    return true;
	  }
	  function isThenableResolved(thenable) {
	    thenable = thenable.status;
	    return "fulfilled" === thenable || "rejected" === thenable;
	  }
	  function noop$1() {}
	  function trackUsedThenable(thenableState, thenable, index) {
	    index = thenableState[index];
	    undefined === index
	      ? thenableState.push(thenable)
	      : index !== thenable &&
	        (thenable.then(noop$1, noop$1), (thenable = index));
	    switch (thenable.status) {
	      case "fulfilled":
	        return thenable.value;
	      case "rejected":
	        thenableState = thenable.reason;
	        if (thenableState === SuspenseException)
	          throw Error(formatProdErrorMessage(483));
	        throw thenableState;
	      default:
	        if ("string" === typeof thenable.status) thenable.then(noop$1, noop$1);
	        else {
	          thenableState = workInProgressRoot;
	          if (null !== thenableState && 100 < thenableState.shellSuspendCounter)
	            throw Error(formatProdErrorMessage(482));
	          thenableState = thenable;
	          thenableState.status = "pending";
	          thenableState.then(
	            function (fulfilledValue) {
	              if ("pending" === thenable.status) {
	                var fulfilledThenable = thenable;
	                fulfilledThenable.status = "fulfilled";
	                fulfilledThenable.value = fulfilledValue;
	              }
	            },
	            function (error) {
	              if ("pending" === thenable.status) {
	                var rejectedThenable = thenable;
	                rejectedThenable.status = "rejected";
	                rejectedThenable.reason = error;
	              }
	            }
	          );
	        }
	        switch (thenable.status) {
	          case "fulfilled":
	            return thenable.value;
	          case "rejected":
	            thenableState = thenable.reason;
	            if (thenableState === SuspenseException)
	              throw Error(formatProdErrorMessage(483));
	            throw thenableState;
	        }
	        suspendedThenable = thenable;
	        throw SuspenseException;
	    }
	  }
	  function getSuspendedThenable() {
	    if (null === suspendedThenable) throw Error(formatProdErrorMessage(459));
	    var thenable = suspendedThenable;
	    suspendedThenable = null;
	    return thenable;
	  }
	  function unwrapThenable(thenable) {
	    var index = thenableIndexCounter$1;
	    thenableIndexCounter$1 += 1;
	    null === thenableState$1 && (thenableState$1 = []);
	    return trackUsedThenable(thenableState$1, thenable, index);
	  }
	  function coerceRef(workInProgress, element) {
	    element = element.props.ref;
	    workInProgress.ref = undefined !== element ? element : null;
	  }
	  function throwOnInvalidObjectType(returnFiber, newChild) {
	    if (newChild.$$typeof === REACT_LEGACY_ELEMENT_TYPE)
	      throw Error(formatProdErrorMessage(525));
	    returnFiber = Object.prototype.toString.call(newChild);
	    throw Error(
	      formatProdErrorMessage(
	        31,
	        "[object Object]" === returnFiber
	          ? "object with keys {" + Object.keys(newChild).join(", ") + "}"
	          : returnFiber
	      )
	    );
	  }
	  function resolveLazy(lazyType) {
	    var init = lazyType._init;
	    return init(lazyType._payload);
	  }
	  function createChildReconciler(shouldTrackSideEffects) {
	    function deleteChild(returnFiber, childToDelete) {
	      if (shouldTrackSideEffects) {
	        var deletions = returnFiber.deletions;
	        null === deletions
	          ? ((returnFiber.deletions = [childToDelete]),
	            (returnFiber.flags |= 16))
	          : deletions.push(childToDelete);
	      }
	    }
	    function deleteRemainingChildren(returnFiber, currentFirstChild) {
	      if (!shouldTrackSideEffects) return null;
	      for (; null !== currentFirstChild; )
	        deleteChild(returnFiber, currentFirstChild),
	          (currentFirstChild = currentFirstChild.sibling);
	      return null;
	    }
	    function mapRemainingChildren(currentFirstChild) {
	      for (var existingChildren = new Map(); null !== currentFirstChild; )
	        null !== currentFirstChild.key
	          ? existingChildren.set(currentFirstChild.key, currentFirstChild)
	          : existingChildren.set(currentFirstChild.index, currentFirstChild),
	          (currentFirstChild = currentFirstChild.sibling);
	      return existingChildren;
	    }
	    function useFiber(fiber, pendingProps) {
	      fiber = createWorkInProgress(fiber, pendingProps);
	      fiber.index = 0;
	      fiber.sibling = null;
	      return fiber;
	    }
	    function placeChild(newFiber, lastPlacedIndex, newIndex) {
	      newFiber.index = newIndex;
	      if (!shouldTrackSideEffects)
	        return (newFiber.flags |= 1048576), lastPlacedIndex;
	      newIndex = newFiber.alternate;
	      if (null !== newIndex)
	        return (
	          (newIndex = newIndex.index),
	          newIndex < lastPlacedIndex
	            ? ((newFiber.flags |= 33554434), lastPlacedIndex)
	            : newIndex
	        );
	      newFiber.flags |= 33554434;
	      return lastPlacedIndex;
	    }
	    function placeSingleChild(newFiber) {
	      shouldTrackSideEffects &&
	        null === newFiber.alternate &&
	        (newFiber.flags |= 33554434);
	      return newFiber;
	    }
	    function updateTextNode(returnFiber, current, textContent, lanes) {
	      if (null === current || 6 !== current.tag)
	        return (
	          (current = createFiberFromText(textContent, returnFiber.mode, lanes)),
	          (current.return = returnFiber),
	          current
	        );
	      current = useFiber(current, textContent);
	      current.return = returnFiber;
	      return current;
	    }
	    function updateElement(returnFiber, current, element, lanes) {
	      var elementType = element.type;
	      if (elementType === REACT_FRAGMENT_TYPE)
	        return updateFragment(
	          returnFiber,
	          current,
	          element.props.children,
	          lanes,
	          element.key
	        );
	      if (
	        null !== current &&
	        (current.elementType === elementType ||
	          ("object" === typeof elementType &&
	            null !== elementType &&
	            elementType.$$typeof === REACT_LAZY_TYPE &&
	            resolveLazy(elementType) === current.type))
	      )
	        return (
	          (current = useFiber(current, element.props)),
	          coerceRef(current, element),
	          (current.return = returnFiber),
	          current
	        );
	      current = createFiberFromTypeAndProps(
	        element.type,
	        element.key,
	        element.props,
	        null,
	        returnFiber.mode,
	        lanes
	      );
	      coerceRef(current, element);
	      current.return = returnFiber;
	      return current;
	    }
	    function updatePortal(returnFiber, current, portal, lanes) {
	      if (
	        null === current ||
	        4 !== current.tag ||
	        current.stateNode.containerInfo !== portal.containerInfo ||
	        current.stateNode.implementation !== portal.implementation
	      )
	        return (
	          (current = createFiberFromPortal(portal, returnFiber.mode, lanes)),
	          (current.return = returnFiber),
	          current
	        );
	      current = useFiber(current, portal.children || []);
	      current.return = returnFiber;
	      return current;
	    }
	    function updateFragment(returnFiber, current, fragment, lanes, key) {
	      if (null === current || 7 !== current.tag)
	        return (
	          (current = createFiberFromFragment(
	            fragment,
	            returnFiber.mode,
	            lanes,
	            key
	          )),
	          (current.return = returnFiber),
	          current
	        );
	      current = useFiber(current, fragment);
	      current.return = returnFiber;
	      return current;
	    }
	    function createChild(returnFiber, newChild, lanes) {
	      if (
	        ("string" === typeof newChild && "" !== newChild) ||
	        "number" === typeof newChild ||
	        "bigint" === typeof newChild
	      )
	        return (
	          (newChild = createFiberFromText(
	            "" + newChild,
	            returnFiber.mode,
	            lanes
	          )),
	          (newChild.return = returnFiber),
	          newChild
	        );
	      if ("object" === typeof newChild && null !== newChild) {
	        switch (newChild.$$typeof) {
	          case REACT_ELEMENT_TYPE:
	            return (
	              (lanes = createFiberFromTypeAndProps(
	                newChild.type,
	                newChild.key,
	                newChild.props,
	                null,
	                returnFiber.mode,
	                lanes
	              )),
	              coerceRef(lanes, newChild),
	              (lanes.return = returnFiber),
	              lanes
	            );
	          case REACT_PORTAL_TYPE:
	            return (
	              (newChild = createFiberFromPortal(
	                newChild,
	                returnFiber.mode,
	                lanes
	              )),
	              (newChild.return = returnFiber),
	              newChild
	            );
	          case REACT_LAZY_TYPE:
	            var init = newChild._init;
	            newChild = init(newChild._payload);
	            return createChild(returnFiber, newChild, lanes);
	        }
	        if (isArrayImpl(newChild) || getIteratorFn(newChild))
	          return (
	            (newChild = createFiberFromFragment(
	              newChild,
	              returnFiber.mode,
	              lanes,
	              null
	            )),
	            (newChild.return = returnFiber),
	            newChild
	          );
	        if ("function" === typeof newChild.then)
	          return createChild(returnFiber, unwrapThenable(newChild), lanes);
	        if (newChild.$$typeof === REACT_CONTEXT_TYPE)
	          return createChild(
	            returnFiber,
	            readContextDuringReconciliation(returnFiber, newChild),
	            lanes
	          );
	        throwOnInvalidObjectType(returnFiber, newChild);
	      }
	      return null;
	    }
	    function updateSlot(returnFiber, oldFiber, newChild, lanes) {
	      var key = null !== oldFiber ? oldFiber.key : null;
	      if (
	        ("string" === typeof newChild && "" !== newChild) ||
	        "number" === typeof newChild ||
	        "bigint" === typeof newChild
	      )
	        return null !== key
	          ? null
	          : updateTextNode(returnFiber, oldFiber, "" + newChild, lanes);
	      if ("object" === typeof newChild && null !== newChild) {
	        switch (newChild.$$typeof) {
	          case REACT_ELEMENT_TYPE:
	            return newChild.key === key
	              ? updateElement(returnFiber, oldFiber, newChild, lanes)
	              : null;
	          case REACT_PORTAL_TYPE:
	            return newChild.key === key
	              ? updatePortal(returnFiber, oldFiber, newChild, lanes)
	              : null;
	          case REACT_LAZY_TYPE:
	            return (
	              (key = newChild._init),
	              (newChild = key(newChild._payload)),
	              updateSlot(returnFiber, oldFiber, newChild, lanes)
	            );
	        }
	        if (isArrayImpl(newChild) || getIteratorFn(newChild))
	          return null !== key
	            ? null
	            : updateFragment(returnFiber, oldFiber, newChild, lanes, null);
	        if ("function" === typeof newChild.then)
	          return updateSlot(
	            returnFiber,
	            oldFiber,
	            unwrapThenable(newChild),
	            lanes
	          );
	        if (newChild.$$typeof === REACT_CONTEXT_TYPE)
	          return updateSlot(
	            returnFiber,
	            oldFiber,
	            readContextDuringReconciliation(returnFiber, newChild),
	            lanes
	          );
	        throwOnInvalidObjectType(returnFiber, newChild);
	      }
	      return null;
	    }
	    function updateFromMap(
	      existingChildren,
	      returnFiber,
	      newIdx,
	      newChild,
	      lanes
	    ) {
	      if (
	        ("string" === typeof newChild && "" !== newChild) ||
	        "number" === typeof newChild ||
	        "bigint" === typeof newChild
	      )
	        return (
	          (existingChildren = existingChildren.get(newIdx) || null),
	          updateTextNode(returnFiber, existingChildren, "" + newChild, lanes)
	        );
	      if ("object" === typeof newChild && null !== newChild) {
	        switch (newChild.$$typeof) {
	          case REACT_ELEMENT_TYPE:
	            return (
	              (existingChildren =
	                existingChildren.get(
	                  null === newChild.key ? newIdx : newChild.key
	                ) || null),
	              updateElement(returnFiber, existingChildren, newChild, lanes)
	            );
	          case REACT_PORTAL_TYPE:
	            return (
	              (existingChildren =
	                existingChildren.get(
	                  null === newChild.key ? newIdx : newChild.key
	                ) || null),
	              updatePortal(returnFiber, existingChildren, newChild, lanes)
	            );
	          case REACT_LAZY_TYPE:
	            var init = newChild._init;
	            newChild = init(newChild._payload);
	            return updateFromMap(
	              existingChildren,
	              returnFiber,
	              newIdx,
	              newChild,
	              lanes
	            );
	        }
	        if (isArrayImpl(newChild) || getIteratorFn(newChild))
	          return (
	            (existingChildren = existingChildren.get(newIdx) || null),
	            updateFragment(returnFiber, existingChildren, newChild, lanes, null)
	          );
	        if ("function" === typeof newChild.then)
	          return updateFromMap(
	            existingChildren,
	            returnFiber,
	            newIdx,
	            unwrapThenable(newChild),
	            lanes
	          );
	        if (newChild.$$typeof === REACT_CONTEXT_TYPE)
	          return updateFromMap(
	            existingChildren,
	            returnFiber,
	            newIdx,
	            readContextDuringReconciliation(returnFiber, newChild),
	            lanes
	          );
	        throwOnInvalidObjectType(returnFiber, newChild);
	      }
	      return null;
	    }
	    function reconcileChildrenArray(
	      returnFiber,
	      currentFirstChild,
	      newChildren,
	      lanes
	    ) {
	      for (
	        var resultingFirstChild = null,
	          previousNewFiber = null,
	          oldFiber = currentFirstChild,
	          newIdx = (currentFirstChild = 0),
	          nextOldFiber = null;
	        null !== oldFiber && newIdx < newChildren.length;
	        newIdx++
	      ) {
	        oldFiber.index > newIdx
	          ? ((nextOldFiber = oldFiber), (oldFiber = null))
	          : (nextOldFiber = oldFiber.sibling);
	        var newFiber = updateSlot(
	          returnFiber,
	          oldFiber,
	          newChildren[newIdx],
	          lanes
	        );
	        if (null === newFiber) {
	          null === oldFiber && (oldFiber = nextOldFiber);
	          break;
	        }
	        shouldTrackSideEffects &&
	          oldFiber &&
	          null === newFiber.alternate &&
	          deleteChild(returnFiber, oldFiber);
	        currentFirstChild = placeChild(newFiber, currentFirstChild, newIdx);
	        null === previousNewFiber
	          ? (resultingFirstChild = newFiber)
	          : (previousNewFiber.sibling = newFiber);
	        previousNewFiber = newFiber;
	        oldFiber = nextOldFiber;
	      }
	      if (newIdx === newChildren.length)
	        return (
	          deleteRemainingChildren(returnFiber, oldFiber),
	          isHydrating && pushTreeFork(returnFiber, newIdx),
	          resultingFirstChild
	        );
	      if (null === oldFiber) {
	        for (; newIdx < newChildren.length; newIdx++)
	          (oldFiber = createChild(returnFiber, newChildren[newIdx], lanes)),
	            null !== oldFiber &&
	              ((currentFirstChild = placeChild(
	                oldFiber,
	                currentFirstChild,
	                newIdx
	              )),
	              null === previousNewFiber
	                ? (resultingFirstChild = oldFiber)
	                : (previousNewFiber.sibling = oldFiber),
	              (previousNewFiber = oldFiber));
	        isHydrating && pushTreeFork(returnFiber, newIdx);
	        return resultingFirstChild;
	      }
	      for (
	        oldFiber = mapRemainingChildren(oldFiber);
	        newIdx < newChildren.length;
	        newIdx++
	      )
	        (nextOldFiber = updateFromMap(
	          oldFiber,
	          returnFiber,
	          newIdx,
	          newChildren[newIdx],
	          lanes
	        )),
	          null !== nextOldFiber &&
	            (shouldTrackSideEffects &&
	              null !== nextOldFiber.alternate &&
	              oldFiber.delete(
	                null === nextOldFiber.key ? newIdx : nextOldFiber.key
	              ),
	            (currentFirstChild = placeChild(
	              nextOldFiber,
	              currentFirstChild,
	              newIdx
	            )),
	            null === previousNewFiber
	              ? (resultingFirstChild = nextOldFiber)
	              : (previousNewFiber.sibling = nextOldFiber),
	            (previousNewFiber = nextOldFiber));
	      shouldTrackSideEffects &&
	        oldFiber.forEach(function (child) {
	          return deleteChild(returnFiber, child);
	        });
	      isHydrating && pushTreeFork(returnFiber, newIdx);
	      return resultingFirstChild;
	    }
	    function reconcileChildrenIterator(
	      returnFiber,
	      currentFirstChild,
	      newChildren,
	      lanes
	    ) {
	      if (null == newChildren) throw Error(formatProdErrorMessage(151));
	      for (
	        var resultingFirstChild = null,
	          previousNewFiber = null,
	          oldFiber = currentFirstChild,
	          newIdx = (currentFirstChild = 0),
	          nextOldFiber = null,
	          step = newChildren.next();
	        null !== oldFiber && !step.done;
	        newIdx++, step = newChildren.next()
	      ) {
	        oldFiber.index > newIdx
	          ? ((nextOldFiber = oldFiber), (oldFiber = null))
	          : (nextOldFiber = oldFiber.sibling);
	        var newFiber = updateSlot(returnFiber, oldFiber, step.value, lanes);
	        if (null === newFiber) {
	          null === oldFiber && (oldFiber = nextOldFiber);
	          break;
	        }
	        shouldTrackSideEffects &&
	          oldFiber &&
	          null === newFiber.alternate &&
	          deleteChild(returnFiber, oldFiber);
	        currentFirstChild = placeChild(newFiber, currentFirstChild, newIdx);
	        null === previousNewFiber
	          ? (resultingFirstChild = newFiber)
	          : (previousNewFiber.sibling = newFiber);
	        previousNewFiber = newFiber;
	        oldFiber = nextOldFiber;
	      }
	      if (step.done)
	        return (
	          deleteRemainingChildren(returnFiber, oldFiber),
	          isHydrating && pushTreeFork(returnFiber, newIdx),
	          resultingFirstChild
	        );
	      if (null === oldFiber) {
	        for (; !step.done; newIdx++, step = newChildren.next())
	          (step = createChild(returnFiber, step.value, lanes)),
	            null !== step &&
	              ((currentFirstChild = placeChild(
	                step,
	                currentFirstChild,
	                newIdx
	              )),
	              null === previousNewFiber
	                ? (resultingFirstChild = step)
	                : (previousNewFiber.sibling = step),
	              (previousNewFiber = step));
	        isHydrating && pushTreeFork(returnFiber, newIdx);
	        return resultingFirstChild;
	      }
	      for (
	        oldFiber = mapRemainingChildren(oldFiber);
	        !step.done;
	        newIdx++, step = newChildren.next()
	      )
	        (step = updateFromMap(
	          oldFiber,
	          returnFiber,
	          newIdx,
	          step.value,
	          lanes
	        )),
	          null !== step &&
	            (shouldTrackSideEffects &&
	              null !== step.alternate &&
	              oldFiber.delete(null === step.key ? newIdx : step.key),
	            (currentFirstChild = placeChild(step, currentFirstChild, newIdx)),
	            null === previousNewFiber
	              ? (resultingFirstChild = step)
	              : (previousNewFiber.sibling = step),
	            (previousNewFiber = step));
	      shouldTrackSideEffects &&
	        oldFiber.forEach(function (child) {
	          return deleteChild(returnFiber, child);
	        });
	      isHydrating && pushTreeFork(returnFiber, newIdx);
	      return resultingFirstChild;
	    }
	    function reconcileChildFibersImpl(
	      returnFiber,
	      currentFirstChild,
	      newChild,
	      lanes
	    ) {
	      "object" === typeof newChild &&
	        null !== newChild &&
	        newChild.type === REACT_FRAGMENT_TYPE &&
	        null === newChild.key &&
	        (newChild = newChild.props.children);
	      if ("object" === typeof newChild && null !== newChild) {
	        switch (newChild.$$typeof) {
	          case REACT_ELEMENT_TYPE:
	            a: {
	              for (var key = newChild.key; null !== currentFirstChild; ) {
	                if (currentFirstChild.key === key) {
	                  key = newChild.type;
	                  if (key === REACT_FRAGMENT_TYPE) {
	                    if (7 === currentFirstChild.tag) {
	                      deleteRemainingChildren(
	                        returnFiber,
	                        currentFirstChild.sibling
	                      );
	                      lanes = useFiber(
	                        currentFirstChild,
	                        newChild.props.children
	                      );
	                      lanes.return = returnFiber;
	                      returnFiber = lanes;
	                      break a;
	                    }
	                  } else if (
	                    currentFirstChild.elementType === key ||
	                    ("object" === typeof key &&
	                      null !== key &&
	                      key.$$typeof === REACT_LAZY_TYPE &&
	                      resolveLazy(key) === currentFirstChild.type)
	                  ) {
	                    deleteRemainingChildren(
	                      returnFiber,
	                      currentFirstChild.sibling
	                    );
	                    lanes = useFiber(currentFirstChild, newChild.props);
	                    coerceRef(lanes, newChild);
	                    lanes.return = returnFiber;
	                    returnFiber = lanes;
	                    break a;
	                  }
	                  deleteRemainingChildren(returnFiber, currentFirstChild);
	                  break;
	                } else deleteChild(returnFiber, currentFirstChild);
	                currentFirstChild = currentFirstChild.sibling;
	              }
	              newChild.type === REACT_FRAGMENT_TYPE
	                ? ((lanes = createFiberFromFragment(
	                    newChild.props.children,
	                    returnFiber.mode,
	                    lanes,
	                    newChild.key
	                  )),
	                  (lanes.return = returnFiber),
	                  (returnFiber = lanes))
	                : ((lanes = createFiberFromTypeAndProps(
	                    newChild.type,
	                    newChild.key,
	                    newChild.props,
	                    null,
	                    returnFiber.mode,
	                    lanes
	                  )),
	                  coerceRef(lanes, newChild),
	                  (lanes.return = returnFiber),
	                  (returnFiber = lanes));
	            }
	            return placeSingleChild(returnFiber);
	          case REACT_PORTAL_TYPE:
	            a: {
	              for (key = newChild.key; null !== currentFirstChild; ) {
	                if (currentFirstChild.key === key)
	                  if (
	                    4 === currentFirstChild.tag &&
	                    currentFirstChild.stateNode.containerInfo ===
	                      newChild.containerInfo &&
	                    currentFirstChild.stateNode.implementation ===
	                      newChild.implementation
	                  ) {
	                    deleteRemainingChildren(
	                      returnFiber,
	                      currentFirstChild.sibling
	                    );
	                    lanes = useFiber(
	                      currentFirstChild,
	                      newChild.children || []
	                    );
	                    lanes.return = returnFiber;
	                    returnFiber = lanes;
	                    break a;
	                  } else {
	                    deleteRemainingChildren(returnFiber, currentFirstChild);
	                    break;
	                  }
	                else deleteChild(returnFiber, currentFirstChild);
	                currentFirstChild = currentFirstChild.sibling;
	              }
	              lanes = createFiberFromPortal(newChild, returnFiber.mode, lanes);
	              lanes.return = returnFiber;
	              returnFiber = lanes;
	            }
	            return placeSingleChild(returnFiber);
	          case REACT_LAZY_TYPE:
	            return (
	              (key = newChild._init),
	              (newChild = key(newChild._payload)),
	              reconcileChildFibersImpl(
	                returnFiber,
	                currentFirstChild,
	                newChild,
	                lanes
	              )
	            );
	        }
	        if (isArrayImpl(newChild))
	          return reconcileChildrenArray(
	            returnFiber,
	            currentFirstChild,
	            newChild,
	            lanes
	          );
	        if (getIteratorFn(newChild)) {
	          key = getIteratorFn(newChild);
	          if ("function" !== typeof key)
	            throw Error(formatProdErrorMessage(150));
	          newChild = key.call(newChild);
	          return reconcileChildrenIterator(
	            returnFiber,
	            currentFirstChild,
	            newChild,
	            lanes
	          );
	        }
	        if ("function" === typeof newChild.then)
	          return reconcileChildFibersImpl(
	            returnFiber,
	            currentFirstChild,
	            unwrapThenable(newChild),
	            lanes
	          );
	        if (newChild.$$typeof === REACT_CONTEXT_TYPE)
	          return reconcileChildFibersImpl(
	            returnFiber,
	            currentFirstChild,
	            readContextDuringReconciliation(returnFiber, newChild),
	            lanes
	          );
	        throwOnInvalidObjectType(returnFiber, newChild);
	      }
	      return ("string" === typeof newChild && "" !== newChild) ||
	        "number" === typeof newChild ||
	        "bigint" === typeof newChild
	        ? ((newChild = "" + newChild),
	          null !== currentFirstChild && 6 === currentFirstChild.tag
	            ? (deleteRemainingChildren(returnFiber, currentFirstChild.sibling),
	              (lanes = useFiber(currentFirstChild, newChild)),
	              (lanes.return = returnFiber),
	              (returnFiber = lanes))
	            : (deleteRemainingChildren(returnFiber, currentFirstChild),
	              (lanes = createFiberFromText(newChild, returnFiber.mode, lanes)),
	              (lanes.return = returnFiber),
	              (returnFiber = lanes)),
	          placeSingleChild(returnFiber))
	        : deleteRemainingChildren(returnFiber, currentFirstChild);
	    }
	    return function (returnFiber, currentFirstChild, newChild, lanes) {
	      try {
	        thenableIndexCounter$1 = 0;
	        var firstChildFiber = reconcileChildFibersImpl(
	          returnFiber,
	          currentFirstChild,
	          newChild,
	          lanes
	        );
	        thenableState$1 = null;
	        return firstChildFiber;
	      } catch (x) {
	        if (x === SuspenseException) throw x;
	        var fiber = createFiber(29, x, null, returnFiber.mode);
	        fiber.lanes = lanes;
	        fiber.return = returnFiber;
	        return fiber;
	      } finally {
	      }
	    };
	  }
	  function pushHiddenContext(fiber, context) {
	    fiber = entangledRenderLanes;
	    push(prevEntangledRenderLanesCursor, fiber);
	    push(currentTreeHiddenStackCursor, context);
	    entangledRenderLanes = fiber | context.baseLanes;
	  }
	  function reuseHiddenContextOnStack() {
	    push(prevEntangledRenderLanesCursor, entangledRenderLanes);
	    push(currentTreeHiddenStackCursor, currentTreeHiddenStackCursor.current);
	  }
	  function popHiddenContext() {
	    entangledRenderLanes = prevEntangledRenderLanesCursor.current;
	    pop(currentTreeHiddenStackCursor);
	    pop(prevEntangledRenderLanesCursor);
	  }
	  function pushPrimaryTreeSuspenseHandler(handler) {
	    var current = handler.alternate;
	    push(suspenseStackCursor, suspenseStackCursor.current & 1);
	    push(suspenseHandlerStackCursor, handler);
	    null === shellBoundary &&
	      (null === current || null !== currentTreeHiddenStackCursor.current
	        ? (shellBoundary = handler)
	        : null !== current.memoizedState && (shellBoundary = handler));
	  }
	  function pushOffscreenSuspenseHandler(fiber) {
	    if (22 === fiber.tag) {
	      if (
	        (push(suspenseStackCursor, suspenseStackCursor.current),
	        push(suspenseHandlerStackCursor, fiber),
	        null === shellBoundary)
	      ) {
	        var current = fiber.alternate;
	        null !== current &&
	          null !== current.memoizedState &&
	          (shellBoundary = fiber);
	      }
	    } else reuseSuspenseHandlerOnStack();
	  }
	  function reuseSuspenseHandlerOnStack() {
	    push(suspenseStackCursor, suspenseStackCursor.current);
	    push(suspenseHandlerStackCursor, suspenseHandlerStackCursor.current);
	  }
	  function popSuspenseHandler(fiber) {
	    pop(suspenseHandlerStackCursor);
	    shellBoundary === fiber && (shellBoundary = null);
	    pop(suspenseStackCursor);
	  }
	  function findFirstSuspended(row) {
	    for (var node = row; null !== node; ) {
	      if (13 === node.tag) {
	        var state = node.memoizedState;
	        if (
	          null !== state &&
	          ((state = state.dehydrated),
	          null === state ||
	            isSuspenseInstancePending(state) ||
	            isSuspenseInstanceFallback(state))
	        )
	          return node;
	      } else if (19 === node.tag && undefined !== node.memoizedProps.revealOrder) {
	        if (0 !== (node.flags & 128)) return node;
	      } else if (null !== node.child) {
	        node.child.return = node;
	        node = node.child;
	        continue;
	      }
	      if (node === row) break;
	      for (; null === node.sibling; ) {
	        if (null === node.return || node.return === row) return null;
	        node = node.return;
	      }
	      node.sibling.return = node.return;
	      node = node.sibling;
	    }
	    return null;
	  }
	  function throwInvalidHookError() {
	    throw Error(formatProdErrorMessage(321));
	  }
	  function areHookInputsEqual(nextDeps, prevDeps) {
	    if (null === prevDeps) return false;
	    for (var i = 0; i < prevDeps.length && i < nextDeps.length; i++)
	      if (!objectIs(nextDeps[i], prevDeps[i])) return false;
	    return true;
	  }
	  function renderWithHooks(
	    current,
	    workInProgress,
	    Component,
	    props,
	    secondArg,
	    nextRenderLanes
	  ) {
	    renderLanes = nextRenderLanes;
	    currentlyRenderingFiber$1 = workInProgress;
	    workInProgress.memoizedState = null;
	    workInProgress.updateQueue = null;
	    workInProgress.lanes = 0;
	    ReactSharedInternals.H =
	      null === current || null === current.memoizedState
	        ? HooksDispatcherOnMount
	        : HooksDispatcherOnUpdate;
	    shouldDoubleInvokeUserFnsInHooksDEV = false;
	    nextRenderLanes = Component(props, secondArg);
	    shouldDoubleInvokeUserFnsInHooksDEV = false;
	    didScheduleRenderPhaseUpdateDuringThisPass &&
	      (nextRenderLanes = renderWithHooksAgain(
	        workInProgress,
	        Component,
	        props,
	        secondArg
	      ));
	    finishRenderingHooks(current);
	    return nextRenderLanes;
	  }
	  function finishRenderingHooks(current) {
	    ReactSharedInternals.H = ContextOnlyDispatcher;
	    var didRenderTooFewHooks =
	      null !== currentHook && null !== currentHook.next;
	    renderLanes = 0;
	    workInProgressHook = currentHook = currentlyRenderingFiber$1 = null;
	    didScheduleRenderPhaseUpdate = false;
	    thenableIndexCounter = 0;
	    thenableState = null;
	    if (didRenderTooFewHooks) throw Error(formatProdErrorMessage(300));
	    null === current ||
	      didReceiveUpdate ||
	      ((current = current.dependencies),
	      null !== current &&
	        checkIfContextChanged(current) &&
	        (didReceiveUpdate = true));
	  }
	  function renderWithHooksAgain(workInProgress, Component, props, secondArg) {
	    currentlyRenderingFiber$1 = workInProgress;
	    var numberOfReRenders = 0;
	    do {
	      didScheduleRenderPhaseUpdateDuringThisPass && (thenableState = null);
	      thenableIndexCounter = 0;
	      didScheduleRenderPhaseUpdateDuringThisPass = false;
	      if (25 <= numberOfReRenders) throw Error(formatProdErrorMessage(301));
	      numberOfReRenders += 1;
	      workInProgressHook = currentHook = null;
	      if (null != workInProgress.updateQueue) {
	        var children = workInProgress.updateQueue;
	        children.lastEffect = null;
	        children.events = null;
	        children.stores = null;
	        null != children.memoCache && (children.memoCache.index = 0);
	      }
	      ReactSharedInternals.H = HooksDispatcherOnRerender;
	      children = Component(props, secondArg);
	    } while (didScheduleRenderPhaseUpdateDuringThisPass);
	    return children;
	  }
	  function TransitionAwareHostComponent() {
	    var dispatcher = ReactSharedInternals.H,
	      maybeThenable = dispatcher.useState()[0];
	    maybeThenable =
	      "function" === typeof maybeThenable.then
	        ? useThenable(maybeThenable)
	        : maybeThenable;
	    dispatcher = dispatcher.useState()[0];
	    (null !== currentHook ? currentHook.memoizedState : null) !== dispatcher &&
	      (currentlyRenderingFiber$1.flags |= 1024);
	    return maybeThenable;
	  }
	  function checkDidRenderIdHook() {
	    var didRenderIdHook = 0 !== localIdCounter;
	    localIdCounter = 0;
	    return didRenderIdHook;
	  }
	  function bailoutHooks(current, workInProgress, lanes) {
	    workInProgress.updateQueue = current.updateQueue;
	    workInProgress.flags &= -2053;
	    current.lanes &= ~lanes;
	  }
	  function resetHooksOnUnwind(workInProgress) {
	    if (didScheduleRenderPhaseUpdate) {
	      for (
	        workInProgress = workInProgress.memoizedState;
	        null !== workInProgress;

	      ) {
	        var queue = workInProgress.queue;
	        null !== queue && (queue.pending = null);
	        workInProgress = workInProgress.next;
	      }
	      didScheduleRenderPhaseUpdate = false;
	    }
	    renderLanes = 0;
	    workInProgressHook = currentHook = currentlyRenderingFiber$1 = null;
	    didScheduleRenderPhaseUpdateDuringThisPass = false;
	    thenableIndexCounter = localIdCounter = 0;
	    thenableState = null;
	  }
	  function mountWorkInProgressHook() {
	    var hook = {
	      memoizedState: null,
	      baseState: null,
	      baseQueue: null,
	      queue: null,
	      next: null
	    };
	    null === workInProgressHook
	      ? (currentlyRenderingFiber$1.memoizedState = workInProgressHook = hook)
	      : (workInProgressHook = workInProgressHook.next = hook);
	    return workInProgressHook;
	  }
	  function updateWorkInProgressHook() {
	    if (null === currentHook) {
	      var nextCurrentHook = currentlyRenderingFiber$1.alternate;
	      nextCurrentHook =
	        null !== nextCurrentHook ? nextCurrentHook.memoizedState : null;
	    } else nextCurrentHook = currentHook.next;
	    var nextWorkInProgressHook =
	      null === workInProgressHook
	        ? currentlyRenderingFiber$1.memoizedState
	        : workInProgressHook.next;
	    if (null !== nextWorkInProgressHook)
	      (workInProgressHook = nextWorkInProgressHook),
	        (currentHook = nextCurrentHook);
	    else {
	      if (null === nextCurrentHook) {
	        if (null === currentlyRenderingFiber$1.alternate)
	          throw Error(formatProdErrorMessage(467));
	        throw Error(formatProdErrorMessage(310));
	      }
	      currentHook = nextCurrentHook;
	      nextCurrentHook = {
	        memoizedState: currentHook.memoizedState,
	        baseState: currentHook.baseState,
	        baseQueue: currentHook.baseQueue,
	        queue: currentHook.queue,
	        next: null
	      };
	      null === workInProgressHook
	        ? (currentlyRenderingFiber$1.memoizedState = workInProgressHook =
	            nextCurrentHook)
	        : (workInProgressHook = workInProgressHook.next = nextCurrentHook);
	    }
	    return workInProgressHook;
	  }
	  function useThenable(thenable) {
	    var index = thenableIndexCounter;
	    thenableIndexCounter += 1;
	    null === thenableState && (thenableState = []);
	    thenable = trackUsedThenable(thenableState, thenable, index);
	    index = currentlyRenderingFiber$1;
	    null ===
	      (null === workInProgressHook
	        ? index.memoizedState
	        : workInProgressHook.next) &&
	      ((index = index.alternate),
	      (ReactSharedInternals.H =
	        null === index || null === index.memoizedState
	          ? HooksDispatcherOnMount
	          : HooksDispatcherOnUpdate));
	    return thenable;
	  }
	  function use(usable) {
	    if (null !== usable && "object" === typeof usable) {
	      if ("function" === typeof usable.then) return useThenable(usable);
	      if (usable.$$typeof === REACT_CONTEXT_TYPE) return readContext(usable);
	    }
	    throw Error(formatProdErrorMessage(438, String(usable)));
	  }
	  function useMemoCache(size) {
	    var memoCache = null,
	      updateQueue = currentlyRenderingFiber$1.updateQueue;
	    null !== updateQueue && (memoCache = updateQueue.memoCache);
	    if (null == memoCache) {
	      var current = currentlyRenderingFiber$1.alternate;
	      null !== current &&
	        ((current = current.updateQueue),
	        null !== current &&
	          ((current = current.memoCache),
	          null != current &&
	            (memoCache = {
	              data: current.data.map(function (array) {
	                return array.slice();
	              }),
	              index: 0
	            })));
	    }
	    null == memoCache && (memoCache = { data: [], index: 0 });
	    null === updateQueue &&
	      ((updateQueue = createFunctionComponentUpdateQueue()),
	      (currentlyRenderingFiber$1.updateQueue = updateQueue));
	    updateQueue.memoCache = memoCache;
	    updateQueue = memoCache.data[memoCache.index];
	    if (undefined === updateQueue)
	      for (
	        updateQueue = memoCache.data[memoCache.index] = Array(size),
	          current = 0;
	        current < size;
	        current++
	      )
	        updateQueue[current] = REACT_MEMO_CACHE_SENTINEL;
	    memoCache.index++;
	    return updateQueue;
	  }
	  function basicStateReducer(state, action) {
	    return "function" === typeof action ? action(state) : action;
	  }
	  function updateReducer(reducer) {
	    var hook = updateWorkInProgressHook();
	    return updateReducerImpl(hook, currentHook, reducer);
	  }
	  function updateReducerImpl(hook, current, reducer) {
	    var queue = hook.queue;
	    if (null === queue) throw Error(formatProdErrorMessage(311));
	    queue.lastRenderedReducer = reducer;
	    var baseQueue = hook.baseQueue,
	      pendingQueue = queue.pending;
	    if (null !== pendingQueue) {
	      if (null !== baseQueue) {
	        var baseFirst = baseQueue.next;
	        baseQueue.next = pendingQueue.next;
	        pendingQueue.next = baseFirst;
	      }
	      current.baseQueue = baseQueue = pendingQueue;
	      queue.pending = null;
	    }
	    pendingQueue = hook.baseState;
	    if (null === baseQueue) hook.memoizedState = pendingQueue;
	    else {
	      current = baseQueue.next;
	      var newBaseQueueFirst = (baseFirst = null),
	        newBaseQueueLast = null,
	        update = current,
	        didReadFromEntangledAsyncAction$48 = false;
	      do {
	        var updateLane = update.lane & -536870913;
	        if (
	          updateLane !== update.lane
	            ? (workInProgressRootRenderLanes & updateLane) === updateLane
	            : (renderLanes & updateLane) === updateLane
	        ) {
	          var revertLane = update.revertLane;
	          if (0 === revertLane)
	            null !== newBaseQueueLast &&
	              (newBaseQueueLast = newBaseQueueLast.next =
	                {
	                  lane: 0,
	                  revertLane: 0,
	                  action: update.action,
	                  hasEagerState: update.hasEagerState,
	                  eagerState: update.eagerState,
	                  next: null
	                }),
	              updateLane === currentEntangledLane &&
	                (didReadFromEntangledAsyncAction$48 = true);
	          else if ((renderLanes & revertLane) === revertLane) {
	            update = update.next;
	            revertLane === currentEntangledLane &&
	              (didReadFromEntangledAsyncAction$48 = true);
	            continue;
	          } else
	            (updateLane = {
	              lane: 0,
	              revertLane: update.revertLane,
	              action: update.action,
	              hasEagerState: update.hasEagerState,
	              eagerState: update.eagerState,
	              next: null
	            }),
	              null === newBaseQueueLast
	                ? ((newBaseQueueFirst = newBaseQueueLast = updateLane),
	                  (baseFirst = pendingQueue))
	                : (newBaseQueueLast = newBaseQueueLast.next = updateLane),
	              (currentlyRenderingFiber$1.lanes |= revertLane),
	              (workInProgressRootSkippedLanes |= revertLane);
	          updateLane = update.action;
	          shouldDoubleInvokeUserFnsInHooksDEV &&
	            reducer(pendingQueue, updateLane);
	          pendingQueue = update.hasEagerState
	            ? update.eagerState
	            : reducer(pendingQueue, updateLane);
	        } else
	          (revertLane = {
	            lane: updateLane,
	            revertLane: update.revertLane,
	            action: update.action,
	            hasEagerState: update.hasEagerState,
	            eagerState: update.eagerState,
	            next: null
	          }),
	            null === newBaseQueueLast
	              ? ((newBaseQueueFirst = newBaseQueueLast = revertLane),
	                (baseFirst = pendingQueue))
	              : (newBaseQueueLast = newBaseQueueLast.next = revertLane),
	            (currentlyRenderingFiber$1.lanes |= updateLane),
	            (workInProgressRootSkippedLanes |= updateLane);
	        update = update.next;
	      } while (null !== update && update !== current);
	      null === newBaseQueueLast
	        ? (baseFirst = pendingQueue)
	        : (newBaseQueueLast.next = newBaseQueueFirst);
	      if (
	        !objectIs(pendingQueue, hook.memoizedState) &&
	        ((didReceiveUpdate = true),
	        didReadFromEntangledAsyncAction$48 &&
	          ((reducer = currentEntangledActionThenable), null !== reducer))
	      )
	        throw reducer;
	      hook.memoizedState = pendingQueue;
	      hook.baseState = baseFirst;
	      hook.baseQueue = newBaseQueueLast;
	      queue.lastRenderedState = pendingQueue;
	    }
	    null === baseQueue && (queue.lanes = 0);
	    return [hook.memoizedState, queue.dispatch];
	  }
	  function rerenderReducer(reducer) {
	    var hook = updateWorkInProgressHook(),
	      queue = hook.queue;
	    if (null === queue) throw Error(formatProdErrorMessage(311));
	    queue.lastRenderedReducer = reducer;
	    var dispatch = queue.dispatch,
	      lastRenderPhaseUpdate = queue.pending,
	      newState = hook.memoizedState;
	    if (null !== lastRenderPhaseUpdate) {
	      queue.pending = null;
	      var update = (lastRenderPhaseUpdate = lastRenderPhaseUpdate.next);
	      do (newState = reducer(newState, update.action)), (update = update.next);
	      while (update !== lastRenderPhaseUpdate);
	      objectIs(newState, hook.memoizedState) || (didReceiveUpdate = true);
	      hook.memoizedState = newState;
	      null === hook.baseQueue && (hook.baseState = newState);
	      queue.lastRenderedState = newState;
	    }
	    return [newState, dispatch];
	  }
	  function updateSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) {
	    var fiber = currentlyRenderingFiber$1,
	      hook = updateWorkInProgressHook(),
	      isHydrating$jscomp$0 = isHydrating;
	    if (isHydrating$jscomp$0) {
	      if (undefined === getServerSnapshot)
	        throw Error(formatProdErrorMessage(407));
	      getServerSnapshot = getServerSnapshot();
	    } else getServerSnapshot = getSnapshot();
	    var snapshotChanged = !objectIs(
	      (currentHook || hook).memoizedState,
	      getServerSnapshot
	    );
	    snapshotChanged &&
	      ((hook.memoizedState = getServerSnapshot), (didReceiveUpdate = true));
	    hook = hook.queue;
	    updateEffect(subscribeToStore.bind(null, fiber, hook, subscribe), [
	      subscribe
	    ]);
	    if (
	      hook.getSnapshot !== getSnapshot ||
	      snapshotChanged ||
	      (null !== workInProgressHook && workInProgressHook.memoizedState.tag & 1)
	    ) {
	      fiber.flags |= 2048;
	      pushEffect(
	        9,
	        updateStoreInstance.bind(
	          null,
	          fiber,
	          hook,
	          getServerSnapshot,
	          getSnapshot
	        ),
	        { destroy: undefined },
	        null
	      );
	      if (null === workInProgressRoot) throw Error(formatProdErrorMessage(349));
	      isHydrating$jscomp$0 ||
	        0 !== (renderLanes & 60) ||
	        pushStoreConsistencyCheck(fiber, getSnapshot, getServerSnapshot);
	    }
	    return getServerSnapshot;
	  }
	  function pushStoreConsistencyCheck(fiber, getSnapshot, renderedSnapshot) {
	    fiber.flags |= 16384;
	    fiber = { getSnapshot: getSnapshot, value: renderedSnapshot };
	    getSnapshot = currentlyRenderingFiber$1.updateQueue;
	    null === getSnapshot
	      ? ((getSnapshot = createFunctionComponentUpdateQueue()),
	        (currentlyRenderingFiber$1.updateQueue = getSnapshot),
	        (getSnapshot.stores = [fiber]))
	      : ((renderedSnapshot = getSnapshot.stores),
	        null === renderedSnapshot
	          ? (getSnapshot.stores = [fiber])
	          : renderedSnapshot.push(fiber));
	  }
	  function updateStoreInstance(fiber, inst, nextSnapshot, getSnapshot) {
	    inst.value = nextSnapshot;
	    inst.getSnapshot = getSnapshot;
	    checkIfSnapshotChanged(inst) && forceStoreRerender(fiber);
	  }
	  function subscribeToStore(fiber, inst, subscribe) {
	    return subscribe(function () {
	      checkIfSnapshotChanged(inst) && forceStoreRerender(fiber);
	    });
	  }
	  function checkIfSnapshotChanged(inst) {
	    var latestGetSnapshot = inst.getSnapshot;
	    inst = inst.value;
	    try {
	      var nextValue = latestGetSnapshot();
	      return !objectIs(inst, nextValue);
	    } catch (error) {
	      return true;
	    }
	  }
	  function forceStoreRerender(fiber) {
	    var root = enqueueConcurrentRenderForLane(fiber, 2);
	    null !== root && scheduleUpdateOnFiber(root, fiber, 2);
	  }
	  function mountStateImpl(initialState) {
	    var hook = mountWorkInProgressHook();
	    if ("function" === typeof initialState) {
	      var initialStateInitializer = initialState;
	      initialState = initialStateInitializer();
	      if (shouldDoubleInvokeUserFnsInHooksDEV) {
	        setIsStrictModeForDevtools(true);
	        try {
	          initialStateInitializer();
	        } finally {
	          setIsStrictModeForDevtools(false);
	        }
	      }
	    }
	    hook.memoizedState = hook.baseState = initialState;
	    hook.queue = {
	      pending: null,
	      lanes: 0,
	      dispatch: null,
	      lastRenderedReducer: basicStateReducer,
	      lastRenderedState: initialState
	    };
	    return hook;
	  }
	  function updateOptimisticImpl(hook, current, passthrough, reducer) {
	    hook.baseState = passthrough;
	    return updateReducerImpl(
	      hook,
	      currentHook,
	      "function" === typeof reducer ? reducer : basicStateReducer
	    );
	  }
	  function dispatchActionState(
	    fiber,
	    actionQueue,
	    setPendingState,
	    setState,
	    payload
	  ) {
	    if (isRenderPhaseUpdate(fiber)) throw Error(formatProdErrorMessage(485));
	    fiber = actionQueue.action;
	    if (null !== fiber) {
	      var actionNode = {
	        payload: payload,
	        action: fiber,
	        next: null,
	        isTransition: true,
	        status: "pending",
	        value: null,
	        reason: null,
	        listeners: [],
	        then: function (listener) {
	          actionNode.listeners.push(listener);
	        }
	      };
	      null !== ReactSharedInternals.T
	        ? setPendingState(true)
	        : (actionNode.isTransition = false);
	      setState(actionNode);
	      setPendingState = actionQueue.pending;
	      null === setPendingState
	        ? ((actionNode.next = actionQueue.pending = actionNode),
	          runActionStateAction(actionQueue, actionNode))
	        : ((actionNode.next = setPendingState.next),
	          (actionQueue.pending = setPendingState.next = actionNode));
	    }
	  }
	  function runActionStateAction(actionQueue, node) {
	    var action = node.action,
	      payload = node.payload,
	      prevState = actionQueue.state;
	    if (node.isTransition) {
	      var prevTransition = ReactSharedInternals.T,
	        currentTransition = {};
	      ReactSharedInternals.T = currentTransition;
	      try {
	        var returnValue = action(prevState, payload),
	          onStartTransitionFinish = ReactSharedInternals.S;
	        null !== onStartTransitionFinish &&
	          onStartTransitionFinish(currentTransition, returnValue);
	        handleActionReturnValue(actionQueue, node, returnValue);
	      } catch (error) {
	        onActionError(actionQueue, node, error);
	      } finally {
	        ReactSharedInternals.T = prevTransition;
	      }
	    } else
	      try {
	        (prevTransition = action(prevState, payload)),
	          handleActionReturnValue(actionQueue, node, prevTransition);
	      } catch (error$52) {
	        onActionError(actionQueue, node, error$52);
	      }
	  }
	  function handleActionReturnValue(actionQueue, node, returnValue) {
	    null !== returnValue &&
	    "object" === typeof returnValue &&
	    "function" === typeof returnValue.then
	      ? returnValue.then(
	          function (nextState) {
	            onActionSuccess(actionQueue, node, nextState);
	          },
	          function (error) {
	            return onActionError(actionQueue, node, error);
	          }
	        )
	      : onActionSuccess(actionQueue, node, returnValue);
	  }
	  function onActionSuccess(actionQueue, actionNode, nextState) {
	    actionNode.status = "fulfilled";
	    actionNode.value = nextState;
	    notifyActionListeners(actionNode);
	    actionQueue.state = nextState;
	    actionNode = actionQueue.pending;
	    null !== actionNode &&
	      ((nextState = actionNode.next),
	      nextState === actionNode
	        ? (actionQueue.pending = null)
	        : ((nextState = nextState.next),
	          (actionNode.next = nextState),
	          runActionStateAction(actionQueue, nextState)));
	  }
	  function onActionError(actionQueue, actionNode, error) {
	    var last = actionQueue.pending;
	    actionQueue.pending = null;
	    if (null !== last) {
	      last = last.next;
	      do
	        (actionNode.status = "rejected"),
	          (actionNode.reason = error),
	          notifyActionListeners(actionNode),
	          (actionNode = actionNode.next);
	      while (actionNode !== last);
	    }
	    actionQueue.action = null;
	  }
	  function notifyActionListeners(actionNode) {
	    actionNode = actionNode.listeners;
	    for (var i = 0; i < actionNode.length; i++) (0, actionNode[i])();
	  }
	  function actionStateReducer(oldState, newState) {
	    return newState;
	  }
	  function mountActionState(action, initialStateProp) {
	    if (isHydrating) {
	      var ssrFormState = workInProgressRoot.formState;
	      if (null !== ssrFormState) {
	        a: {
	          var JSCompiler_inline_result = currentlyRenderingFiber$1;
	          if (isHydrating) {
	            if (nextHydratableInstance) {
	              var markerInstance = canHydrateFormStateMarker(
	                nextHydratableInstance,
	                rootOrSingletonContext
	              );
	              if (markerInstance) {
	                nextHydratableInstance =
	                  getNextHydratableSibling(markerInstance);
	                JSCompiler_inline_result =
	                  isFormStateMarkerMatching(markerInstance);
	                break a;
	              }
	            }
	            throwOnHydrationMismatch(JSCompiler_inline_result);
	          }
	          JSCompiler_inline_result = false;
	        }
	        JSCompiler_inline_result && (initialStateProp = ssrFormState[0]);
	      }
	    }
	    ssrFormState = mountWorkInProgressHook();
	    ssrFormState.memoizedState = ssrFormState.baseState = initialStateProp;
	    JSCompiler_inline_result = {
	      pending: null,
	      lanes: 0,
	      dispatch: null,
	      lastRenderedReducer: actionStateReducer,
	      lastRenderedState: initialStateProp
	    };
	    ssrFormState.queue = JSCompiler_inline_result;
	    ssrFormState = dispatchSetState.bind(
	      null,
	      currentlyRenderingFiber$1,
	      JSCompiler_inline_result
	    );
	    JSCompiler_inline_result.dispatch = ssrFormState;
	    JSCompiler_inline_result = mountStateImpl(false);
	    var setPendingState = dispatchOptimisticSetState.bind(
	      null,
	      currentlyRenderingFiber$1,
	      false,
	      JSCompiler_inline_result.queue
	    );
	    JSCompiler_inline_result = mountWorkInProgressHook();
	    markerInstance = {
	      state: initialStateProp,
	      dispatch: null,
	      action: action,
	      pending: null
	    };
	    JSCompiler_inline_result.queue = markerInstance;
	    ssrFormState = dispatchActionState.bind(
	      null,
	      currentlyRenderingFiber$1,
	      markerInstance,
	      setPendingState,
	      ssrFormState
	    );
	    markerInstance.dispatch = ssrFormState;
	    JSCompiler_inline_result.memoizedState = action;
	    return [initialStateProp, ssrFormState, false];
	  }
	  function updateActionState(action) {
	    var stateHook = updateWorkInProgressHook();
	    return updateActionStateImpl(stateHook, currentHook, action);
	  }
	  function updateActionStateImpl(stateHook, currentStateHook, action) {
	    currentStateHook = updateReducerImpl(
	      stateHook,
	      currentStateHook,
	      actionStateReducer
	    )[0];
	    stateHook = updateReducer(basicStateReducer)[0];
	    currentStateHook =
	      "object" === typeof currentStateHook &&
	      null !== currentStateHook &&
	      "function" === typeof currentStateHook.then
	        ? useThenable(currentStateHook)
	        : currentStateHook;
	    var actionQueueHook = updateWorkInProgressHook(),
	      actionQueue = actionQueueHook.queue,
	      dispatch = actionQueue.dispatch;
	    action !== actionQueueHook.memoizedState &&
	      ((currentlyRenderingFiber$1.flags |= 2048),
	      pushEffect(
	        9,
	        actionStateActionEffect.bind(null, actionQueue, action),
	        { destroy: undefined },
	        null
	      ));
	    return [currentStateHook, dispatch, stateHook];
	  }
	  function actionStateActionEffect(actionQueue, action) {
	    actionQueue.action = action;
	  }
	  function rerenderActionState(action) {
	    var stateHook = updateWorkInProgressHook(),
	      currentStateHook = currentHook;
	    if (null !== currentStateHook)
	      return updateActionStateImpl(stateHook, currentStateHook, action);
	    updateWorkInProgressHook();
	    stateHook = stateHook.memoizedState;
	    currentStateHook = updateWorkInProgressHook();
	    var dispatch = currentStateHook.queue.dispatch;
	    currentStateHook.memoizedState = action;
	    return [stateHook, dispatch, false];
	  }
	  function pushEffect(tag, create, inst, deps) {
	    tag = { tag: tag, create: create, inst: inst, deps: deps, next: null };
	    create = currentlyRenderingFiber$1.updateQueue;
	    null === create &&
	      ((create = createFunctionComponentUpdateQueue()),
	      (currentlyRenderingFiber$1.updateQueue = create));
	    inst = create.lastEffect;
	    null === inst
	      ? (create.lastEffect = tag.next = tag)
	      : ((deps = inst.next),
	        (inst.next = tag),
	        (tag.next = deps),
	        (create.lastEffect = tag));
	    return tag;
	  }
	  function updateRef() {
	    return updateWorkInProgressHook().memoizedState;
	  }
	  function mountEffectImpl(fiberFlags, hookFlags, create, deps) {
	    var hook = mountWorkInProgressHook();
	    currentlyRenderingFiber$1.flags |= fiberFlags;
	    hook.memoizedState = pushEffect(
	      1 | hookFlags,
	      create,
	      { destroy: undefined },
	      undefined === deps ? null : deps
	    );
	  }
	  function updateEffectImpl(fiberFlags, hookFlags, create, deps) {
	    var hook = updateWorkInProgressHook();
	    deps = undefined === deps ? null : deps;
	    var inst = hook.memoizedState.inst;
	    null !== currentHook &&
	    null !== deps &&
	    areHookInputsEqual(deps, currentHook.memoizedState.deps)
	      ? (hook.memoizedState = pushEffect(hookFlags, create, inst, deps))
	      : ((currentlyRenderingFiber$1.flags |= fiberFlags),
	        (hook.memoizedState = pushEffect(1 | hookFlags, create, inst, deps)));
	  }
	  function mountEffect(create, deps) {
	    mountEffectImpl(8390656, 8, create, deps);
	  }
	  function updateEffect(create, deps) {
	    updateEffectImpl(2048, 8, create, deps);
	  }
	  function updateInsertionEffect(create, deps) {
	    return updateEffectImpl(4, 2, create, deps);
	  }
	  function updateLayoutEffect(create, deps) {
	    return updateEffectImpl(4, 4, create, deps);
	  }
	  function imperativeHandleEffect(create, ref) {
	    if ("function" === typeof ref) {
	      create = create();
	      var refCleanup = ref(create);
	      return function () {
	        "function" === typeof refCleanup ? refCleanup() : ref(null);
	      };
	    }
	    if (null !== ref && undefined !== ref)
	      return (
	        (create = create()),
	        (ref.current = create),
	        function () {
	          ref.current = null;
	        }
	      );
	  }
	  function updateImperativeHandle(ref, create, deps) {
	    deps = null !== deps && undefined !== deps ? deps.concat([ref]) : null;
	    updateEffectImpl(
	      4,
	      4,
	      imperativeHandleEffect.bind(null, create, ref),
	      deps
	    );
	  }
	  function mountDebugValue() {}
	  function updateCallback(callback, deps) {
	    var hook = updateWorkInProgressHook();
	    deps = undefined === deps ? null : deps;
	    var prevState = hook.memoizedState;
	    if (null !== deps && areHookInputsEqual(deps, prevState[1]))
	      return prevState[0];
	    hook.memoizedState = [callback, deps];
	    return callback;
	  }
	  function updateMemo(nextCreate, deps) {
	    var hook = updateWorkInProgressHook();
	    deps = undefined === deps ? null : deps;
	    var prevState = hook.memoizedState;
	    if (null !== deps && areHookInputsEqual(deps, prevState[1]))
	      return prevState[0];
	    prevState = nextCreate();
	    if (shouldDoubleInvokeUserFnsInHooksDEV) {
	      setIsStrictModeForDevtools(true);
	      try {
	        nextCreate();
	      } finally {
	        setIsStrictModeForDevtools(false);
	      }
	    }
	    hook.memoizedState = [prevState, deps];
	    return prevState;
	  }
	  function mountDeferredValueImpl(hook, value, initialValue) {
	    if (undefined === initialValue || 0 !== (renderLanes & 1073741824))
	      return (hook.memoizedState = value);
	    hook.memoizedState = initialValue;
	    hook = requestDeferredLane();
	    currentlyRenderingFiber$1.lanes |= hook;
	    workInProgressRootSkippedLanes |= hook;
	    return initialValue;
	  }
	  function updateDeferredValueImpl(hook, prevValue, value, initialValue) {
	    if (objectIs(value, prevValue)) return value;
	    if (null !== currentTreeHiddenStackCursor.current)
	      return (
	        (hook = mountDeferredValueImpl(hook, value, initialValue)),
	        objectIs(hook, prevValue) || (didReceiveUpdate = true),
	        hook
	      );
	    if (0 === (renderLanes & 42))
	      return (didReceiveUpdate = true), (hook.memoizedState = value);
	    hook = requestDeferredLane();
	    currentlyRenderingFiber$1.lanes |= hook;
	    workInProgressRootSkippedLanes |= hook;
	    return prevValue;
	  }
	  function startTransition(
	    fiber,
	    queue,
	    pendingState,
	    finishedState,
	    callback
	  ) {
	    var previousPriority = getCurrentUpdatePriority();
	    setCurrentUpdatePriority(
	      0 !== previousPriority && 8 > previousPriority ? previousPriority : 8
	    );
	    var prevTransition = ReactSharedInternals.T,
	      currentTransition = {};
	    ReactSharedInternals.T = currentTransition;
	    dispatchOptimisticSetState(fiber, false, queue, pendingState);
	    try {
	      var returnValue = callback(),
	        onStartTransitionFinish = ReactSharedInternals.S;
	      null !== onStartTransitionFinish &&
	        onStartTransitionFinish(currentTransition, returnValue);
	      if (
	        null !== returnValue &&
	        "object" === typeof returnValue &&
	        "function" === typeof returnValue.then
	      ) {
	        var thenableForFinishedState = chainThenableValue(
	          returnValue,
	          finishedState
	        );
	        dispatchSetStateInternal(
	          fiber,
	          queue,
	          thenableForFinishedState,
	          requestUpdateLane(fiber)
	        );
	      } else
	        dispatchSetStateInternal(
	          fiber,
	          queue,
	          finishedState,
	          requestUpdateLane(fiber)
	        );
	    } catch (error) {
	      dispatchSetStateInternal(
	        fiber,
	        queue,
	        { then: function () {}, status: "rejected", reason: error },
	        requestUpdateLane()
	      );
	    } finally {
	      setCurrentUpdatePriority(previousPriority),
	        (ReactSharedInternals.T = prevTransition);
	    }
	  }
	  function ensureFormComponentIsStateful(formFiber) {
	    var existingStateHook = formFiber.memoizedState;
	    if (null !== existingStateHook) return existingStateHook;
	    existingStateHook = {
	      memoizedState: NotPendingTransition,
	      baseState: NotPendingTransition,
	      baseQueue: null,
	      queue: {
	        pending: null,
	        lanes: 0,
	        dispatch: null,
	        lastRenderedReducer: basicStateReducer,
	        lastRenderedState: NotPendingTransition
	      },
	      next: null
	    };
	    var initialResetState = {};
	    existingStateHook.next = {
	      memoizedState: initialResetState,
	      baseState: initialResetState,
	      baseQueue: null,
	      queue: {
	        pending: null,
	        lanes: 0,
	        dispatch: null,
	        lastRenderedReducer: basicStateReducer,
	        lastRenderedState: initialResetState
	      },
	      next: null
	    };
	    formFiber.memoizedState = existingStateHook;
	    formFiber = formFiber.alternate;
	    null !== formFiber && (formFiber.memoizedState = existingStateHook);
	    return existingStateHook;
	  }
	  function useHostTransitionStatus() {
	    return readContext(HostTransitionContext);
	  }
	  function updateId() {
	    return updateWorkInProgressHook().memoizedState;
	  }
	  function updateRefresh() {
	    return updateWorkInProgressHook().memoizedState;
	  }
	  function refreshCache(fiber) {
	    for (var provider = fiber.return; null !== provider; ) {
	      switch (provider.tag) {
	        case 24:
	        case 3:
	          var lane = requestUpdateLane();
	          fiber = createUpdate(lane);
	          var root = enqueueUpdate(provider, fiber, lane);
	          null !== root &&
	            (scheduleUpdateOnFiber(root, provider, lane),
	            entangleTransitions(root, provider, lane));
	          provider = { cache: createCache() };
	          fiber.payload = provider;
	          return;
	      }
	      provider = provider.return;
	    }
	  }
	  function dispatchReducerAction(fiber, queue, action) {
	    var lane = requestUpdateLane();
	    action = {
	      lane: lane,
	      revertLane: 0,
	      action: action,
	      hasEagerState: false,
	      eagerState: null,
	      next: null
	    };
	    isRenderPhaseUpdate(fiber)
	      ? enqueueRenderPhaseUpdate(queue, action)
	      : ((action = enqueueConcurrentHookUpdate(fiber, queue, action, lane)),
	        null !== action &&
	          (scheduleUpdateOnFiber(action, fiber, lane),
	          entangleTransitionUpdate(action, queue, lane)));
	  }
	  function dispatchSetState(fiber, queue, action) {
	    var lane = requestUpdateLane();
	    dispatchSetStateInternal(fiber, queue, action, lane);
	  }
	  function dispatchSetStateInternal(fiber, queue, action, lane) {
	    var update = {
	      lane: lane,
	      revertLane: 0,
	      action: action,
	      hasEagerState: false,
	      eagerState: null,
	      next: null
	    };
	    if (isRenderPhaseUpdate(fiber)) enqueueRenderPhaseUpdate(queue, update);
	    else {
	      var alternate = fiber.alternate;
	      if (
	        0 === fiber.lanes &&
	        (null === alternate || 0 === alternate.lanes) &&
	        ((alternate = queue.lastRenderedReducer), null !== alternate)
	      )
	        try {
	          var currentState = queue.lastRenderedState,
	            eagerState = alternate(currentState, action);
	          update.hasEagerState = !0;
	          update.eagerState = eagerState;
	          if (objectIs(eagerState, currentState))
	            return (
	              enqueueUpdate$1(fiber, queue, update, 0),
	              null === workInProgressRoot && finishQueueingConcurrentUpdates(),
	              !1
	            );
	        } catch (error) {
	        } finally {
	        }
	      action = enqueueConcurrentHookUpdate(fiber, queue, update, lane);
	      if (null !== action)
	        return (
	          scheduleUpdateOnFiber(action, fiber, lane),
	          entangleTransitionUpdate(action, queue, lane),
	          true
	        );
	    }
	    return false;
	  }
	  function dispatchOptimisticSetState(
	    fiber,
	    throwIfDuringRender,
	    queue,
	    action
	  ) {
	    action = {
	      lane: 2,
	      revertLane: requestTransitionLane(),
	      action: action,
	      hasEagerState: false,
	      eagerState: null,
	      next: null
	    };
	    if (isRenderPhaseUpdate(fiber)) {
	      if (throwIfDuringRender) throw Error(formatProdErrorMessage(479));
	    } else
	      (throwIfDuringRender = enqueueConcurrentHookUpdate(
	        fiber,
	        queue,
	        action,
	        2
	      )),
	        null !== throwIfDuringRender &&
	          scheduleUpdateOnFiber(throwIfDuringRender, fiber, 2);
	  }
	  function isRenderPhaseUpdate(fiber) {
	    var alternate = fiber.alternate;
	    return (
	      fiber === currentlyRenderingFiber$1 ||
	      (null !== alternate && alternate === currentlyRenderingFiber$1)
	    );
	  }
	  function enqueueRenderPhaseUpdate(queue, update) {
	    didScheduleRenderPhaseUpdateDuringThisPass = didScheduleRenderPhaseUpdate =
	      true;
	    var pending = queue.pending;
	    null === pending
	      ? (update.next = update)
	      : ((update.next = pending.next), (pending.next = update));
	    queue.pending = update;
	  }
	  function entangleTransitionUpdate(root, queue, lane) {
	    if (0 !== (lane & 4194176)) {
	      var queueLanes = queue.lanes;
	      queueLanes &= root.pendingLanes;
	      lane |= queueLanes;
	      queue.lanes = lane;
	      markRootEntangled(root, lane);
	    }
	  }
	  function applyDerivedStateFromProps(
	    workInProgress,
	    ctor,
	    getDerivedStateFromProps,
	    nextProps
	  ) {
	    ctor = workInProgress.memoizedState;
	    getDerivedStateFromProps = getDerivedStateFromProps(nextProps, ctor);
	    getDerivedStateFromProps =
	      null === getDerivedStateFromProps || undefined === getDerivedStateFromProps
	        ? ctor
	        : assign({}, ctor, getDerivedStateFromProps);
	    workInProgress.memoizedState = getDerivedStateFromProps;
	    0 === workInProgress.lanes &&
	      (workInProgress.updateQueue.baseState = getDerivedStateFromProps);
	  }
	  function checkShouldComponentUpdate(
	    workInProgress,
	    ctor,
	    oldProps,
	    newProps,
	    oldState,
	    newState,
	    nextContext
	  ) {
	    workInProgress = workInProgress.stateNode;
	    return "function" === typeof workInProgress.shouldComponentUpdate
	      ? workInProgress.shouldComponentUpdate(newProps, newState, nextContext)
	      : ctor.prototype && ctor.prototype.isPureReactComponent
	        ? !shallowEqual(oldProps, newProps) || !shallowEqual(oldState, newState)
	        : true;
	  }
	  function callComponentWillReceiveProps(
	    workInProgress,
	    instance,
	    newProps,
	    nextContext
	  ) {
	    workInProgress = instance.state;
	    "function" === typeof instance.componentWillReceiveProps &&
	      instance.componentWillReceiveProps(newProps, nextContext);
	    "function" === typeof instance.UNSAFE_componentWillReceiveProps &&
	      instance.UNSAFE_componentWillReceiveProps(newProps, nextContext);
	    instance.state !== workInProgress &&
	      classComponentUpdater.enqueueReplaceState(instance, instance.state, null);
	  }
	  function resolveClassComponentProps(Component, baseProps) {
	    var newProps = baseProps;
	    if ("ref" in baseProps) {
	      newProps = {};
	      for (var propName in baseProps)
	        "ref" !== propName && (newProps[propName] = baseProps[propName]);
	    }
	    if ((Component = Component.defaultProps)) {
	      newProps === baseProps && (newProps = assign({}, newProps));
	      for (var propName$54 in Component)
	        undefined === newProps[propName$54] &&
	          (newProps[propName$54] = Component[propName$54]);
	    }
	    return newProps;
	  }
	  function logUncaughtError(root, errorInfo) {
	    try {
	      var onUncaughtError = root.onUncaughtError;
	      onUncaughtError(errorInfo.value, { componentStack: errorInfo.stack });
	    } catch (e) {
	      setTimeout(function () {
	        throw e;
	      });
	    }
	  }
	  function logCaughtError(root, boundary, errorInfo) {
	    try {
	      var onCaughtError = root.onCaughtError;
	      onCaughtError(errorInfo.value, {
	        componentStack: errorInfo.stack,
	        errorBoundary: 1 === boundary.tag ? boundary.stateNode : null
	      });
	    } catch (e) {
	      setTimeout(function () {
	        throw e;
	      });
	    }
	  }
	  function createRootErrorUpdate(root, errorInfo, lane) {
	    lane = createUpdate(lane);
	    lane.tag = 3;
	    lane.payload = { element: null };
	    lane.callback = function () {
	      logUncaughtError(root, errorInfo);
	    };
	    return lane;
	  }
	  function createClassErrorUpdate(lane) {
	    lane = createUpdate(lane);
	    lane.tag = 3;
	    return lane;
	  }
	  function initializeClassErrorUpdate(update, root, fiber, errorInfo) {
	    var getDerivedStateFromError = fiber.type.getDerivedStateFromError;
	    if ("function" === typeof getDerivedStateFromError) {
	      var error = errorInfo.value;
	      update.payload = function () {
	        return getDerivedStateFromError(error);
	      };
	      update.callback = function () {
	        logCaughtError(root, fiber, errorInfo);
	      };
	    }
	    var inst = fiber.stateNode;
	    null !== inst &&
	      "function" === typeof inst.componentDidCatch &&
	      (update.callback = function () {
	        logCaughtError(root, fiber, errorInfo);
	        "function" !== typeof getDerivedStateFromError &&
	          (null === legacyErrorBoundariesThatAlreadyFailed
	            ? (legacyErrorBoundariesThatAlreadyFailed = new Set([this]))
	            : legacyErrorBoundariesThatAlreadyFailed.add(this));
	        var stack = errorInfo.stack;
	        this.componentDidCatch(errorInfo.value, {
	          componentStack: null !== stack ? stack : ""
	        });
	      });
	  }
	  function throwException(
	    root,
	    returnFiber,
	    sourceFiber,
	    value,
	    rootRenderLanes
	  ) {
	    sourceFiber.flags |= 32768;
	    if (
	      null !== value &&
	      "object" === typeof value &&
	      "function" === typeof value.then
	    ) {
	      returnFiber = sourceFiber.alternate;
	      null !== returnFiber &&
	        propagateParentContextChanges(
	          returnFiber,
	          sourceFiber,
	          rootRenderLanes,
	          true
	        );
	      sourceFiber = suspenseHandlerStackCursor.current;
	      if (null !== sourceFiber) {
	        switch (sourceFiber.tag) {
	          case 13:
	            return (
	              null === shellBoundary
	                ? renderDidSuspendDelayIfPossible()
	                : null === sourceFiber.alternate &&
	                  0 === workInProgressRootExitStatus &&
	                  (workInProgressRootExitStatus = 3),
	              (sourceFiber.flags &= -257),
	              (sourceFiber.flags |= 65536),
	              (sourceFiber.lanes = rootRenderLanes),
	              value === noopSuspenseyCommitThenable
	                ? (sourceFiber.flags |= 16384)
	                : ((returnFiber = sourceFiber.updateQueue),
	                  null === returnFiber
	                    ? (sourceFiber.updateQueue = new Set([value]))
	                    : returnFiber.add(value),
	                  attachPingListener(root, value, rootRenderLanes)),
	              false
	            );
	          case 22:
	            return (
	              (sourceFiber.flags |= 65536),
	              value === noopSuspenseyCommitThenable
	                ? (sourceFiber.flags |= 16384)
	                : ((returnFiber = sourceFiber.updateQueue),
	                  null === returnFiber
	                    ? ((returnFiber = {
	                        transitions: null,
	                        markerInstances: null,
	                        retryQueue: new Set([value])
	                      }),
	                      (sourceFiber.updateQueue = returnFiber))
	                    : ((sourceFiber = returnFiber.retryQueue),
	                      null === sourceFiber
	                        ? (returnFiber.retryQueue = new Set([value]))
	                        : sourceFiber.add(value)),
	                  attachPingListener(root, value, rootRenderLanes)),
	              false
	            );
	        }
	        throw Error(formatProdErrorMessage(435, sourceFiber.tag));
	      }
	      attachPingListener(root, value, rootRenderLanes);
	      renderDidSuspendDelayIfPossible();
	      return false;
	    }
	    if (isHydrating)
	      return (
	        (returnFiber = suspenseHandlerStackCursor.current),
	        null !== returnFiber
	          ? (0 === (returnFiber.flags & 65536) && (returnFiber.flags |= 256),
	            (returnFiber.flags |= 65536),
	            (returnFiber.lanes = rootRenderLanes),
	            value !== HydrationMismatchException &&
	              ((root = Error(formatProdErrorMessage(422), { cause: value })),
	              queueHydrationError(
	                createCapturedValueAtFiber(root, sourceFiber)
	              )))
	          : (value !== HydrationMismatchException &&
	              ((returnFiber = Error(formatProdErrorMessage(423), {
	                cause: value
	              })),
	              queueHydrationError(
	                createCapturedValueAtFiber(returnFiber, sourceFiber)
	              )),
	            (root = root.current.alternate),
	            (root.flags |= 65536),
	            (rootRenderLanes &= -rootRenderLanes),
	            (root.lanes |= rootRenderLanes),
	            (value = createCapturedValueAtFiber(value, sourceFiber)),
	            (rootRenderLanes = createRootErrorUpdate(
	              root.stateNode,
	              value,
	              rootRenderLanes
	            )),
	            enqueueCapturedUpdate(root, rootRenderLanes),
	            4 !== workInProgressRootExitStatus &&
	              (workInProgressRootExitStatus = 2)),
	        false
	      );
	    var wrapperError = Error(formatProdErrorMessage(520), { cause: value });
	    wrapperError = createCapturedValueAtFiber(wrapperError, sourceFiber);
	    null === workInProgressRootConcurrentErrors
	      ? (workInProgressRootConcurrentErrors = [wrapperError])
	      : workInProgressRootConcurrentErrors.push(wrapperError);
	    4 !== workInProgressRootExitStatus && (workInProgressRootExitStatus = 2);
	    if (null === returnFiber) return true;
	    value = createCapturedValueAtFiber(value, sourceFiber);
	    sourceFiber = returnFiber;
	    do {
	      switch (sourceFiber.tag) {
	        case 3:
	          return (
	            (sourceFiber.flags |= 65536),
	            (root = rootRenderLanes & -rootRenderLanes),
	            (sourceFiber.lanes |= root),
	            (root = createRootErrorUpdate(sourceFiber.stateNode, value, root)),
	            enqueueCapturedUpdate(sourceFiber, root),
	            false
	          );
	        case 1:
	          if (
	            ((returnFiber = sourceFiber.type),
	            (wrapperError = sourceFiber.stateNode),
	            0 === (sourceFiber.flags & 128) &&
	              ("function" === typeof returnFiber.getDerivedStateFromError ||
	                (null !== wrapperError &&
	                  "function" === typeof wrapperError.componentDidCatch &&
	                  (null === legacyErrorBoundariesThatAlreadyFailed ||
	                    !legacyErrorBoundariesThatAlreadyFailed.has(
	                      wrapperError
	                    )))))
	          )
	            return (
	              (sourceFiber.flags |= 65536),
	              (rootRenderLanes &= -rootRenderLanes),
	              (sourceFiber.lanes |= rootRenderLanes),
	              (rootRenderLanes = createClassErrorUpdate(rootRenderLanes)),
	              initializeClassErrorUpdate(
	                rootRenderLanes,
	                root,
	                sourceFiber,
	                value
	              ),
	              enqueueCapturedUpdate(sourceFiber, rootRenderLanes),
	              false
	            );
	      }
	      sourceFiber = sourceFiber.return;
	    } while (null !== sourceFiber);
	    return false;
	  }
	  function reconcileChildren(
	    current,
	    workInProgress,
	    nextChildren,
	    renderLanes
	  ) {
	    workInProgress.child =
	      null === current
	        ? mountChildFibers(workInProgress, null, nextChildren, renderLanes)
	        : reconcileChildFibers(
	            workInProgress,
	            current.child,
	            nextChildren,
	            renderLanes
	          );
	  }
	  function updateForwardRef(
	    current,
	    workInProgress,
	    Component,
	    nextProps,
	    renderLanes
	  ) {
	    Component = Component.render;
	    var ref = workInProgress.ref;
	    if ("ref" in nextProps) {
	      var propsWithoutRef = {};
	      for (var key in nextProps)
	        "ref" !== key && (propsWithoutRef[key] = nextProps[key]);
	    } else propsWithoutRef = nextProps;
	    prepareToReadContext(workInProgress);
	    nextProps = renderWithHooks(
	      current,
	      workInProgress,
	      Component,
	      propsWithoutRef,
	      ref,
	      renderLanes
	    );
	    key = checkDidRenderIdHook();
	    if (null !== current && !didReceiveUpdate)
	      return (
	        bailoutHooks(current, workInProgress, renderLanes),
	        bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes)
	      );
	    isHydrating && key && pushMaterializedTreeId(workInProgress);
	    workInProgress.flags |= 1;
	    reconcileChildren(current, workInProgress, nextProps, renderLanes);
	    return workInProgress.child;
	  }
	  function updateMemoComponent(
	    current,
	    workInProgress,
	    Component,
	    nextProps,
	    renderLanes
	  ) {
	    if (null === current) {
	      var type = Component.type;
	      if (
	        "function" === typeof type &&
	        !shouldConstruct(type) &&
	        undefined === type.defaultProps &&
	        null === Component.compare
	      )
	        return (
	          (workInProgress.tag = 15),
	          (workInProgress.type = type),
	          updateSimpleMemoComponent(
	            current,
	            workInProgress,
	            type,
	            nextProps,
	            renderLanes
	          )
	        );
	      current = createFiberFromTypeAndProps(
	        Component.type,
	        null,
	        nextProps,
	        workInProgress,
	        workInProgress.mode,
	        renderLanes
	      );
	      current.ref = workInProgress.ref;
	      current.return = workInProgress;
	      return (workInProgress.child = current);
	    }
	    type = current.child;
	    if (!checkScheduledUpdateOrContext(current, renderLanes)) {
	      var prevProps = type.memoizedProps;
	      Component = Component.compare;
	      Component = null !== Component ? Component : shallowEqual;
	      if (Component(prevProps, nextProps) && current.ref === workInProgress.ref)
	        return bailoutOnAlreadyFinishedWork(
	          current,
	          workInProgress,
	          renderLanes
	        );
	    }
	    workInProgress.flags |= 1;
	    current = createWorkInProgress(type, nextProps);
	    current.ref = workInProgress.ref;
	    current.return = workInProgress;
	    return (workInProgress.child = current);
	  }
	  function updateSimpleMemoComponent(
	    current,
	    workInProgress,
	    Component,
	    nextProps,
	    renderLanes
	  ) {
	    if (null !== current) {
	      var prevProps = current.memoizedProps;
	      if (
	        shallowEqual(prevProps, nextProps) &&
	        current.ref === workInProgress.ref
	      )
	        if (
	          ((didReceiveUpdate = false),
	          (workInProgress.pendingProps = nextProps = prevProps),
	          checkScheduledUpdateOrContext(current, renderLanes))
	        )
	          0 !== (current.flags & 131072) && (didReceiveUpdate = true);
	        else
	          return (
	            (workInProgress.lanes = current.lanes),
	            bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes)
	          );
	    }
	    return updateFunctionComponent(
	      current,
	      workInProgress,
	      Component,
	      nextProps,
	      renderLanes
	    );
	  }
	  function updateOffscreenComponent(current, workInProgress, renderLanes) {
	    var nextProps = workInProgress.pendingProps,
	      nextChildren = nextProps.children,
	      nextIsDetached = 0 !== (workInProgress.stateNode._pendingVisibility & 2),
	      prevState = null !== current ? current.memoizedState : null;
	    markRef(current, workInProgress);
	    if ("hidden" === nextProps.mode || nextIsDetached) {
	      if (0 !== (workInProgress.flags & 128)) {
	        nextProps =
	          null !== prevState ? prevState.baseLanes | renderLanes : renderLanes;
	        if (null !== current) {
	          nextChildren = workInProgress.child = current.child;
	          for (nextIsDetached = 0; null !== nextChildren; )
	            (nextIsDetached =
	              nextIsDetached | nextChildren.lanes | nextChildren.childLanes),
	              (nextChildren = nextChildren.sibling);
	          workInProgress.childLanes = nextIsDetached & ~nextProps;
	        } else (workInProgress.childLanes = 0), (workInProgress.child = null);
	        return deferHiddenOffscreenComponent(
	          current,
	          workInProgress,
	          nextProps,
	          renderLanes
	        );
	      }
	      if (0 !== (renderLanes & 536870912))
	        (workInProgress.memoizedState = { baseLanes: 0, cachePool: null }),
	          null !== current &&
	            pushTransition(
	              workInProgress,
	              null !== prevState ? prevState.cachePool : null
	            ),
	          null !== prevState
	            ? pushHiddenContext(workInProgress, prevState)
	            : reuseHiddenContextOnStack(),
	          pushOffscreenSuspenseHandler(workInProgress);
	      else
	        return (
	          (workInProgress.lanes = workInProgress.childLanes = 536870912),
	          deferHiddenOffscreenComponent(
	            current,
	            workInProgress,
	            null !== prevState
	              ? prevState.baseLanes | renderLanes
	              : renderLanes,
	            renderLanes
	          )
	        );
	    } else
	      null !== prevState
	        ? (pushTransition(workInProgress, prevState.cachePool),
	          pushHiddenContext(workInProgress, prevState),
	          reuseSuspenseHandlerOnStack(),
	          (workInProgress.memoizedState = null))
	        : (null !== current && pushTransition(workInProgress, null),
	          reuseHiddenContextOnStack(),
	          reuseSuspenseHandlerOnStack());
	    reconcileChildren(current, workInProgress, nextChildren, renderLanes);
	    return workInProgress.child;
	  }
	  function deferHiddenOffscreenComponent(
	    current,
	    workInProgress,
	    nextBaseLanes,
	    renderLanes
	  ) {
	    var JSCompiler_inline_result = peekCacheFromPool();
	    JSCompiler_inline_result =
	      null === JSCompiler_inline_result
	        ? null
	        : {
	            parent: isPrimaryRenderer
	              ? CacheContext._currentValue
	              : CacheContext._currentValue2,
	            pool: JSCompiler_inline_result
	          };
	    workInProgress.memoizedState = {
	      baseLanes: nextBaseLanes,
	      cachePool: JSCompiler_inline_result
	    };
	    null !== current && pushTransition(workInProgress, null);
	    reuseHiddenContextOnStack();
	    pushOffscreenSuspenseHandler(workInProgress);
	    null !== current &&
	      propagateParentContextChanges(current, workInProgress, renderLanes, true);
	    return null;
	  }
	  function markRef(current, workInProgress) {
	    var ref = workInProgress.ref;
	    if (null === ref)
	      null !== current &&
	        null !== current.ref &&
	        (workInProgress.flags |= 2097664);
	    else {
	      if ("function" !== typeof ref && "object" !== typeof ref)
	        throw Error(formatProdErrorMessage(284));
	      if (null === current || current.ref !== ref)
	        workInProgress.flags |= 2097664;
	    }
	  }
	  function updateFunctionComponent(
	    current,
	    workInProgress,
	    Component,
	    nextProps,
	    renderLanes
	  ) {
	    prepareToReadContext(workInProgress);
	    Component = renderWithHooks(
	      current,
	      workInProgress,
	      Component,
	      nextProps,
	      undefined,
	      renderLanes
	    );
	    nextProps = checkDidRenderIdHook();
	    if (null !== current && !didReceiveUpdate)
	      return (
	        bailoutHooks(current, workInProgress, renderLanes),
	        bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes)
	      );
	    isHydrating && nextProps && pushMaterializedTreeId(workInProgress);
	    workInProgress.flags |= 1;
	    reconcileChildren(current, workInProgress, Component, renderLanes);
	    return workInProgress.child;
	  }
	  function replayFunctionComponent(
	    current,
	    workInProgress,
	    nextProps,
	    Component,
	    secondArg,
	    renderLanes
	  ) {
	    prepareToReadContext(workInProgress);
	    workInProgress.updateQueue = null;
	    nextProps = renderWithHooksAgain(
	      workInProgress,
	      Component,
	      nextProps,
	      secondArg
	    );
	    finishRenderingHooks(current);
	    Component = checkDidRenderIdHook();
	    if (null !== current && !didReceiveUpdate)
	      return (
	        bailoutHooks(current, workInProgress, renderLanes),
	        bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes)
	      );
	    isHydrating && Component && pushMaterializedTreeId(workInProgress);
	    workInProgress.flags |= 1;
	    reconcileChildren(current, workInProgress, nextProps, renderLanes);
	    return workInProgress.child;
	  }
	  function updateClassComponent(
	    current,
	    workInProgress,
	    Component,
	    nextProps,
	    renderLanes
	  ) {
	    prepareToReadContext(workInProgress);
	    if (null === workInProgress.stateNode) {
	      var context = emptyContextObject,
	        contextType = Component.contextType;
	      "object" === typeof contextType &&
	        null !== contextType &&
	        (context = readContext(contextType));
	      context = new Component(nextProps, context);
	      workInProgress.memoizedState =
	        null !== context.state && undefined !== context.state
	          ? context.state
	          : null;
	      context.updater = classComponentUpdater;
	      workInProgress.stateNode = context;
	      context._reactInternals = workInProgress;
	      context = workInProgress.stateNode;
	      context.props = nextProps;
	      context.state = workInProgress.memoizedState;
	      context.refs = {};
	      initializeUpdateQueue(workInProgress);
	      contextType = Component.contextType;
	      context.context =
	        "object" === typeof contextType && null !== contextType
	          ? readContext(contextType)
	          : emptyContextObject;
	      context.state = workInProgress.memoizedState;
	      contextType = Component.getDerivedStateFromProps;
	      "function" === typeof contextType &&
	        (applyDerivedStateFromProps(
	          workInProgress,
	          Component,
	          contextType,
	          nextProps
	        ),
	        (context.state = workInProgress.memoizedState));
	      "function" === typeof Component.getDerivedStateFromProps ||
	        "function" === typeof context.getSnapshotBeforeUpdate ||
	        ("function" !== typeof context.UNSAFE_componentWillMount &&
	          "function" !== typeof context.componentWillMount) ||
	        ((contextType = context.state),
	        "function" === typeof context.componentWillMount &&
	          context.componentWillMount(),
	        "function" === typeof context.UNSAFE_componentWillMount &&
	          context.UNSAFE_componentWillMount(),
	        contextType !== context.state &&
	          classComponentUpdater.enqueueReplaceState(
	            context,
	            context.state,
	            null
	          ),
	        processUpdateQueue(workInProgress, nextProps, context, renderLanes),
	        suspendIfUpdateReadFromEntangledAsyncAction(),
	        (context.state = workInProgress.memoizedState));
	      "function" === typeof context.componentDidMount &&
	        (workInProgress.flags |= 4194308);
	      nextProps = true;
	    } else if (null === current) {
	      context = workInProgress.stateNode;
	      var unresolvedOldProps = workInProgress.memoizedProps,
	        oldProps = resolveClassComponentProps(Component, unresolvedOldProps);
	      context.props = oldProps;
	      var oldContext = context.context,
	        contextType$jscomp$0 = Component.contextType;
	      contextType = emptyContextObject;
	      "object" === typeof contextType$jscomp$0 &&
	        null !== contextType$jscomp$0 &&
	        (contextType = readContext(contextType$jscomp$0));
	      var getDerivedStateFromProps = Component.getDerivedStateFromProps;
	      contextType$jscomp$0 =
	        "function" === typeof getDerivedStateFromProps ||
	        "function" === typeof context.getSnapshotBeforeUpdate;
	      unresolvedOldProps = workInProgress.pendingProps !== unresolvedOldProps;
	      contextType$jscomp$0 ||
	        ("function" !== typeof context.UNSAFE_componentWillReceiveProps &&
	          "function" !== typeof context.componentWillReceiveProps) ||
	        ((unresolvedOldProps || oldContext !== contextType) &&
	          callComponentWillReceiveProps(
	            workInProgress,
	            context,
	            nextProps,
	            contextType
	          ));
	      hasForceUpdate = false;
	      var oldState = workInProgress.memoizedState;
	      context.state = oldState;
	      processUpdateQueue(workInProgress, nextProps, context, renderLanes);
	      suspendIfUpdateReadFromEntangledAsyncAction();
	      oldContext = workInProgress.memoizedState;
	      unresolvedOldProps || oldState !== oldContext || hasForceUpdate
	        ? ("function" === typeof getDerivedStateFromProps &&
	            (applyDerivedStateFromProps(
	              workInProgress,
	              Component,
	              getDerivedStateFromProps,
	              nextProps
	            ),
	            (oldContext = workInProgress.memoizedState)),
	          (oldProps =
	            hasForceUpdate ||
	            checkShouldComponentUpdate(
	              workInProgress,
	              Component,
	              oldProps,
	              nextProps,
	              oldState,
	              oldContext,
	              contextType
	            ))
	            ? (contextType$jscomp$0 ||
	                ("function" !== typeof context.UNSAFE_componentWillMount &&
	                  "function" !== typeof context.componentWillMount) ||
	                ("function" === typeof context.componentWillMount &&
	                  context.componentWillMount(),
	                "function" === typeof context.UNSAFE_componentWillMount &&
	                  context.UNSAFE_componentWillMount()),
	              "function" === typeof context.componentDidMount &&
	                (workInProgress.flags |= 4194308))
	            : ("function" === typeof context.componentDidMount &&
	                (workInProgress.flags |= 4194308),
	              (workInProgress.memoizedProps = nextProps),
	              (workInProgress.memoizedState = oldContext)),
	          (context.props = nextProps),
	          (context.state = oldContext),
	          (context.context = contextType),
	          (nextProps = oldProps))
	        : ("function" === typeof context.componentDidMount &&
	            (workInProgress.flags |= 4194308),
	          (nextProps = false));
	    } else {
	      context = workInProgress.stateNode;
	      cloneUpdateQueue(current, workInProgress);
	      contextType = workInProgress.memoizedProps;
	      contextType$jscomp$0 = resolveClassComponentProps(Component, contextType);
	      context.props = contextType$jscomp$0;
	      getDerivedStateFromProps = workInProgress.pendingProps;
	      oldState = context.context;
	      oldContext = Component.contextType;
	      oldProps = emptyContextObject;
	      "object" === typeof oldContext &&
	        null !== oldContext &&
	        (oldProps = readContext(oldContext));
	      unresolvedOldProps = Component.getDerivedStateFromProps;
	      (oldContext =
	        "function" === typeof unresolvedOldProps ||
	        "function" === typeof context.getSnapshotBeforeUpdate) ||
	        ("function" !== typeof context.UNSAFE_componentWillReceiveProps &&
	          "function" !== typeof context.componentWillReceiveProps) ||
	        ((contextType !== getDerivedStateFromProps || oldState !== oldProps) &&
	          callComponentWillReceiveProps(
	            workInProgress,
	            context,
	            nextProps,
	            oldProps
	          ));
	      hasForceUpdate = false;
	      oldState = workInProgress.memoizedState;
	      context.state = oldState;
	      processUpdateQueue(workInProgress, nextProps, context, renderLanes);
	      suspendIfUpdateReadFromEntangledAsyncAction();
	      var newState = workInProgress.memoizedState;
	      contextType !== getDerivedStateFromProps ||
	      oldState !== newState ||
	      hasForceUpdate ||
	      (null !== current &&
	        null !== current.dependencies &&
	        checkIfContextChanged(current.dependencies))
	        ? ("function" === typeof unresolvedOldProps &&
	            (applyDerivedStateFromProps(
	              workInProgress,
	              Component,
	              unresolvedOldProps,
	              nextProps
	            ),
	            (newState = workInProgress.memoizedState)),
	          (contextType$jscomp$0 =
	            hasForceUpdate ||
	            checkShouldComponentUpdate(
	              workInProgress,
	              Component,
	              contextType$jscomp$0,
	              nextProps,
	              oldState,
	              newState,
	              oldProps
	            ) ||
	            (null !== current &&
	              null !== current.dependencies &&
	              checkIfContextChanged(current.dependencies)))
	            ? (oldContext ||
	                ("function" !== typeof context.UNSAFE_componentWillUpdate &&
	                  "function" !== typeof context.componentWillUpdate) ||
	                ("function" === typeof context.componentWillUpdate &&
	                  context.componentWillUpdate(nextProps, newState, oldProps),
	                "function" === typeof context.UNSAFE_componentWillUpdate &&
	                  context.UNSAFE_componentWillUpdate(
	                    nextProps,
	                    newState,
	                    oldProps
	                  )),
	              "function" === typeof context.componentDidUpdate &&
	                (workInProgress.flags |= 4),
	              "function" === typeof context.getSnapshotBeforeUpdate &&
	                (workInProgress.flags |= 1024))
	            : ("function" !== typeof context.componentDidUpdate ||
	                (contextType === current.memoizedProps &&
	                  oldState === current.memoizedState) ||
	                (workInProgress.flags |= 4),
	              "function" !== typeof context.getSnapshotBeforeUpdate ||
	                (contextType === current.memoizedProps &&
	                  oldState === current.memoizedState) ||
	                (workInProgress.flags |= 1024),
	              (workInProgress.memoizedProps = nextProps),
	              (workInProgress.memoizedState = newState)),
	          (context.props = nextProps),
	          (context.state = newState),
	          (context.context = oldProps),
	          (nextProps = contextType$jscomp$0))
	        : ("function" !== typeof context.componentDidUpdate ||
	            (contextType === current.memoizedProps &&
	              oldState === current.memoizedState) ||
	            (workInProgress.flags |= 4),
	          "function" !== typeof context.getSnapshotBeforeUpdate ||
	            (contextType === current.memoizedProps &&
	              oldState === current.memoizedState) ||
	            (workInProgress.flags |= 1024),
	          (nextProps = false));
	    }
	    context = nextProps;
	    markRef(current, workInProgress);
	    nextProps = 0 !== (workInProgress.flags & 128);
	    context || nextProps
	      ? ((context = workInProgress.stateNode),
	        (Component =
	          nextProps && "function" !== typeof Component.getDerivedStateFromError
	            ? null
	            : context.render()),
	        (workInProgress.flags |= 1),
	        null !== current && nextProps
	          ? ((workInProgress.child = reconcileChildFibers(
	              workInProgress,
	              current.child,
	              null,
	              renderLanes
	            )),
	            (workInProgress.child = reconcileChildFibers(
	              workInProgress,
	              null,
	              Component,
	              renderLanes
	            )))
	          : reconcileChildren(current, workInProgress, Component, renderLanes),
	        (workInProgress.memoizedState = context.state),
	        (current = workInProgress.child))
	      : (current = bailoutOnAlreadyFinishedWork(
	          current,
	          workInProgress,
	          renderLanes
	        ));
	    return current;
	  }
	  function mountHostRootWithoutHydrating(
	    current,
	    workInProgress,
	    nextChildren,
	    renderLanes
	  ) {
	    resetHydrationState();
	    workInProgress.flags |= 256;
	    reconcileChildren(current, workInProgress, nextChildren, renderLanes);
	    return workInProgress.child;
	  }
	  function mountSuspenseOffscreenState(renderLanes) {
	    return { baseLanes: renderLanes, cachePool: getSuspendedCache() };
	  }
	  function getRemainingWorkInPrimaryTree(
	    current,
	    primaryTreeDidDefer,
	    renderLanes
	  ) {
	    current = null !== current ? current.childLanes & ~renderLanes : 0;
	    primaryTreeDidDefer && (current |= workInProgressDeferredLane);
	    return current;
	  }
	  function updateSuspenseComponent(current, workInProgress, renderLanes) {
	    var nextProps = workInProgress.pendingProps,
	      showFallback = false,
	      didSuspend = 0 !== (workInProgress.flags & 128),
	      JSCompiler_temp;
	    (JSCompiler_temp = didSuspend) ||
	      (JSCompiler_temp =
	        null !== current && null === current.memoizedState
	          ? false
	          : 0 !== (suspenseStackCursor.current & 2));
	    JSCompiler_temp && ((showFallback = true), (workInProgress.flags &= -129));
	    JSCompiler_temp = 0 !== (workInProgress.flags & 32);
	    workInProgress.flags &= -33;
	    if (null === current) {
	      if (isHydrating) {
	        showFallback
	          ? pushPrimaryTreeSuspenseHandler(workInProgress)
	          : reuseSuspenseHandlerOnStack();
	        if (isHydrating) {
	          var nextInstance = nextHydratableInstance,
	            JSCompiler_temp$jscomp$0;
	          if ((JSCompiler_temp$jscomp$0 = nextInstance))
	            (nextInstance = canHydrateSuspenseInstance(
	              nextInstance,
	              rootOrSingletonContext
	            )),
	              null !== nextInstance
	                ? ((workInProgress.memoizedState = {
	                    dehydrated: nextInstance,
	                    treeContext:
	                      null !== treeContextProvider
	                        ? { id: treeContextId, overflow: treeContextOverflow }
	                        : null,
	                    retryLane: 536870912
	                  }),
	                  (JSCompiler_temp$jscomp$0 = createFiber(18, null, null, 0)),
	                  (JSCompiler_temp$jscomp$0.stateNode = nextInstance),
	                  (JSCompiler_temp$jscomp$0.return = workInProgress),
	                  (workInProgress.child = JSCompiler_temp$jscomp$0),
	                  (hydrationParentFiber = workInProgress),
	                  (nextHydratableInstance = null),
	                  (JSCompiler_temp$jscomp$0 = true))
	                : (JSCompiler_temp$jscomp$0 = false);
	          JSCompiler_temp$jscomp$0 || throwOnHydrationMismatch(workInProgress);
	        }
	        nextInstance = workInProgress.memoizedState;
	        if (
	          null !== nextInstance &&
	          ((nextInstance = nextInstance.dehydrated), null !== nextInstance)
	        )
	          return (
	            isSuspenseInstanceFallback(nextInstance)
	              ? (workInProgress.lanes = 16)
	              : (workInProgress.lanes = 536870912),
	            null
	          );
	        popSuspenseHandler(workInProgress);
	      }
	      nextInstance = nextProps.children;
	      nextProps = nextProps.fallback;
	      if (showFallback)
	        return (
	          reuseSuspenseHandlerOnStack(),
	          (showFallback = workInProgress.mode),
	          (nextInstance = mountWorkInProgressOffscreenFiber(
	            { mode: "hidden", children: nextInstance },
	            showFallback
	          )),
	          (nextProps = createFiberFromFragment(
	            nextProps,
	            showFallback,
	            renderLanes,
	            null
	          )),
	          (nextInstance.return = workInProgress),
	          (nextProps.return = workInProgress),
	          (nextInstance.sibling = nextProps),
	          (workInProgress.child = nextInstance),
	          (showFallback = workInProgress.child),
	          (showFallback.memoizedState =
	            mountSuspenseOffscreenState(renderLanes)),
	          (showFallback.childLanes = getRemainingWorkInPrimaryTree(
	            current,
	            JSCompiler_temp,
	            renderLanes
	          )),
	          (workInProgress.memoizedState = SUSPENDED_MARKER),
	          nextProps
	        );
	      pushPrimaryTreeSuspenseHandler(workInProgress);
	      return mountSuspensePrimaryChildren(workInProgress, nextInstance);
	    }
	    JSCompiler_temp$jscomp$0 = current.memoizedState;
	    if (
	      null !== JSCompiler_temp$jscomp$0 &&
	      ((nextInstance = JSCompiler_temp$jscomp$0.dehydrated),
	      null !== nextInstance)
	    ) {
	      if (didSuspend)
	        workInProgress.flags & 256
	          ? (pushPrimaryTreeSuspenseHandler(workInProgress),
	            (workInProgress.flags &= -257),
	            (workInProgress = retrySuspenseComponentWithoutHydrating(
	              current,
	              workInProgress,
	              renderLanes
	            )))
	          : null !== workInProgress.memoizedState
	            ? (reuseSuspenseHandlerOnStack(),
	              (workInProgress.child = current.child),
	              (workInProgress.flags |= 128),
	              (workInProgress = null))
	            : (reuseSuspenseHandlerOnStack(),
	              (showFallback = nextProps.fallback),
	              (nextInstance = workInProgress.mode),
	              (nextProps = mountWorkInProgressOffscreenFiber(
	                { mode: "visible", children: nextProps.children },
	                nextInstance
	              )),
	              (showFallback = createFiberFromFragment(
	                showFallback,
	                nextInstance,
	                renderLanes,
	                null
	              )),
	              (showFallback.flags |= 2),
	              (nextProps.return = workInProgress),
	              (showFallback.return = workInProgress),
	              (nextProps.sibling = showFallback),
	              (workInProgress.child = nextProps),
	              reconcileChildFibers(
	                workInProgress,
	                current.child,
	                null,
	                renderLanes
	              ),
	              (nextProps = workInProgress.child),
	              (nextProps.memoizedState =
	                mountSuspenseOffscreenState(renderLanes)),
	              (nextProps.childLanes = getRemainingWorkInPrimaryTree(
	                current,
	                JSCompiler_temp,
	                renderLanes
	              )),
	              (workInProgress.memoizedState = SUSPENDED_MARKER),
	              (workInProgress = showFallback));
	      else if (
	        (pushPrimaryTreeSuspenseHandler(workInProgress),
	        isSuspenseInstanceFallback(nextInstance))
	      )
	        (JSCompiler_temp =
	          getSuspenseInstanceFallbackErrorDetails(nextInstance).digest),
	          (nextProps = Error(formatProdErrorMessage(419))),
	          (nextProps.stack = ""),
	          (nextProps.digest = JSCompiler_temp),
	          queueHydrationError({ value: nextProps, source: null, stack: null }),
	          (workInProgress = retrySuspenseComponentWithoutHydrating(
	            current,
	            workInProgress,
	            renderLanes
	          ));
	      else if (
	        (didReceiveUpdate ||
	          propagateParentContextChanges(
	            current,
	            workInProgress,
	            renderLanes,
	            false
	          ),
	        (JSCompiler_temp = 0 !== (renderLanes & current.childLanes)),
	        didReceiveUpdate || JSCompiler_temp)
	      ) {
	        JSCompiler_temp = workInProgressRoot;
	        if (null !== JSCompiler_temp) {
	          nextProps = renderLanes & -renderLanes;
	          if (0 !== (nextProps & 42)) nextProps = 1;
	          else
	            switch (nextProps) {
	              case 2:
	                nextProps = 1;
	                break;
	              case 8:
	                nextProps = 4;
	                break;
	              case 32:
	                nextProps = 16;
	                break;
	              case 128:
	              case 256:
	              case 512:
	              case 1024:
	              case 2048:
	              case 4096:
	              case 8192:
	              case 16384:
	              case 32768:
	              case 65536:
	              case 131072:
	              case 262144:
	              case 524288:
	              case 1048576:
	              case 2097152:
	              case 4194304:
	              case 8388608:
	              case 16777216:
	              case 33554432:
	                nextProps = 64;
	                break;
	              case 268435456:
	                nextProps = 134217728;
	                break;
	              default:
	                nextProps = 0;
	            }
	          nextProps =
	            0 !== (nextProps & (JSCompiler_temp.suspendedLanes | renderLanes))
	              ? 0
	              : nextProps;
	          if (
	            0 !== nextProps &&
	            nextProps !== JSCompiler_temp$jscomp$0.retryLane
	          )
	            throw (
	              ((JSCompiler_temp$jscomp$0.retryLane = nextProps),
	              enqueueConcurrentRenderForLane(current, nextProps),
	              scheduleUpdateOnFiber(JSCompiler_temp, current, nextProps),
	              SelectiveHydrationException)
	            );
	        }
	        isSuspenseInstancePending(nextInstance) ||
	          renderDidSuspendDelayIfPossible();
	        workInProgress = retrySuspenseComponentWithoutHydrating(
	          current,
	          workInProgress,
	          renderLanes
	        );
	      } else
	        isSuspenseInstancePending(nextInstance)
	          ? ((workInProgress.flags |= 128),
	            (workInProgress.child = current.child),
	            (workInProgress = retryDehydratedSuspenseBoundary.bind(
	              null,
	              current
	            )),
	            registerSuspenseInstanceRetry(nextInstance, workInProgress),
	            (workInProgress = null))
	          : ((current = JSCompiler_temp$jscomp$0.treeContext),
	            supportsHydration &&
	              ((nextHydratableInstance =
	                getFirstHydratableChildWithinSuspenseInstance(nextInstance)),
	              (hydrationParentFiber = workInProgress),
	              (isHydrating = true),
	              (hydrationErrors = null),
	              (rootOrSingletonContext = false),
	              null !== current &&
	                ((idStack[idStackIndex++] = treeContextId),
	                (idStack[idStackIndex++] = treeContextOverflow),
	                (idStack[idStackIndex++] = treeContextProvider),
	                (treeContextId = current.id),
	                (treeContextOverflow = current.overflow),
	                (treeContextProvider = workInProgress))),
	            (workInProgress = mountSuspensePrimaryChildren(
	              workInProgress,
	              nextProps.children
	            )),
	            (workInProgress.flags |= 4096));
	      return workInProgress;
	    }
	    if (showFallback)
	      return (
	        reuseSuspenseHandlerOnStack(),
	        (showFallback = nextProps.fallback),
	        (nextInstance = workInProgress.mode),
	        (JSCompiler_temp$jscomp$0 = current.child),
	        (didSuspend = JSCompiler_temp$jscomp$0.sibling),
	        (nextProps = createWorkInProgress(JSCompiler_temp$jscomp$0, {
	          mode: "hidden",
	          children: nextProps.children
	        })),
	        (nextProps.subtreeFlags =
	          JSCompiler_temp$jscomp$0.subtreeFlags & 31457280),
	        null !== didSuspend
	          ? (showFallback = createWorkInProgress(didSuspend, showFallback))
	          : ((showFallback = createFiberFromFragment(
	              showFallback,
	              nextInstance,
	              renderLanes,
	              null
	            )),
	            (showFallback.flags |= 2)),
	        (showFallback.return = workInProgress),
	        (nextProps.return = workInProgress),
	        (nextProps.sibling = showFallback),
	        (workInProgress.child = nextProps),
	        (nextProps = showFallback),
	        (showFallback = workInProgress.child),
	        (nextInstance = current.child.memoizedState),
	        null === nextInstance
	          ? (nextInstance = mountSuspenseOffscreenState(renderLanes))
	          : ((JSCompiler_temp$jscomp$0 = nextInstance.cachePool),
	            null !== JSCompiler_temp$jscomp$0
	              ? ((didSuspend = isPrimaryRenderer
	                  ? CacheContext._currentValue
	                  : CacheContext._currentValue2),
	                (JSCompiler_temp$jscomp$0 =
	                  JSCompiler_temp$jscomp$0.parent !== didSuspend
	                    ? { parent: didSuspend, pool: didSuspend }
	                    : JSCompiler_temp$jscomp$0))
	              : (JSCompiler_temp$jscomp$0 = getSuspendedCache()),
	            (nextInstance = {
	              baseLanes: nextInstance.baseLanes | renderLanes,
	              cachePool: JSCompiler_temp$jscomp$0
	            })),
	        (showFallback.memoizedState = nextInstance),
	        (showFallback.childLanes = getRemainingWorkInPrimaryTree(
	          current,
	          JSCompiler_temp,
	          renderLanes
	        )),
	        (workInProgress.memoizedState = SUSPENDED_MARKER),
	        nextProps
	      );
	    pushPrimaryTreeSuspenseHandler(workInProgress);
	    renderLanes = current.child;
	    current = renderLanes.sibling;
	    renderLanes = createWorkInProgress(renderLanes, {
	      mode: "visible",
	      children: nextProps.children
	    });
	    renderLanes.return = workInProgress;
	    renderLanes.sibling = null;
	    null !== current &&
	      ((JSCompiler_temp = workInProgress.deletions),
	      null === JSCompiler_temp
	        ? ((workInProgress.deletions = [current]), (workInProgress.flags |= 16))
	        : JSCompiler_temp.push(current));
	    workInProgress.child = renderLanes;
	    workInProgress.memoizedState = null;
	    return renderLanes;
	  }
	  function mountSuspensePrimaryChildren(workInProgress, primaryChildren) {
	    primaryChildren = mountWorkInProgressOffscreenFiber(
	      { mode: "visible", children: primaryChildren },
	      workInProgress.mode
	    );
	    primaryChildren.return = workInProgress;
	    return (workInProgress.child = primaryChildren);
	  }
	  function mountWorkInProgressOffscreenFiber(offscreenProps, mode) {
	    return createFiberFromOffscreen(offscreenProps, mode, 0, null);
	  }
	  function retrySuspenseComponentWithoutHydrating(
	    current,
	    workInProgress,
	    renderLanes
	  ) {
	    reconcileChildFibers(workInProgress, current.child, null, renderLanes);
	    current = mountSuspensePrimaryChildren(
	      workInProgress,
	      workInProgress.pendingProps.children
	    );
	    current.flags |= 2;
	    workInProgress.memoizedState = null;
	    return current;
	  }
	  function scheduleSuspenseWorkOnFiber(fiber, renderLanes, propagationRoot) {
	    fiber.lanes |= renderLanes;
	    var alternate = fiber.alternate;
	    null !== alternate && (alternate.lanes |= renderLanes);
	    scheduleContextWorkOnParentPath(fiber.return, renderLanes, propagationRoot);
	  }
	  function initSuspenseListRenderState(
	    workInProgress,
	    isBackwards,
	    tail,
	    lastContentRow,
	    tailMode
	  ) {
	    var renderState = workInProgress.memoizedState;
	    null === renderState
	      ? (workInProgress.memoizedState = {
	          isBackwards: isBackwards,
	          rendering: null,
	          renderingStartTime: 0,
	          last: lastContentRow,
	          tail: tail,
	          tailMode: tailMode
	        })
	      : ((renderState.isBackwards = isBackwards),
	        (renderState.rendering = null),
	        (renderState.renderingStartTime = 0),
	        (renderState.last = lastContentRow),
	        (renderState.tail = tail),
	        (renderState.tailMode = tailMode));
	  }
	  function updateSuspenseListComponent(current, workInProgress, renderLanes) {
	    var nextProps = workInProgress.pendingProps,
	      revealOrder = nextProps.revealOrder,
	      tailMode = nextProps.tail;
	    reconcileChildren(current, workInProgress, nextProps.children, renderLanes);
	    nextProps = suspenseStackCursor.current;
	    if (0 !== (nextProps & 2))
	      (nextProps = (nextProps & 1) | 2), (workInProgress.flags |= 128);
	    else {
	      if (null !== current && 0 !== (current.flags & 128))
	        a: for (current = workInProgress.child; null !== current; ) {
	          if (13 === current.tag)
	            null !== current.memoizedState &&
	              scheduleSuspenseWorkOnFiber(current, renderLanes, workInProgress);
	          else if (19 === current.tag)
	            scheduleSuspenseWorkOnFiber(current, renderLanes, workInProgress);
	          else if (null !== current.child) {
	            current.child.return = current;
	            current = current.child;
	            continue;
	          }
	          if (current === workInProgress) break a;
	          for (; null === current.sibling; ) {
	            if (null === current.return || current.return === workInProgress)
	              break a;
	            current = current.return;
	          }
	          current.sibling.return = current.return;
	          current = current.sibling;
	        }
	      nextProps &= 1;
	    }
	    push(suspenseStackCursor, nextProps);
	    switch (revealOrder) {
	      case "forwards":
	        renderLanes = workInProgress.child;
	        for (revealOrder = null; null !== renderLanes; )
	          (current = renderLanes.alternate),
	            null !== current &&
	              null === findFirstSuspended(current) &&
	              (revealOrder = renderLanes),
	            (renderLanes = renderLanes.sibling);
	        renderLanes = revealOrder;
	        null === renderLanes
	          ? ((revealOrder = workInProgress.child),
	            (workInProgress.child = null))
	          : ((revealOrder = renderLanes.sibling), (renderLanes.sibling = null));
	        initSuspenseListRenderState(
	          workInProgress,
	          false,
	          revealOrder,
	          renderLanes,
	          tailMode
	        );
	        break;
	      case "backwards":
	        renderLanes = null;
	        revealOrder = workInProgress.child;
	        for (workInProgress.child = null; null !== revealOrder; ) {
	          current = revealOrder.alternate;
	          if (null !== current && null === findFirstSuspended(current)) {
	            workInProgress.child = revealOrder;
	            break;
	          }
	          current = revealOrder.sibling;
	          revealOrder.sibling = renderLanes;
	          renderLanes = revealOrder;
	          revealOrder = current;
	        }
	        initSuspenseListRenderState(
	          workInProgress,
	          true,
	          renderLanes,
	          null,
	          tailMode
	        );
	        break;
	      case "together":
	        initSuspenseListRenderState(workInProgress, false, null, null, undefined);
	        break;
	      default:
	        workInProgress.memoizedState = null;
	    }
	    return workInProgress.child;
	  }
	  function bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes) {
	    null !== current && (workInProgress.dependencies = current.dependencies);
	    workInProgressRootSkippedLanes |= workInProgress.lanes;
	    if (0 === (renderLanes & workInProgress.childLanes))
	      if (null !== current) {
	        if (
	          (propagateParentContextChanges(
	            current,
	            workInProgress,
	            renderLanes,
	            false
	          ),
	          0 === (renderLanes & workInProgress.childLanes))
	        )
	          return null;
	      } else return null;
	    if (null !== current && workInProgress.child !== current.child)
	      throw Error(formatProdErrorMessage(153));
	    if (null !== workInProgress.child) {
	      current = workInProgress.child;
	      renderLanes = createWorkInProgress(current, current.pendingProps);
	      workInProgress.child = renderLanes;
	      for (renderLanes.return = workInProgress; null !== current.sibling; )
	        (current = current.sibling),
	          (renderLanes = renderLanes.sibling =
	            createWorkInProgress(current, current.pendingProps)),
	          (renderLanes.return = workInProgress);
	      renderLanes.sibling = null;
	    }
	    return workInProgress.child;
	  }
	  function checkScheduledUpdateOrContext(current, renderLanes) {
	    if (0 !== (current.lanes & renderLanes)) return true;
	    current = current.dependencies;
	    return null !== current && checkIfContextChanged(current) ? true : false;
	  }
	  function attemptEarlyBailoutIfNoScheduledUpdate(
	    current,
	    workInProgress,
	    renderLanes
	  ) {
	    switch (workInProgress.tag) {
	      case 3:
	        pushHostContainer(
	          workInProgress,
	          workInProgress.stateNode.containerInfo
	        );
	        pushProvider(workInProgress, CacheContext, current.memoizedState.cache);
	        resetHydrationState();
	        break;
	      case 27:
	      case 5:
	        pushHostContext(workInProgress);
	        break;
	      case 4:
	        pushHostContainer(
	          workInProgress,
	          workInProgress.stateNode.containerInfo
	        );
	        break;
	      case 10:
	        pushProvider(
	          workInProgress,
	          workInProgress.type,
	          workInProgress.memoizedProps.value
	        );
	        break;
	      case 13:
	        var state = workInProgress.memoizedState;
	        if (null !== state) {
	          if (null !== state.dehydrated)
	            return (
	              pushPrimaryTreeSuspenseHandler(workInProgress),
	              (workInProgress.flags |= 128),
	              null
	            );
	          if (0 !== (renderLanes & workInProgress.child.childLanes))
	            return updateSuspenseComponent(
	              current,
	              workInProgress,
	              renderLanes
	            );
	          pushPrimaryTreeSuspenseHandler(workInProgress);
	          current = bailoutOnAlreadyFinishedWork(
	            current,
	            workInProgress,
	            renderLanes
	          );
	          return null !== current ? current.sibling : null;
	        }
	        pushPrimaryTreeSuspenseHandler(workInProgress);
	        break;
	      case 19:
	        var didSuspendBefore = 0 !== (current.flags & 128);
	        state = 0 !== (renderLanes & workInProgress.childLanes);
	        state ||
	          (propagateParentContextChanges(
	            current,
	            workInProgress,
	            renderLanes,
	            false
	          ),
	          (state = 0 !== (renderLanes & workInProgress.childLanes)));
	        if (didSuspendBefore) {
	          if (state)
	            return updateSuspenseListComponent(
	              current,
	              workInProgress,
	              renderLanes
	            );
	          workInProgress.flags |= 128;
	        }
	        didSuspendBefore = workInProgress.memoizedState;
	        null !== didSuspendBefore &&
	          ((didSuspendBefore.rendering = null),
	          (didSuspendBefore.tail = null),
	          (didSuspendBefore.lastEffect = null));
	        push(suspenseStackCursor, suspenseStackCursor.current);
	        if (state) break;
	        else return null;
	      case 22:
	      case 23:
	        return (
	          (workInProgress.lanes = 0),
	          updateOffscreenComponent(current, workInProgress, renderLanes)
	        );
	      case 24:
	        pushProvider(workInProgress, CacheContext, current.memoizedState.cache);
	    }
	    return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
	  }
	  function beginWork(current, workInProgress, renderLanes) {
	    if (null !== current)
	      if (current.memoizedProps !== workInProgress.pendingProps)
	        didReceiveUpdate = true;
	      else {
	        if (
	          !checkScheduledUpdateOrContext(current, renderLanes) &&
	          0 === (workInProgress.flags & 128)
	        )
	          return (
	            (didReceiveUpdate = false),
	            attemptEarlyBailoutIfNoScheduledUpdate(
	              current,
	              workInProgress,
	              renderLanes
	            )
	          );
	        didReceiveUpdate = 0 !== (current.flags & 131072) ? true : false;
	      }
	    else
	      (didReceiveUpdate = false),
	        isHydrating &&
	          0 !== (workInProgress.flags & 1048576) &&
	          pushTreeId(workInProgress, treeForkCount, workInProgress.index);
	    workInProgress.lanes = 0;
	    switch (workInProgress.tag) {
	      case 16:
	        a: {
	          current = workInProgress.pendingProps;
	          var lazyComponent = workInProgress.elementType,
	            init = lazyComponent._init;
	          lazyComponent = init(lazyComponent._payload);
	          workInProgress.type = lazyComponent;
	          if ("function" === typeof lazyComponent)
	            shouldConstruct(lazyComponent)
	              ? ((current = resolveClassComponentProps(lazyComponent, current)),
	                (workInProgress.tag = 1),
	                (workInProgress = updateClassComponent(
	                  null,
	                  workInProgress,
	                  lazyComponent,
	                  current,
	                  renderLanes
	                )))
	              : ((workInProgress.tag = 0),
	                (workInProgress = updateFunctionComponent(
	                  null,
	                  workInProgress,
	                  lazyComponent,
	                  current,
	                  renderLanes
	                )));
	          else {
	            if (undefined !== lazyComponent && null !== lazyComponent)
	              if (
	                ((init = lazyComponent.$$typeof),
	                init === REACT_FORWARD_REF_TYPE)
	              ) {
	                workInProgress.tag = 11;
	                workInProgress = updateForwardRef(
	                  null,
	                  workInProgress,
	                  lazyComponent,
	                  current,
	                  renderLanes
	                );
	                break a;
	              } else if (init === REACT_MEMO_TYPE) {
	                workInProgress.tag = 14;
	                workInProgress = updateMemoComponent(
	                  null,
	                  workInProgress,
	                  lazyComponent,
	                  current,
	                  renderLanes
	                );
	                break a;
	              }
	            workInProgress =
	              getComponentNameFromType(lazyComponent) || lazyComponent;
	            throw Error(formatProdErrorMessage(306, workInProgress, ""));
	          }
	        }
	        return workInProgress;
	      case 0:
	        return updateFunctionComponent(
	          current,
	          workInProgress,
	          workInProgress.type,
	          workInProgress.pendingProps,
	          renderLanes
	        );
	      case 1:
	        return (
	          (lazyComponent = workInProgress.type),
	          (init = resolveClassComponentProps(
	            lazyComponent,
	            workInProgress.pendingProps
	          )),
	          updateClassComponent(
	            current,
	            workInProgress,
	            lazyComponent,
	            init,
	            renderLanes
	          )
	        );
	      case 3:
	        a: {
	          pushHostContainer(
	            workInProgress,
	            workInProgress.stateNode.containerInfo
	          );
	          if (null === current) throw Error(formatProdErrorMessage(387));
	          var nextProps = workInProgress.pendingProps;
	          init = workInProgress.memoizedState;
	          lazyComponent = init.element;
	          cloneUpdateQueue(current, workInProgress);
	          processUpdateQueue(workInProgress, nextProps, null, renderLanes);
	          var nextState = workInProgress.memoizedState;
	          nextProps = nextState.cache;
	          pushProvider(workInProgress, CacheContext, nextProps);
	          nextProps !== init.cache &&
	            propagateContextChanges(
	              workInProgress,
	              [CacheContext],
	              renderLanes,
	              true
	            );
	          suspendIfUpdateReadFromEntangledAsyncAction();
	          nextProps = nextState.element;
	          if (supportsHydration && init.isDehydrated)
	            if (
	              ((init = {
	                element: nextProps,
	                isDehydrated: false,
	                cache: nextState.cache
	              }),
	              (workInProgress.updateQueue.baseState = init),
	              (workInProgress.memoizedState = init),
	              workInProgress.flags & 256)
	            ) {
	              workInProgress = mountHostRootWithoutHydrating(
	                current,
	                workInProgress,
	                nextProps,
	                renderLanes
	              );
	              break a;
	            } else if (nextProps !== lazyComponent) {
	              lazyComponent = createCapturedValueAtFiber(
	                Error(formatProdErrorMessage(424)),
	                workInProgress
	              );
	              queueHydrationError(lazyComponent);
	              workInProgress = mountHostRootWithoutHydrating(
	                current,
	                workInProgress,
	                nextProps,
	                renderLanes
	              );
	              break a;
	            } else
	              for (
	                supportsHydration &&
	                  ((nextHydratableInstance =
	                    getFirstHydratableChildWithinContainer(
	                      workInProgress.stateNode.containerInfo
	                    )),
	                  (hydrationParentFiber = workInProgress),
	                  (isHydrating = true),
	                  (hydrationErrors = null),
	                  (rootOrSingletonContext = true)),
	                  renderLanes = mountChildFibers(
	                    workInProgress,
	                    null,
	                    nextProps,
	                    renderLanes
	                  ),
	                  workInProgress.child = renderLanes;
	                renderLanes;

	              )
	                (renderLanes.flags = (renderLanes.flags & -3) | 4096),
	                  (renderLanes = renderLanes.sibling);
	          else {
	            resetHydrationState();
	            if (nextProps === lazyComponent) {
	              workInProgress = bailoutOnAlreadyFinishedWork(
	                current,
	                workInProgress,
	                renderLanes
	              );
	              break a;
	            }
	            reconcileChildren(current, workInProgress, nextProps, renderLanes);
	          }
	          workInProgress = workInProgress.child;
	        }
	        return workInProgress;
	      case 26:
	        if (supportsResources)
	          return (
	            markRef(current, workInProgress),
	            null === current
	              ? (renderLanes = getResource(
	                  workInProgress.type,
	                  null,
	                  workInProgress.pendingProps,
	                  null
	                ))
	                ? (workInProgress.memoizedState = renderLanes)
	                : isHydrating ||
	                  (workInProgress.stateNode = createHoistableInstance(
	                    workInProgress.type,
	                    workInProgress.pendingProps,
	                    rootInstanceStackCursor.current,
	                    workInProgress
	                  ))
	              : (workInProgress.memoizedState = getResource(
	                  workInProgress.type,
	                  current.memoizedProps,
	                  workInProgress.pendingProps,
	                  current.memoizedState
	                )),
	            null
	          );
	      case 27:
	        if (supportsSingletons)
	          return (
	            pushHostContext(workInProgress),
	            null === current &&
	              supportsSingletons &&
	              isHydrating &&
	              ((lazyComponent = workInProgress.stateNode =
	                resolveSingletonInstance(
	                  workInProgress.type,
	                  workInProgress.pendingProps,
	                  rootInstanceStackCursor.current,
	                  contextStackCursor.current,
	                  false
	                )),
	              (hydrationParentFiber = workInProgress),
	              (rootOrSingletonContext = true),
	              (nextHydratableInstance =
	                getFirstHydratableChild(lazyComponent))),
	            (lazyComponent = workInProgress.pendingProps.children),
	            null !== current || isHydrating
	              ? reconcileChildren(
	                  current,
	                  workInProgress,
	                  lazyComponent,
	                  renderLanes
	                )
	              : (workInProgress.child = reconcileChildFibers(
	                  workInProgress,
	                  null,
	                  lazyComponent,
	                  renderLanes
	                )),
	            markRef(current, workInProgress),
	            workInProgress.child
	          );
	      case 5:
	        if (null === current && isHydrating) {
	          validateHydratableInstance(
	            workInProgress.type,
	            workInProgress.pendingProps,
	            contextStackCursor.current
	          );
	          if ((init = lazyComponent = nextHydratableInstance))
	            (lazyComponent = canHydrateInstance(
	              lazyComponent,
	              workInProgress.type,
	              workInProgress.pendingProps,
	              rootOrSingletonContext
	            )),
	              null !== lazyComponent
	                ? ((workInProgress.stateNode = lazyComponent),
	                  (hydrationParentFiber = workInProgress),
	                  (nextHydratableInstance =
	                    getFirstHydratableChild(lazyComponent)),
	                  (rootOrSingletonContext = false),
	                  (init = true))
	                : (init = false);
	          init || throwOnHydrationMismatch(workInProgress);
	        }
	        pushHostContext(workInProgress);
	        init = workInProgress.type;
	        nextProps = workInProgress.pendingProps;
	        nextState = null !== current ? current.memoizedProps : null;
	        lazyComponent = nextProps.children;
	        shouldSetTextContent(init, nextProps)
	          ? (lazyComponent = null)
	          : null !== nextState &&
	            shouldSetTextContent(init, nextState) &&
	            (workInProgress.flags |= 32);
	        null !== workInProgress.memoizedState &&
	          ((init = renderWithHooks(
	            current,
	            workInProgress,
	            TransitionAwareHostComponent,
	            null,
	            null,
	            renderLanes
	          )),
	          isPrimaryRenderer
	            ? (HostTransitionContext._currentValue = init)
	            : (HostTransitionContext._currentValue2 = init));
	        markRef(current, workInProgress);
	        reconcileChildren(current, workInProgress, lazyComponent, renderLanes);
	        return workInProgress.child;
	      case 6:
	        if (null === current && isHydrating) {
	          validateHydratableTextInstance(
	            workInProgress.pendingProps,
	            contextStackCursor.current
	          );
	          if ((current = renderLanes = nextHydratableInstance))
	            (renderLanes = canHydrateTextInstance(
	              renderLanes,
	              workInProgress.pendingProps,
	              rootOrSingletonContext
	            )),
	              null !== renderLanes
	                ? ((workInProgress.stateNode = renderLanes),
	                  (hydrationParentFiber = workInProgress),
	                  (nextHydratableInstance = null),
	                  (current = true))
	                : (current = false);
	          current || throwOnHydrationMismatch(workInProgress);
	        }
	        return null;
	      case 13:
	        return updateSuspenseComponent(current, workInProgress, renderLanes);
	      case 4:
	        return (
	          pushHostContainer(
	            workInProgress,
	            workInProgress.stateNode.containerInfo
	          ),
	          (lazyComponent = workInProgress.pendingProps),
	          null === current
	            ? (workInProgress.child = reconcileChildFibers(
	                workInProgress,
	                null,
	                lazyComponent,
	                renderLanes
	              ))
	            : reconcileChildren(
	                current,
	                workInProgress,
	                lazyComponent,
	                renderLanes
	              ),
	          workInProgress.child
	        );
	      case 11:
	        return updateForwardRef(
	          current,
	          workInProgress,
	          workInProgress.type,
	          workInProgress.pendingProps,
	          renderLanes
	        );
	      case 7:
	        return (
	          reconcileChildren(
	            current,
	            workInProgress,
	            workInProgress.pendingProps,
	            renderLanes
	          ),
	          workInProgress.child
	        );
	      case 8:
	        return (
	          reconcileChildren(
	            current,
	            workInProgress,
	            workInProgress.pendingProps.children,
	            renderLanes
	          ),
	          workInProgress.child
	        );
	      case 12:
	        return (
	          reconcileChildren(
	            current,
	            workInProgress,
	            workInProgress.pendingProps.children,
	            renderLanes
	          ),
	          workInProgress.child
	        );
	      case 10:
	        return (
	          (lazyComponent = workInProgress.pendingProps),
	          pushProvider(
	            workInProgress,
	            workInProgress.type,
	            lazyComponent.value
	          ),
	          reconcileChildren(
	            current,
	            workInProgress,
	            lazyComponent.children,
	            renderLanes
	          ),
	          workInProgress.child
	        );
	      case 9:
	        return (
	          (init = workInProgress.type._context),
	          (lazyComponent = workInProgress.pendingProps.children),
	          prepareToReadContext(workInProgress),
	          (init = readContext(init)),
	          (lazyComponent = lazyComponent(init)),
	          (workInProgress.flags |= 1),
	          reconcileChildren(
	            current,
	            workInProgress,
	            lazyComponent,
	            renderLanes
	          ),
	          workInProgress.child
	        );
	      case 14:
	        return updateMemoComponent(
	          current,
	          workInProgress,
	          workInProgress.type,
	          workInProgress.pendingProps,
	          renderLanes
	        );
	      case 15:
	        return updateSimpleMemoComponent(
	          current,
	          workInProgress,
	          workInProgress.type,
	          workInProgress.pendingProps,
	          renderLanes
	        );
	      case 19:
	        return updateSuspenseListComponent(
	          current,
	          workInProgress,
	          renderLanes
	        );
	      case 22:
	        return updateOffscreenComponent(current, workInProgress, renderLanes);
	      case 24:
	        return (
	          prepareToReadContext(workInProgress),
	          (lazyComponent = readContext(CacheContext)),
	          null === current
	            ? ((init = peekCacheFromPool()),
	              null === init &&
	                ((init = workInProgressRoot),
	                (nextProps = createCache()),
	                (init.pooledCache = nextProps),
	                nextProps.refCount++,
	                null !== nextProps && (init.pooledCacheLanes |= renderLanes),
	                (init = nextProps)),
	              (workInProgress.memoizedState = {
	                parent: lazyComponent,
	                cache: init
	              }),
	              initializeUpdateQueue(workInProgress),
	              pushProvider(workInProgress, CacheContext, init))
	            : (0 !== (current.lanes & renderLanes) &&
	                (cloneUpdateQueue(current, workInProgress),
	                processUpdateQueue(workInProgress, null, null, renderLanes),
	                suspendIfUpdateReadFromEntangledAsyncAction()),
	              (init = current.memoizedState),
	              (nextProps = workInProgress.memoizedState),
	              init.parent !== lazyComponent
	                ? ((init = { parent: lazyComponent, cache: lazyComponent }),
	                  (workInProgress.memoizedState = init),
	                  0 === workInProgress.lanes &&
	                    (workInProgress.memoizedState =
	                      workInProgress.updateQueue.baseState =
	                        init),
	                  pushProvider(workInProgress, CacheContext, lazyComponent))
	                : ((lazyComponent = nextProps.cache),
	                  pushProvider(workInProgress, CacheContext, lazyComponent),
	                  lazyComponent !== init.cache &&
	                    propagateContextChanges(
	                      workInProgress,
	                      [CacheContext],
	                      renderLanes,
	                      true
	                    ))),
	          reconcileChildren(
	            current,
	            workInProgress,
	            workInProgress.pendingProps.children,
	            renderLanes
	          ),
	          workInProgress.child
	        );
	      case 29:
	        throw workInProgress.pendingProps;
	    }
	    throw Error(formatProdErrorMessage(156, workInProgress.tag));
	  }
	  function pushProvider(providerFiber, context, nextValue) {
	    isPrimaryRenderer
	      ? (push(valueCursor, context._currentValue),
	        (context._currentValue = nextValue))
	      : (push(valueCursor, context._currentValue2),
	        (context._currentValue2 = nextValue));
	  }
	  function popProvider(context) {
	    var currentValue = valueCursor.current;
	    isPrimaryRenderer
	      ? (context._currentValue = currentValue)
	      : (context._currentValue2 = currentValue);
	    pop(valueCursor);
	  }
	  function scheduleContextWorkOnParentPath(
	    parent,
	    renderLanes,
	    propagationRoot
	  ) {
	    for (; null !== parent; ) {
	      var alternate = parent.alternate;
	      (parent.childLanes & renderLanes) !== renderLanes
	        ? ((parent.childLanes |= renderLanes),
	          null !== alternate && (alternate.childLanes |= renderLanes))
	        : null !== alternate &&
	          (alternate.childLanes & renderLanes) !== renderLanes &&
	          (alternate.childLanes |= renderLanes);
	      if (parent === propagationRoot) break;
	      parent = parent.return;
	    }
	  }
	  function propagateContextChanges(
	    workInProgress,
	    contexts,
	    renderLanes,
	    forcePropagateEntireTree
	  ) {
	    var fiber = workInProgress.child;
	    null !== fiber && (fiber.return = workInProgress);
	    for (; null !== fiber; ) {
	      var list = fiber.dependencies;
	      if (null !== list) {
	        var nextFiber = fiber.child;
	        list = list.firstContext;
	        a: for (; null !== list; ) {
	          var dependency = list;
	          list = fiber;
	          for (var i = 0; i < contexts.length; i++)
	            if (dependency.context === contexts[i]) {
	              list.lanes |= renderLanes;
	              dependency = list.alternate;
	              null !== dependency && (dependency.lanes |= renderLanes);
	              scheduleContextWorkOnParentPath(
	                list.return,
	                renderLanes,
	                workInProgress
	              );
	              forcePropagateEntireTree || (nextFiber = null);
	              break a;
	            }
	          list = dependency.next;
	        }
	      } else if (18 === fiber.tag) {
	        nextFiber = fiber.return;
	        if (null === nextFiber) throw Error(formatProdErrorMessage(341));
	        nextFiber.lanes |= renderLanes;
	        list = nextFiber.alternate;
	        null !== list && (list.lanes |= renderLanes);
	        scheduleContextWorkOnParentPath(nextFiber, renderLanes, workInProgress);
	        nextFiber = null;
	      } else nextFiber = fiber.child;
	      if (null !== nextFiber) nextFiber.return = fiber;
	      else
	        for (nextFiber = fiber; null !== nextFiber; ) {
	          if (nextFiber === workInProgress) {
	            nextFiber = null;
	            break;
	          }
	          fiber = nextFiber.sibling;
	          if (null !== fiber) {
	            fiber.return = nextFiber.return;
	            nextFiber = fiber;
	            break;
	          }
	          nextFiber = nextFiber.return;
	        }
	      fiber = nextFiber;
	    }
	  }
	  function propagateParentContextChanges(
	    current,
	    workInProgress,
	    renderLanes,
	    forcePropagateEntireTree
	  ) {
	    current = null;
	    for (
	      var parent = workInProgress, isInsidePropagationBailout = false;
	      null !== parent;

	    ) {
	      if (!isInsidePropagationBailout)
	        if (0 !== (parent.flags & 524288)) isInsidePropagationBailout = true;
	        else if (0 !== (parent.flags & 262144)) break;
	      if (10 === parent.tag) {
	        var currentParent = parent.alternate;
	        if (null === currentParent) throw Error(formatProdErrorMessage(387));
	        currentParent = currentParent.memoizedProps;
	        if (null !== currentParent) {
	          var context = parent.type;
	          objectIs(parent.pendingProps.value, currentParent.value) ||
	            (null !== current ? current.push(context) : (current = [context]));
	        }
	      } else if (parent === hostTransitionProviderCursor.current) {
	        currentParent = parent.alternate;
	        if (null === currentParent) throw Error(formatProdErrorMessage(387));
	        currentParent.memoizedState.memoizedState !==
	          parent.memoizedState.memoizedState &&
	          (null !== current
	            ? current.push(HostTransitionContext)
	            : (current = [HostTransitionContext]));
	      }
	      parent = parent.return;
	    }
	    null !== current &&
	      propagateContextChanges(
	        workInProgress,
	        current,
	        renderLanes,
	        forcePropagateEntireTree
	      );
	    workInProgress.flags |= 262144;
	  }
	  function checkIfContextChanged(currentDependencies) {
	    for (
	      currentDependencies = currentDependencies.firstContext;
	      null !== currentDependencies;

	    ) {
	      var context = currentDependencies.context;
	      if (
	        !objectIs(
	          isPrimaryRenderer ? context._currentValue : context._currentValue2,
	          currentDependencies.memoizedValue
	        )
	      )
	        return true;
	      currentDependencies = currentDependencies.next;
	    }
	    return false;
	  }
	  function prepareToReadContext(workInProgress) {
	    currentlyRenderingFiber = workInProgress;
	    lastContextDependency = null;
	    workInProgress = workInProgress.dependencies;
	    null !== workInProgress && (workInProgress.firstContext = null);
	  }
	  function readContext(context) {
	    return readContextForConsumer(currentlyRenderingFiber, context);
	  }
	  function readContextDuringReconciliation(consumer, context) {
	    null === currentlyRenderingFiber && prepareToReadContext(consumer);
	    return readContextForConsumer(consumer, context);
	  }
	  function readContextForConsumer(consumer, context) {
	    var value = isPrimaryRenderer
	      ? context._currentValue
	      : context._currentValue2;
	    context = { context: context, memoizedValue: value, next: null };
	    if (null === lastContextDependency) {
	      if (null === consumer) throw Error(formatProdErrorMessage(308));
	      lastContextDependency = context;
	      consumer.dependencies = { lanes: 0, firstContext: context };
	      consumer.flags |= 524288;
	    } else lastContextDependency = lastContextDependency.next = context;
	    return value;
	  }
	  function createCache() {
	    return {
	      controller: new AbortControllerLocal(),
	      data: new Map(),
	      refCount: 0
	    };
	  }
	  function releaseCache(cache) {
	    cache.refCount--;
	    0 === cache.refCount &&
	      scheduleCallback$1(NormalPriority, function () {
	        cache.controller.abort();
	      });
	  }
	  function peekCacheFromPool() {
	    var cacheResumedFromPreviousRender = resumedCache.current;
	    return null !== cacheResumedFromPreviousRender
	      ? cacheResumedFromPreviousRender
	      : workInProgressRoot.pooledCache;
	  }
	  function pushTransition(offscreenWorkInProgress, prevCachePool) {
	    null === prevCachePool
	      ? push(resumedCache, resumedCache.current)
	      : push(resumedCache, prevCachePool.pool);
	  }
	  function getSuspendedCache() {
	    var cacheFromPool = peekCacheFromPool();
	    return null === cacheFromPool
	      ? null
	      : {
	          parent: isPrimaryRenderer
	            ? CacheContext._currentValue
	            : CacheContext._currentValue2,
	          pool: cacheFromPool
	        };
	  }
	  function markUpdate(workInProgress) {
	    workInProgress.flags |= 4;
	  }
	  function doesRequireClone(current, completedWork) {
	    if (null !== current && current.child === completedWork.child) return false;
	    if (0 !== (completedWork.flags & 16)) return true;
	    for (current = completedWork.child; null !== current; ) {
	      if (0 !== (current.flags & 13878) || 0 !== (current.subtreeFlags & 13878))
	        return true;
	      current = current.sibling;
	    }
	    return false;
	  }
	  function appendAllChildren(
	    parent,
	    workInProgress,
	    needsVisibilityToggle,
	    isHidden
	  ) {
	    if (supportsMutation)
	      for (
	        needsVisibilityToggle = workInProgress.child;
	        null !== needsVisibilityToggle;

	      ) {
	        if (5 === needsVisibilityToggle.tag || 6 === needsVisibilityToggle.tag)
	          appendInitialChild(parent, needsVisibilityToggle.stateNode);
	        else if (
	          !(
	            4 === needsVisibilityToggle.tag ||
	            (supportsSingletons && 27 === needsVisibilityToggle.tag)
	          ) &&
	          null !== needsVisibilityToggle.child
	        ) {
	          needsVisibilityToggle.child.return = needsVisibilityToggle;
	          needsVisibilityToggle = needsVisibilityToggle.child;
	          continue;
	        }
	        if (needsVisibilityToggle === workInProgress) break;
	        for (; null === needsVisibilityToggle.sibling; ) {
	          if (
	            null === needsVisibilityToggle.return ||
	            needsVisibilityToggle.return === workInProgress
	          )
	            return;
	          needsVisibilityToggle = needsVisibilityToggle.return;
	        }
	        needsVisibilityToggle.sibling.return = needsVisibilityToggle.return;
	        needsVisibilityToggle = needsVisibilityToggle.sibling;
	      }
	    else if (supportsPersistence)
	      for (var node$91 = workInProgress.child; null !== node$91; ) {
	        if (5 === node$91.tag) {
	          var instance = node$91.stateNode;
	          needsVisibilityToggle &&
	            isHidden &&
	            (instance = cloneHiddenInstance(
	              instance,
	              node$91.type,
	              node$91.memoizedProps
	            ));
	          appendInitialChild(parent, instance);
	        } else if (6 === node$91.tag)
	          (instance = node$91.stateNode),
	            needsVisibilityToggle &&
	              isHidden &&
	              (instance = cloneHiddenTextInstance(
	                instance,
	                node$91.memoizedProps
	              )),
	            appendInitialChild(parent, instance);
	        else if (4 !== node$91.tag)
	          if (22 === node$91.tag && null !== node$91.memoizedState)
	            (instance = node$91.child),
	              null !== instance && (instance.return = node$91),
	              appendAllChildren(parent, node$91, true, true);
	          else if (null !== node$91.child) {
	            node$91.child.return = node$91;
	            node$91 = node$91.child;
	            continue;
	          }
	        if (node$91 === workInProgress) break;
	        for (; null === node$91.sibling; ) {
	          if (null === node$91.return || node$91.return === workInProgress)
	            return;
	          node$91 = node$91.return;
	        }
	        node$91.sibling.return = node$91.return;
	        node$91 = node$91.sibling;
	      }
	  }
	  function appendAllChildrenToContainer(
	    containerChildSet,
	    workInProgress,
	    needsVisibilityToggle,
	    isHidden
	  ) {
	    if (supportsPersistence)
	      for (var node = workInProgress.child; null !== node; ) {
	        if (5 === node.tag) {
	          var instance = node.stateNode;
	          needsVisibilityToggle &&
	            isHidden &&
	            (instance = cloneHiddenInstance(
	              instance,
	              node.type,
	              node.memoizedProps
	            ));
	          appendChildToContainerChildSet(containerChildSet, instance);
	        } else if (6 === node.tag)
	          (instance = node.stateNode),
	            needsVisibilityToggle &&
	              isHidden &&
	              (instance = cloneHiddenTextInstance(
	                instance,
	                node.memoizedProps
	              )),
	            appendChildToContainerChildSet(containerChildSet, instance);
	        else if (4 !== node.tag)
	          if (22 === node.tag && null !== node.memoizedState)
	            (instance = node.child),
	              null !== instance && (instance.return = node),
	              appendAllChildrenToContainer(
	                containerChildSet,
	                node,
	                !(
	                  null !== node.memoizedProps &&
	                  "manual" === node.memoizedProps.mode
	                ),
	                true
	              );
	          else if (null !== node.child) {
	            node.child.return = node;
	            node = node.child;
	            continue;
	          }
	        if (node === workInProgress) break;
	        for (; null === node.sibling; ) {
	          if (null === node.return || node.return === workInProgress) return;
	          node = node.return;
	        }
	        node.sibling.return = node.return;
	        node = node.sibling;
	      }
	  }
	  function updateHostContainer(current, workInProgress) {
	    if (supportsPersistence && doesRequireClone(current, workInProgress)) {
	      current = workInProgress.stateNode;
	      var container = current.containerInfo,
	        newChildSet = createContainerChildSet();
	      appendAllChildrenToContainer(newChildSet, workInProgress, false, false);
	      current.pendingChildren = newChildSet;
	      markUpdate(workInProgress);
	      finalizeContainerChildren(container, newChildSet);
	    }
	  }
	  function updateHostComponent(current, workInProgress, type, newProps) {
	    if (supportsMutation)
	      current.memoizedProps !== newProps && markUpdate(workInProgress);
	    else if (supportsPersistence) {
	      var currentInstance = current.stateNode,
	        oldProps$94 = current.memoizedProps;
	      if (
	        (current = doesRequireClone(current, workInProgress)) ||
	        oldProps$94 !== newProps
	      ) {
	        var currentHostContext = contextStackCursor.current;
	        oldProps$94 = cloneInstance(
	          currentInstance,
	          type,
	          oldProps$94,
	          newProps,
	          !current,
	          null
	        );
	        oldProps$94 === currentInstance
	          ? (workInProgress.stateNode = currentInstance)
	          : (finalizeInitialChildren(
	              oldProps$94,
	              type,
	              newProps,
	              currentHostContext
	            ) && markUpdate(workInProgress),
	            (workInProgress.stateNode = oldProps$94),
	            current
	              ? appendAllChildren(oldProps$94, workInProgress, false, false)
	              : markUpdate(workInProgress));
	      } else workInProgress.stateNode = currentInstance;
	    }
	  }
	  function preloadInstanceAndSuspendIfNeeded(workInProgress, type, props) {
	    if (maySuspendCommit(type, props)) {
	      if (((workInProgress.flags |= 16777216), !preloadInstance(type, props)))
	        if (shouldRemainOnPreviousScreen()) workInProgress.flags |= 8192;
	        else
	          throw (
	            ((suspendedThenable = noopSuspenseyCommitThenable),
	            SuspenseyCommitException)
	          );
	    } else workInProgress.flags &= -16777217;
	  }
	  function preloadResourceAndSuspendIfNeeded(workInProgress, resource) {
	    if (mayResourceSuspendCommit(resource)) {
	      if (((workInProgress.flags |= 16777216), !preloadResource(resource)))
	        if (shouldRemainOnPreviousScreen()) workInProgress.flags |= 8192;
	        else
	          throw (
	            ((suspendedThenable = noopSuspenseyCommitThenable),
	            SuspenseyCommitException)
	          );
	    } else workInProgress.flags &= -16777217;
	  }
	  function scheduleRetryEffect(workInProgress, retryQueue) {
	    null !== retryQueue && (workInProgress.flags |= 4);
	    workInProgress.flags & 16384 &&
	      ((retryQueue =
	        22 !== workInProgress.tag ? claimNextRetryLane() : 536870912),
	      (workInProgress.lanes |= retryQueue),
	      (workInProgressSuspendedRetryLanes |= retryQueue));
	  }
	  function cutOffTailIfNeeded(renderState, hasRenderedATailFallback) {
	    if (!isHydrating)
	      switch (renderState.tailMode) {
	        case "hidden":
	          hasRenderedATailFallback = renderState.tail;
	          for (var lastTailNode = null; null !== hasRenderedATailFallback; )
	            null !== hasRenderedATailFallback.alternate &&
	              (lastTailNode = hasRenderedATailFallback),
	              (hasRenderedATailFallback = hasRenderedATailFallback.sibling);
	          null === lastTailNode
	            ? (renderState.tail = null)
	            : (lastTailNode.sibling = null);
	          break;
	        case "collapsed":
	          lastTailNode = renderState.tail;
	          for (var lastTailNode$96 = null; null !== lastTailNode; )
	            null !== lastTailNode.alternate && (lastTailNode$96 = lastTailNode),
	              (lastTailNode = lastTailNode.sibling);
	          null === lastTailNode$96
	            ? hasRenderedATailFallback || null === renderState.tail
	              ? (renderState.tail = null)
	              : (renderState.tail.sibling = null)
	            : (lastTailNode$96.sibling = null);
	      }
	  }
	  function bubbleProperties(completedWork) {
	    var didBailout =
	        null !== completedWork.alternate &&
	        completedWork.alternate.child === completedWork.child,
	      newChildLanes = 0,
	      subtreeFlags = 0;
	    if (didBailout)
	      for (var child$97 = completedWork.child; null !== child$97; )
	        (newChildLanes |= child$97.lanes | child$97.childLanes),
	          (subtreeFlags |= child$97.subtreeFlags & 31457280),
	          (subtreeFlags |= child$97.flags & 31457280),
	          (child$97.return = completedWork),
	          (child$97 = child$97.sibling);
	    else
	      for (child$97 = completedWork.child; null !== child$97; )
	        (newChildLanes |= child$97.lanes | child$97.childLanes),
	          (subtreeFlags |= child$97.subtreeFlags),
	          (subtreeFlags |= child$97.flags),
	          (child$97.return = completedWork),
	          (child$97 = child$97.sibling);
	    completedWork.subtreeFlags |= subtreeFlags;
	    completedWork.childLanes = newChildLanes;
	    return didBailout;
	  }
	  function completeWork(current, workInProgress, renderLanes) {
	    var newProps = workInProgress.pendingProps;
	    popTreeContext(workInProgress);
	    switch (workInProgress.tag) {
	      case 16:
	      case 15:
	      case 0:
	      case 11:
	      case 7:
	      case 8:
	      case 12:
	      case 9:
	      case 14:
	        return bubbleProperties(workInProgress), null;
	      case 1:
	        return bubbleProperties(workInProgress), null;
	      case 3:
	        renderLanes = workInProgress.stateNode;
	        newProps = null;
	        null !== current && (newProps = current.memoizedState.cache);
	        workInProgress.memoizedState.cache !== newProps &&
	          (workInProgress.flags |= 2048);
	        popProvider(CacheContext);
	        popHostContainer();
	        renderLanes.pendingContext &&
	          ((renderLanes.context = renderLanes.pendingContext),
	          (renderLanes.pendingContext = null));
	        if (null === current || null === current.child)
	          popHydrationState(workInProgress)
	            ? markUpdate(workInProgress)
	            : null === current ||
	              (current.memoizedState.isDehydrated &&
	                0 === (workInProgress.flags & 256)) ||
	              ((workInProgress.flags |= 1024),
	              null !== hydrationErrors &&
	                (queueRecoverableErrors(hydrationErrors),
	                (hydrationErrors = null)));
	        updateHostContainer(current, workInProgress);
	        bubbleProperties(workInProgress);
	        return null;
	      case 26:
	        if (supportsResources) {
	          renderLanes = workInProgress.type;
	          var nextResource = workInProgress.memoizedState;
	          null === current
	            ? (markUpdate(workInProgress),
	              null !== nextResource
	                ? (bubbleProperties(workInProgress),
	                  preloadResourceAndSuspendIfNeeded(
	                    workInProgress,
	                    nextResource
	                  ))
	                : (bubbleProperties(workInProgress),
	                  preloadInstanceAndSuspendIfNeeded(
	                    workInProgress,
	                    renderLanes,
	                    newProps
	                  )))
	            : nextResource
	              ? nextResource !== current.memoizedState
	                ? (markUpdate(workInProgress),
	                  bubbleProperties(workInProgress),
	                  preloadResourceAndSuspendIfNeeded(
	                    workInProgress,
	                    nextResource
	                  ))
	                : (bubbleProperties(workInProgress),
	                  (workInProgress.flags &= -16777217))
	              : (supportsMutation
	                  ? current.memoizedProps !== newProps &&
	                    markUpdate(workInProgress)
	                  : updateHostComponent(
	                      current,
	                      workInProgress,
	                      renderLanes,
	                      newProps
	                    ),
	                bubbleProperties(workInProgress),
	                preloadInstanceAndSuspendIfNeeded(
	                  workInProgress,
	                  renderLanes,
	                  newProps
	                ));
	          return null;
	        }
	      case 27:
	        if (supportsSingletons) {
	          popHostContext(workInProgress);
	          renderLanes = rootInstanceStackCursor.current;
	          nextResource = workInProgress.type;
	          if (null !== current && null != workInProgress.stateNode)
	            supportsMutation
	              ? current.memoizedProps !== newProps && markUpdate(workInProgress)
	              : updateHostComponent(
	                  current,
	                  workInProgress,
	                  nextResource,
	                  newProps
	                );
	          else {
	            if (!newProps) {
	              if (null === workInProgress.stateNode)
	                throw Error(formatProdErrorMessage(166));
	              bubbleProperties(workInProgress);
	              return null;
	            }
	            current = contextStackCursor.current;
	            popHydrationState(workInProgress)
	              ? prepareToHydrateHostInstance(workInProgress, current)
	              : ((current = resolveSingletonInstance(
	                  nextResource,
	                  newProps,
	                  renderLanes,
	                  current,
	                  true
	                )),
	                (workInProgress.stateNode = current),
	                markUpdate(workInProgress));
	          }
	          bubbleProperties(workInProgress);
	          return null;
	        }
	      case 5:
	        popHostContext(workInProgress);
	        renderLanes = workInProgress.type;
	        if (null !== current && null != workInProgress.stateNode)
	          updateHostComponent(current, workInProgress, renderLanes, newProps);
	        else {
	          if (!newProps) {
	            if (null === workInProgress.stateNode)
	              throw Error(formatProdErrorMessage(166));
	            bubbleProperties(workInProgress);
	            return null;
	          }
	          current = contextStackCursor.current;
	          popHydrationState(workInProgress)
	            ? prepareToHydrateHostInstance(workInProgress, current)
	            : ((nextResource = createInstance(
	                renderLanes,
	                newProps,
	                rootInstanceStackCursor.current,
	                current,
	                workInProgress
	              )),
	              appendAllChildren(nextResource, workInProgress, false, false),
	              (workInProgress.stateNode = nextResource),
	              finalizeInitialChildren(
	                nextResource,
	                renderLanes,
	                newProps,
	                current
	              ) && markUpdate(workInProgress));
	        }
	        bubbleProperties(workInProgress);
	        preloadInstanceAndSuspendIfNeeded(
	          workInProgress,
	          workInProgress.type,
	          workInProgress.pendingProps
	        );
	        return null;
	      case 6:
	        if (current && null != workInProgress.stateNode)
	          (renderLanes = current.memoizedProps),
	            supportsMutation
	              ? renderLanes !== newProps && markUpdate(workInProgress)
	              : supportsPersistence &&
	                (renderLanes !== newProps
	                  ? ((workInProgress.stateNode = createTextInstance(
	                      newProps,
	                      rootInstanceStackCursor.current,
	                      contextStackCursor.current,
	                      workInProgress
	                    )),
	                    markUpdate(workInProgress))
	                  : (workInProgress.stateNode = current.stateNode));
	        else {
	          if ("string" !== typeof newProps && null === workInProgress.stateNode)
	            throw Error(formatProdErrorMessage(166));
	          current = rootInstanceStackCursor.current;
	          renderLanes = contextStackCursor.current;
	          if (popHydrationState(workInProgress)) {
	            if (!supportsHydration) throw Error(formatProdErrorMessage(176));
	            current = workInProgress.stateNode;
	            renderLanes = workInProgress.memoizedProps;
	            newProps = null;
	            nextResource = hydrationParentFiber;
	            if (null !== nextResource)
	              switch (nextResource.tag) {
	                case 27:
	                case 5:
	                  newProps = nextResource.memoizedProps;
	              }
	            hydrateTextInstance(
	              current,
	              renderLanes,
	              workInProgress,
	              newProps
	            ) || throwOnHydrationMismatch(workInProgress);
	          } else
	            workInProgress.stateNode = createTextInstance(
	              newProps,
	              current,
	              renderLanes,
	              workInProgress
	            );
	        }
	        bubbleProperties(workInProgress);
	        return null;
	      case 13:
	        newProps = workInProgress.memoizedState;
	        if (
	          null === current ||
	          (null !== current.memoizedState &&
	            null !== current.memoizedState.dehydrated)
	        ) {
	          nextResource = popHydrationState(workInProgress);
	          if (null !== newProps && null !== newProps.dehydrated) {
	            if (null === current) {
	              if (!nextResource) throw Error(formatProdErrorMessage(318));
	              if (!supportsHydration) throw Error(formatProdErrorMessage(344));
	              nextResource = workInProgress.memoizedState;
	              nextResource =
	                null !== nextResource ? nextResource.dehydrated : null;
	              if (!nextResource) throw Error(formatProdErrorMessage(317));
	              hydrateSuspenseInstance(nextResource, workInProgress);
	            } else
	              resetHydrationState(),
	                0 === (workInProgress.flags & 128) &&
	                  (workInProgress.memoizedState = null),
	                (workInProgress.flags |= 4);
	            bubbleProperties(workInProgress);
	            nextResource = false;
	          } else
	            null !== hydrationErrors &&
	              (queueRecoverableErrors(hydrationErrors),
	              (hydrationErrors = null)),
	              (nextResource = true);
	          if (!nextResource) {
	            if (workInProgress.flags & 256)
	              return popSuspenseHandler(workInProgress), workInProgress;
	            popSuspenseHandler(workInProgress);
	            return null;
	          }
	        }
	        popSuspenseHandler(workInProgress);
	        if (0 !== (workInProgress.flags & 128))
	          return (workInProgress.lanes = renderLanes), workInProgress;
	        renderLanes = null !== newProps;
	        current = null !== current && null !== current.memoizedState;
	        if (renderLanes) {
	          newProps = workInProgress.child;
	          nextResource = null;
	          null !== newProps.alternate &&
	            null !== newProps.alternate.memoizedState &&
	            null !== newProps.alternate.memoizedState.cachePool &&
	            (nextResource = newProps.alternate.memoizedState.cachePool.pool);
	          var cache$110 = null;
	          null !== newProps.memoizedState &&
	            null !== newProps.memoizedState.cachePool &&
	            (cache$110 = newProps.memoizedState.cachePool.pool);
	          cache$110 !== nextResource && (newProps.flags |= 2048);
	        }
	        renderLanes !== current &&
	          renderLanes &&
	          (workInProgress.child.flags |= 8192);
	        scheduleRetryEffect(workInProgress, workInProgress.updateQueue);
	        bubbleProperties(workInProgress);
	        return null;
	      case 4:
	        return (
	          popHostContainer(),
	          updateHostContainer(current, workInProgress),
	          null === current &&
	            preparePortalMount(workInProgress.stateNode.containerInfo),
	          bubbleProperties(workInProgress),
	          null
	        );
	      case 10:
	        return (
	          popProvider(workInProgress.type),
	          bubbleProperties(workInProgress),
	          null
	        );
	      case 19:
	        pop(suspenseStackCursor);
	        nextResource = workInProgress.memoizedState;
	        if (null === nextResource)
	          return bubbleProperties(workInProgress), null;
	        newProps = 0 !== (workInProgress.flags & 128);
	        cache$110 = nextResource.rendering;
	        if (null === cache$110)
	          if (newProps) cutOffTailIfNeeded(nextResource, false);
	          else {
	            if (
	              0 !== workInProgressRootExitStatus ||
	              (null !== current && 0 !== (current.flags & 128))
	            )
	              for (current = workInProgress.child; null !== current; ) {
	                cache$110 = findFirstSuspended(current);
	                if (null !== cache$110) {
	                  workInProgress.flags |= 128;
	                  cutOffTailIfNeeded(nextResource, false);
	                  current = cache$110.updateQueue;
	                  workInProgress.updateQueue = current;
	                  scheduleRetryEffect(workInProgress, current);
	                  workInProgress.subtreeFlags = 0;
	                  current = renderLanes;
	                  for (
	                    renderLanes = workInProgress.child;
	                    null !== renderLanes;

	                  )
	                    resetWorkInProgress(renderLanes, current),
	                      (renderLanes = renderLanes.sibling);
	                  push(
	                    suspenseStackCursor,
	                    (suspenseStackCursor.current & 1) | 2
	                  );
	                  return workInProgress.child;
	                }
	                current = current.sibling;
	              }
	            null !== nextResource.tail &&
	              now() > workInProgressRootRenderTargetTime &&
	              ((workInProgress.flags |= 128),
	              (newProps = true),
	              cutOffTailIfNeeded(nextResource, false),
	              (workInProgress.lanes = 4194304));
	          }
	        else {
	          if (!newProps)
	            if (((current = findFirstSuspended(cache$110)), null !== current)) {
	              if (
	                ((workInProgress.flags |= 128),
	                (newProps = true),
	                (current = current.updateQueue),
	                (workInProgress.updateQueue = current),
	                scheduleRetryEffect(workInProgress, current),
	                cutOffTailIfNeeded(nextResource, true),
	                null === nextResource.tail &&
	                  "hidden" === nextResource.tailMode &&
	                  !cache$110.alternate &&
	                  !isHydrating)
	              )
	                return bubbleProperties(workInProgress), null;
	            } else
	              2 * now() - nextResource.renderingStartTime >
	                workInProgressRootRenderTargetTime &&
	                536870912 !== renderLanes &&
	                ((workInProgress.flags |= 128),
	                (newProps = true),
	                cutOffTailIfNeeded(nextResource, false),
	                (workInProgress.lanes = 4194304));
	          nextResource.isBackwards
	            ? ((cache$110.sibling = workInProgress.child),
	              (workInProgress.child = cache$110))
	            : ((current = nextResource.last),
	              null !== current
	                ? (current.sibling = cache$110)
	                : (workInProgress.child = cache$110),
	              (nextResource.last = cache$110));
	        }
	        if (null !== nextResource.tail)
	          return (
	            (workInProgress = nextResource.tail),
	            (nextResource.rendering = workInProgress),
	            (nextResource.tail = workInProgress.sibling),
	            (nextResource.renderingStartTime = now()),
	            (workInProgress.sibling = null),
	            (current = suspenseStackCursor.current),
	            push(
	              suspenseStackCursor,
	              newProps ? (current & 1) | 2 : current & 1
	            ),
	            workInProgress
	          );
	        bubbleProperties(workInProgress);
	        return null;
	      case 22:
	      case 23:
	        return (
	          popSuspenseHandler(workInProgress),
	          popHiddenContext(),
	          (newProps = null !== workInProgress.memoizedState),
	          null !== current
	            ? (null !== current.memoizedState) !== newProps &&
	              (workInProgress.flags |= 8192)
	            : newProps && (workInProgress.flags |= 8192),
	          newProps
	            ? 0 !== (renderLanes & 536870912) &&
	              0 === (workInProgress.flags & 128) &&
	              (bubbleProperties(workInProgress),
	              workInProgress.subtreeFlags & 6 && (workInProgress.flags |= 8192))
	            : bubbleProperties(workInProgress),
	          (renderLanes = workInProgress.updateQueue),
	          null !== renderLanes &&
	            scheduleRetryEffect(workInProgress, renderLanes.retryQueue),
	          (renderLanes = null),
	          null !== current &&
	            null !== current.memoizedState &&
	            null !== current.memoizedState.cachePool &&
	            (renderLanes = current.memoizedState.cachePool.pool),
	          (newProps = null),
	          null !== workInProgress.memoizedState &&
	            null !== workInProgress.memoizedState.cachePool &&
	            (newProps = workInProgress.memoizedState.cachePool.pool),
	          newProps !== renderLanes && (workInProgress.flags |= 2048),
	          null !== current && pop(resumedCache),
	          null
	        );
	      case 24:
	        return (
	          (renderLanes = null),
	          null !== current && (renderLanes = current.memoizedState.cache),
	          workInProgress.memoizedState.cache !== renderLanes &&
	            (workInProgress.flags |= 2048),
	          popProvider(CacheContext),
	          bubbleProperties(workInProgress),
	          null
	        );
	      case 25:
	        return null;
	    }
	    throw Error(formatProdErrorMessage(156, workInProgress.tag));
	  }
	  function unwindWork(current, workInProgress) {
	    popTreeContext(workInProgress);
	    switch (workInProgress.tag) {
	      case 1:
	        return (
	          (current = workInProgress.flags),
	          current & 65536
	            ? ((workInProgress.flags = (current & -65537) | 128),
	              workInProgress)
	            : null
	        );
	      case 3:
	        return (
	          popProvider(CacheContext),
	          popHostContainer(),
	          (current = workInProgress.flags),
	          0 !== (current & 65536) && 0 === (current & 128)
	            ? ((workInProgress.flags = (current & -65537) | 128),
	              workInProgress)
	            : null
	        );
	      case 26:
	      case 27:
	      case 5:
	        return popHostContext(workInProgress), null;
	      case 13:
	        popSuspenseHandler(workInProgress);
	        current = workInProgress.memoizedState;
	        if (null !== current && null !== current.dehydrated) {
	          if (null === workInProgress.alternate)
	            throw Error(formatProdErrorMessage(340));
	          resetHydrationState();
	        }
	        current = workInProgress.flags;
	        return current & 65536
	          ? ((workInProgress.flags = (current & -65537) | 128), workInProgress)
	          : null;
	      case 19:
	        return pop(suspenseStackCursor), null;
	      case 4:
	        return popHostContainer(), null;
	      case 10:
	        return popProvider(workInProgress.type), null;
	      case 22:
	      case 23:
	        return (
	          popSuspenseHandler(workInProgress),
	          popHiddenContext(),
	          null !== current && pop(resumedCache),
	          (current = workInProgress.flags),
	          current & 65536
	            ? ((workInProgress.flags = (current & -65537) | 128),
	              workInProgress)
	            : null
	        );
	      case 24:
	        return popProvider(CacheContext), null;
	      case 25:
	        return null;
	      default:
	        return null;
	    }
	  }
	  function unwindInterruptedWork(current, interruptedWork) {
	    popTreeContext(interruptedWork);
	    switch (interruptedWork.tag) {
	      case 3:
	        popProvider(CacheContext);
	        popHostContainer();
	        break;
	      case 26:
	      case 27:
	      case 5:
	        popHostContext(interruptedWork);
	        break;
	      case 4:
	        popHostContainer();
	        break;
	      case 13:
	        popSuspenseHandler(interruptedWork);
	        break;
	      case 19:
	        pop(suspenseStackCursor);
	        break;
	      case 10:
	        popProvider(interruptedWork.type);
	        break;
	      case 22:
	      case 23:
	        popSuspenseHandler(interruptedWork);
	        popHiddenContext();
	        null !== current && pop(resumedCache);
	        break;
	      case 24:
	        popProvider(CacheContext);
	    }
	  }
	  function commitHookEffectListMount(flags, finishedWork) {
	    try {
	      var updateQueue = finishedWork.updateQueue,
	        lastEffect = null !== updateQueue ? updateQueue.lastEffect : null;
	      if (null !== lastEffect) {
	        var firstEffect = lastEffect.next;
	        updateQueue = firstEffect;
	        do {
	          if ((updateQueue.tag & flags) === flags) {
	            lastEffect = void 0;
	            var create = updateQueue.create,
	              inst = updateQueue.inst;
	            lastEffect = create();
	            inst.destroy = lastEffect;
	          }
	          updateQueue = updateQueue.next;
	        } while (updateQueue !== firstEffect);
	      }
	    } catch (error) {
	      captureCommitPhaseError(finishedWork, finishedWork.return, error);
	    }
	  }
	  function commitHookEffectListUnmount(
	    flags,
	    finishedWork,
	    nearestMountedAncestor$jscomp$0
	  ) {
	    try {
	      var updateQueue = finishedWork.updateQueue,
	        lastEffect = null !== updateQueue ? updateQueue.lastEffect : null;
	      if (null !== lastEffect) {
	        var firstEffect = lastEffect.next;
	        updateQueue = firstEffect;
	        do {
	          if ((updateQueue.tag & flags) === flags) {
	            var inst = updateQueue.inst,
	              destroy = inst.destroy;
	            if (void 0 !== destroy) {
	              inst.destroy = void 0;
	              lastEffect = finishedWork;
	              var nearestMountedAncestor = nearestMountedAncestor$jscomp$0;
	              try {
	                destroy();
	              } catch (error) {
	                captureCommitPhaseError(
	                  lastEffect,
	                  nearestMountedAncestor,
	                  error
	                );
	              }
	            }
	          }
	          updateQueue = updateQueue.next;
	        } while (updateQueue !== firstEffect);
	      }
	    } catch (error) {
	      captureCommitPhaseError(finishedWork, finishedWork.return, error);
	    }
	  }
	  function commitClassCallbacks(finishedWork) {
	    var updateQueue = finishedWork.updateQueue;
	    if (null !== updateQueue) {
	      var instance = finishedWork.stateNode;
	      try {
	        commitCallbacks(updateQueue, instance);
	      } catch (error) {
	        captureCommitPhaseError(finishedWork, finishedWork.return, error);
	      }
	    }
	  }
	  function safelyCallComponentWillUnmount(
	    current,
	    nearestMountedAncestor,
	    instance
	  ) {
	    instance.props = resolveClassComponentProps(
	      current.type,
	      current.memoizedProps
	    );
	    instance.state = current.memoizedState;
	    try {
	      instance.componentWillUnmount();
	    } catch (error) {
	      captureCommitPhaseError(current, nearestMountedAncestor, error);
	    }
	  }
	  function safelyAttachRef(current, nearestMountedAncestor) {
	    try {
	      var ref = current.ref;
	      if (null !== ref) {
	        var instance = current.stateNode;
	        switch (current.tag) {
	          case 26:
	          case 27:
	          case 5:
	            var instanceToUse = getPublicInstance(instance);
	            break;
	          default:
	            instanceToUse = instance;
	        }
	        "function" === typeof ref
	          ? (current.refCleanup = ref(instanceToUse))
	          : (ref.current = instanceToUse);
	      }
	    } catch (error) {
	      captureCommitPhaseError(current, nearestMountedAncestor, error);
	    }
	  }
	  function safelyDetachRef(current, nearestMountedAncestor) {
	    var ref = current.ref,
	      refCleanup = current.refCleanup;
	    if (null !== ref)
	      if ("function" === typeof refCleanup)
	        try {
	          refCleanup();
	        } catch (error) {
	          captureCommitPhaseError(current, nearestMountedAncestor, error);
	        } finally {
	          (current.refCleanup = null),
	            (current = current.alternate),
	            null != current && (current.refCleanup = null);
	        }
	      else if ("function" === typeof ref)
	        try {
	          ref(null);
	        } catch (error$126) {
	          captureCommitPhaseError(current, nearestMountedAncestor, error$126);
	        }
	      else ref.current = null;
	  }
	  function commitHostMount(finishedWork) {
	    var type = finishedWork.type,
	      props = finishedWork.memoizedProps,
	      instance = finishedWork.stateNode;
	    try {
	      commitMount(instance, type, props, finishedWork);
	    } catch (error) {
	      captureCommitPhaseError(finishedWork, finishedWork.return, error);
	    }
	  }
	  function commitHostUpdate(finishedWork, newProps, oldProps) {
	    try {
	      commitUpdate(
	        finishedWork.stateNode,
	        finishedWork.type,
	        oldProps,
	        newProps,
	        finishedWork
	      );
	    } catch (error) {
	      captureCommitPhaseError(finishedWork, finishedWork.return, error);
	    }
	  }
	  function isHostParent(fiber) {
	    return (
	      5 === fiber.tag ||
	      3 === fiber.tag ||
	      (supportsResources ? 26 === fiber.tag : false) ||
	      (supportsSingletons ? 27 === fiber.tag : false) ||
	      4 === fiber.tag
	    );
	  }
	  function getHostSibling(fiber) {
	    a: for (;;) {
	      for (; null === fiber.sibling; ) {
	        if (null === fiber.return || isHostParent(fiber.return)) return null;
	        fiber = fiber.return;
	      }
	      fiber.sibling.return = fiber.return;
	      for (
	        fiber = fiber.sibling;
	        5 !== fiber.tag &&
	        6 !== fiber.tag &&
	        (supportsSingletons ? 27 !== fiber.tag : 1) &&
	        18 !== fiber.tag;

	      ) {
	        if (fiber.flags & 2) continue a;
	        if (null === fiber.child || 4 === fiber.tag) continue a;
	        else (fiber.child.return = fiber), (fiber = fiber.child);
	      }
	      if (!(fiber.flags & 2)) return fiber.stateNode;
	    }
	  }
	  function insertOrAppendPlacementNodeIntoContainer(node, before, parent) {
	    var tag = node.tag;
	    if (5 === tag || 6 === tag)
	      (node = node.stateNode),
	        before
	          ? insertInContainerBefore(parent, node, before)
	          : appendChildToContainer(parent, node);
	    else if (
	      !(4 === tag || (supportsSingletons && 27 === tag)) &&
	      ((node = node.child), null !== node)
	    )
	      for (
	        insertOrAppendPlacementNodeIntoContainer(node, before, parent),
	          node = node.sibling;
	        null !== node;

	      )
	        insertOrAppendPlacementNodeIntoContainer(node, before, parent),
	          (node = node.sibling);
	  }
	  function insertOrAppendPlacementNode(node, before, parent) {
	    var tag = node.tag;
	    if (5 === tag || 6 === tag)
	      (node = node.stateNode),
	        before ? insertBefore(parent, node, before) : appendChild(parent, node);
	    else if (
	      !(4 === tag || (supportsSingletons && 27 === tag)) &&
	      ((node = node.child), null !== node)
	    )
	      for (
	        insertOrAppendPlacementNode(node, before, parent), node = node.sibling;
	        null !== node;

	      )
	        insertOrAppendPlacementNode(node, before, parent),
	          (node = node.sibling);
	  }
	  function commitHostPortalContainerChildren(
	    portal,
	    finishedWork,
	    pendingChildren
	  ) {
	    portal = portal.containerInfo;
	    try {
	      replaceContainerChildren(portal, pendingChildren);
	    } catch (error) {
	      captureCommitPhaseError(finishedWork, finishedWork.return, error);
	    }
	  }
	  function commitBeforeMutationEffects(root, firstChild) {
	    prepareForCommit(root.containerInfo);
	    for (nextEffect = firstChild; null !== nextEffect; )
	      if (
	        ((root = nextEffect),
	        (firstChild = root.child),
	        0 !== (root.subtreeFlags & 1028) && null !== firstChild)
	      )
	        (firstChild.return = root), (nextEffect = firstChild);
	      else
	        for (; null !== nextEffect; ) {
	          root = nextEffect;
	          var current = root.alternate;
	          firstChild = root.flags;
	          switch (root.tag) {
	            case 0:
	              break;
	            case 11:
	            case 15:
	              break;
	            case 1:
	              if (0 !== (firstChild & 1024) && null !== current) {
	                firstChild = undefined;
	                var finishedWork = root,
	                  prevProps = current.memoizedProps;
	                current = current.memoizedState;
	                var instance = finishedWork.stateNode;
	                try {
	                  var resolvedPrevProps = resolveClassComponentProps(
	                    finishedWork.type,
	                    prevProps,
	                    finishedWork.elementType === finishedWork.type
	                  );
	                  firstChild = instance.getSnapshotBeforeUpdate(
	                    resolvedPrevProps,
	                    current
	                  );
	                  instance.__reactInternalSnapshotBeforeUpdate = firstChild;
	                } catch (error) {
	                  captureCommitPhaseError(
	                    finishedWork,
	                    finishedWork.return,
	                    error
	                  );
	                }
	              }
	              break;
	            case 3:
	              0 !== (firstChild & 1024) &&
	                supportsMutation &&
	                clearContainer(root.stateNode.containerInfo);
	              break;
	            case 5:
	            case 26:
	            case 27:
	            case 6:
	            case 4:
	            case 17:
	              break;
	            default:
	              if (0 !== (firstChild & 1024))
	                throw Error(formatProdErrorMessage(163));
	          }
	          firstChild = root.sibling;
	          if (null !== firstChild) {
	            firstChild.return = root.return;
	            nextEffect = firstChild;
	            break;
	          }
	          nextEffect = root.return;
	        }
	    resolvedPrevProps = shouldFireAfterActiveInstanceBlur;
	    shouldFireAfterActiveInstanceBlur = false;
	    return resolvedPrevProps;
	  }
	  function commitLayoutEffectOnFiber(finishedRoot, current, finishedWork) {
	    var flags = finishedWork.flags;
	    switch (finishedWork.tag) {
	      case 0:
	      case 11:
	      case 15:
	        recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
	        flags & 4 && commitHookEffectListMount(5, finishedWork);
	        break;
	      case 1:
	        recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
	        if (flags & 4)
	          if (((finishedRoot = finishedWork.stateNode), null === current))
	            try {
	              finishedRoot.componentDidMount();
	            } catch (error) {
	              captureCommitPhaseError(finishedWork, finishedWork.return, error);
	            }
	          else {
	            var prevProps = resolveClassComponentProps(
	              finishedWork.type,
	              current.memoizedProps
	            );
	            current = current.memoizedState;
	            try {
	              finishedRoot.componentDidUpdate(
	                prevProps,
	                current,
	                finishedRoot.__reactInternalSnapshotBeforeUpdate
	              );
	            } catch (error$125) {
	              captureCommitPhaseError(
	                finishedWork,
	                finishedWork.return,
	                error$125
	              );
	            }
	          }
	        flags & 64 && commitClassCallbacks(finishedWork);
	        flags & 512 && safelyAttachRef(finishedWork, finishedWork.return);
	        break;
	      case 3:
	        recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
	        if (
	          flags & 64 &&
	          ((flags = finishedWork.updateQueue), null !== flags)
	        ) {
	          finishedRoot = null;
	          if (null !== finishedWork.child)
	            switch (finishedWork.child.tag) {
	              case 27:
	              case 5:
	                finishedRoot = getPublicInstance(finishedWork.child.stateNode);
	                break;
	              case 1:
	                finishedRoot = finishedWork.child.stateNode;
	            }
	          try {
	            commitCallbacks(flags, finishedRoot);
	          } catch (error) {
	            captureCommitPhaseError(finishedWork, finishedWork.return, error);
	          }
	        }
	        break;
	      case 26:
	        if (supportsResources) {
	          recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
	          flags & 512 && safelyAttachRef(finishedWork, finishedWork.return);
	          break;
	        }
	      case 27:
	      case 5:
	        recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
	        null === current && flags & 4 && commitHostMount(finishedWork);
	        flags & 512 && safelyAttachRef(finishedWork, finishedWork.return);
	        break;
	      case 12:
	        recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
	        break;
	      case 13:
	        recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
	        flags & 4 &&
	          commitSuspenseHydrationCallbacks(finishedRoot, finishedWork);
	        break;
	      case 22:
	        prevProps =
	          null !== finishedWork.memoizedState || offscreenSubtreeIsHidden;
	        if (!prevProps) {
	          current =
	            (null !== current && null !== current.memoizedState) ||
	            offscreenSubtreeWasHidden;
	          var prevOffscreenSubtreeIsHidden = offscreenSubtreeIsHidden,
	            prevOffscreenSubtreeWasHidden = offscreenSubtreeWasHidden;
	          offscreenSubtreeIsHidden = prevProps;
	          (offscreenSubtreeWasHidden = current) &&
	          !prevOffscreenSubtreeWasHidden
	            ? recursivelyTraverseReappearLayoutEffects(
	                finishedRoot,
	                finishedWork,
	                0 !== (finishedWork.subtreeFlags & 8772)
	              )
	            : recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
	          offscreenSubtreeIsHidden = prevOffscreenSubtreeIsHidden;
	          offscreenSubtreeWasHidden = prevOffscreenSubtreeWasHidden;
	        }
	        flags & 512 &&
	          ("manual" === finishedWork.memoizedProps.mode
	            ? safelyAttachRef(finishedWork, finishedWork.return)
	            : safelyDetachRef(finishedWork, finishedWork.return));
	        break;
	      default:
	        recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
	    }
	  }
	  function detachFiberAfterEffects(fiber) {
	    var alternate = fiber.alternate;
	    null !== alternate &&
	      ((fiber.alternate = null), detachFiberAfterEffects(alternate));
	    fiber.child = null;
	    fiber.deletions = null;
	    fiber.sibling = null;
	    5 === fiber.tag &&
	      ((alternate = fiber.stateNode),
	      null !== alternate && detachDeletedInstance(alternate));
	    fiber.stateNode = null;
	    fiber.return = null;
	    fiber.dependencies = null;
	    fiber.memoizedProps = null;
	    fiber.memoizedState = null;
	    fiber.pendingProps = null;
	    fiber.stateNode = null;
	    fiber.updateQueue = null;
	  }
	  function recursivelyTraverseDeletionEffects(
	    finishedRoot,
	    nearestMountedAncestor,
	    parent
	  ) {
	    for (parent = parent.child; null !== parent; )
	      commitDeletionEffectsOnFiber(
	        finishedRoot,
	        nearestMountedAncestor,
	        parent
	      ),
	        (parent = parent.sibling);
	  }
	  function commitDeletionEffectsOnFiber(
	    finishedRoot,
	    nearestMountedAncestor,
	    deletedFiber
	  ) {
	    if (injectedHook && "function" === typeof injectedHook.onCommitFiberUnmount)
	      try {
	        injectedHook.onCommitFiberUnmount(rendererID, deletedFiber);
	      } catch (err) {}
	    switch (deletedFiber.tag) {
	      case 26:
	        if (supportsResources) {
	          offscreenSubtreeWasHidden ||
	            safelyDetachRef(deletedFiber, nearestMountedAncestor);
	          recursivelyTraverseDeletionEffects(
	            finishedRoot,
	            nearestMountedAncestor,
	            deletedFiber
	          );
	          deletedFiber.memoizedState
	            ? releaseResource(deletedFiber.memoizedState)
	            : deletedFiber.stateNode &&
	              unmountHoistable(deletedFiber.stateNode);
	          break;
	        }
	      case 27:
	        if (supportsSingletons) {
	          offscreenSubtreeWasHidden ||
	            safelyDetachRef(deletedFiber, nearestMountedAncestor);
	          var prevHostParent = hostParent,
	            prevHostParentIsContainer = hostParentIsContainer;
	          hostParent = deletedFiber.stateNode;
	          recursivelyTraverseDeletionEffects(
	            finishedRoot,
	            nearestMountedAncestor,
	            deletedFiber
	          );
	          releaseSingletonInstance(deletedFiber.stateNode);
	          hostParent = prevHostParent;
	          hostParentIsContainer = prevHostParentIsContainer;
	          break;
	        }
	      case 5:
	        offscreenSubtreeWasHidden ||
	          safelyDetachRef(deletedFiber, nearestMountedAncestor);
	      case 6:
	        if (supportsMutation) {
	          if (
	            ((prevHostParent = hostParent),
	            (prevHostParentIsContainer = hostParentIsContainer),
	            (hostParent = null),
	            recursivelyTraverseDeletionEffects(
	              finishedRoot,
	              nearestMountedAncestor,
	              deletedFiber
	            ),
	            (hostParent = prevHostParent),
	            (hostParentIsContainer = prevHostParentIsContainer),
	            null !== hostParent)
	          )
	            if (hostParentIsContainer)
	              try {
	                removeChildFromContainer(hostParent, deletedFiber.stateNode);
	              } catch (error) {
	                captureCommitPhaseError(
	                  deletedFiber,
	                  nearestMountedAncestor,
	                  error
	                );
	              }
	            else
	              try {
	                removeChild(hostParent, deletedFiber.stateNode);
	              } catch (error) {
	                captureCommitPhaseError(
	                  deletedFiber,
	                  nearestMountedAncestor,
	                  error
	                );
	              }
	        } else
	          recursivelyTraverseDeletionEffects(
	            finishedRoot,
	            nearestMountedAncestor,
	            deletedFiber
	          );
	        break;
	      case 18:
	        supportsMutation &&
	          null !== hostParent &&
	          (hostParentIsContainer
	            ? clearSuspenseBoundaryFromContainer(
	                hostParent,
	                deletedFiber.stateNode
	              )
	            : clearSuspenseBoundary(hostParent, deletedFiber.stateNode));
	        break;
	      case 4:
	        supportsMutation
	          ? ((prevHostParent = hostParent),
	            (prevHostParentIsContainer = hostParentIsContainer),
	            (hostParent = deletedFiber.stateNode.containerInfo),
	            (hostParentIsContainer = true),
	            recursivelyTraverseDeletionEffects(
	              finishedRoot,
	              nearestMountedAncestor,
	              deletedFiber
	            ),
	            (hostParent = prevHostParent),
	            (hostParentIsContainer = prevHostParentIsContainer))
	          : (supportsPersistence &&
	              commitHostPortalContainerChildren(
	                deletedFiber.stateNode,
	                deletedFiber,
	                createContainerChildSet()
	              ),
	            recursivelyTraverseDeletionEffects(
	              finishedRoot,
	              nearestMountedAncestor,
	              deletedFiber
	            ));
	        break;
	      case 0:
	      case 11:
	      case 14:
	      case 15:
	        offscreenSubtreeWasHidden ||
	          commitHookEffectListUnmount(2, deletedFiber, nearestMountedAncestor);
	        offscreenSubtreeWasHidden ||
	          commitHookEffectListUnmount(4, deletedFiber, nearestMountedAncestor);
	        recursivelyTraverseDeletionEffects(
	          finishedRoot,
	          nearestMountedAncestor,
	          deletedFiber
	        );
	        break;
	      case 1:
	        offscreenSubtreeWasHidden ||
	          (safelyDetachRef(deletedFiber, nearestMountedAncestor),
	          (prevHostParent = deletedFiber.stateNode),
	          "function" === typeof prevHostParent.componentWillUnmount &&
	            safelyCallComponentWillUnmount(
	              deletedFiber,
	              nearestMountedAncestor,
	              prevHostParent
	            ));
	        recursivelyTraverseDeletionEffects(
	          finishedRoot,
	          nearestMountedAncestor,
	          deletedFiber
	        );
	        break;
	      case 21:
	        recursivelyTraverseDeletionEffects(
	          finishedRoot,
	          nearestMountedAncestor,
	          deletedFiber
	        );
	        break;
	      case 22:
	        offscreenSubtreeWasHidden ||
	          safelyDetachRef(deletedFiber, nearestMountedAncestor);
	        offscreenSubtreeWasHidden =
	          (prevHostParent = offscreenSubtreeWasHidden) ||
	          null !== deletedFiber.memoizedState;
	        recursivelyTraverseDeletionEffects(
	          finishedRoot,
	          nearestMountedAncestor,
	          deletedFiber
	        );
	        offscreenSubtreeWasHidden = prevHostParent;
	        break;
	      default:
	        recursivelyTraverseDeletionEffects(
	          finishedRoot,
	          nearestMountedAncestor,
	          deletedFiber
	        );
	    }
	  }
	  function commitSuspenseHydrationCallbacks(finishedRoot, finishedWork) {
	    if (
	      supportsHydration &&
	      null === finishedWork.memoizedState &&
	      ((finishedRoot = finishedWork.alternate),
	      null !== finishedRoot &&
	        ((finishedRoot = finishedRoot.memoizedState),
	        null !== finishedRoot &&
	          ((finishedRoot = finishedRoot.dehydrated), null !== finishedRoot)))
	    )
	      try {
	        commitHydratedSuspenseInstance(finishedRoot);
	      } catch (error) {
	        captureCommitPhaseError(finishedWork, finishedWork.return, error);
	      }
	  }
	  function getRetryCache(finishedWork) {
	    switch (finishedWork.tag) {
	      case 13:
	      case 19:
	        var retryCache = finishedWork.stateNode;
	        null === retryCache &&
	          (retryCache = finishedWork.stateNode = new PossiblyWeakSet());
	        return retryCache;
	      case 22:
	        return (
	          (finishedWork = finishedWork.stateNode),
	          (retryCache = finishedWork._retryCache),
	          null === retryCache &&
	            (retryCache = finishedWork._retryCache = new PossiblyWeakSet()),
	          retryCache
	        );
	      default:
	        throw Error(formatProdErrorMessage(435, finishedWork.tag));
	    }
	  }
	  function attachSuspenseRetryListeners(finishedWork, wakeables) {
	    var retryCache = getRetryCache(finishedWork);
	    wakeables.forEach(function (wakeable) {
	      var retry = resolveRetryWakeable.bind(null, finishedWork, wakeable);
	      retryCache.has(wakeable) ||
	        (retryCache.add(wakeable), wakeable.then(retry, retry));
	    });
	  }
	  function recursivelyTraverseMutationEffects(root$jscomp$0, parentFiber) {
	    var deletions = parentFiber.deletions;
	    if (null !== deletions)
	      for (var i = 0; i < deletions.length; i++) {
	        var childToDelete = deletions[i],
	          root = root$jscomp$0,
	          returnFiber = parentFiber;
	        if (supportsMutation) {
	          var parent = returnFiber;
	          a: for (; null !== parent; ) {
	            switch (parent.tag) {
	              case 27:
	              case 5:
	                hostParent = parent.stateNode;
	                hostParentIsContainer = false;
	                break a;
	              case 3:
	                hostParent = parent.stateNode.containerInfo;
	                hostParentIsContainer = true;
	                break a;
	              case 4:
	                hostParent = parent.stateNode.containerInfo;
	                hostParentIsContainer = true;
	                break a;
	            }
	            parent = parent.return;
	          }
	          if (null === hostParent) throw Error(formatProdErrorMessage(160));
	          commitDeletionEffectsOnFiber(root, returnFiber, childToDelete);
	          hostParent = null;
	          hostParentIsContainer = false;
	        } else commitDeletionEffectsOnFiber(root, returnFiber, childToDelete);
	        root = childToDelete.alternate;
	        null !== root && (root.return = null);
	        childToDelete.return = null;
	      }
	    if (parentFiber.subtreeFlags & 13878)
	      for (parentFiber = parentFiber.child; null !== parentFiber; )
	        commitMutationEffectsOnFiber(parentFiber, root$jscomp$0),
	          (parentFiber = parentFiber.sibling);
	  }
	  function commitMutationEffectsOnFiber(finishedWork, root) {
	    var current = finishedWork.alternate,
	      flags = finishedWork.flags;
	    switch (finishedWork.tag) {
	      case 0:
	      case 11:
	      case 14:
	      case 15:
	        recursivelyTraverseMutationEffects(root, finishedWork);
	        commitReconciliationEffects(finishedWork);
	        flags & 4 &&
	          (commitHookEffectListUnmount(3, finishedWork, finishedWork.return),
	          commitHookEffectListMount(3, finishedWork),
	          commitHookEffectListUnmount(5, finishedWork, finishedWork.return));
	        break;
	      case 1:
	        recursivelyTraverseMutationEffects(root, finishedWork);
	        commitReconciliationEffects(finishedWork);
	        flags & 512 &&
	          (offscreenSubtreeWasHidden ||
	            null === current ||
	            safelyDetachRef(current, current.return));
	        flags & 64 &&
	          offscreenSubtreeIsHidden &&
	          ((finishedWork = finishedWork.updateQueue),
	          null !== finishedWork &&
	            ((flags = finishedWork.callbacks),
	            null !== flags &&
	              ((current = finishedWork.shared.hiddenCallbacks),
	              (finishedWork.shared.hiddenCallbacks =
	                null === current ? flags : current.concat(flags)))));
	        break;
	      case 26:
	        if (supportsResources) {
	          var hoistableRoot = currentHoistableRoot;
	          recursivelyTraverseMutationEffects(root, finishedWork);
	          commitReconciliationEffects(finishedWork);
	          flags & 512 &&
	            (offscreenSubtreeWasHidden ||
	              null === current ||
	              safelyDetachRef(current, current.return));
	          flags & 4 &&
	            ((flags = null !== current ? current.memoizedState : null),
	            (root = finishedWork.memoizedState),
	            null === current
	              ? null === root
	                ? null === finishedWork.stateNode
	                  ? (finishedWork.stateNode = hydrateHoistable(
	                      hoistableRoot,
	                      finishedWork.type,
	                      finishedWork.memoizedProps,
	                      finishedWork
	                    ))
	                  : mountHoistable(
	                      hoistableRoot,
	                      finishedWork.type,
	                      finishedWork.stateNode
	                    )
	                : (finishedWork.stateNode = acquireResource(
	                    hoistableRoot,
	                    root,
	                    finishedWork.memoizedProps
	                  ))
	              : flags !== root
	                ? (null === flags
	                    ? null !== current.stateNode &&
	                      unmountHoistable(current.stateNode)
	                    : releaseResource(flags),
	                  null === root
	                    ? mountHoistable(
	                        hoistableRoot,
	                        finishedWork.type,
	                        finishedWork.stateNode
	                      )
	                    : acquireResource(
	                        hoistableRoot,
	                        root,
	                        finishedWork.memoizedProps
	                      ))
	                : null === root &&
	                  null !== finishedWork.stateNode &&
	                  commitHostUpdate(
	                    finishedWork,
	                    finishedWork.memoizedProps,
	                    current.memoizedProps
	                  ));
	          break;
	        }
	      case 27:
	        if (
	          supportsSingletons &&
	          flags & 4 &&
	          null === finishedWork.alternate
	        ) {
	          hoistableRoot = finishedWork.stateNode;
	          var props = finishedWork.memoizedProps;
	          try {
	            clearSingleton(hoistableRoot),
	              acquireSingletonInstance(
	                finishedWork.type,
	                props,
	                hoistableRoot,
	                finishedWork
	              );
	          } catch (error) {
	            captureCommitPhaseError(finishedWork, finishedWork.return, error);
	          }
	        }
	      case 5:
	        recursivelyTraverseMutationEffects(root, finishedWork);
	        commitReconciliationEffects(finishedWork);
	        flags & 512 &&
	          (offscreenSubtreeWasHidden ||
	            null === current ||
	            safelyDetachRef(current, current.return));
	        if (supportsMutation) {
	          if (finishedWork.flags & 32) {
	            root = finishedWork.stateNode;
	            try {
	              resetTextContent(root);
	            } catch (error) {
	              captureCommitPhaseError(finishedWork, finishedWork.return, error);
	            }
	          }
	          flags & 4 &&
	            null != finishedWork.stateNode &&
	            ((root = finishedWork.memoizedProps),
	            commitHostUpdate(
	              finishedWork,
	              root,
	              null !== current ? current.memoizedProps : root
	            ));
	          flags & 1024 && (needsFormReset = true);
	        }
	        break;
	      case 6:
	        recursivelyTraverseMutationEffects(root, finishedWork);
	        commitReconciliationEffects(finishedWork);
	        if (flags & 4 && supportsMutation) {
	          if (null === finishedWork.stateNode)
	            throw Error(formatProdErrorMessage(162));
	          flags = finishedWork.memoizedProps;
	          current = null !== current ? current.memoizedProps : flags;
	          root = finishedWork.stateNode;
	          try {
	            commitTextUpdate(root, current, flags);
	          } catch (error) {
	            captureCommitPhaseError(finishedWork, finishedWork.return, error);
	          }
	        }
	        break;
	      case 3:
	        supportsResources
	          ? (prepareToCommitHoistables(),
	            (hoistableRoot = currentHoistableRoot),
	            (currentHoistableRoot = getHoistableRoot(root.containerInfo)),
	            recursivelyTraverseMutationEffects(root, finishedWork),
	            (currentHoistableRoot = hoistableRoot))
	          : recursivelyTraverseMutationEffects(root, finishedWork);
	        commitReconciliationEffects(finishedWork);
	        if (flags & 4) {
	          if (
	            supportsMutation &&
	            supportsHydration &&
	            null !== current &&
	            current.memoizedState.isDehydrated
	          )
	            try {
	              commitHydratedContainer(root.containerInfo);
	            } catch (error) {
	              captureCommitPhaseError(finishedWork, finishedWork.return, error);
	            }
	          if (supportsPersistence) {
	            flags = root.containerInfo;
	            current = root.pendingChildren;
	            try {
	              replaceContainerChildren(flags, current);
	            } catch (error) {
	              captureCommitPhaseError(finishedWork, finishedWork.return, error);
	            }
	          }
	        }
	        needsFormReset &&
	          ((needsFormReset = false), recursivelyResetForms(finishedWork));
	        break;
	      case 4:
	        supportsResources
	          ? ((current = currentHoistableRoot),
	            (currentHoistableRoot = getHoistableRoot(
	              finishedWork.stateNode.containerInfo
	            )),
	            recursivelyTraverseMutationEffects(root, finishedWork),
	            commitReconciliationEffects(finishedWork),
	            (currentHoistableRoot = current))
	          : (recursivelyTraverseMutationEffects(root, finishedWork),
	            commitReconciliationEffects(finishedWork));
	        flags & 4 &&
	          supportsPersistence &&
	          commitHostPortalContainerChildren(
	            finishedWork.stateNode,
	            finishedWork,
	            finishedWork.stateNode.pendingChildren
	          );
	        break;
	      case 12:
	        recursivelyTraverseMutationEffects(root, finishedWork);
	        commitReconciliationEffects(finishedWork);
	        break;
	      case 13:
	        recursivelyTraverseMutationEffects(root, finishedWork);
	        commitReconciliationEffects(finishedWork);
	        finishedWork.child.flags & 8192 &&
	          (null !== finishedWork.memoizedState) !==
	            (null !== current && null !== current.memoizedState) &&
	          (globalMostRecentFallbackTime = now());
	        flags & 4 &&
	          ((flags = finishedWork.updateQueue),
	          null !== flags &&
	            ((finishedWork.updateQueue = null),
	            attachSuspenseRetryListeners(finishedWork, flags)));
	        break;
	      case 22:
	        flags & 512 &&
	          (offscreenSubtreeWasHidden ||
	            null === current ||
	            safelyDetachRef(current, current.return));
	        hoistableRoot = null !== finishedWork.memoizedState;
	        var wasHidden = null !== current && null !== current.memoizedState,
	          prevOffscreenSubtreeIsHidden = offscreenSubtreeIsHidden,
	          prevOffscreenSubtreeWasHidden = offscreenSubtreeWasHidden;
	        offscreenSubtreeIsHidden =
	          prevOffscreenSubtreeIsHidden || hoistableRoot;
	        offscreenSubtreeWasHidden = prevOffscreenSubtreeWasHidden || wasHidden;
	        recursivelyTraverseMutationEffects(root, finishedWork);
	        offscreenSubtreeWasHidden = prevOffscreenSubtreeWasHidden;
	        offscreenSubtreeIsHidden = prevOffscreenSubtreeIsHidden;
	        commitReconciliationEffects(finishedWork);
	        root = finishedWork.stateNode;
	        root._current = finishedWork;
	        root._visibility &= -3;
	        root._visibility |= root._pendingVisibility & 2;
	        if (
	          flags & 8192 &&
	          ((root._visibility = hoistableRoot
	            ? root._visibility & -2
	            : root._visibility | 1),
	          hoistableRoot &&
	            ((root = offscreenSubtreeIsHidden || offscreenSubtreeWasHidden),
	            null === current ||
	              wasHidden ||
	              root ||
	              recursivelyTraverseDisappearLayoutEffects(finishedWork)),
	          supportsMutation &&
	            (null === finishedWork.memoizedProps ||
	              "manual" !== finishedWork.memoizedProps.mode))
	        )
	          a: if (((current = null), supportsMutation))
	            for (root = finishedWork; ; ) {
	              if (
	                5 === root.tag ||
	                (supportsResources && 26 === root.tag) ||
	                (supportsSingletons && 27 === root.tag)
	              ) {
	                if (null === current) {
	                  wasHidden = current = root;
	                  try {
	                    (props = wasHidden.stateNode),
	                      hoistableRoot
	                        ? hideInstance(props)
	                        : unhideInstance(
	                            wasHidden.stateNode,
	                            wasHidden.memoizedProps
	                          );
	                  } catch (error) {
	                    captureCommitPhaseError(wasHidden, wasHidden.return, error);
	                  }
	                }
	              } else if (6 === root.tag) {
	                if (null === current) {
	                  wasHidden = root;
	                  try {
	                    var instance = wasHidden.stateNode;
	                    hoistableRoot
	                      ? hideTextInstance(instance)
	                      : unhideTextInstance(instance, wasHidden.memoizedProps);
	                  } catch (error) {
	                    captureCommitPhaseError(wasHidden, wasHidden.return, error);
	                  }
	                }
	              } else if (
	                ((22 !== root.tag && 23 !== root.tag) ||
	                  null === root.memoizedState ||
	                  root === finishedWork) &&
	                null !== root.child
	              ) {
	                root.child.return = root;
	                root = root.child;
	                continue;
	              }
	              if (root === finishedWork) break a;
	              for (; null === root.sibling; ) {
	                if (null === root.return || root.return === finishedWork)
	                  break a;
	                current === root && (current = null);
	                root = root.return;
	              }
	              current === root && (current = null);
	              root.sibling.return = root.return;
	              root = root.sibling;
	            }
	        flags & 4 &&
	          ((flags = finishedWork.updateQueue),
	          null !== flags &&
	            ((current = flags.retryQueue),
	            null !== current &&
	              ((flags.retryQueue = null),
	              attachSuspenseRetryListeners(finishedWork, current))));
	        break;
	      case 19:
	        recursivelyTraverseMutationEffects(root, finishedWork);
	        commitReconciliationEffects(finishedWork);
	        flags & 4 &&
	          ((flags = finishedWork.updateQueue),
	          null !== flags &&
	            ((finishedWork.updateQueue = null),
	            attachSuspenseRetryListeners(finishedWork, flags)));
	        break;
	      case 21:
	        break;
	      default:
	        recursivelyTraverseMutationEffects(root, finishedWork),
	          commitReconciliationEffects(finishedWork);
	    }
	  }
	  function commitReconciliationEffects(finishedWork) {
	    var flags = finishedWork.flags;
	    if (flags & 2) {
	      try {
	        if (
	          supportsMutation &&
	          (!supportsSingletons || 27 !== finishedWork.tag)
	        ) {
	          a: {
	            for (var parent = finishedWork.return; null !== parent; ) {
	              if (isHostParent(parent)) {
	                var JSCompiler_inline_result = parent;
	                break a;
	              }
	              parent = parent.return;
	            }
	            throw Error(formatProdErrorMessage(160));
	          }
	          switch (JSCompiler_inline_result.tag) {
	            case 27:
	              if (supportsSingletons) {
	                var parent$jscomp$0 = JSCompiler_inline_result.stateNode,
	                  before = getHostSibling(finishedWork);
	                insertOrAppendPlacementNode(
	                  finishedWork,
	                  before,
	                  parent$jscomp$0
	                );
	                break;
	              }
	            case 5:
	              var parent$127 = JSCompiler_inline_result.stateNode;
	              JSCompiler_inline_result.flags & 32 &&
	                (resetTextContent(parent$127),
	                (JSCompiler_inline_result.flags &= -33));
	              var before$128 = getHostSibling(finishedWork);
	              insertOrAppendPlacementNode(finishedWork, before$128, parent$127);
	              break;
	            case 3:
	            case 4:
	              var parent$129 = JSCompiler_inline_result.stateNode.containerInfo,
	                before$130 = getHostSibling(finishedWork);
	              insertOrAppendPlacementNodeIntoContainer(
	                finishedWork,
	                before$130,
	                parent$129
	              );
	              break;
	            default:
	              throw Error(formatProdErrorMessage(161));
	          }
	        }
	      } catch (error) {
	        captureCommitPhaseError(finishedWork, finishedWork.return, error);
	      }
	      finishedWork.flags &= -3;
	    }
	    flags & 4096 && (finishedWork.flags &= -4097);
	  }
	  function recursivelyResetForms(parentFiber) {
	    if (parentFiber.subtreeFlags & 1024)
	      for (parentFiber = parentFiber.child; null !== parentFiber; ) {
	        var fiber = parentFiber;
	        recursivelyResetForms(fiber);
	        5 === fiber.tag &&
	          fiber.flags & 1024 &&
	          resetFormInstance(fiber.stateNode);
	        parentFiber = parentFiber.sibling;
	      }
	  }
	  function recursivelyTraverseLayoutEffects(root, parentFiber) {
	    if (parentFiber.subtreeFlags & 8772)
	      for (parentFiber = parentFiber.child; null !== parentFiber; )
	        commitLayoutEffectOnFiber(root, parentFiber.alternate, parentFiber),
	          (parentFiber = parentFiber.sibling);
	  }
	  function recursivelyTraverseDisappearLayoutEffects(parentFiber) {
	    for (parentFiber = parentFiber.child; null !== parentFiber; ) {
	      var finishedWork = parentFiber;
	      switch (finishedWork.tag) {
	        case 0:
	        case 11:
	        case 14:
	        case 15:
	          commitHookEffectListUnmount(4, finishedWork, finishedWork.return);
	          recursivelyTraverseDisappearLayoutEffects(finishedWork);
	          break;
	        case 1:
	          safelyDetachRef(finishedWork, finishedWork.return);
	          var instance = finishedWork.stateNode;
	          "function" === typeof instance.componentWillUnmount &&
	            safelyCallComponentWillUnmount(
	              finishedWork,
	              finishedWork.return,
	              instance
	            );
	          recursivelyTraverseDisappearLayoutEffects(finishedWork);
	          break;
	        case 26:
	        case 27:
	        case 5:
	          safelyDetachRef(finishedWork, finishedWork.return);
	          recursivelyTraverseDisappearLayoutEffects(finishedWork);
	          break;
	        case 22:
	          safelyDetachRef(finishedWork, finishedWork.return);
	          null === finishedWork.memoizedState &&
	            recursivelyTraverseDisappearLayoutEffects(finishedWork);
	          break;
	        default:
	          recursivelyTraverseDisappearLayoutEffects(finishedWork);
	      }
	      parentFiber = parentFiber.sibling;
	    }
	  }
	  function recursivelyTraverseReappearLayoutEffects(
	    finishedRoot$jscomp$0,
	    parentFiber,
	    includeWorkInProgressEffects
	  ) {
	    includeWorkInProgressEffects =
	      includeWorkInProgressEffects && 0 !== (parentFiber.subtreeFlags & 8772);
	    for (parentFiber = parentFiber.child; null !== parentFiber; ) {
	      var current = parentFiber.alternate,
	        finishedRoot = finishedRoot$jscomp$0,
	        finishedWork = parentFiber,
	        flags = finishedWork.flags;
	      switch (finishedWork.tag) {
	        case 0:
	        case 11:
	        case 15:
	          recursivelyTraverseReappearLayoutEffects(
	            finishedRoot,
	            finishedWork,
	            includeWorkInProgressEffects
	          );
	          commitHookEffectListMount(4, finishedWork);
	          break;
	        case 1:
	          recursivelyTraverseReappearLayoutEffects(
	            finishedRoot,
	            finishedWork,
	            includeWorkInProgressEffects
	          );
	          current = finishedWork;
	          finishedRoot = current.stateNode;
	          if ("function" === typeof finishedRoot.componentDidMount)
	            try {
	              finishedRoot.componentDidMount();
	            } catch (error) {
	              captureCommitPhaseError(current, current.return, error);
	            }
	          current = finishedWork;
	          finishedRoot = current.updateQueue;
	          if (null !== finishedRoot) {
	            var instance = current.stateNode;
	            try {
	              var hiddenCallbacks = finishedRoot.shared.hiddenCallbacks;
	              if (null !== hiddenCallbacks)
	                for (
	                  finishedRoot.shared.hiddenCallbacks = null, finishedRoot = 0;
	                  finishedRoot < hiddenCallbacks.length;
	                  finishedRoot++
	                )
	                  callCallback(hiddenCallbacks[finishedRoot], instance);
	            } catch (error) {
	              captureCommitPhaseError(current, current.return, error);
	            }
	          }
	          includeWorkInProgressEffects &&
	            flags & 64 &&
	            commitClassCallbacks(finishedWork);
	          safelyAttachRef(finishedWork, finishedWork.return);
	          break;
	        case 26:
	        case 27:
	        case 5:
	          recursivelyTraverseReappearLayoutEffects(
	            finishedRoot,
	            finishedWork,
	            includeWorkInProgressEffects
	          );
	          includeWorkInProgressEffects &&
	            null === current &&
	            flags & 4 &&
	            commitHostMount(finishedWork);
	          safelyAttachRef(finishedWork, finishedWork.return);
	          break;
	        case 12:
	          recursivelyTraverseReappearLayoutEffects(
	            finishedRoot,
	            finishedWork,
	            includeWorkInProgressEffects
	          );
	          break;
	        case 13:
	          recursivelyTraverseReappearLayoutEffects(
	            finishedRoot,
	            finishedWork,
	            includeWorkInProgressEffects
	          );
	          includeWorkInProgressEffects &&
	            flags & 4 &&
	            commitSuspenseHydrationCallbacks(finishedRoot, finishedWork);
	          break;
	        case 22:
	          null === finishedWork.memoizedState &&
	            recursivelyTraverseReappearLayoutEffects(
	              finishedRoot,
	              finishedWork,
	              includeWorkInProgressEffects
	            );
	          safelyAttachRef(finishedWork, finishedWork.return);
	          break;
	        default:
	          recursivelyTraverseReappearLayoutEffects(
	            finishedRoot,
	            finishedWork,
	            includeWorkInProgressEffects
	          );
	      }
	      parentFiber = parentFiber.sibling;
	    }
	  }
	  function commitOffscreenPassiveMountEffects(current, finishedWork) {
	    var previousCache = null;
	    null !== current &&
	      null !== current.memoizedState &&
	      null !== current.memoizedState.cachePool &&
	      (previousCache = current.memoizedState.cachePool.pool);
	    current = null;
	    null !== finishedWork.memoizedState &&
	      null !== finishedWork.memoizedState.cachePool &&
	      (current = finishedWork.memoizedState.cachePool.pool);
	    current !== previousCache &&
	      (null != current && current.refCount++,
	      null != previousCache && releaseCache(previousCache));
	  }
	  function commitCachePassiveMountEffect(current, finishedWork) {
	    current = null;
	    null !== finishedWork.alternate &&
	      (current = finishedWork.alternate.memoizedState.cache);
	    finishedWork = finishedWork.memoizedState.cache;
	    finishedWork !== current &&
	      (finishedWork.refCount++, null != current && releaseCache(current));
	  }
	  function recursivelyTraversePassiveMountEffects(
	    root,
	    parentFiber,
	    committedLanes,
	    committedTransitions
	  ) {
	    if (parentFiber.subtreeFlags & 10256)
	      for (parentFiber = parentFiber.child; null !== parentFiber; )
	        commitPassiveMountOnFiber(
	          root,
	          parentFiber,
	          committedLanes,
	          committedTransitions
	        ),
	          (parentFiber = parentFiber.sibling);
	  }
	  function commitPassiveMountOnFiber(
	    finishedRoot,
	    finishedWork,
	    committedLanes,
	    committedTransitions
	  ) {
	    var flags = finishedWork.flags;
	    switch (finishedWork.tag) {
	      case 0:
	      case 11:
	      case 15:
	        recursivelyTraversePassiveMountEffects(
	          finishedRoot,
	          finishedWork,
	          committedLanes,
	          committedTransitions
	        );
	        flags & 2048 && commitHookEffectListMount(9, finishedWork);
	        break;
	      case 3:
	        recursivelyTraversePassiveMountEffects(
	          finishedRoot,
	          finishedWork,
	          committedLanes,
	          committedTransitions
	        );
	        flags & 2048 &&
	          ((finishedRoot = null),
	          null !== finishedWork.alternate &&
	            (finishedRoot = finishedWork.alternate.memoizedState.cache),
	          (finishedWork = finishedWork.memoizedState.cache),
	          finishedWork !== finishedRoot &&
	            (finishedWork.refCount++,
	            null != finishedRoot && releaseCache(finishedRoot)));
	        break;
	      case 12:
	        if (flags & 2048) {
	          recursivelyTraversePassiveMountEffects(
	            finishedRoot,
	            finishedWork,
	            committedLanes,
	            committedTransitions
	          );
	          finishedRoot = finishedWork.stateNode;
	          try {
	            var _finishedWork$memoize2 = finishedWork.memoizedProps,
	              id = _finishedWork$memoize2.id,
	              onPostCommit = _finishedWork$memoize2.onPostCommit;
	            "function" === typeof onPostCommit &&
	              onPostCommit(
	                id,
	                null === finishedWork.alternate ? "mount" : "update",
	                finishedRoot.passiveEffectDuration,
	                -0
	              );
	          } catch (error) {
	            captureCommitPhaseError(finishedWork, finishedWork.return, error);
	          }
	        } else
	          recursivelyTraversePassiveMountEffects(
	            finishedRoot,
	            finishedWork,
	            committedLanes,
	            committedTransitions
	          );
	        break;
	      case 23:
	        break;
	      case 22:
	        _finishedWork$memoize2 = finishedWork.stateNode;
	        null !== finishedWork.memoizedState
	          ? _finishedWork$memoize2._visibility & 4
	            ? recursivelyTraversePassiveMountEffects(
	                finishedRoot,
	                finishedWork,
	                committedLanes,
	                committedTransitions
	              )
	            : recursivelyTraverseAtomicPassiveEffects(
	                finishedRoot,
	                finishedWork
	              )
	          : _finishedWork$memoize2._visibility & 4
	            ? recursivelyTraversePassiveMountEffects(
	                finishedRoot,
	                finishedWork,
	                committedLanes,
	                committedTransitions
	              )
	            : ((_finishedWork$memoize2._visibility |= 4),
	              recursivelyTraverseReconnectPassiveEffects(
	                finishedRoot,
	                finishedWork,
	                committedLanes,
	                committedTransitions,
	                0 !== (finishedWork.subtreeFlags & 10256)
	              ));
	        flags & 2048 &&
	          commitOffscreenPassiveMountEffects(
	            finishedWork.alternate,
	            finishedWork
	          );
	        break;
	      case 24:
	        recursivelyTraversePassiveMountEffects(
	          finishedRoot,
	          finishedWork,
	          committedLanes,
	          committedTransitions
	        );
	        flags & 2048 &&
	          commitCachePassiveMountEffect(finishedWork.alternate, finishedWork);
	        break;
	      default:
	        recursivelyTraversePassiveMountEffects(
	          finishedRoot,
	          finishedWork,
	          committedLanes,
	          committedTransitions
	        );
	    }
	  }
	  function recursivelyTraverseReconnectPassiveEffects(
	    finishedRoot$jscomp$0,
	    parentFiber,
	    committedLanes$jscomp$0,
	    committedTransitions$jscomp$0,
	    includeWorkInProgressEffects
	  ) {
	    includeWorkInProgressEffects =
	      includeWorkInProgressEffects && 0 !== (parentFiber.subtreeFlags & 10256);
	    for (parentFiber = parentFiber.child; null !== parentFiber; ) {
	      var finishedRoot = finishedRoot$jscomp$0,
	        finishedWork = parentFiber,
	        committedLanes = committedLanes$jscomp$0,
	        committedTransitions = committedTransitions$jscomp$0,
	        flags = finishedWork.flags;
	      switch (finishedWork.tag) {
	        case 0:
	        case 11:
	        case 15:
	          recursivelyTraverseReconnectPassiveEffects(
	            finishedRoot,
	            finishedWork,
	            committedLanes,
	            committedTransitions,
	            includeWorkInProgressEffects
	          );
	          commitHookEffectListMount(8, finishedWork);
	          break;
	        case 23:
	          break;
	        case 22:
	          var instance = finishedWork.stateNode;
	          null !== finishedWork.memoizedState
	            ? instance._visibility & 4
	              ? recursivelyTraverseReconnectPassiveEffects(
	                  finishedRoot,
	                  finishedWork,
	                  committedLanes,
	                  committedTransitions,
	                  includeWorkInProgressEffects
	                )
	              : recursivelyTraverseAtomicPassiveEffects(
	                  finishedRoot,
	                  finishedWork
	                )
	            : ((instance._visibility |= 4),
	              recursivelyTraverseReconnectPassiveEffects(
	                finishedRoot,
	                finishedWork,
	                committedLanes,
	                committedTransitions,
	                includeWorkInProgressEffects
	              ));
	          includeWorkInProgressEffects &&
	            flags & 2048 &&
	            commitOffscreenPassiveMountEffects(
	              finishedWork.alternate,
	              finishedWork
	            );
	          break;
	        case 24:
	          recursivelyTraverseReconnectPassiveEffects(
	            finishedRoot,
	            finishedWork,
	            committedLanes,
	            committedTransitions,
	            includeWorkInProgressEffects
	          );
	          includeWorkInProgressEffects &&
	            flags & 2048 &&
	            commitCachePassiveMountEffect(finishedWork.alternate, finishedWork);
	          break;
	        default:
	          recursivelyTraverseReconnectPassiveEffects(
	            finishedRoot,
	            finishedWork,
	            committedLanes,
	            committedTransitions,
	            includeWorkInProgressEffects
	          );
	      }
	      parentFiber = parentFiber.sibling;
	    }
	  }
	  function recursivelyTraverseAtomicPassiveEffects(
	    finishedRoot$jscomp$0,
	    parentFiber
	  ) {
	    if (parentFiber.subtreeFlags & 10256)
	      for (parentFiber = parentFiber.child; null !== parentFiber; ) {
	        var finishedRoot = finishedRoot$jscomp$0,
	          finishedWork = parentFiber,
	          flags = finishedWork.flags;
	        switch (finishedWork.tag) {
	          case 22:
	            recursivelyTraverseAtomicPassiveEffects(finishedRoot, finishedWork);
	            flags & 2048 &&
	              commitOffscreenPassiveMountEffects(
	                finishedWork.alternate,
	                finishedWork
	              );
	            break;
	          case 24:
	            recursivelyTraverseAtomicPassiveEffects(finishedRoot, finishedWork);
	            flags & 2048 &&
	              commitCachePassiveMountEffect(
	                finishedWork.alternate,
	                finishedWork
	              );
	            break;
	          default:
	            recursivelyTraverseAtomicPassiveEffects(finishedRoot, finishedWork);
	        }
	        parentFiber = parentFiber.sibling;
	      }
	  }
	  function recursivelyAccumulateSuspenseyCommit(parentFiber) {
	    if (parentFiber.subtreeFlags & suspenseyCommitFlag)
	      for (parentFiber = parentFiber.child; null !== parentFiber; )
	        accumulateSuspenseyCommitOnFiber(parentFiber),
	          (parentFiber = parentFiber.sibling);
	  }
	  function accumulateSuspenseyCommitOnFiber(fiber) {
	    switch (fiber.tag) {
	      case 26:
	        recursivelyAccumulateSuspenseyCommit(fiber);
	        fiber.flags & suspenseyCommitFlag &&
	          (null !== fiber.memoizedState
	            ? suspendResource(
	                currentHoistableRoot,
	                fiber.memoizedState,
	                fiber.memoizedProps
	              )
	            : suspendInstance(fiber.type, fiber.memoizedProps));
	        break;
	      case 5:
	        recursivelyAccumulateSuspenseyCommit(fiber);
	        fiber.flags & suspenseyCommitFlag &&
	          suspendInstance(fiber.type, fiber.memoizedProps);
	        break;
	      case 3:
	      case 4:
	        if (supportsResources) {
	          var previousHoistableRoot = currentHoistableRoot;
	          currentHoistableRoot = getHoistableRoot(
	            fiber.stateNode.containerInfo
	          );
	          recursivelyAccumulateSuspenseyCommit(fiber);
	          currentHoistableRoot = previousHoistableRoot;
	        } else recursivelyAccumulateSuspenseyCommit(fiber);
	        break;
	      case 22:
	        null === fiber.memoizedState &&
	          ((previousHoistableRoot = fiber.alternate),
	          null !== previousHoistableRoot &&
	          null !== previousHoistableRoot.memoizedState
	            ? ((previousHoistableRoot = suspenseyCommitFlag),
	              (suspenseyCommitFlag = 16777216),
	              recursivelyAccumulateSuspenseyCommit(fiber),
	              (suspenseyCommitFlag = previousHoistableRoot))
	            : recursivelyAccumulateSuspenseyCommit(fiber));
	        break;
	      default:
	        recursivelyAccumulateSuspenseyCommit(fiber);
	    }
	  }
	  function detachAlternateSiblings(parentFiber) {
	    var previousFiber = parentFiber.alternate;
	    if (
	      null !== previousFiber &&
	      ((parentFiber = previousFiber.child), null !== parentFiber)
	    ) {
	      previousFiber.child = null;
	      do
	        (previousFiber = parentFiber.sibling),
	          (parentFiber.sibling = null),
	          (parentFiber = previousFiber);
	      while (null !== parentFiber);
	    }
	  }
	  function recursivelyTraversePassiveUnmountEffects(parentFiber) {
	    var deletions = parentFiber.deletions;
	    if (0 !== (parentFiber.flags & 16)) {
	      if (null !== deletions)
	        for (var i = 0; i < deletions.length; i++) {
	          var childToDelete = deletions[i];
	          nextEffect = childToDelete;
	          commitPassiveUnmountEffectsInsideOfDeletedTree_begin(
	            childToDelete,
	            parentFiber
	          );
	        }
	      detachAlternateSiblings(parentFiber);
	    }
	    if (parentFiber.subtreeFlags & 10256)
	      for (parentFiber = parentFiber.child; null !== parentFiber; )
	        commitPassiveUnmountOnFiber(parentFiber),
	          (parentFiber = parentFiber.sibling);
	  }
	  function commitPassiveUnmountOnFiber(finishedWork) {
	    switch (finishedWork.tag) {
	      case 0:
	      case 11:
	      case 15:
	        recursivelyTraversePassiveUnmountEffects(finishedWork);
	        finishedWork.flags & 2048 &&
	          commitHookEffectListUnmount(9, finishedWork, finishedWork.return);
	        break;
	      case 3:
	        recursivelyTraversePassiveUnmountEffects(finishedWork);
	        break;
	      case 12:
	        recursivelyTraversePassiveUnmountEffects(finishedWork);
	        break;
	      case 22:
	        var instance = finishedWork.stateNode;
	        null !== finishedWork.memoizedState &&
	        instance._visibility & 4 &&
	        (null === finishedWork.return || 13 !== finishedWork.return.tag)
	          ? ((instance._visibility &= -5),
	            recursivelyTraverseDisconnectPassiveEffects(finishedWork))
	          : recursivelyTraversePassiveUnmountEffects(finishedWork);
	        break;
	      default:
	        recursivelyTraversePassiveUnmountEffects(finishedWork);
	    }
	  }
	  function recursivelyTraverseDisconnectPassiveEffects(parentFiber) {
	    var deletions = parentFiber.deletions;
	    if (0 !== (parentFiber.flags & 16)) {
	      if (null !== deletions)
	        for (var i = 0; i < deletions.length; i++) {
	          var childToDelete = deletions[i];
	          nextEffect = childToDelete;
	          commitPassiveUnmountEffectsInsideOfDeletedTree_begin(
	            childToDelete,
	            parentFiber
	          );
	        }
	      detachAlternateSiblings(parentFiber);
	    }
	    for (parentFiber = parentFiber.child; null !== parentFiber; ) {
	      deletions = parentFiber;
	      switch (deletions.tag) {
	        case 0:
	        case 11:
	        case 15:
	          commitHookEffectListUnmount(8, deletions, deletions.return);
	          recursivelyTraverseDisconnectPassiveEffects(deletions);
	          break;
	        case 22:
	          i = deletions.stateNode;
	          i._visibility & 4 &&
	            ((i._visibility &= -5),
	            recursivelyTraverseDisconnectPassiveEffects(deletions));
	          break;
	        default:
	          recursivelyTraverseDisconnectPassiveEffects(deletions);
	      }
	      parentFiber = parentFiber.sibling;
	    }
	  }
	  function commitPassiveUnmountEffectsInsideOfDeletedTree_begin(
	    deletedSubtreeRoot,
	    nearestMountedAncestor
	  ) {
	    for (; null !== nextEffect; ) {
	      var fiber = nextEffect;
	      switch (fiber.tag) {
	        case 0:
	        case 11:
	        case 15:
	          commitHookEffectListUnmount(8, fiber, nearestMountedAncestor);
	          break;
	        case 23:
	        case 22:
	          if (
	            null !== fiber.memoizedState &&
	            null !== fiber.memoizedState.cachePool
	          ) {
	            var cache = fiber.memoizedState.cachePool.pool;
	            null != cache && cache.refCount++;
	          }
	          break;
	        case 24:
	          releaseCache(fiber.memoizedState.cache);
	      }
	      cache = fiber.child;
	      if (null !== cache) (cache.return = fiber), (nextEffect = cache);
	      else
	        a: for (fiber = deletedSubtreeRoot; null !== nextEffect; ) {
	          cache = nextEffect;
	          var sibling = cache.sibling,
	            returnFiber = cache.return;
	          detachFiberAfterEffects(cache);
	          if (cache === fiber) {
	            nextEffect = null;
	            break a;
	          }
	          if (null !== sibling) {
	            sibling.return = returnFiber;
	            nextEffect = sibling;
	            break a;
	          }
	          nextEffect = returnFiber;
	        }
	    }
	  }
	  function findFiberRootForHostRoot(hostRoot) {
	    var maybeFiber = getInstanceFromNode(hostRoot);
	    if (null != maybeFiber) {
	      if ("string" !== typeof maybeFiber.memoizedProps["data-testname"])
	        throw Error(formatProdErrorMessage(364));
	      return maybeFiber;
	    }
	    hostRoot = findFiberRoot(hostRoot);
	    if (null === hostRoot) throw Error(formatProdErrorMessage(362));
	    return hostRoot.stateNode.current;
	  }
	  function matchSelector(fiber$jscomp$0, selector) {
	    var tag = fiber$jscomp$0.tag;
	    switch (selector.$$typeof) {
	      case COMPONENT_TYPE:
	        if (fiber$jscomp$0.type === selector.value) return true;
	        break;
	      case HAS_PSEUDO_CLASS_TYPE:
	        a: {
	          selector = selector.value;
	          fiber$jscomp$0 = [fiber$jscomp$0, 0];
	          for (tag = 0; tag < fiber$jscomp$0.length; ) {
	            var fiber = fiber$jscomp$0[tag++],
	              tag$jscomp$0 = fiber.tag,
	              selectorIndex = fiber$jscomp$0[tag++],
	              selector$jscomp$0 = selector[selectorIndex];
	            if (
	              (5 !== tag$jscomp$0 &&
	                26 !== tag$jscomp$0 &&
	                27 !== tag$jscomp$0) ||
	              !isHiddenSubtree(fiber)
	            ) {
	              for (
	                ;
	                null != selector$jscomp$0 &&
	                matchSelector(fiber, selector$jscomp$0);

	              )
	                selectorIndex++, (selector$jscomp$0 = selector[selectorIndex]);
	              if (selectorIndex === selector.length) {
	                selector = true;
	                break a;
	              } else
	                for (fiber = fiber.child; null !== fiber; )
	                  fiber$jscomp$0.push(fiber, selectorIndex),
	                    (fiber = fiber.sibling);
	            }
	          }
	          selector = false;
	        }
	        return selector;
	      case ROLE_TYPE:
	        if (
	          (5 === tag || 26 === tag || 27 === tag) &&
	          matchAccessibilityRole(fiber$jscomp$0.stateNode, selector.value)
	        )
	          return true;
	        break;
	      case TEXT_TYPE:
	        if (5 === tag || 6 === tag || 26 === tag || 27 === tag)
	          if (
	            ((fiber$jscomp$0 = getTextContent(fiber$jscomp$0)),
	            null !== fiber$jscomp$0 &&
	              0 <= fiber$jscomp$0.indexOf(selector.value))
	          )
	            return true;
	        break;
	      case TEST_NAME_TYPE:
	        if (5 === tag || 26 === tag || 27 === tag)
	          if (
	            ((fiber$jscomp$0 = fiber$jscomp$0.memoizedProps["data-testname"]),
	            "string" === typeof fiber$jscomp$0 &&
	              fiber$jscomp$0.toLowerCase() === selector.value.toLowerCase())
	          )
	            return true;
	        break;
	      default:
	        throw Error(formatProdErrorMessage(365));
	    }
	    return false;
	  }
	  function selectorToString(selector) {
	    switch (selector.$$typeof) {
	      case COMPONENT_TYPE:
	        return (
	          "<" + (getComponentNameFromType(selector.value) || "Unknown") + ">"
	        );
	      case HAS_PSEUDO_CLASS_TYPE:
	        return ":has(" + (selectorToString(selector) || "") + ")";
	      case ROLE_TYPE:
	        return '[role="' + selector.value + '"]';
	      case TEXT_TYPE:
	        return '"' + selector.value + '"';
	      case TEST_NAME_TYPE:
	        return '[data-testname="' + selector.value + '"]';
	      default:
	        throw Error(formatProdErrorMessage(365));
	    }
	  }
	  function findPaths(root, selectors) {
	    var matchingFibers = [];
	    root = [root, 0];
	    for (var index = 0; index < root.length; ) {
	      var fiber = root[index++],
	        tag = fiber.tag,
	        selectorIndex = root[index++],
	        selector = selectors[selectorIndex];
	      if ((5 !== tag && 26 !== tag && 27 !== tag) || !isHiddenSubtree(fiber)) {
	        for (; null != selector && matchSelector(fiber, selector); )
	          selectorIndex++, (selector = selectors[selectorIndex]);
	        if (selectorIndex === selectors.length) matchingFibers.push(fiber);
	        else
	          for (fiber = fiber.child; null !== fiber; )
	            root.push(fiber, selectorIndex), (fiber = fiber.sibling);
	      }
	    }
	    return matchingFibers;
	  }
	  function findAllNodes(hostRoot, selectors) {
	    if (!supportsTestSelectors) throw Error(formatProdErrorMessage(363));
	    hostRoot = findFiberRootForHostRoot(hostRoot);
	    hostRoot = findPaths(hostRoot, selectors);
	    selectors = [];
	    hostRoot = Array.from(hostRoot);
	    for (var index = 0; index < hostRoot.length; ) {
	      var node = hostRoot[index++],
	        tag = node.tag;
	      if (5 === tag || 26 === tag || 27 === tag)
	        isHiddenSubtree(node) || selectors.push(node.stateNode);
	      else
	        for (node = node.child; null !== node; )
	          hostRoot.push(node), (node = node.sibling);
	    }
	    return selectors;
	  }
	  function requestUpdateLane() {
	    if (0 !== (executionContext & 2) && 0 !== workInProgressRootRenderLanes)
	      return workInProgressRootRenderLanes & -workInProgressRootRenderLanes;
	    if (null !== ReactSharedInternals.T) {
	      var actionScopeLane = currentEntangledLane;
	      return 0 !== actionScopeLane ? actionScopeLane : requestTransitionLane();
	    }
	    return resolveUpdatePriority();
	  }
	  function requestDeferredLane() {
	    0 === workInProgressDeferredLane &&
	      (workInProgressDeferredLane =
	        0 === (workInProgressRootRenderLanes & 536870912) || isHydrating
	          ? claimNextTransitionLane()
	          : 536870912);
	    var suspenseHandler = suspenseHandlerStackCursor.current;
	    null !== suspenseHandler && (suspenseHandler.flags |= 32);
	    return workInProgressDeferredLane;
	  }
	  function scheduleUpdateOnFiber(root, fiber, lane) {
	    if (
	      (root === workInProgressRoot && 2 === workInProgressSuspendedReason) ||
	      null !== root.cancelPendingCommit
	    )
	      prepareFreshStack(root, 0),
	        markRootSuspended(
	          root,
	          workInProgressRootRenderLanes,
	          workInProgressDeferredLane,
	          false
	        );
	    markRootUpdated$1(root, lane);
	    if (0 === (executionContext & 2) || root !== workInProgressRoot)
	      root === workInProgressRoot &&
	        (0 === (executionContext & 2) &&
	          (workInProgressRootInterleavedUpdatedLanes |= lane),
	        4 === workInProgressRootExitStatus &&
	          markRootSuspended(
	            root,
	            workInProgressRootRenderLanes,
	            workInProgressDeferredLane,
	            false
	          )),
	        ensureRootIsScheduled(root);
	  }
	  function performWorkOnRoot(root$jscomp$0, lanes, forceSync) {
	    if (0 !== (executionContext & 6)) throw Error(formatProdErrorMessage(327));
	    var shouldTimeSlice =
	        (!forceSync &&
	          0 === (lanes & 60) &&
	          0 === (lanes & root$jscomp$0.expiredLanes)) ||
	        checkIfRootIsPrerendering(root$jscomp$0, lanes),
	      exitStatus = shouldTimeSlice
	        ? renderRootConcurrent(root$jscomp$0, lanes)
	        : renderRootSync(root$jscomp$0, lanes, true),
	      renderWasConcurrent = shouldTimeSlice;
	    do {
	      if (0 === exitStatus) {
	        workInProgressRootIsPrerendering &&
	          !shouldTimeSlice &&
	          markRootSuspended(root$jscomp$0, lanes, 0, false);
	        break;
	      } else if (6 === exitStatus)
	        markRootSuspended(
	          root$jscomp$0,
	          lanes,
	          0,
	          !workInProgressRootDidSkipSuspendedSiblings
	        );
	      else {
	        forceSync = root$jscomp$0.current.alternate;
	        if (
	          renderWasConcurrent &&
	          !isRenderConsistentWithExternalStores(forceSync)
	        ) {
	          exitStatus = renderRootSync(root$jscomp$0, lanes, false);
	          renderWasConcurrent = false;
	          continue;
	        }
	        if (2 === exitStatus) {
	          renderWasConcurrent = lanes;
	          if (root$jscomp$0.errorRecoveryDisabledLanes & renderWasConcurrent)
	            var JSCompiler_inline_result = 0;
	          else
	            (JSCompiler_inline_result =
	              root$jscomp$0.pendingLanes & -536870913),
	              (JSCompiler_inline_result =
	                0 !== JSCompiler_inline_result
	                  ? JSCompiler_inline_result
	                  : JSCompiler_inline_result & 536870912
	                    ? 536870912
	                    : 0);
	          if (0 !== JSCompiler_inline_result) {
	            lanes = JSCompiler_inline_result;
	            a: {
	              var root = root$jscomp$0;
	              exitStatus = workInProgressRootConcurrentErrors;
	              var wasRootDehydrated =
	                supportsHydration && root.current.memoizedState.isDehydrated;
	              wasRootDehydrated &&
	                (prepareFreshStack(root, JSCompiler_inline_result).flags |=
	                  256);
	              JSCompiler_inline_result = renderRootSync(
	                root,
	                JSCompiler_inline_result,
	                false
	              );
	              if (2 !== JSCompiler_inline_result) {
	                if (
	                  workInProgressRootDidAttachPingListener &&
	                  !wasRootDehydrated
	                ) {
	                  root.errorRecoveryDisabledLanes |= renderWasConcurrent;
	                  workInProgressRootInterleavedUpdatedLanes |=
	                    renderWasConcurrent;
	                  exitStatus = 4;
	                  break a;
	                }
	                renderWasConcurrent = workInProgressRootRecoverableErrors;
	                workInProgressRootRecoverableErrors = exitStatus;
	                null !== renderWasConcurrent &&
	                  queueRecoverableErrors(renderWasConcurrent);
	              }
	              exitStatus = JSCompiler_inline_result;
	            }
	            renderWasConcurrent = false;
	            if (2 !== exitStatus) continue;
	          }
	        }
	        if (1 === exitStatus) {
	          prepareFreshStack(root$jscomp$0, 0);
	          markRootSuspended(root$jscomp$0, lanes, 0, true);
	          break;
	        }
	        a: {
	          shouldTimeSlice = root$jscomp$0;
	          switch (exitStatus) {
	            case 0:
	            case 1:
	              throw Error(formatProdErrorMessage(345));
	            case 4:
	              if ((lanes & 4194176) === lanes) {
	                markRootSuspended(
	                  shouldTimeSlice,
	                  lanes,
	                  workInProgressDeferredLane,
	                  !workInProgressRootDidSkipSuspendedSiblings
	                );
	                break a;
	              }
	              break;
	            case 2:
	              workInProgressRootRecoverableErrors = null;
	              break;
	            case 3:
	            case 5:
	              break;
	            default:
	              throw Error(formatProdErrorMessage(329));
	          }
	          shouldTimeSlice.finishedWork = forceSync;
	          shouldTimeSlice.finishedLanes = lanes;
	          if (
	            (lanes & 62914560) === lanes &&
	            ((renderWasConcurrent = globalMostRecentFallbackTime + 300 - now()),
	            10 < renderWasConcurrent)
	          ) {
	            markRootSuspended(
	              shouldTimeSlice,
	              lanes,
	              workInProgressDeferredLane,
	              !workInProgressRootDidSkipSuspendedSiblings
	            );
	            if (0 !== getNextLanes(shouldTimeSlice, 0)) break a;
	            shouldTimeSlice.timeoutHandle = scheduleTimeout(
	              commitRootWhenReady.bind(
	                null,
	                shouldTimeSlice,
	                forceSync,
	                workInProgressRootRecoverableErrors,
	                workInProgressTransitions,
	                workInProgressRootDidIncludeRecursiveRenderUpdate,
	                lanes,
	                workInProgressDeferredLane,
	                workInProgressRootInterleavedUpdatedLanes,
	                workInProgressSuspendedRetryLanes,
	                workInProgressRootDidSkipSuspendedSiblings,
	                2,
	                -0,
	                0
	              ),
	              renderWasConcurrent
	            );
	            break a;
	          }
	          commitRootWhenReady(
	            shouldTimeSlice,
	            forceSync,
	            workInProgressRootRecoverableErrors,
	            workInProgressTransitions,
	            workInProgressRootDidIncludeRecursiveRenderUpdate,
	            lanes,
	            workInProgressDeferredLane,
	            workInProgressRootInterleavedUpdatedLanes,
	            workInProgressSuspendedRetryLanes,
	            workInProgressRootDidSkipSuspendedSiblings,
	            0,
	            -0,
	            0
	          );
	        }
	      }
	      break;
	    } while (1);
	    ensureRootIsScheduled(root$jscomp$0);
	  }
	  function queueRecoverableErrors(errors) {
	    null === workInProgressRootRecoverableErrors
	      ? (workInProgressRootRecoverableErrors = errors)
	      : workInProgressRootRecoverableErrors.push.apply(
	          workInProgressRootRecoverableErrors,
	          errors
	        );
	  }
	  function commitRootWhenReady(
	    root,
	    finishedWork,
	    recoverableErrors,
	    transitions,
	    didIncludeRenderPhaseUpdate,
	    lanes,
	    spawnedLane,
	    updatedLanes,
	    suspendedRetryLanes,
	    didSkipSuspendedSiblings,
	    suspendedCommitReason,
	    completedRenderStartTime,
	    completedRenderEndTime
	  ) {
	    var subtreeFlags = finishedWork.subtreeFlags;
	    if (subtreeFlags & 8192 || 16785408 === (subtreeFlags & 16785408))
	      if (
	        (startSuspendingCommit(),
	        accumulateSuspenseyCommitOnFiber(finishedWork),
	        (finishedWork = waitForCommitToBeReady()),
	        null !== finishedWork)
	      ) {
	        root.cancelPendingCommit = finishedWork(
	          commitRoot.bind(
	            null,
	            root,
	            recoverableErrors,
	            transitions,
	            didIncludeRenderPhaseUpdate,
	            spawnedLane,
	            updatedLanes,
	            suspendedRetryLanes,
	            1,
	            completedRenderStartTime,
	            completedRenderEndTime
	          )
	        );
	        markRootSuspended(root, lanes, spawnedLane, !didSkipSuspendedSiblings);
	        return;
	      }
	    commitRoot(
	      root,
	      recoverableErrors,
	      transitions,
	      didIncludeRenderPhaseUpdate,
	      spawnedLane,
	      updatedLanes,
	      suspendedRetryLanes,
	      suspendedCommitReason,
	      completedRenderStartTime,
	      completedRenderEndTime
	    );
	  }
	  function isRenderConsistentWithExternalStores(finishedWork) {
	    for (var node = finishedWork; ; ) {
	      var tag = node.tag;
	      if (
	        (0 === tag || 11 === tag || 15 === tag) &&
	        node.flags & 16384 &&
	        ((tag = node.updateQueue),
	        null !== tag && ((tag = tag.stores), null !== tag))
	      )
	        for (var i = 0; i < tag.length; i++) {
	          var check = tag[i],
	            getSnapshot = check.getSnapshot;
	          check = check.value;
	          try {
	            if (!objectIs(getSnapshot(), check)) return !1;
	          } catch (error) {
	            return false;
	          }
	        }
	      tag = node.child;
	      if (node.subtreeFlags & 16384 && null !== tag)
	        (tag.return = node), (node = tag);
	      else {
	        if (node === finishedWork) break;
	        for (; null === node.sibling; ) {
	          if (null === node.return || node.return === finishedWork) return true;
	          node = node.return;
	        }
	        node.sibling.return = node.return;
	        node = node.sibling;
	      }
	    }
	    return true;
	  }
	  function markRootSuspended(
	    root,
	    suspendedLanes,
	    spawnedLane,
	    didAttemptEntireTree
	  ) {
	    suspendedLanes &= ~workInProgressRootPingedLanes;
	    suspendedLanes &= ~workInProgressRootInterleavedUpdatedLanes;
	    root.suspendedLanes |= suspendedLanes;
	    root.pingedLanes &= ~suspendedLanes;
	    didAttemptEntireTree && (root.warmLanes |= suspendedLanes);
	    didAttemptEntireTree = root.expirationTimes;
	    for (var lanes = suspendedLanes; 0 < lanes; ) {
	      var index$6 = 31 - clz32(lanes),
	        lane = 1 << index$6;
	      didAttemptEntireTree[index$6] = -1;
	      lanes &= ~lane;
	    }
	    0 !== spawnedLane &&
	      markSpawnedDeferredLane(root, spawnedLane, suspendedLanes);
	  }
	  function flushSyncWork() {
	    return 0 === (executionContext & 6)
	      ? (flushSyncWorkAcrossRoots_impl(0), false)
	      : true;
	  }
	  function resetWorkInProgressStack() {
	    if (null !== workInProgress) {
	      if (0 === workInProgressSuspendedReason)
	        var interruptedWork = workInProgress.return;
	      else
	        (interruptedWork = workInProgress),
	          (lastContextDependency = currentlyRenderingFiber = null),
	          resetHooksOnUnwind(interruptedWork),
	          (thenableState$1 = null),
	          (thenableIndexCounter$1 = 0),
	          (interruptedWork = workInProgress);
	      for (; null !== interruptedWork; )
	        unwindInterruptedWork(interruptedWork.alternate, interruptedWork),
	          (interruptedWork = interruptedWork.return);
	      workInProgress = null;
	    }
	  }
	  function prepareFreshStack(root, lanes) {
	    root.finishedWork = null;
	    root.finishedLanes = 0;
	    var timeoutHandle = root.timeoutHandle;
	    timeoutHandle !== noTimeout &&
	      ((root.timeoutHandle = noTimeout), cancelTimeout(timeoutHandle));
	    timeoutHandle = root.cancelPendingCommit;
	    null !== timeoutHandle &&
	      ((root.cancelPendingCommit = null), timeoutHandle());
	    resetWorkInProgressStack();
	    workInProgressRoot = root;
	    workInProgress = timeoutHandle = createWorkInProgress(root.current, null);
	    workInProgressRootRenderLanes = lanes;
	    workInProgressSuspendedReason = 0;
	    workInProgressThrownValue = null;
	    workInProgressRootDidSkipSuspendedSiblings = false;
	    workInProgressRootIsPrerendering = checkIfRootIsPrerendering(root, lanes);
	    workInProgressRootDidAttachPingListener = false;
	    workInProgressSuspendedRetryLanes =
	      workInProgressDeferredLane =
	      workInProgressRootPingedLanes =
	      workInProgressRootInterleavedUpdatedLanes =
	      workInProgressRootSkippedLanes =
	      workInProgressRootExitStatus =
	        0;
	    workInProgressRootRecoverableErrors = workInProgressRootConcurrentErrors =
	      null;
	    workInProgressRootDidIncludeRecursiveRenderUpdate = false;
	    0 !== (lanes & 8) && (lanes |= lanes & 32);
	    var allEntangledLanes = root.entangledLanes;
	    if (0 !== allEntangledLanes)
	      for (
	        root = root.entanglements, allEntangledLanes &= lanes;
	        0 < allEntangledLanes;

	      ) {
	        var index$4 = 31 - clz32(allEntangledLanes),
	          lane = 1 << index$4;
	        lanes |= root[index$4];
	        allEntangledLanes &= ~lane;
	      }
	    entangledRenderLanes = lanes;
	    finishQueueingConcurrentUpdates();
	    return timeoutHandle;
	  }
	  function handleThrow(root, thrownValue) {
	    currentlyRenderingFiber$1 = null;
	    ReactSharedInternals.H = ContextOnlyDispatcher;
	    thrownValue === SuspenseException
	      ? ((thrownValue = getSuspendedThenable()),
	        (workInProgressSuspendedReason = 3))
	      : thrownValue === SuspenseyCommitException
	        ? ((thrownValue = getSuspendedThenable()),
	          (workInProgressSuspendedReason = 4))
	        : (workInProgressSuspendedReason =
	            thrownValue === SelectiveHydrationException
	              ? 8
	              : null !== thrownValue &&
	                  "object" === typeof thrownValue &&
	                  "function" === typeof thrownValue.then
	                ? 6
	                : 1);
	    workInProgressThrownValue = thrownValue;
	    null === workInProgress &&
	      ((workInProgressRootExitStatus = 1),
	      logUncaughtError(
	        root,
	        createCapturedValueAtFiber(thrownValue, root.current)
	      ));
	  }
	  function shouldRemainOnPreviousScreen() {
	    var handler = suspenseHandlerStackCursor.current;
	    return null === handler
	      ? true
	      : (workInProgressRootRenderLanes & 4194176) ===
	          workInProgressRootRenderLanes
	        ? null === shellBoundary
	          ? true
	          : false
	        : (workInProgressRootRenderLanes & 62914560) ===
	              workInProgressRootRenderLanes ||
	            0 !== (workInProgressRootRenderLanes & 536870912)
	          ? handler === shellBoundary
	          : false;
	  }
	  function pushDispatcher() {
	    var prevDispatcher = ReactSharedInternals.H;
	    ReactSharedInternals.H = ContextOnlyDispatcher;
	    return null === prevDispatcher ? ContextOnlyDispatcher : prevDispatcher;
	  }
	  function pushAsyncDispatcher() {
	    var prevAsyncDispatcher = ReactSharedInternals.A;
	    ReactSharedInternals.A = DefaultAsyncDispatcher;
	    return prevAsyncDispatcher;
	  }
	  function renderDidSuspendDelayIfPossible() {
	    workInProgressRootExitStatus = 4;
	    workInProgressRootDidSkipSuspendedSiblings ||
	      ((workInProgressRootRenderLanes & 4194176) !==
	        workInProgressRootRenderLanes &&
	        null !== suspenseHandlerStackCursor.current) ||
	      (workInProgressRootIsPrerendering = true);
	    (0 === (workInProgressRootSkippedLanes & 134217727) &&
	      0 === (workInProgressRootInterleavedUpdatedLanes & 134217727)) ||
	      null === workInProgressRoot ||
	      markRootSuspended(
	        workInProgressRoot,
	        workInProgressRootRenderLanes,
	        workInProgressDeferredLane,
	        false
	      );
	  }
	  function renderRootSync(root, lanes, shouldYieldForPrerendering) {
	    var prevExecutionContext = executionContext;
	    executionContext |= 2;
	    var prevDispatcher = pushDispatcher(),
	      prevAsyncDispatcher = pushAsyncDispatcher();
	    if (workInProgressRoot !== root || workInProgressRootRenderLanes !== lanes)
	      (workInProgressTransitions = null), prepareFreshStack(root, lanes);
	    lanes = false;
	    var exitStatus = workInProgressRootExitStatus;
	    a: do
	      try {
	        if (0 !== workInProgressSuspendedReason && null !== workInProgress) {
	          var unitOfWork = workInProgress,
	            thrownValue = workInProgressThrownValue;
	          switch (workInProgressSuspendedReason) {
	            case 8:
	              resetWorkInProgressStack();
	              exitStatus = 6;
	              break a;
	            case 3:
	            case 2:
	            case 6:
	              null === suspenseHandlerStackCursor.current && (lanes = !0);
	              var reason = workInProgressSuspendedReason;
	              workInProgressSuspendedReason = 0;
	              workInProgressThrownValue = null;
	              throwAndUnwindWorkLoop(root, unitOfWork, thrownValue, reason);
	              if (
	                shouldYieldForPrerendering &&
	                workInProgressRootIsPrerendering
	              ) {
	                exitStatus = 0;
	                break a;
	              }
	              break;
	            default:
	              (reason = workInProgressSuspendedReason),
	                (workInProgressSuspendedReason = 0),
	                (workInProgressThrownValue = null),
	                throwAndUnwindWorkLoop(root, unitOfWork, thrownValue, reason);
	          }
	        }
	        workLoopSync();
	        exitStatus = workInProgressRootExitStatus;
	        break;
	      } catch (thrownValue$151) {
	        handleThrow(root, thrownValue$151);
	      }
	    while (1);
	    lanes && root.shellSuspendCounter++;
	    lastContextDependency = currentlyRenderingFiber = null;
	    executionContext = prevExecutionContext;
	    ReactSharedInternals.H = prevDispatcher;
	    ReactSharedInternals.A = prevAsyncDispatcher;
	    null === workInProgress &&
	      ((workInProgressRoot = null),
	      (workInProgressRootRenderLanes = 0),
	      finishQueueingConcurrentUpdates());
	    return exitStatus;
	  }
	  function workLoopSync() {
	    for (; null !== workInProgress; ) performUnitOfWork(workInProgress);
	  }
	  function renderRootConcurrent(root, lanes) {
	    var prevExecutionContext = executionContext;
	    executionContext |= 2;
	    var prevDispatcher = pushDispatcher(),
	      prevAsyncDispatcher = pushAsyncDispatcher();
	    workInProgressRoot !== root || workInProgressRootRenderLanes !== lanes
	      ? ((workInProgressTransitions = null),
	        (workInProgressRootRenderTargetTime = now() + 500),
	        prepareFreshStack(root, lanes))
	      : (workInProgressRootIsPrerendering = checkIfRootIsPrerendering(
	          root,
	          lanes
	        ));
	    a: do
	      try {
	        if (0 !== workInProgressSuspendedReason && null !== workInProgress) {
	          lanes = workInProgress;
	          var thrownValue = workInProgressThrownValue;
	          b: switch (workInProgressSuspendedReason) {
	            case 1:
	              workInProgressSuspendedReason = 0;
	              workInProgressThrownValue = null;
	              throwAndUnwindWorkLoop(root, lanes, thrownValue, 1);
	              break;
	            case 2:
	              if (isThenableResolved(thrownValue)) {
	                workInProgressSuspendedReason = 0;
	                workInProgressThrownValue = null;
	                replaySuspendedUnitOfWork(lanes);
	                break;
	              }
	              lanes = function () {
	                2 === workInProgressSuspendedReason &&
	                  workInProgressRoot === root &&
	                  (workInProgressSuspendedReason = 7);
	                ensureRootIsScheduled(root);
	              };
	              thrownValue.then(lanes, lanes);
	              break a;
	            case 3:
	              workInProgressSuspendedReason = 7;
	              break a;
	            case 4:
	              workInProgressSuspendedReason = 5;
	              break a;
	            case 7:
	              isThenableResolved(thrownValue)
	                ? ((workInProgressSuspendedReason = 0),
	                  (workInProgressThrownValue = null),
	                  replaySuspendedUnitOfWork(lanes))
	                : ((workInProgressSuspendedReason = 0),
	                  (workInProgressThrownValue = null),
	                  throwAndUnwindWorkLoop(root, lanes, thrownValue, 7));
	              break;
	            case 5:
	              var resource = null;
	              switch (workInProgress.tag) {
	                case 26:
	                  resource = workInProgress.memoizedState;
	                case 5:
	                case 27:
	                  var hostFiber = workInProgress,
	                    type = hostFiber.type,
	                    props = hostFiber.pendingProps;
	                  if (
	                    resource
	                      ? preloadResource(resource)
	                      : preloadInstance(type, props)
	                  ) {
	                    workInProgressSuspendedReason = 0;
	                    workInProgressThrownValue = null;
	                    var sibling = hostFiber.sibling;
	                    if (null !== sibling) workInProgress = sibling;
	                    else {
	                      var returnFiber = hostFiber.return;
	                      null !== returnFiber
	                        ? ((workInProgress = returnFiber),
	                          completeUnitOfWork(returnFiber))
	                        : (workInProgress = null);
	                    }
	                    break b;
	                  }
	              }
	              workInProgressSuspendedReason = 0;
	              workInProgressThrownValue = null;
	              throwAndUnwindWorkLoop(root, lanes, thrownValue, 5);
	              break;
	            case 6:
	              workInProgressSuspendedReason = 0;
	              workInProgressThrownValue = null;
	              throwAndUnwindWorkLoop(root, lanes, thrownValue, 6);
	              break;
	            case 8:
	              resetWorkInProgressStack();
	              workInProgressRootExitStatus = 6;
	              break a;
	            default:
	              throw Error(formatProdErrorMessage(462));
	          }
	        }
	        workLoopConcurrent();
	        break;
	      } catch (thrownValue$153) {
	        handleThrow(root, thrownValue$153);
	      }
	    while (1);
	    lastContextDependency = currentlyRenderingFiber = null;
	    ReactSharedInternals.H = prevDispatcher;
	    ReactSharedInternals.A = prevAsyncDispatcher;
	    executionContext = prevExecutionContext;
	    if (null !== workInProgress) return 0;
	    workInProgressRoot = null;
	    workInProgressRootRenderLanes = 0;
	    finishQueueingConcurrentUpdates();
	    return workInProgressRootExitStatus;
	  }
	  function workLoopConcurrent() {
	    for (; null !== workInProgress && !shouldYield(); )
	      performUnitOfWork(workInProgress);
	  }
	  function performUnitOfWork(unitOfWork) {
	    var next = beginWork(
	      unitOfWork.alternate,
	      unitOfWork,
	      entangledRenderLanes
	    );
	    unitOfWork.memoizedProps = unitOfWork.pendingProps;
	    null === next ? completeUnitOfWork(unitOfWork) : (workInProgress = next);
	  }
	  function replaySuspendedUnitOfWork(unitOfWork) {
	    var next = unitOfWork;
	    var current = next.alternate;
	    switch (next.tag) {
	      case 15:
	      case 0:
	        next = replayFunctionComponent(
	          current,
	          next,
	          next.pendingProps,
	          next.type,
	          undefined,
	          workInProgressRootRenderLanes
	        );
	        break;
	      case 11:
	        next = replayFunctionComponent(
	          current,
	          next,
	          next.pendingProps,
	          next.type.render,
	          next.ref,
	          workInProgressRootRenderLanes
	        );
	        break;
	      case 5:
	        resetHooksOnUnwind(next);
	      default:
	        unwindInterruptedWork(current, next),
	          (next = workInProgress =
	            resetWorkInProgress(next, entangledRenderLanes)),
	          (next = beginWork(current, next, entangledRenderLanes));
	    }
	    unitOfWork.memoizedProps = unitOfWork.pendingProps;
	    null === next ? completeUnitOfWork(unitOfWork) : (workInProgress = next);
	  }
	  function throwAndUnwindWorkLoop(
	    root,
	    unitOfWork,
	    thrownValue,
	    suspendedReason
	  ) {
	    lastContextDependency = currentlyRenderingFiber = null;
	    resetHooksOnUnwind(unitOfWork);
	    thenableState$1 = null;
	    thenableIndexCounter$1 = 0;
	    var returnFiber = unitOfWork.return;
	    try {
	      if (
	        throwException(
	          root,
	          returnFiber,
	          unitOfWork,
	          thrownValue,
	          workInProgressRootRenderLanes
	        )
	      ) {
	        workInProgressRootExitStatus = 1;
	        logUncaughtError(
	          root,
	          createCapturedValueAtFiber(thrownValue, root.current)
	        );
	        workInProgress = null;
	        return;
	      }
	    } catch (error) {
	      if (null !== returnFiber) throw ((workInProgress = returnFiber), error);
	      workInProgressRootExitStatus = 1;
	      logUncaughtError(
	        root,
	        createCapturedValueAtFiber(thrownValue, root.current)
	      );
	      workInProgress = null;
	      return;
	    }
	    if (unitOfWork.flags & 32768) {
	      if (isHydrating || 1 === suspendedReason) root = true;
	      else if (
	        workInProgressRootIsPrerendering ||
	        0 !== (workInProgressRootRenderLanes & 536870912)
	      )
	        root = false;
	      else if (
	        ((workInProgressRootDidSkipSuspendedSiblings = root = true),
	        2 === suspendedReason || 3 === suspendedReason || 6 === suspendedReason)
	      )
	        (suspendedReason = suspenseHandlerStackCursor.current),
	          null !== suspendedReason &&
	            13 === suspendedReason.tag &&
	            (suspendedReason.flags |= 16384);
	      unwindUnitOfWork(unitOfWork, root);
	    } else completeUnitOfWork(unitOfWork);
	  }
	  function completeUnitOfWork(unitOfWork) {
	    var completedWork = unitOfWork;
	    do {
	      if (0 !== (completedWork.flags & 32768)) {
	        unwindUnitOfWork(
	          completedWork,
	          workInProgressRootDidSkipSuspendedSiblings
	        );
	        return;
	      }
	      unitOfWork = completedWork.return;
	      var next = completeWork(
	        completedWork.alternate,
	        completedWork,
	        entangledRenderLanes
	      );
	      if (null !== next) {
	        workInProgress = next;
	        return;
	      }
	      completedWork = completedWork.sibling;
	      if (null !== completedWork) {
	        workInProgress = completedWork;
	        return;
	      }
	      workInProgress = completedWork = unitOfWork;
	    } while (null !== completedWork);
	    0 === workInProgressRootExitStatus && (workInProgressRootExitStatus = 5);
	  }
	  function unwindUnitOfWork(unitOfWork, skipSiblings) {
	    do {
	      var next = unwindWork(unitOfWork.alternate, unitOfWork);
	      if (null !== next) {
	        next.flags &= 32767;
	        workInProgress = next;
	        return;
	      }
	      next = unitOfWork.return;
	      null !== next &&
	        ((next.flags |= 32768),
	        (next.subtreeFlags = 0),
	        (next.deletions = null));
	      if (
	        !skipSiblings &&
	        ((unitOfWork = unitOfWork.sibling), null !== unitOfWork)
	      ) {
	        workInProgress = unitOfWork;
	        return;
	      }
	      workInProgress = unitOfWork = next;
	    } while (null !== unitOfWork);
	    workInProgressRootExitStatus = 6;
	    workInProgress = null;
	  }
	  function commitRoot(
	    root,
	    recoverableErrors,
	    transitions,
	    didIncludeRenderPhaseUpdate,
	    spawnedLane,
	    updatedLanes,
	    suspendedRetryLanes,
	    suspendedCommitReason,
	    completedRenderStartTime,
	    completedRenderEndTime
	  ) {
	    var prevTransition = ReactSharedInternals.T,
	      previousUpdateLanePriority = getCurrentUpdatePriority();
	    try {
	      setCurrentUpdatePriority(2),
	        (ReactSharedInternals.T = null),
	        commitRootImpl(
	          root,
	          recoverableErrors,
	          transitions,
	          didIncludeRenderPhaseUpdate,
	          previousUpdateLanePriority,
	          spawnedLane,
	          updatedLanes,
	          suspendedRetryLanes,
	          suspendedCommitReason,
	          completedRenderStartTime,
	          completedRenderEndTime
	        );
	    } finally {
	      (ReactSharedInternals.T = prevTransition),
	        setCurrentUpdatePriority(previousUpdateLanePriority);
	    }
	  }
	  function commitRootImpl(
	    root,
	    recoverableErrors,
	    transitions,
	    didIncludeRenderPhaseUpdate,
	    renderPriorityLevel,
	    spawnedLane,
	    updatedLanes,
	    suspendedRetryLanes
	  ) {
	    do flushPassiveEffects();
	    while (null !== rootWithPendingPassiveEffects);
	    if (0 !== (executionContext & 6)) throw Error(formatProdErrorMessage(327));
	    var finishedWork = root.finishedWork;
	    didIncludeRenderPhaseUpdate = root.finishedLanes;
	    if (null === finishedWork) return null;
	    root.finishedWork = null;
	    root.finishedLanes = 0;
	    if (finishedWork === root.current) throw Error(formatProdErrorMessage(177));
	    root.callbackNode = null;
	    root.callbackPriority = 0;
	    root.cancelPendingCommit = null;
	    var remainingLanes = finishedWork.lanes | finishedWork.childLanes;
	    remainingLanes |= concurrentlyUpdatedLanes;
	    markRootFinished(
	      root,
	      didIncludeRenderPhaseUpdate,
	      remainingLanes,
	      spawnedLane,
	      updatedLanes,
	      suspendedRetryLanes
	    );
	    root === workInProgressRoot &&
	      ((workInProgress = workInProgressRoot = null),
	      (workInProgressRootRenderLanes = 0));
	    (0 === (finishedWork.subtreeFlags & 10256) &&
	      0 === (finishedWork.flags & 10256)) ||
	      rootDoesHavePassiveEffects ||
	      ((rootDoesHavePassiveEffects = true),
	      (pendingPassiveEffectsRemainingLanes = remainingLanes),
	      (pendingPassiveTransitions = transitions),
	      scheduleCallback(NormalPriority$1, function () {
	        flushPassiveEffects();
	        return null;
	      }));
	    transitions = 0 !== (finishedWork.flags & 15990);
	    0 !== (finishedWork.subtreeFlags & 15990) || transitions
	      ? ((transitions = ReactSharedInternals.T),
	        (ReactSharedInternals.T = null),
	        (spawnedLane = getCurrentUpdatePriority()),
	        setCurrentUpdatePriority(2),
	        (updatedLanes = executionContext),
	        (executionContext |= 4),
	        commitBeforeMutationEffects(root, finishedWork),
	        commitMutationEffectsOnFiber(finishedWork, root),
	        resetAfterCommit(root.containerInfo),
	        (root.current = finishedWork),
	        commitLayoutEffectOnFiber(root, finishedWork.alternate, finishedWork),
	        requestPaint(),
	        (executionContext = updatedLanes),
	        setCurrentUpdatePriority(spawnedLane),
	        (ReactSharedInternals.T = transitions))
	      : (root.current = finishedWork);
	    rootDoesHavePassiveEffects
	      ? ((rootDoesHavePassiveEffects = false),
	        (rootWithPendingPassiveEffects = root),
	        (pendingPassiveEffectsLanes = didIncludeRenderPhaseUpdate))
	      : releaseRootPooledCache(root, remainingLanes);
	    remainingLanes = root.pendingLanes;
	    0 === remainingLanes && (legacyErrorBoundariesThatAlreadyFailed = null);
	    onCommitRoot(finishedWork.stateNode);
	    ensureRootIsScheduled(root);
	    if (null !== recoverableErrors)
	      for (
	        renderPriorityLevel = root.onRecoverableError, finishedWork = 0;
	        finishedWork < recoverableErrors.length;
	        finishedWork++
	      )
	        (remainingLanes = recoverableErrors[finishedWork]),
	          renderPriorityLevel(remainingLanes.value, {
	            componentStack: remainingLanes.stack
	          });
	    0 !== (pendingPassiveEffectsLanes & 3) && flushPassiveEffects();
	    remainingLanes = root.pendingLanes;
	    0 !== (didIncludeRenderPhaseUpdate & 4194218) && 0 !== (remainingLanes & 42)
	      ? root === rootWithNestedUpdates
	        ? nestedUpdateCount++
	        : ((nestedUpdateCount = 0), (rootWithNestedUpdates = root))
	      : (nestedUpdateCount = 0);
	    flushSyncWorkAcrossRoots_impl(0);
	    return null;
	  }
	  function releaseRootPooledCache(root, remainingLanes) {
	    0 === (root.pooledCacheLanes &= remainingLanes) &&
	      ((remainingLanes = root.pooledCache),
	      null != remainingLanes &&
	        ((root.pooledCache = null), releaseCache(remainingLanes)));
	  }
	  function flushPassiveEffects() {
	    if (null !== rootWithPendingPassiveEffects) {
	      var root = rootWithPendingPassiveEffects,
	        remainingLanes = pendingPassiveEffectsRemainingLanes;
	      pendingPassiveEffectsRemainingLanes = 0;
	      var renderPriority = lanesToEventPriority(pendingPassiveEffectsLanes),
	        priority = 32 > renderPriority ? 32 : renderPriority;
	      renderPriority = ReactSharedInternals.T;
	      var previousPriority = getCurrentUpdatePriority();
	      try {
	        setCurrentUpdatePriority(priority);
	        ReactSharedInternals.T = null;
	        if (null === rootWithPendingPassiveEffects)
	          var JSCompiler_inline_result = !1;
	        else {
	          priority = pendingPassiveTransitions;
	          pendingPassiveTransitions = null;
	          var root$jscomp$0 = rootWithPendingPassiveEffects,
	            lanes = pendingPassiveEffectsLanes;
	          rootWithPendingPassiveEffects = null;
	          pendingPassiveEffectsLanes = 0;
	          if (0 !== (executionContext & 6))
	            throw Error(formatProdErrorMessage(331));
	          var prevExecutionContext = executionContext;
	          executionContext |= 4;
	          commitPassiveUnmountOnFiber(root$jscomp$0.current);
	          commitPassiveMountOnFiber(
	            root$jscomp$0,
	            root$jscomp$0.current,
	            lanes,
	            priority
	          );
	          executionContext = prevExecutionContext;
	          flushSyncWorkAcrossRoots_impl(0, !1);
	          if (
	            injectedHook &&
	            "function" === typeof injectedHook.onPostCommitFiberRoot
	          )
	            try {
	              injectedHook.onPostCommitFiberRoot(rendererID, root$jscomp$0);
	            } catch (err) {}
	          JSCompiler_inline_result = !0;
	        }
	        return JSCompiler_inline_result;
	      } finally {
	        setCurrentUpdatePriority(previousPriority),
	          (ReactSharedInternals.T = renderPriority),
	          releaseRootPooledCache(root, remainingLanes);
	      }
	    }
	    return false;
	  }
	  function captureCommitPhaseErrorOnRoot(rootFiber, sourceFiber, error) {
	    sourceFiber = createCapturedValueAtFiber(error, sourceFiber);
	    sourceFiber = createRootErrorUpdate(rootFiber.stateNode, sourceFiber, 2);
	    rootFiber = enqueueUpdate(rootFiber, sourceFiber, 2);
	    null !== rootFiber &&
	      (markRootUpdated$1(rootFiber, 2), ensureRootIsScheduled(rootFiber));
	  }
	  function captureCommitPhaseError(sourceFiber, nearestMountedAncestor, error) {
	    if (3 === sourceFiber.tag)
	      captureCommitPhaseErrorOnRoot(sourceFiber, sourceFiber, error);
	    else
	      for (; null !== nearestMountedAncestor; ) {
	        if (3 === nearestMountedAncestor.tag) {
	          captureCommitPhaseErrorOnRoot(
	            nearestMountedAncestor,
	            sourceFiber,
	            error
	          );
	          break;
	        } else if (1 === nearestMountedAncestor.tag) {
	          var instance = nearestMountedAncestor.stateNode;
	          if (
	            "function" ===
	              typeof nearestMountedAncestor.type.getDerivedStateFromError ||
	            ("function" === typeof instance.componentDidCatch &&
	              (null === legacyErrorBoundariesThatAlreadyFailed ||
	                !legacyErrorBoundariesThatAlreadyFailed.has(instance)))
	          ) {
	            sourceFiber = createCapturedValueAtFiber(error, sourceFiber);
	            error = createClassErrorUpdate(2);
	            instance = enqueueUpdate(nearestMountedAncestor, error, 2);
	            null !== instance &&
	              (initializeClassErrorUpdate(
	                error,
	                instance,
	                nearestMountedAncestor,
	                sourceFiber
	              ),
	              markRootUpdated$1(instance, 2),
	              ensureRootIsScheduled(instance));
	            break;
	          }
	        }
	        nearestMountedAncestor = nearestMountedAncestor.return;
	      }
	  }
	  function attachPingListener(root, wakeable, lanes) {
	    var pingCache = root.pingCache;
	    if (null === pingCache) {
	      pingCache = root.pingCache = new PossiblyWeakMap();
	      var threadIDs = new Set();
	      pingCache.set(wakeable, threadIDs);
	    } else
	      (threadIDs = pingCache.get(wakeable)),
	        undefined === threadIDs &&
	          ((threadIDs = new Set()), pingCache.set(wakeable, threadIDs));
	    threadIDs.has(lanes) ||
	      ((workInProgressRootDidAttachPingListener = true),
	      threadIDs.add(lanes),
	      (root = pingSuspendedRoot.bind(null, root, wakeable, lanes)),
	      wakeable.then(root, root));
	  }
	  function pingSuspendedRoot(root, wakeable, pingedLanes) {
	    var pingCache = root.pingCache;
	    null !== pingCache && pingCache.delete(wakeable);
	    root.pingedLanes |= root.suspendedLanes & pingedLanes;
	    root.warmLanes &= ~pingedLanes;
	    workInProgressRoot === root &&
	      (workInProgressRootRenderLanes & pingedLanes) === pingedLanes &&
	      (4 === workInProgressRootExitStatus ||
	      (3 === workInProgressRootExitStatus &&
	        (workInProgressRootRenderLanes & 62914560) ===
	          workInProgressRootRenderLanes &&
	        300 > now() - globalMostRecentFallbackTime)
	        ? 0 === (executionContext & 2) && prepareFreshStack(root, 0)
	        : (workInProgressRootPingedLanes |= pingedLanes),
	      workInProgressSuspendedRetryLanes === workInProgressRootRenderLanes &&
	        (workInProgressSuspendedRetryLanes = 0));
	    ensureRootIsScheduled(root);
	  }
	  function retryTimedOutBoundary(boundaryFiber, retryLane) {
	    0 === retryLane && (retryLane = claimNextRetryLane());
	    boundaryFiber = enqueueConcurrentRenderForLane(boundaryFiber, retryLane);
	    null !== boundaryFiber &&
	      (markRootUpdated$1(boundaryFiber, retryLane),
	      ensureRootIsScheduled(boundaryFiber));
	  }
	  function retryDehydratedSuspenseBoundary(boundaryFiber) {
	    var suspenseState = boundaryFiber.memoizedState,
	      retryLane = 0;
	    null !== suspenseState && (retryLane = suspenseState.retryLane);
	    retryTimedOutBoundary(boundaryFiber, retryLane);
	  }
	  function resolveRetryWakeable(boundaryFiber, wakeable) {
	    var retryLane = 0;
	    switch (boundaryFiber.tag) {
	      case 13:
	        var retryCache = boundaryFiber.stateNode;
	        var suspenseState = boundaryFiber.memoizedState;
	        null !== suspenseState && (retryLane = suspenseState.retryLane);
	        break;
	      case 19:
	        retryCache = boundaryFiber.stateNode;
	        break;
	      case 22:
	        retryCache = boundaryFiber.stateNode._retryCache;
	        break;
	      default:
	        throw Error(formatProdErrorMessage(314));
	    }
	    null !== retryCache && retryCache.delete(wakeable);
	    retryTimedOutBoundary(boundaryFiber, retryLane);
	  }
	  function scheduleCallback(priorityLevel, callback) {
	    return scheduleCallback$3(priorityLevel, callback);
	  }
	  function FiberNode(tag, pendingProps, key, mode) {
	    this.tag = tag;
	    this.key = key;
	    this.sibling =
	      this.child =
	      this.return =
	      this.stateNode =
	      this.type =
	      this.elementType =
	        null;
	    this.index = 0;
	    this.refCleanup = this.ref = null;
	    this.pendingProps = pendingProps;
	    this.dependencies =
	      this.memoizedState =
	      this.updateQueue =
	      this.memoizedProps =
	        null;
	    this.mode = mode;
	    this.subtreeFlags = this.flags = 0;
	    this.deletions = null;
	    this.childLanes = this.lanes = 0;
	    this.alternate = null;
	  }
	  function shouldConstruct(Component) {
	    Component = Component.prototype;
	    return !(!Component || !Component.isReactComponent);
	  }
	  function createWorkInProgress(current, pendingProps) {
	    var workInProgress = current.alternate;
	    null === workInProgress
	      ? ((workInProgress = createFiber(
	          current.tag,
	          pendingProps,
	          current.key,
	          current.mode
	        )),
	        (workInProgress.elementType = current.elementType),
	        (workInProgress.type = current.type),
	        (workInProgress.stateNode = current.stateNode),
	        (workInProgress.alternate = current),
	        (current.alternate = workInProgress))
	      : ((workInProgress.pendingProps = pendingProps),
	        (workInProgress.type = current.type),
	        (workInProgress.flags = 0),
	        (workInProgress.subtreeFlags = 0),
	        (workInProgress.deletions = null));
	    workInProgress.flags = current.flags & 31457280;
	    workInProgress.childLanes = current.childLanes;
	    workInProgress.lanes = current.lanes;
	    workInProgress.child = current.child;
	    workInProgress.memoizedProps = current.memoizedProps;
	    workInProgress.memoizedState = current.memoizedState;
	    workInProgress.updateQueue = current.updateQueue;
	    pendingProps = current.dependencies;
	    workInProgress.dependencies =
	      null === pendingProps
	        ? null
	        : {
	            lanes: pendingProps.lanes,
	            firstContext: pendingProps.firstContext
	          };
	    workInProgress.sibling = current.sibling;
	    workInProgress.index = current.index;
	    workInProgress.ref = current.ref;
	    workInProgress.refCleanup = current.refCleanup;
	    return workInProgress;
	  }
	  function resetWorkInProgress(workInProgress, renderLanes) {
	    workInProgress.flags &= 31457282;
	    var current = workInProgress.alternate;
	    null === current
	      ? ((workInProgress.childLanes = 0),
	        (workInProgress.lanes = renderLanes),
	        (workInProgress.child = null),
	        (workInProgress.subtreeFlags = 0),
	        (workInProgress.memoizedProps = null),
	        (workInProgress.memoizedState = null),
	        (workInProgress.updateQueue = null),
	        (workInProgress.dependencies = null),
	        (workInProgress.stateNode = null))
	      : ((workInProgress.childLanes = current.childLanes),
	        (workInProgress.lanes = current.lanes),
	        (workInProgress.child = current.child),
	        (workInProgress.subtreeFlags = 0),
	        (workInProgress.deletions = null),
	        (workInProgress.memoizedProps = current.memoizedProps),
	        (workInProgress.memoizedState = current.memoizedState),
	        (workInProgress.updateQueue = current.updateQueue),
	        (workInProgress.type = current.type),
	        (renderLanes = current.dependencies),
	        (workInProgress.dependencies =
	          null === renderLanes
	            ? null
	            : {
	                lanes: renderLanes.lanes,
	                firstContext: renderLanes.firstContext
	              }));
	    return workInProgress;
	  }
	  function createFiberFromTypeAndProps(
	    type,
	    key,
	    pendingProps,
	    owner,
	    mode,
	    lanes
	  ) {
	    var fiberTag = 0;
	    owner = type;
	    if ("function" === typeof type) shouldConstruct(type) && (fiberTag = 1);
	    else if ("string" === typeof type)
	      fiberTag =
	        supportsResources && supportsSingletons
	          ? isHostHoistableType(type, pendingProps, contextStackCursor.current)
	            ? 26
	            : isHostSingletonType(type)
	              ? 27
	              : 5
	          : supportsResources
	            ? isHostHoistableType(
	                type,
	                pendingProps,
	                contextStackCursor.current
	              )
	              ? 26
	              : 5
	            : supportsSingletons
	              ? isHostSingletonType(type)
	                ? 27
	                : 5
	              : 5;
	    else
	      a: switch (type) {
	        case REACT_FRAGMENT_TYPE:
	          return createFiberFromFragment(
	            pendingProps.children,
	            mode,
	            lanes,
	            key
	          );
	        case REACT_STRICT_MODE_TYPE:
	          fiberTag = 8;
	          mode |= 24;
	          break;
	        case REACT_PROFILER_TYPE:
	          return (
	            (type = createFiber(12, pendingProps, key, mode | 2)),
	            (type.elementType = REACT_PROFILER_TYPE),
	            (type.lanes = lanes),
	            type
	          );
	        case REACT_SUSPENSE_TYPE:
	          return (
	            (type = createFiber(13, pendingProps, key, mode)),
	            (type.elementType = REACT_SUSPENSE_TYPE),
	            (type.lanes = lanes),
	            type
	          );
	        case REACT_SUSPENSE_LIST_TYPE:
	          return (
	            (type = createFiber(19, pendingProps, key, mode)),
	            (type.elementType = REACT_SUSPENSE_LIST_TYPE),
	            (type.lanes = lanes),
	            type
	          );
	        case REACT_OFFSCREEN_TYPE:
	          return createFiberFromOffscreen(pendingProps, mode, lanes, key);
	        default:
	          if ("object" === typeof type && null !== type)
	            switch (type.$$typeof) {
	              case REACT_PROVIDER_TYPE:
	              case REACT_CONTEXT_TYPE:
	                fiberTag = 10;
	                break a;
	              case REACT_CONSUMER_TYPE:
	                fiberTag = 9;
	                break a;
	              case REACT_FORWARD_REF_TYPE:
	                fiberTag = 11;
	                break a;
	              case REACT_MEMO_TYPE:
	                fiberTag = 14;
	                break a;
	              case REACT_LAZY_TYPE:
	                fiberTag = 16;
	                owner = null;
	                break a;
	            }
	          fiberTag = 29;
	          pendingProps = Error(
	            formatProdErrorMessage(
	              130,
	              null === type ? "null" : typeof type,
	              ""
	            )
	          );
	          owner = null;
	      }
	    key = createFiber(fiberTag, pendingProps, key, mode);
	    key.elementType = type;
	    key.type = owner;
	    key.lanes = lanes;
	    return key;
	  }
	  function createFiberFromFragment(elements, mode, lanes, key) {
	    elements = createFiber(7, elements, key, mode);
	    elements.lanes = lanes;
	    return elements;
	  }
	  function createFiberFromOffscreen(pendingProps, mode, lanes, key) {
	    pendingProps = createFiber(22, pendingProps, key, mode);
	    pendingProps.elementType = REACT_OFFSCREEN_TYPE;
	    pendingProps.lanes = lanes;
	    var primaryChildInstance = {
	      _visibility: 1,
	      _pendingVisibility: 1,
	      _pendingMarkers: null,
	      _retryCache: null,
	      _transitions: null,
	      _current: null,
	      detach: function () {
	        var fiber = primaryChildInstance._current;
	        if (null === fiber) throw Error(formatProdErrorMessage(456));
	        if (0 === (primaryChildInstance._pendingVisibility & 2)) {
	          var root = enqueueConcurrentRenderForLane(fiber, 2);
	          null !== root &&
	            ((primaryChildInstance._pendingVisibility |= 2),
	            scheduleUpdateOnFiber(root, fiber, 2));
	        }
	      },
	      attach: function () {
	        var fiber = primaryChildInstance._current;
	        if (null === fiber) throw Error(formatProdErrorMessage(456));
	        if (0 !== (primaryChildInstance._pendingVisibility & 2)) {
	          var root = enqueueConcurrentRenderForLane(fiber, 2);
	          null !== root &&
	            ((primaryChildInstance._pendingVisibility &= -3),
	            scheduleUpdateOnFiber(root, fiber, 2));
	        }
	      }
	    };
	    pendingProps.stateNode = primaryChildInstance;
	    return pendingProps;
	  }
	  function createFiberFromText(content, mode, lanes) {
	    content = createFiber(6, content, null, mode);
	    content.lanes = lanes;
	    return content;
	  }
	  function createFiberFromPortal(portal, mode, lanes) {
	    mode = createFiber(
	      4,
	      null !== portal.children ? portal.children : [],
	      portal.key,
	      mode
	    );
	    mode.lanes = lanes;
	    mode.stateNode = {
	      containerInfo: portal.containerInfo,
	      pendingChildren: null,
	      implementation: portal.implementation
	    };
	    return mode;
	  }
	  function FiberRootNode(
	    containerInfo,
	    tag,
	    hydrate,
	    identifierPrefix,
	    onUncaughtError,
	    onCaughtError,
	    onRecoverableError,
	    formState
	  ) {
	    this.tag = 1;
	    this.containerInfo = containerInfo;
	    this.finishedWork =
	      this.pingCache =
	      this.current =
	      this.pendingChildren =
	        null;
	    this.timeoutHandle = noTimeout;
	    this.callbackNode =
	      this.next =
	      this.pendingContext =
	      this.context =
	      this.cancelPendingCommit =
	        null;
	    this.callbackPriority = 0;
	    this.expirationTimes = createLaneMap(-1);
	    this.entangledLanes =
	      this.shellSuspendCounter =
	      this.errorRecoveryDisabledLanes =
	      this.finishedLanes =
	      this.expiredLanes =
	      this.warmLanes =
	      this.pingedLanes =
	      this.suspendedLanes =
	      this.pendingLanes =
	        0;
	    this.entanglements = createLaneMap(0);
	    this.hiddenUpdates = createLaneMap(null);
	    this.identifierPrefix = identifierPrefix;
	    this.onUncaughtError = onUncaughtError;
	    this.onCaughtError = onCaughtError;
	    this.onRecoverableError = onRecoverableError;
	    this.pooledCache = null;
	    this.pooledCacheLanes = 0;
	    this.formState = formState;
	    this.incompleteTransitions = new Map();
	  }
	  function createFiberRoot(
	    containerInfo,
	    tag,
	    hydrate,
	    initialChildren,
	    hydrationCallbacks,
	    isStrictMode,
	    identifierPrefix,
	    onUncaughtError,
	    onCaughtError,
	    onRecoverableError,
	    transitionCallbacks,
	    formState
	  ) {
	    containerInfo = new FiberRootNode(
	      containerInfo,
	      tag,
	      hydrate,
	      identifierPrefix,
	      onUncaughtError,
	      onCaughtError,
	      onRecoverableError,
	      formState
	    );
	    tag = 1;
	    true === isStrictMode && (tag |= 24);
	    isStrictMode = createFiber(3, null, null, tag);
	    containerInfo.current = isStrictMode;
	    isStrictMode.stateNode = containerInfo;
	    tag = createCache();
	    tag.refCount++;
	    containerInfo.pooledCache = tag;
	    tag.refCount++;
	    isStrictMode.memoizedState = {
	      element: initialChildren,
	      isDehydrated: hydrate,
	      cache: tag
	    };
	    initializeUpdateQueue(isStrictMode);
	    return containerInfo;
	  }
	  function getContextForSubtree(parentComponent) {
	    if (!parentComponent) return emptyContextObject;
	    parentComponent = emptyContextObject;
	    return parentComponent;
	  }
	  function findHostInstance(component) {
	    var fiber = component._reactInternals;
	    if (undefined === fiber) {
	      if ("function" === typeof component.render)
	        throw Error(formatProdErrorMessage(188));
	      component = Object.keys(component).join(",");
	      throw Error(formatProdErrorMessage(268, component));
	    }
	    component = findCurrentFiberUsingSlowPath(fiber);
	    component = null !== component ? findCurrentHostFiberImpl(component) : null;
	    return null === component ? null : getPublicInstance(component.stateNode);
	  }
	  function updateContainerImpl(
	    rootFiber,
	    lane,
	    element,
	    container,
	    parentComponent,
	    callback
	  ) {
	    parentComponent = getContextForSubtree(parentComponent);
	    null === container.context
	      ? (container.context = parentComponent)
	      : (container.pendingContext = parentComponent);
	    container = createUpdate(lane);
	    container.payload = { element: element };
	    callback = undefined === callback ? null : callback;
	    null !== callback && (container.callback = callback);
	    element = enqueueUpdate(rootFiber, container, lane);
	    null !== element &&
	      (scheduleUpdateOnFiber(element, rootFiber, lane),
	      entangleTransitions(element, rootFiber, lane));
	  }
	  function markRetryLaneImpl(fiber, retryLane) {
	    fiber = fiber.memoizedState;
	    if (null !== fiber && null !== fiber.dehydrated) {
	      var a = fiber.retryLane;
	      fiber.retryLane = 0 !== a && a < retryLane ? a : retryLane;
	    }
	  }
	  function markRetryLaneIfNotHydrated(fiber, retryLane) {
	    markRetryLaneImpl(fiber, retryLane);
	    (fiber = fiber.alternate) && markRetryLaneImpl(fiber, retryLane);
	  }
	  var exports = {};
	  var React = ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__,
	    Scheduler = schedulerExports,
	    assign = Object.assign,
	    REACT_LEGACY_ELEMENT_TYPE = Symbol.for("react.element"),
	    REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"),
	    REACT_PORTAL_TYPE = Symbol.for("react.portal"),
	    REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"),
	    REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"),
	    REACT_PROFILER_TYPE = Symbol.for("react.profiler"),
	    REACT_PROVIDER_TYPE = Symbol.for("react.provider"),
	    REACT_CONSUMER_TYPE = Symbol.for("react.consumer"),
	    REACT_CONTEXT_TYPE = Symbol.for("react.context"),
	    REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"),
	    REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"),
	    REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"),
	    REACT_MEMO_TYPE = Symbol.for("react.memo"),
	    REACT_LAZY_TYPE = Symbol.for("react.lazy");
	  var REACT_OFFSCREEN_TYPE = Symbol.for("react.offscreen");
	  var REACT_MEMO_CACHE_SENTINEL = Symbol.for("react.memo_cache_sentinel"),
	    MAYBE_ITERATOR_SYMBOL = Symbol.iterator,
	    REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"),
	    ReactSharedInternals =
	      React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
	    prefix,
	    suffix,
	    reentry = false,
	    isArrayImpl = Array.isArray,
	    rendererVersion = $$$config.rendererVersion,
	    rendererPackageName = $$$config.rendererPackageName,
	    extraDevToolsConfig = $$$config.extraDevToolsConfig,
	    getPublicInstance = $$$config.getPublicInstance,
	    getRootHostContext = $$$config.getRootHostContext,
	    getChildHostContext = $$$config.getChildHostContext,
	    prepareForCommit = $$$config.prepareForCommit,
	    resetAfterCommit = $$$config.resetAfterCommit,
	    createInstance = $$$config.createInstance,
	    appendInitialChild = $$$config.appendInitialChild,
	    finalizeInitialChildren = $$$config.finalizeInitialChildren,
	    shouldSetTextContent = $$$config.shouldSetTextContent,
	    createTextInstance = $$$config.createTextInstance,
	    scheduleTimeout = $$$config.scheduleTimeout,
	    cancelTimeout = $$$config.cancelTimeout,
	    noTimeout = $$$config.noTimeout,
	    isPrimaryRenderer = $$$config.isPrimaryRenderer;
	  $$$config.warnsIfNotActing;
	  var supportsMutation = $$$config.supportsMutation,
	    supportsPersistence = $$$config.supportsPersistence,
	    supportsHydration = $$$config.supportsHydration,
	    getInstanceFromNode = $$$config.getInstanceFromNode;
	  $$$config.beforeActiveInstanceBlur;
	  $$$config.afterActiveInstanceBlur;
	  var preparePortalMount = $$$config.preparePortalMount;
	  $$$config.prepareScopeUpdate;
	  $$$config.getInstanceFromScope;
	  var setCurrentUpdatePriority = $$$config.setCurrentUpdatePriority,
	    getCurrentUpdatePriority = $$$config.getCurrentUpdatePriority,
	    resolveUpdatePriority = $$$config.resolveUpdatePriority;
	  $$$config.resolveEventType;
	  $$$config.resolveEventTimeStamp;
	  var shouldAttemptEagerTransition = $$$config.shouldAttemptEagerTransition,
	    detachDeletedInstance = $$$config.detachDeletedInstance;
	  $$$config.requestPostPaintCallback;
	  var maySuspendCommit = $$$config.maySuspendCommit,
	    preloadInstance = $$$config.preloadInstance,
	    startSuspendingCommit = $$$config.startSuspendingCommit,
	    suspendInstance = $$$config.suspendInstance,
	    waitForCommitToBeReady = $$$config.waitForCommitToBeReady,
	    NotPendingTransition = $$$config.NotPendingTransition,
	    HostTransitionContext = $$$config.HostTransitionContext,
	    resetFormInstance = $$$config.resetFormInstance;
	  $$$config.bindToConsole;
	  var supportsMicrotasks = $$$config.supportsMicrotasks,
	    scheduleMicrotask = $$$config.scheduleMicrotask,
	    supportsTestSelectors = $$$config.supportsTestSelectors,
	    findFiberRoot = $$$config.findFiberRoot,
	    getBoundingRect = $$$config.getBoundingRect,
	    getTextContent = $$$config.getTextContent,
	    isHiddenSubtree = $$$config.isHiddenSubtree,
	    matchAccessibilityRole = $$$config.matchAccessibilityRole,
	    setFocusIfFocusable = $$$config.setFocusIfFocusable,
	    setupIntersectionObserver = $$$config.setupIntersectionObserver,
	    appendChild = $$$config.appendChild,
	    appendChildToContainer = $$$config.appendChildToContainer,
	    commitTextUpdate = $$$config.commitTextUpdate,
	    commitMount = $$$config.commitMount,
	    commitUpdate = $$$config.commitUpdate,
	    insertBefore = $$$config.insertBefore,
	    insertInContainerBefore = $$$config.insertInContainerBefore,
	    removeChild = $$$config.removeChild,
	    removeChildFromContainer = $$$config.removeChildFromContainer,
	    resetTextContent = $$$config.resetTextContent,
	    hideInstance = $$$config.hideInstance,
	    hideTextInstance = $$$config.hideTextInstance,
	    unhideInstance = $$$config.unhideInstance,
	    unhideTextInstance = $$$config.unhideTextInstance,
	    clearContainer = $$$config.clearContainer,
	    cloneInstance = $$$config.cloneInstance,
	    createContainerChildSet = $$$config.createContainerChildSet,
	    appendChildToContainerChildSet = $$$config.appendChildToContainerChildSet,
	    finalizeContainerChildren = $$$config.finalizeContainerChildren,
	    replaceContainerChildren = $$$config.replaceContainerChildren,
	    cloneHiddenInstance = $$$config.cloneHiddenInstance,
	    cloneHiddenTextInstance = $$$config.cloneHiddenTextInstance,
	    isSuspenseInstancePending = $$$config.isSuspenseInstancePending,
	    isSuspenseInstanceFallback = $$$config.isSuspenseInstanceFallback,
	    getSuspenseInstanceFallbackErrorDetails =
	      $$$config.getSuspenseInstanceFallbackErrorDetails,
	    registerSuspenseInstanceRetry = $$$config.registerSuspenseInstanceRetry,
	    canHydrateFormStateMarker = $$$config.canHydrateFormStateMarker,
	    isFormStateMarkerMatching = $$$config.isFormStateMarkerMatching,
	    getNextHydratableSibling = $$$config.getNextHydratableSibling,
	    getFirstHydratableChild = $$$config.getFirstHydratableChild,
	    getFirstHydratableChildWithinContainer =
	      $$$config.getFirstHydratableChildWithinContainer,
	    getFirstHydratableChildWithinSuspenseInstance =
	      $$$config.getFirstHydratableChildWithinSuspenseInstance,
	    canHydrateInstance = $$$config.canHydrateInstance,
	    canHydrateTextInstance = $$$config.canHydrateTextInstance,
	    canHydrateSuspenseInstance = $$$config.canHydrateSuspenseInstance,
	    hydrateInstance = $$$config.hydrateInstance,
	    hydrateTextInstance = $$$config.hydrateTextInstance,
	    hydrateSuspenseInstance = $$$config.hydrateSuspenseInstance,
	    getNextHydratableInstanceAfterSuspenseInstance =
	      $$$config.getNextHydratableInstanceAfterSuspenseInstance,
	    commitHydratedContainer = $$$config.commitHydratedContainer,
	    commitHydratedSuspenseInstance = $$$config.commitHydratedSuspenseInstance,
	    clearSuspenseBoundary = $$$config.clearSuspenseBoundary,
	    clearSuspenseBoundaryFromContainer =
	      $$$config.clearSuspenseBoundaryFromContainer,
	    shouldDeleteUnhydratedTailInstances =
	      $$$config.shouldDeleteUnhydratedTailInstances;
	  $$$config.diffHydratedPropsForDevWarnings;
	  $$$config.diffHydratedTextForDevWarnings;
	  $$$config.describeHydratableInstanceForDevWarnings;
	  var validateHydratableInstance = $$$config.validateHydratableInstance,
	    validateHydratableTextInstance = $$$config.validateHydratableTextInstance,
	    supportsResources = $$$config.supportsResources,
	    isHostHoistableType = $$$config.isHostHoistableType,
	    getHoistableRoot = $$$config.getHoistableRoot,
	    getResource = $$$config.getResource,
	    acquireResource = $$$config.acquireResource,
	    releaseResource = $$$config.releaseResource,
	    hydrateHoistable = $$$config.hydrateHoistable,
	    mountHoistable = $$$config.mountHoistable,
	    unmountHoistable = $$$config.unmountHoistable,
	    createHoistableInstance = $$$config.createHoistableInstance,
	    prepareToCommitHoistables = $$$config.prepareToCommitHoistables,
	    mayResourceSuspendCommit = $$$config.mayResourceSuspendCommit,
	    preloadResource = $$$config.preloadResource,
	    suspendResource = $$$config.suspendResource,
	    supportsSingletons = $$$config.supportsSingletons,
	    resolveSingletonInstance = $$$config.resolveSingletonInstance,
	    clearSingleton = $$$config.clearSingleton,
	    acquireSingletonInstance = $$$config.acquireSingletonInstance,
	    releaseSingletonInstance = $$$config.releaseSingletonInstance,
	    isHostSingletonType = $$$config.isHostSingletonType,
	    valueStack = [],
	    index$jscomp$0 = -1,
	    emptyContextObject = {},
	    clz32 = Math.clz32 ? Math.clz32 : clz32Fallback,
	    log$1 = Math.log,
	    LN2 = Math.LN2,
	    nextTransitionLane = 128,
	    nextRetryLane = 4194304,
	    scheduleCallback$3 = Scheduler.unstable_scheduleCallback,
	    cancelCallback$1 = Scheduler.unstable_cancelCallback,
	    shouldYield = Scheduler.unstable_shouldYield,
	    requestPaint = Scheduler.unstable_requestPaint,
	    now = Scheduler.unstable_now,
	    ImmediatePriority = Scheduler.unstable_ImmediatePriority,
	    UserBlockingPriority = Scheduler.unstable_UserBlockingPriority,
	    NormalPriority$1 = Scheduler.unstable_NormalPriority,
	    IdlePriority = Scheduler.unstable_IdlePriority,
	    log = Scheduler.log,
	    unstable_setDisableYieldValue = Scheduler.unstable_setDisableYieldValue,
	    rendererID = null,
	    injectedHook = null,
	    objectIs = "function" === typeof Object.is ? Object.is : is,
	    CapturedStacks = new WeakMap(),
	    forkStack = [],
	    forkStackIndex = 0,
	    treeForkProvider = null,
	    treeForkCount = 0,
	    idStack = [],
	    idStackIndex = 0,
	    treeContextProvider = null,
	    treeContextId = 1,
	    treeContextOverflow = "",
	    contextStackCursor = createCursor(null),
	    contextFiberStackCursor = createCursor(null),
	    rootInstanceStackCursor = createCursor(null),
	    hostTransitionProviderCursor = createCursor(null),
	    hydrationParentFiber = null,
	    nextHydratableInstance = null,
	    isHydrating = false,
	    hydrationErrors = null,
	    rootOrSingletonContext = false,
	    HydrationMismatchException = Error(formatProdErrorMessage(519)),
	    concurrentQueues = [],
	    concurrentQueuesIndex = 0,
	    concurrentlyUpdatedLanes = 0,
	    firstScheduledRoot = null,
	    lastScheduledRoot = null,
	    didScheduleMicrotask = false,
	    mightHavePendingSyncWork = false,
	    isFlushingWork = false,
	    currentEventTransitionLane = 0,
	    currentEntangledListeners = null,
	    currentEntangledPendingCount = 0,
	    currentEntangledLane = 0,
	    currentEntangledActionThenable = null,
	    hasForceUpdate = false,
	    didReadFromEntangledAsyncAction = false,
	    hasOwnProperty = Object.prototype.hasOwnProperty,
	    SuspenseException = Error(formatProdErrorMessage(460)),
	    SuspenseyCommitException = Error(formatProdErrorMessage(474)),
	    noopSuspenseyCommitThenable = { then: function () {} },
	    suspendedThenable = null,
	    thenableState$1 = null,
	    thenableIndexCounter$1 = 0,
	    reconcileChildFibers = createChildReconciler(true),
	    mountChildFibers = createChildReconciler(false),
	    currentTreeHiddenStackCursor = createCursor(null),
	    prevEntangledRenderLanesCursor = createCursor(0),
	    suspenseHandlerStackCursor = createCursor(null),
	    shellBoundary = null,
	    suspenseStackCursor = createCursor(0),
	    renderLanes = 0,
	    currentlyRenderingFiber$1 = null,
	    currentHook = null,
	    workInProgressHook = null,
	    didScheduleRenderPhaseUpdate = false,
	    didScheduleRenderPhaseUpdateDuringThisPass = false,
	    shouldDoubleInvokeUserFnsInHooksDEV = false,
	    localIdCounter = 0,
	    thenableIndexCounter = 0,
	    thenableState = null,
	    globalClientIdCounter = 0;
	  var createFunctionComponentUpdateQueue = function () {
	    return { lastEffect: null, events: null, stores: null, memoCache: null };
	  };
	  var ContextOnlyDispatcher = {
	    readContext: readContext,
	    use: use,
	    useCallback: throwInvalidHookError,
	    useContext: throwInvalidHookError,
	    useEffect: throwInvalidHookError,
	    useImperativeHandle: throwInvalidHookError,
	    useLayoutEffect: throwInvalidHookError,
	    useInsertionEffect: throwInvalidHookError,
	    useMemo: throwInvalidHookError,
	    useReducer: throwInvalidHookError,
	    useRef: throwInvalidHookError,
	    useState: throwInvalidHookError,
	    useDebugValue: throwInvalidHookError,
	    useDeferredValue: throwInvalidHookError,
	    useTransition: throwInvalidHookError,
	    useSyncExternalStore: throwInvalidHookError,
	    useId: throwInvalidHookError
	  };
	  ContextOnlyDispatcher.useCacheRefresh = throwInvalidHookError;
	  ContextOnlyDispatcher.useMemoCache = throwInvalidHookError;
	  ContextOnlyDispatcher.useHostTransitionStatus = throwInvalidHookError;
	  ContextOnlyDispatcher.useFormState = throwInvalidHookError;
	  ContextOnlyDispatcher.useActionState = throwInvalidHookError;
	  ContextOnlyDispatcher.useOptimistic = throwInvalidHookError;
	  var HooksDispatcherOnMount = {
	    readContext: readContext,
	    use: use,
	    useCallback: function (callback, deps) {
	      mountWorkInProgressHook().memoizedState = [
	        callback,
	        undefined === deps ? null : deps
	      ];
	      return callback;
	    },
	    useContext: readContext,
	    useEffect: mountEffect,
	    useImperativeHandle: function (ref, create, deps) {
	      deps = null !== deps && undefined !== deps ? deps.concat([ref]) : null;
	      mountEffectImpl(
	        4194308,
	        4,
	        imperativeHandleEffect.bind(null, create, ref),
	        deps
	      );
	    },
	    useLayoutEffect: function (create, deps) {
	      return mountEffectImpl(4194308, 4, create, deps);
	    },
	    useInsertionEffect: function (create, deps) {
	      mountEffectImpl(4, 2, create, deps);
	    },
	    useMemo: function (nextCreate, deps) {
	      var hook = mountWorkInProgressHook();
	      deps = undefined === deps ? null : deps;
	      var nextValue = nextCreate();
	      if (shouldDoubleInvokeUserFnsInHooksDEV) {
	        setIsStrictModeForDevtools(true);
	        try {
	          nextCreate();
	        } finally {
	          setIsStrictModeForDevtools(false);
	        }
	      }
	      hook.memoizedState = [nextValue, deps];
	      return nextValue;
	    },
	    useReducer: function (reducer, initialArg, init) {
	      var hook = mountWorkInProgressHook();
	      if (undefined !== init) {
	        var initialState = init(initialArg);
	        if (shouldDoubleInvokeUserFnsInHooksDEV) {
	          setIsStrictModeForDevtools(true);
	          try {
	            init(initialArg);
	          } finally {
	            setIsStrictModeForDevtools(false);
	          }
	        }
	      } else initialState = initialArg;
	      hook.memoizedState = hook.baseState = initialState;
	      reducer = {
	        pending: null,
	        lanes: 0,
	        dispatch: null,
	        lastRenderedReducer: reducer,
	        lastRenderedState: initialState
	      };
	      hook.queue = reducer;
	      reducer = reducer.dispatch = dispatchReducerAction.bind(
	        null,
	        currentlyRenderingFiber$1,
	        reducer
	      );
	      return [hook.memoizedState, reducer];
	    },
	    useRef: function (initialValue) {
	      var hook = mountWorkInProgressHook();
	      initialValue = { current: initialValue };
	      return (hook.memoizedState = initialValue);
	    },
	    useState: function (initialState) {
	      initialState = mountStateImpl(initialState);
	      var queue = initialState.queue,
	        dispatch = dispatchSetState.bind(
	          null,
	          currentlyRenderingFiber$1,
	          queue
	        );
	      queue.dispatch = dispatch;
	      return [initialState.memoizedState, dispatch];
	    },
	    useDebugValue: mountDebugValue,
	    useDeferredValue: function (value, initialValue) {
	      var hook = mountWorkInProgressHook();
	      return mountDeferredValueImpl(hook, value, initialValue);
	    },
	    useTransition: function () {
	      var stateHook = mountStateImpl(false);
	      stateHook = startTransition.bind(
	        null,
	        currentlyRenderingFiber$1,
	        stateHook.queue,
	        true,
	        false
	      );
	      mountWorkInProgressHook().memoizedState = stateHook;
	      return [false, stateHook];
	    },
	    useSyncExternalStore: function (subscribe, getSnapshot, getServerSnapshot) {
	      var fiber = currentlyRenderingFiber$1,
	        hook = mountWorkInProgressHook();
	      if (isHydrating) {
	        if (undefined === getServerSnapshot)
	          throw Error(formatProdErrorMessage(407));
	        getServerSnapshot = getServerSnapshot();
	      } else {
	        getServerSnapshot = getSnapshot();
	        if (null === workInProgressRoot)
	          throw Error(formatProdErrorMessage(349));
	        0 !== (workInProgressRootRenderLanes & 60) ||
	          pushStoreConsistencyCheck(fiber, getSnapshot, getServerSnapshot);
	      }
	      hook.memoizedState = getServerSnapshot;
	      var inst = { value: getServerSnapshot, getSnapshot: getSnapshot };
	      hook.queue = inst;
	      mountEffect(subscribeToStore.bind(null, fiber, inst, subscribe), [
	        subscribe
	      ]);
	      fiber.flags |= 2048;
	      pushEffect(
	        9,
	        updateStoreInstance.bind(
	          null,
	          fiber,
	          inst,
	          getServerSnapshot,
	          getSnapshot
	        ),
	        { destroy: undefined },
	        null
	      );
	      return getServerSnapshot;
	    },
	    useId: function () {
	      var hook = mountWorkInProgressHook(),
	        identifierPrefix = workInProgressRoot.identifierPrefix;
	      if (isHydrating) {
	        var JSCompiler_inline_result = treeContextOverflow;
	        var idWithLeadingBit = treeContextId;
	        JSCompiler_inline_result =
	          (
	            idWithLeadingBit & ~(1 << (32 - clz32(idWithLeadingBit) - 1))
	          ).toString(32) + JSCompiler_inline_result;
	        identifierPrefix =
	          ":" + identifierPrefix + "R" + JSCompiler_inline_result;
	        JSCompiler_inline_result = localIdCounter++;
	        0 < JSCompiler_inline_result &&
	          (identifierPrefix += "H" + JSCompiler_inline_result.toString(32));
	        identifierPrefix += ":";
	      } else
	        (JSCompiler_inline_result = globalClientIdCounter++),
	          (identifierPrefix =
	            ":" +
	            identifierPrefix +
	            "r" +
	            JSCompiler_inline_result.toString(32) +
	            ":");
	      return (hook.memoizedState = identifierPrefix);
	    },
	    useCacheRefresh: function () {
	      return (mountWorkInProgressHook().memoizedState = refreshCache.bind(
	        null,
	        currentlyRenderingFiber$1
	      ));
	    }
	  };
	  HooksDispatcherOnMount.useMemoCache = useMemoCache;
	  HooksDispatcherOnMount.useHostTransitionStatus = useHostTransitionStatus;
	  HooksDispatcherOnMount.useFormState = mountActionState;
	  HooksDispatcherOnMount.useActionState = mountActionState;
	  HooksDispatcherOnMount.useOptimistic = function (passthrough) {
	    var hook = mountWorkInProgressHook();
	    hook.memoizedState = hook.baseState = passthrough;
	    var queue = {
	      pending: null,
	      lanes: 0,
	      dispatch: null,
	      lastRenderedReducer: null,
	      lastRenderedState: null
	    };
	    hook.queue = queue;
	    hook = dispatchOptimisticSetState.bind(
	      null,
	      currentlyRenderingFiber$1,
	      true,
	      queue
	    );
	    queue.dispatch = hook;
	    return [passthrough, hook];
	  };
	  var HooksDispatcherOnUpdate = {
	    readContext: readContext,
	    use: use,
	    useCallback: updateCallback,
	    useContext: readContext,
	    useEffect: updateEffect,
	    useImperativeHandle: updateImperativeHandle,
	    useInsertionEffect: updateInsertionEffect,
	    useLayoutEffect: updateLayoutEffect,
	    useMemo: updateMemo,
	    useReducer: updateReducer,
	    useRef: updateRef,
	    useState: function () {
	      return updateReducer(basicStateReducer);
	    },
	    useDebugValue: mountDebugValue,
	    useDeferredValue: function (value, initialValue) {
	      var hook = updateWorkInProgressHook();
	      return updateDeferredValueImpl(
	        hook,
	        currentHook.memoizedState,
	        value,
	        initialValue
	      );
	    },
	    useTransition: function () {
	      var booleanOrThenable = updateReducer(basicStateReducer)[0],
	        start = updateWorkInProgressHook().memoizedState;
	      return [
	        "boolean" === typeof booleanOrThenable
	          ? booleanOrThenable
	          : useThenable(booleanOrThenable),
	        start
	      ];
	    },
	    useSyncExternalStore: updateSyncExternalStore,
	    useId: updateId
	  };
	  HooksDispatcherOnUpdate.useCacheRefresh = updateRefresh;
	  HooksDispatcherOnUpdate.useMemoCache = useMemoCache;
	  HooksDispatcherOnUpdate.useHostTransitionStatus = useHostTransitionStatus;
	  HooksDispatcherOnUpdate.useFormState = updateActionState;
	  HooksDispatcherOnUpdate.useActionState = updateActionState;
	  HooksDispatcherOnUpdate.useOptimistic = function (passthrough, reducer) {
	    var hook = updateWorkInProgressHook();
	    return updateOptimisticImpl(hook, currentHook, passthrough, reducer);
	  };
	  var HooksDispatcherOnRerender = {
	    readContext: readContext,
	    use: use,
	    useCallback: updateCallback,
	    useContext: readContext,
	    useEffect: updateEffect,
	    useImperativeHandle: updateImperativeHandle,
	    useInsertionEffect: updateInsertionEffect,
	    useLayoutEffect: updateLayoutEffect,
	    useMemo: updateMemo,
	    useReducer: rerenderReducer,
	    useRef: updateRef,
	    useState: function () {
	      return rerenderReducer(basicStateReducer);
	    },
	    useDebugValue: mountDebugValue,
	    useDeferredValue: function (value, initialValue) {
	      var hook = updateWorkInProgressHook();
	      return null === currentHook
	        ? mountDeferredValueImpl(hook, value, initialValue)
	        : updateDeferredValueImpl(
	            hook,
	            currentHook.memoizedState,
	            value,
	            initialValue
	          );
	    },
	    useTransition: function () {
	      var booleanOrThenable = rerenderReducer(basicStateReducer)[0],
	        start = updateWorkInProgressHook().memoizedState;
	      return [
	        "boolean" === typeof booleanOrThenable
	          ? booleanOrThenable
	          : useThenable(booleanOrThenable),
	        start
	      ];
	    },
	    useSyncExternalStore: updateSyncExternalStore,
	    useId: updateId
	  };
	  HooksDispatcherOnRerender.useCacheRefresh = updateRefresh;
	  HooksDispatcherOnRerender.useMemoCache = useMemoCache;
	  HooksDispatcherOnRerender.useHostTransitionStatus = useHostTransitionStatus;
	  HooksDispatcherOnRerender.useFormState = rerenderActionState;
	  HooksDispatcherOnRerender.useActionState = rerenderActionState;
	  HooksDispatcherOnRerender.useOptimistic = function (passthrough, reducer) {
	    var hook = updateWorkInProgressHook();
	    if (null !== currentHook)
	      return updateOptimisticImpl(hook, currentHook, passthrough, reducer);
	    hook.baseState = passthrough;
	    return [passthrough, hook.queue.dispatch];
	  };
	  var classComponentUpdater = {
	      isMounted: function (component) {
	        return (component = component._reactInternals)
	          ? getNearestMountedFiber(component) === component
	          : false;
	      },
	      enqueueSetState: function (inst, payload, callback) {
	        inst = inst._reactInternals;
	        var lane = requestUpdateLane(),
	          update = createUpdate(lane);
	        update.payload = payload;
	        undefined !== callback &&
	          null !== callback &&
	          (update.callback = callback);
	        payload = enqueueUpdate(inst, update, lane);
	        null !== payload &&
	          (scheduleUpdateOnFiber(payload, inst, lane),
	          entangleTransitions(payload, inst, lane));
	      },
	      enqueueReplaceState: function (inst, payload, callback) {
	        inst = inst._reactInternals;
	        var lane = requestUpdateLane(),
	          update = createUpdate(lane);
	        update.tag = 1;
	        update.payload = payload;
	        undefined !== callback &&
	          null !== callback &&
	          (update.callback = callback);
	        payload = enqueueUpdate(inst, update, lane);
	        null !== payload &&
	          (scheduleUpdateOnFiber(payload, inst, lane),
	          entangleTransitions(payload, inst, lane));
	      },
	      enqueueForceUpdate: function (inst, callback) {
	        inst = inst._reactInternals;
	        var lane = requestUpdateLane(),
	          update = createUpdate(lane);
	        update.tag = 2;
	        undefined !== callback &&
	          null !== callback &&
	          (update.callback = callback);
	        callback = enqueueUpdate(inst, update, lane);
	        null !== callback &&
	          (scheduleUpdateOnFiber(callback, inst, lane),
	          entangleTransitions(callback, inst, lane));
	      }
	    },
	    reportGlobalError =
	      "function" === typeof reportError
	        ? reportError
	        : function (error) {
	            if (
	              "object" === typeof window &&
	              "function" === typeof window.ErrorEvent
	            ) {
	              var event = new window.ErrorEvent("error", {
	                bubbles: true,
	                cancelable: true,
	                message:
	                  "object" === typeof error &&
	                  null !== error &&
	                  "string" === typeof error.message
	                    ? String(error.message)
	                    : String(error),
	                error: error
	              });
	              if (!window.dispatchEvent(event)) return;
	            } else if (
	              "object" === typeof process &&
	              "function" === typeof process.emit
	            ) {
	              process.emit("uncaughtException", error);
	              return;
	            }
	            console.error(error);
	          },
	    SelectiveHydrationException = Error(formatProdErrorMessage(461)),
	    didReceiveUpdate = false,
	    SUSPENDED_MARKER = { dehydrated: null, treeContext: null, retryLane: 0 },
	    valueCursor = createCursor(null),
	    currentlyRenderingFiber = null,
	    lastContextDependency = null,
	    AbortControllerLocal =
	      "undefined" !== typeof AbortController
	        ? AbortController
	        : function () {
	            var listeners = [],
	              signal = (this.signal = {
	                aborted: false,
	                addEventListener: function (type, listener) {
	                  listeners.push(listener);
	                }
	              });
	            this.abort = function () {
	              signal.aborted = true;
	              listeners.forEach(function (listener) {
	                return listener();
	              });
	            };
	          },
	    scheduleCallback$1 = Scheduler.unstable_scheduleCallback,
	    NormalPriority = Scheduler.unstable_NormalPriority,
	    CacheContext = {
	      $$typeof: REACT_CONTEXT_TYPE,
	      Consumer: null,
	      Provider: null,
	      _currentValue: null,
	      _currentValue2: null,
	      _threadCount: 0
	    },
	    prevOnStartTransitionFinish = ReactSharedInternals.S;
	  ReactSharedInternals.S = function (transition, returnValue) {
	    "object" === typeof returnValue &&
	      null !== returnValue &&
	      "function" === typeof returnValue.then &&
	      entangleAsyncAction(transition, returnValue);
	    null !== prevOnStartTransitionFinish &&
	      prevOnStartTransitionFinish(transition, returnValue);
	  };
	  var resumedCache = createCursor(null),
	    offscreenSubtreeIsHidden = false,
	    offscreenSubtreeWasHidden = false,
	    needsFormReset = false,
	    PossiblyWeakSet = "function" === typeof WeakSet ? WeakSet : Set,
	    nextEffect = null,
	    shouldFireAfterActiveInstanceBlur = false,
	    hostParent = null,
	    hostParentIsContainer = false,
	    currentHoistableRoot = null,
	    suspenseyCommitFlag = 8192,
	    DefaultAsyncDispatcher = {
	      getCacheForType: function (resourceType) {
	        var cache = readContext(CacheContext),
	          cacheForType = cache.data.get(resourceType);
	        undefined === cacheForType &&
	          ((cacheForType = resourceType()),
	          cache.data.set(resourceType, cacheForType));
	        return cacheForType;
	      }
	    },
	    COMPONENT_TYPE = 0,
	    HAS_PSEUDO_CLASS_TYPE = 1,
	    ROLE_TYPE = 2,
	    TEST_NAME_TYPE = 3,
	    TEXT_TYPE = 4;
	  if ("function" === typeof Symbol && Symbol.for) {
	    var symbolFor = Symbol.for;
	    COMPONENT_TYPE = symbolFor("selector.component");
	    HAS_PSEUDO_CLASS_TYPE = symbolFor("selector.has_pseudo_class");
	    ROLE_TYPE = symbolFor("selector.role");
	    TEST_NAME_TYPE = symbolFor("selector.test_id");
	    TEXT_TYPE = symbolFor("selector.text");
	  }
	  var PossiblyWeakMap = "function" === typeof WeakMap ? WeakMap : Map,
	    executionContext = 0,
	    workInProgressRoot = null,
	    workInProgress = null,
	    workInProgressRootRenderLanes = 0,
	    workInProgressSuspendedReason = 0,
	    workInProgressThrownValue = null,
	    workInProgressRootDidSkipSuspendedSiblings = false,
	    workInProgressRootIsPrerendering = false,
	    workInProgressRootDidAttachPingListener = false,
	    entangledRenderLanes = 0,
	    workInProgressRootExitStatus = 0,
	    workInProgressRootSkippedLanes = 0,
	    workInProgressRootInterleavedUpdatedLanes = 0,
	    workInProgressRootPingedLanes = 0,
	    workInProgressDeferredLane = 0,
	    workInProgressSuspendedRetryLanes = 0,
	    workInProgressRootConcurrentErrors = null,
	    workInProgressRootRecoverableErrors = null,
	    workInProgressRootDidIncludeRecursiveRenderUpdate = false,
	    globalMostRecentFallbackTime = 0,
	    workInProgressRootRenderTargetTime = Infinity,
	    workInProgressTransitions = null,
	    legacyErrorBoundariesThatAlreadyFailed = null,
	    rootDoesHavePassiveEffects = false,
	    rootWithPendingPassiveEffects = null,
	    pendingPassiveEffectsLanes = 0,
	    pendingPassiveEffectsRemainingLanes = 0,
	    pendingPassiveTransitions = null,
	    nestedUpdateCount = 0,
	    rootWithNestedUpdates = null;
	  exports.attemptContinuousHydration = function (fiber) {
	    if (13 === fiber.tag) {
	      var root = enqueueConcurrentRenderForLane(fiber, 67108864);
	      null !== root && scheduleUpdateOnFiber(root, fiber, 67108864);
	      markRetryLaneIfNotHydrated(fiber, 67108864);
	    }
	  };
	  exports.attemptHydrationAtCurrentPriority = function (fiber) {
	    if (13 === fiber.tag) {
	      var lane = requestUpdateLane(),
	        root = enqueueConcurrentRenderForLane(fiber, lane);
	      null !== root && scheduleUpdateOnFiber(root, fiber, lane);
	      markRetryLaneIfNotHydrated(fiber, lane);
	    }
	  };
	  exports.attemptSynchronousHydration = function (fiber) {
	    switch (fiber.tag) {
	      case 3:
	        fiber = fiber.stateNode;
	        if (fiber.current.memoizedState.isDehydrated) {
	          var lanes = getHighestPriorityLanes(fiber.pendingLanes);
	          if (0 !== lanes) {
	            fiber.pendingLanes |= 2;
	            for (fiber.entangledLanes |= 2; lanes; ) {
	              var lane = 1 << (31 - clz32(lanes));
	              fiber.entanglements[1] |= lane;
	              lanes &= ~lane;
	            }
	            ensureRootIsScheduled(fiber);
	            0 === (executionContext & 6) &&
	              ((workInProgressRootRenderTargetTime = now() + 500),
	              flushSyncWorkAcrossRoots_impl(0));
	          }
	        }
	        break;
	      case 13:
	        (lanes = enqueueConcurrentRenderForLane(fiber, 2)),
	          null !== lanes && scheduleUpdateOnFiber(lanes, fiber, 2),
	          flushSyncWork(),
	          markRetryLaneIfNotHydrated(fiber, 2);
	    }
	  };
	  exports.batchedUpdates = function (fn, a) {
	    return fn(a);
	  };
	  exports.createComponentSelector = function (component) {
	    return { $$typeof: COMPONENT_TYPE, value: component };
	  };
	  exports.createContainer = function (
	    containerInfo,
	    tag,
	    hydrationCallbacks,
	    isStrictMode,
	    concurrentUpdatesByDefaultOverride,
	    identifierPrefix,
	    onUncaughtError,
	    onCaughtError,
	    onRecoverableError,
	    transitionCallbacks
	  ) {
	    return createFiberRoot(
	      containerInfo,
	      tag,
	      false,
	      null,
	      hydrationCallbacks,
	      isStrictMode,
	      identifierPrefix,
	      onUncaughtError,
	      onCaughtError,
	      onRecoverableError,
	      transitionCallbacks,
	      null
	    );
	  };
	  exports.createHasPseudoClassSelector = function (selectors) {
	    return { $$typeof: HAS_PSEUDO_CLASS_TYPE, value: selectors };
	  };
	  exports.createHydrationContainer = function (
	    initialChildren,
	    callback,
	    containerInfo,
	    tag,
	    hydrationCallbacks,
	    isStrictMode,
	    concurrentUpdatesByDefaultOverride,
	    identifierPrefix,
	    onUncaughtError,
	    onCaughtError,
	    onRecoverableError,
	    transitionCallbacks,
	    formState
	  ) {
	    initialChildren = createFiberRoot(
	      containerInfo,
	      tag,
	      true,
	      initialChildren,
	      hydrationCallbacks,
	      isStrictMode,
	      identifierPrefix,
	      onUncaughtError,
	      onCaughtError,
	      onRecoverableError,
	      transitionCallbacks,
	      formState
	    );
	    initialChildren.context = getContextForSubtree(null);
	    containerInfo = initialChildren.current;
	    tag = requestUpdateLane();
	    hydrationCallbacks = createUpdate(tag);
	    hydrationCallbacks.callback =
	      undefined !== callback && null !== callback ? callback : null;
	    enqueueUpdate(containerInfo, hydrationCallbacks, tag);
	    initialChildren.current.lanes = tag;
	    markRootUpdated$1(initialChildren, tag);
	    ensureRootIsScheduled(initialChildren);
	    return initialChildren;
	  };
	  exports.createPortal = function (children, containerInfo, implementation) {
	    var key =
	      3 < arguments.length && undefined !== arguments[3] ? arguments[3] : null;
	    return {
	      $$typeof: REACT_PORTAL_TYPE,
	      key: null == key ? null : "" + key,
	      children: children,
	      containerInfo: containerInfo,
	      implementation: implementation
	    };
	  };
	  exports.createRoleSelector = function (role) {
	    return { $$typeof: ROLE_TYPE, value: role };
	  };
	  exports.createTestNameSelector = function (id) {
	    return { $$typeof: TEST_NAME_TYPE, value: id };
	  };
	  exports.createTextSelector = function (text) {
	    return { $$typeof: TEXT_TYPE, value: text };
	  };
	  exports.defaultOnCaughtError = function (error) {
	    console.error(error);
	  };
	  exports.defaultOnRecoverableError = function (error) {
	    reportGlobalError(error);
	  };
	  exports.defaultOnUncaughtError = function (error) {
	    reportGlobalError(error);
	  };
	  exports.deferredUpdates = function (fn) {
	    var prevTransition = ReactSharedInternals.T,
	      previousPriority = getCurrentUpdatePriority();
	    try {
	      return (
	        setCurrentUpdatePriority(32), (ReactSharedInternals.T = null), fn()
	      );
	    } finally {
	      setCurrentUpdatePriority(previousPriority),
	        (ReactSharedInternals.T = prevTransition);
	    }
	  };
	  exports.discreteUpdates = function (fn, a, b, c, d) {
	    var prevTransition = ReactSharedInternals.T,
	      previousPriority = getCurrentUpdatePriority();
	    try {
	      return (
	        setCurrentUpdatePriority(2),
	        (ReactSharedInternals.T = null),
	        fn(a, b, c, d)
	      );
	    } finally {
	      setCurrentUpdatePriority(previousPriority),
	        (ReactSharedInternals.T = prevTransition),
	        0 === executionContext &&
	          (workInProgressRootRenderTargetTime = now() + 500);
	    }
	  };
	  exports.findAllNodes = findAllNodes;
	  exports.findBoundingRects = function (hostRoot, selectors) {
	    if (!supportsTestSelectors) throw Error(formatProdErrorMessage(363));
	    selectors = findAllNodes(hostRoot, selectors);
	    hostRoot = [];
	    for (var i = 0; i < selectors.length; i++)
	      hostRoot.push(getBoundingRect(selectors[i]));
	    for (selectors = hostRoot.length - 1; 0 < selectors; selectors--) {
	      i = hostRoot[selectors];
	      for (
	        var targetLeft = i.x,
	          targetRight = targetLeft + i.width,
	          targetTop = i.y,
	          targetBottom = targetTop + i.height,
	          j = selectors - 1;
	        0 <= j;
	        j--
	      )
	        if (selectors !== j) {
	          var otherRect = hostRoot[j],
	            otherLeft = otherRect.x,
	            otherRight = otherLeft + otherRect.width,
	            otherTop = otherRect.y,
	            otherBottom = otherTop + otherRect.height;
	          if (
	            targetLeft >= otherLeft &&
	            targetTop >= otherTop &&
	            targetRight <= otherRight &&
	            targetBottom <= otherBottom
	          ) {
	            hostRoot.splice(selectors, 1);
	            break;
	          } else if (
	            !(
	              targetLeft !== otherLeft ||
	              i.width !== otherRect.width ||
	              otherBottom < targetTop ||
	              otherTop > targetBottom
	            )
	          ) {
	            otherTop > targetTop &&
	              ((otherRect.height += otherTop - targetTop),
	              (otherRect.y = targetTop));
	            otherBottom < targetBottom &&
	              (otherRect.height = targetBottom - otherTop);
	            hostRoot.splice(selectors, 1);
	            break;
	          } else if (
	            !(
	              targetTop !== otherTop ||
	              i.height !== otherRect.height ||
	              otherRight < targetLeft ||
	              otherLeft > targetRight
	            )
	          ) {
	            otherLeft > targetLeft &&
	              ((otherRect.width += otherLeft - targetLeft),
	              (otherRect.x = targetLeft));
	            otherRight < targetRight &&
	              (otherRect.width = targetRight - otherLeft);
	            hostRoot.splice(selectors, 1);
	            break;
	          }
	        }
	    }
	    return hostRoot;
	  };
	  exports.findHostInstance = findHostInstance;
	  exports.findHostInstanceWithNoPortals = function (fiber) {
	    fiber = findCurrentFiberUsingSlowPath(fiber);
	    fiber =
	      null !== fiber ? findCurrentHostFiberWithNoPortalsImpl(fiber) : null;
	    return null === fiber ? null : getPublicInstance(fiber.stateNode);
	  };
	  exports.findHostInstanceWithWarning = function (component) {
	    return findHostInstance(component);
	  };
	  exports.flushPassiveEffects = flushPassiveEffects;
	  exports.flushSyncFromReconciler = function (fn) {
	    var prevExecutionContext = executionContext;
	    executionContext |= 1;
	    var prevTransition = ReactSharedInternals.T,
	      previousPriority = getCurrentUpdatePriority();
	    try {
	      if ((setCurrentUpdatePriority(2), (ReactSharedInternals.T = null), fn))
	        return fn();
	    } finally {
	      setCurrentUpdatePriority(previousPriority),
	        (ReactSharedInternals.T = prevTransition),
	        (executionContext = prevExecutionContext),
	        0 === (executionContext & 6) && flushSyncWorkAcrossRoots_impl(0);
	    }
	  };
	  exports.flushSyncWork = flushSyncWork;
	  exports.focusWithin = function (hostRoot, selectors) {
	    if (!supportsTestSelectors) throw Error(formatProdErrorMessage(363));
	    hostRoot = findFiberRootForHostRoot(hostRoot);
	    selectors = findPaths(hostRoot, selectors);
	    selectors = Array.from(selectors);
	    for (hostRoot = 0; hostRoot < selectors.length; ) {
	      var fiber = selectors[hostRoot++],
	        tag = fiber.tag;
	      if (!isHiddenSubtree(fiber)) {
	        if (
	          (5 === tag || 26 === tag || 27 === tag) &&
	          setFocusIfFocusable(fiber.stateNode)
	        )
	          return true;
	        for (fiber = fiber.child; null !== fiber; )
	          selectors.push(fiber), (fiber = fiber.sibling);
	      }
	    }
	    return false;
	  };
	  exports.getFindAllNodesFailureDescription = function (hostRoot, selectors) {
	    if (!supportsTestSelectors) throw Error(formatProdErrorMessage(363));
	    var maxSelectorIndex = 0,
	      matchedNames = [];
	    hostRoot = [findFiberRootForHostRoot(hostRoot), 0];
	    for (var index = 0; index < hostRoot.length; ) {
	      var fiber = hostRoot[index++],
	        tag = fiber.tag,
	        selectorIndex = hostRoot[index++],
	        selector = selectors[selectorIndex];
	      if ((5 !== tag && 26 !== tag && 27 !== tag) || !isHiddenSubtree(fiber))
	        if (
	          (matchSelector(fiber, selector) &&
	            (matchedNames.push(selectorToString(selector)),
	            selectorIndex++,
	            selectorIndex > maxSelectorIndex &&
	              (maxSelectorIndex = selectorIndex)),
	          selectorIndex < selectors.length)
	        )
	          for (fiber = fiber.child; null !== fiber; )
	            hostRoot.push(fiber, selectorIndex), (fiber = fiber.sibling);
	    }
	    if (maxSelectorIndex < selectors.length) {
	      for (
	        hostRoot = [];
	        maxSelectorIndex < selectors.length;
	        maxSelectorIndex++
	      )
	        hostRoot.push(selectorToString(selectors[maxSelectorIndex]));
	      return (
	        "findAllNodes was able to match part of the selector:\n  " +
	        (matchedNames.join(" > ") +
	          "\n\nNo matching component was found for:\n  ") +
	        hostRoot.join(" > ")
	      );
	    }
	    return null;
	  };
	  exports.getPublicRootInstance = function (container) {
	    container = container.current;
	    if (!container.child) return null;
	    switch (container.child.tag) {
	      case 27:
	      case 5:
	        return getPublicInstance(container.child.stateNode);
	      default:
	        return container.child.stateNode;
	    }
	  };
	  exports.injectIntoDevTools = function () {
	    var internals = {
	      bundleType: 0,
	      version: rendererVersion,
	      rendererPackageName: rendererPackageName,
	      currentDispatcherRef: ReactSharedInternals,
	      findFiberByHostInstance: getInstanceFromNode,
	      reconcilerVersion: "19.0.0"
	    };
	    null !== extraDevToolsConfig &&
	      (internals.rendererConfig = extraDevToolsConfig);
	    if ("undefined" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__) internals = false;
	    else {
	      var hook = __REACT_DEVTOOLS_GLOBAL_HOOK__;
	      if (hook.isDisabled || !hook.supportsFiber) internals = true;
	      else {
	        try {
	          (rendererID = hook.inject(internals)), (injectedHook = hook);
	        } catch (err) {}
	        internals = hook.checkDCE ? true : false;
	      }
	    }
	    return internals;
	  };
	  exports.isAlreadyRendering = function () {
	    return false;
	  };
	  exports.observeVisibleRects = function (
	    hostRoot,
	    selectors,
	    callback,
	    options
	  ) {
	    if (!supportsTestSelectors) throw Error(formatProdErrorMessage(363));
	    hostRoot = findAllNodes(hostRoot, selectors);
	    var disconnect = setupIntersectionObserver(
	      hostRoot,
	      callback,
	      options
	    ).disconnect;
	    return {
	      disconnect: function () {
	        disconnect();
	      }
	    };
	  };
	  exports.shouldError = function () {
	    return null;
	  };
	  exports.shouldSuspend = function () {
	    return false;
	  };
	  exports.startHostTransition = function (
	    formFiber,
	    pendingState,
	    action,
	    formData
	  ) {
	    if (5 !== formFiber.tag) throw Error(formatProdErrorMessage(476));
	    var queue = ensureFormComponentIsStateful(formFiber).queue;
	    startTransition(
	      formFiber,
	      queue,
	      pendingState,
	      NotPendingTransition,
	      null === action
	        ? noop
	        : function () {
	            var resetStateQueue =
	              ensureFormComponentIsStateful(formFiber).next.queue;
	            dispatchSetStateInternal(
	              formFiber,
	              resetStateQueue,
	              {},
	              requestUpdateLane()
	            );
	            return action(formData);
	          }
	    );
	  };
	  exports.updateContainer = function (
	    element,
	    container,
	    parentComponent,
	    callback
	  ) {
	    var current = container.current,
	      lane = requestUpdateLane();
	    updateContainerImpl(
	      current,
	      lane,
	      element,
	      container,
	      parentComponent,
	      callback
	    );
	    return lane;
	  };
	  exports.updateContainerSync = function (
	    element,
	    container,
	    parentComponent,
	    callback
	  ) {
	    0 === container.tag && flushPassiveEffects();
	    updateContainerImpl(
	      container.current,
	      2,
	      element,
	      container,
	      parentComponent,
	      callback
	    );
	    return 2;
	  };
	  return exports;
	};
	module.exports.default = module.exports;
	Object.defineProperty(module.exports, "__esModule", { value: true }); 
} (reactReconciler_production));

var reactReconciler_productionExports = reactReconciler_production.exports;

{
  reactReconciler.exports = reactReconciler_productionExports;
}

var reactReconcilerExports = reactReconciler.exports;
const Reconciler = /*@__PURE__*/getDefaultExportFromCjs(reactReconcilerExports);

function i$1(e, t, r) {
  if (!e) return;
  if (r(e) === true) return e;
  let n = t ? e.return : e.child;
  for (; n; ) {
    const u = i$1(n, t, r);
    if (u) return u;
    n = t ? null : n.sibling;
  }
}
function l(e) {
  try {
    return Object.defineProperties(e, {
      _currentRenderer: {
        get() {
          return null;
        },
        set() {
        }
      },
      _currentRenderer2: {
        get() {
          return null;
        },
        set() {
        }
      }
    });
  } catch (t) {
    return e;
  }
}
const a = /* @__PURE__ */ l(/* @__PURE__ */ ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__.createContext(null));
class m extends ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__.Component {
  render() {
    return /* @__PURE__ */ ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__.createElement(a.Provider, { value: this._reactInternals }, this.props.children);
  }
}
function c() {
  const e = ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__.useContext(a);
  if (e === null) throw new Error("its-fine: useFiber must be called within a <FiberProvider />!");
  const t = ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__.useId();
  return ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__.useMemo(() => {
    for (const n of [e, e == null ? undefined : e.alternate]) {
      if (!n) continue;
      const u = i$1(n, false, (d) => {
        let s = d.memoizedState;
        for (; s; ) {
          if (s.memoizedState === t) return true;
          s = s.next;
        }
      });
      if (u) return u;
    }
  }, [e, t]);
}
const p = Symbol.for("react.context"), b = (e) => e !== null && typeof e == "object" && "$$typeof" in e && e.$$typeof === p;
function h() {
  const e = c(), [t] = ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__.useState(() => /* @__PURE__ */ new Map());
  t.clear();
  let r = e;
  for (; r; ) {
    const n = r.type;
    b(n) && n !== a && !t.has(n) && t.set(n, ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__.use(l(n))), r = r.return;
  }
  return t;
}
function x() {
  const e = h();
  return ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__.useMemo(
    () => Array.from(e.keys()).reduce(
      (t, r) => (n) => /* @__PURE__ */ ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__.createElement(t, null, /* @__PURE__ */ ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__.createElement(r.Provider, { ...n, value: e.get(r) })),
      (t) => /* @__PURE__ */ ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__.createElement(m, { ...t })
    ),
    [e]
  );
}

var threeTypes = /* @__PURE__ */ Object.freeze({
  __proto__: null
});
function findInitialRoot(instance) {
  let root = instance.root;
  while (root.getState().previousRoot) root = root.getState().previousRoot;
  return root;
}
const act = ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__.act;
const isOrthographicCamera = (def) => def && def.isOrthographicCamera;
const isRef = (obj) => obj && obj.hasOwnProperty("current");
const isColorRepresentation = (value) => value != null && (typeof value === "string" || typeof value === "number" || value.isColor);
const useIsomorphicLayoutEffect = /* @__PURE__ */ ((_window$document, _window$navigator) => typeof window !== "undefined" && (((_window$document = window.document) == null ? undefined : _window$document.createElement) || ((_window$navigator = window.navigator) == null ? undefined : _window$navigator.product) === "ReactNative"))() ? ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__.useLayoutEffect : ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__.useEffect;
function useMutableCallback(fn) {
  const ref = ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__.useRef(fn);
  useIsomorphicLayoutEffect(() => void (ref.current = fn), [fn]);
  return ref;
}
function useBridge() {
  const fiber = c();
  const ContextBridge = x();
  return ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__.useMemo(() => ({
    children
  }) => {
    const strict = !!i$1(fiber, true, (node) => node.type === ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__.StrictMode);
    const Root = strict ? ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__.StrictMode : ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__.Fragment;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Root, {
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(ContextBridge, {
        children
      })
    });
  }, [fiber, ContextBridge]);
}
function Block({
  set
}) {
  useIsomorphicLayoutEffect(() => {
    set(new Promise(() => null));
    return () => set(false);
  }, [set]);
  return null;
}
const ErrorBoundary = /* @__PURE__ */ ((_ErrorBoundary) => (_ErrorBoundary = class ErrorBoundary extends ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      error: false
    };
  }
  componentDidCatch(err) {
    this.props.set(err);
  }
  render() {
    return this.state.error ? null : this.props.children;
  }
}, _ErrorBoundary.getDerivedStateFromError = () => ({
  error: true
}), _ErrorBoundary))();
function calculateDpr(dpr) {
  var _window$devicePixelRa;
  const target = typeof window !== "undefined" ? (_window$devicePixelRa = window.devicePixelRatio) != null ? _window$devicePixelRa : 2 : 1;
  return Array.isArray(dpr) ? Math.min(Math.max(dpr[0], target), dpr[1]) : dpr;
}
function getRootState(obj) {
  var _r3f;
  return (_r3f = obj.__r3f) == null ? undefined : _r3f.root.getState();
}
const is = {
  obj: (a) => a === Object(a) && !is.arr(a) && typeof a !== "function",
  fun: (a) => typeof a === "function",
  str: (a) => typeof a === "string",
  num: (a) => typeof a === "number",
  boo: (a) => typeof a === "boolean",
  und: (a) => a === undefined,
  nul: (a) => a === null,
  arr: (a) => Array.isArray(a),
  equ(a, b, {
    arrays = "shallow",
    objects = "reference",
    strict = true
  } = {}) {
    if (typeof a !== typeof b || !!a !== !!b) return false;
    if (is.str(a) || is.num(a) || is.boo(a)) return a === b;
    const isObj = is.obj(a);
    if (isObj && objects === "reference") return a === b;
    const isArr = is.arr(a);
    if (isArr && arrays === "reference") return a === b;
    if ((isArr || isObj) && a === b) return true;
    let i2;
    for (i2 in a) if (!(i2 in b)) return false;
    if (isObj && arrays === "shallow" && objects === "shallow") {
      for (i2 in strict ? b : a) if (!is.equ(a[i2], b[i2], {
        strict,
        objects: "reference"
      })) return false;
    } else {
      for (i2 in strict ? b : a) if (a[i2] !== b[i2]) return false;
    }
    if (is.und(i2)) {
      if (isArr && a.length === 0 && b.length === 0) return true;
      if (isObj && Object.keys(a).length === 0 && Object.keys(b).length === 0) return true;
      if (a !== b) return false;
    }
    return true;
  }
};
function buildGraph(object) {
  const data = {
    nodes: {},
    materials: {},
    meshes: {}
  };
  if (object) {
    object.traverse((obj) => {
      if (obj.name) data.nodes[obj.name] = obj;
      if (obj.material && !data.materials[obj.material.name]) data.materials[obj.material.name] = obj.material;
      if (obj.isMesh && !data.meshes[obj.name]) data.meshes[obj.name] = obj;
    });
  }
  return data;
}
function dispose(obj) {
  if (obj.type !== "Scene") obj.dispose == null ? undefined : obj.dispose();
  for (const p in obj) {
    const prop = obj[p];
    if ((prop == null ? undefined : prop.type) !== "Scene") prop == null ? undefined : prop.dispose == null ? undefined : prop.dispose();
  }
}
const REACT_INTERNAL_PROPS = ["children", "key", "ref"];
function getInstanceProps(queue) {
  const props = {};
  for (const key in queue) {
    if (!REACT_INTERNAL_PROPS.includes(key)) props[key] = queue[key];
  }
  return props;
}
function prepare(target, root, type, props) {
  const object = target;
  let instance = object == null ? undefined : object.__r3f;
  if (!instance) {
    instance = {
      root,
      type,
      parent: null,
      children: [],
      props: getInstanceProps(props),
      object,
      eventCount: 0,
      handlers: {},
      isHidden: false
    };
    if (object) object.__r3f = instance;
  }
  return instance;
}
function resolve(root, key) {
  let target = root[key];
  if (!key.includes("-")) return {
    root,
    key,
    target
  };
  target = root;
  for (const part of key.split("-")) {
    var _target;
    key = part;
    root = target;
    target = (_target = target) == null ? undefined : _target[key];
  }
  return {
    root,
    key,
    target
  };
}
const INDEX_REGEX = /-\d+$/;
function attach(parent, child) {
  if (is.str(child.props.attach)) {
    if (INDEX_REGEX.test(child.props.attach)) {
      const index = child.props.attach.replace(INDEX_REGEX, "");
      const {
        root: root2,
        key: key2
      } = resolve(parent.object, index);
      if (!Array.isArray(root2[key2])) root2[key2] = [];
    }
    const {
      root,
      key
    } = resolve(parent.object, child.props.attach);
    child.previousAttach = root[key];
    root[key] = child.object;
  } else if (is.fun(child.props.attach)) {
    child.previousAttach = child.props.attach(parent.object, child.object);
  }
}
function detach(parent, child) {
  if (is.str(child.props.attach)) {
    const {
      root,
      key
    } = resolve(parent.object, child.props.attach);
    const previous = child.previousAttach;
    if (previous === undefined) delete root[key];
    else root[key] = previous;
  } else {
    child.previousAttach == null ? undefined : child.previousAttach(parent.object, child.object);
  }
  delete child.previousAttach;
}
const RESERVED_PROPS = [
  ...REACT_INTERNAL_PROPS,
  // Instance props
  "args",
  "dispose",
  "attach",
  "object",
  "onUpdate",
  // Behavior flags
  "dispose"
];
const MEMOIZED_PROTOTYPES = /* @__PURE__ */ new Map();
function getMemoizedPrototype(root) {
  let ctor = MEMOIZED_PROTOTYPES.get(root.constructor);
  try {
    if (!ctor) {
      ctor = new root.constructor();
      MEMOIZED_PROTOTYPES.set(root.constructor, ctor);
    }
  } catch (e) {
  }
  return ctor;
}
function diffProps(instance, newProps) {
  const changedProps = {};
  for (const prop in newProps) {
    if (RESERVED_PROPS.includes(prop)) continue;
    if (is.equ(newProps[prop], instance.props[prop])) continue;
    changedProps[prop] = newProps[prop];
    for (const other in newProps) {
      if (other.startsWith(`${prop}-`)) changedProps[other] = newProps[other];
    }
  }
  for (const prop in instance.props) {
    if (RESERVED_PROPS.includes(prop) || newProps.hasOwnProperty(prop)) continue;
    const {
      root,
      key
    } = resolve(instance.object, prop);
    if (root.constructor && root.constructor.length === 0) {
      const ctor = getMemoizedPrototype(root);
      if (!is.und(ctor)) changedProps[key] = ctor[key];
    } else {
      changedProps[key] = 0;
    }
  }
  return changedProps;
}
const colorMaps = ["map", "emissiveMap", "sheenColorMap", "specularColorMap", "envMap"];
const EVENT_REGEX = /^on(Pointer|Click|DoubleClick|ContextMenu|Wheel)/;
function applyProps(object, props) {
  var _instance$object;
  const instance = object.__r3f;
  const rootState = instance && findInitialRoot(instance).getState();
  const prevHandlers = instance == null ? undefined : instance.eventCount;
  for (const prop in props) {
    let value = props[prop];
    if (RESERVED_PROPS.includes(prop)) continue;
    if (instance && EVENT_REGEX.test(prop)) {
      if (typeof value === "function") instance.handlers[prop] = value;
      else delete instance.handlers[prop];
      instance.eventCount = Object.keys(instance.handlers).length;
      continue;
    }
    if (value === undefined) continue;
    let {
      root,
      key,
      target
    } = resolve(object, prop);
    if (target instanceof ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Layers && value instanceof ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Layers) {
      target.mask = value.mask;
    } else if (target instanceof ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Color && isColorRepresentation(value)) {
      target.set(value);
    } else if (target !== null && typeof target === "object" && typeof target.set === "function" && typeof target.copy === "function" && value != null && value.constructor && target.constructor === value.constructor) {
      target.copy(value);
    } else if (target !== null && typeof target === "object" && typeof target.set === "function" && Array.isArray(value)) {
      if (typeof target.fromArray === "function") target.fromArray(value);
      else target.set(...value);
    } else if (target !== null && typeof target === "object" && typeof target.set === "function" && typeof value === "number") {
      if (typeof target.setScalar === "function") target.setScalar(value);
      else target.set(value);
    } else {
      var _root$key;
      root[key] = value;
      if (rootState && !rootState.linear && colorMaps.includes(key) && (_root$key = root[key]) != null && _root$key.isTexture && // sRGB textures must be RGBA8 since r137 https://github.com/mrdoob/three.js/pull/23129
      root[key].format === ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.RGBAFormat && root[key].type === ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.UnsignedByteType) {
        root[key].colorSpace = ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.SRGBColorSpace;
      }
    }
  }
  if (instance != null && instance.parent && rootState != null && rootState.internal && (_instance$object = instance.object) != null && _instance$object.isObject3D && prevHandlers !== instance.eventCount) {
    const object2 = instance.object;
    const index = rootState.internal.interaction.indexOf(object2);
    if (index > -1) rootState.internal.interaction.splice(index, 1);
    if (instance.eventCount && object2.raycast !== null) {
      rootState.internal.interaction.push(object2);
    }
  }
  if (instance && instance.props.attach === undefined) {
    if (instance.object.isBufferGeometry) instance.props.attach = "geometry";
    else if (instance.object.isMaterial) instance.props.attach = "material";
  }
  if (instance) invalidateInstance(instance);
  return object;
}
function invalidateInstance(instance) {
  var _instance$root;
  if (!instance.parent) return;
  instance.props.onUpdate == null ? undefined : instance.props.onUpdate(instance.object);
  const state2 = (_instance$root = instance.root) == null ? undefined : _instance$root.getState == null ? undefined : _instance$root.getState();
  if (state2 && state2.internal.frames === 0) state2.invalidate();
}
function updateCamera(camera, size) {
  if (camera.manual) return;
  if (isOrthographicCamera(camera)) {
    camera.left = size.width / -2;
    camera.right = size.width / 2;
    camera.top = size.height / 2;
    camera.bottom = size.height / -2;
  } else {
    camera.aspect = size.width / size.height;
  }
  camera.updateProjectionMatrix();
}
const isObject3D = (object) => object == null ? undefined : object.isObject3D;
function makeId(event) {
  return (event.eventObject || event.object).uuid + "/" + event.index + event.instanceId;
}
function releaseInternalPointerCapture(capturedMap, obj, captures, pointerId) {
  const captureData = captures.get(obj);
  if (captureData) {
    captures.delete(obj);
    if (captures.size === 0) {
      capturedMap.delete(pointerId);
      captureData.target.releasePointerCapture(pointerId);
    }
  }
}
function removeInteractivity(store, object) {
  const {
    internal
  } = store.getState();
  internal.interaction = internal.interaction.filter((o) => o !== object);
  internal.initialHits = internal.initialHits.filter((o) => o !== object);
  internal.hovered.forEach((value, key) => {
    if (value.eventObject === object || value.object === object) {
      internal.hovered.delete(key);
    }
  });
  internal.capturedMap.forEach((captures, pointerId) => {
    releaseInternalPointerCapture(internal.capturedMap, object, captures, pointerId);
  });
}
function createEvents(store) {
  function calculateDistance(event) {
    const {
      internal
    } = store.getState();
    const dx = event.offsetX - internal.initialClick[0];
    const dy = event.offsetY - internal.initialClick[1];
    return Math.round(Math.sqrt(dx * dx + dy * dy));
  }
  function filterPointerEvents(objects) {
    return objects.filter((obj) => ["Move", "Over", "Enter", "Out", "Leave"].some((name) => {
      var _r3f;
      return (_r3f = obj.__r3f) == null ? undefined : _r3f.handlers["onPointer" + name];
    }));
  }
  function intersect(event, filter) {
    const state2 = store.getState();
    const duplicates = /* @__PURE__ */ new Set();
    const intersections = [];
    const eventsObjects = filter ? filter(state2.internal.interaction) : state2.internal.interaction;
    for (let i2 = 0; i2 < eventsObjects.length; i2++) {
      const state3 = getRootState(eventsObjects[i2]);
      if (state3) {
        state3.raycaster.camera = undefined;
      }
    }
    if (!state2.previousRoot) {
      state2.events.compute == null ? undefined : state2.events.compute(event, state2);
    }
    function handleRaycast(obj) {
      const state3 = getRootState(obj);
      if (!state3 || !state3.events.enabled || state3.raycaster.camera === null) return [];
      if (state3.raycaster.camera === undefined) {
        var _state$previousRoot;
        state3.events.compute == null ? undefined : state3.events.compute(event, state3, (_state$previousRoot = state3.previousRoot) == null ? undefined : _state$previousRoot.getState());
        if (state3.raycaster.camera === undefined) state3.raycaster.camera = null;
      }
      return state3.raycaster.camera ? state3.raycaster.intersectObject(obj, true) : [];
    }
    let hits = eventsObjects.flatMap(handleRaycast).sort((a, b) => {
      const aState = getRootState(a.object);
      const bState = getRootState(b.object);
      if (!aState || !bState) return a.distance - b.distance;
      return bState.events.priority - aState.events.priority || a.distance - b.distance;
    }).filter((item) => {
      const id = makeId(item);
      if (duplicates.has(id)) return false;
      duplicates.add(id);
      return true;
    });
    if (state2.events.filter) hits = state2.events.filter(hits, state2);
    for (const hit of hits) {
      let eventObject = hit.object;
      while (eventObject) {
        var _r3f2;
        if ((_r3f2 = eventObject.__r3f) != null && _r3f2.eventCount) intersections.push({
          ...hit,
          eventObject
        });
        eventObject = eventObject.parent;
      }
    }
    if ("pointerId" in event && state2.internal.capturedMap.has(event.pointerId)) {
      for (let captureData of state2.internal.capturedMap.get(event.pointerId).values()) {
        if (!duplicates.has(makeId(captureData.intersection))) intersections.push(captureData.intersection);
      }
    }
    return intersections;
  }
  function handleIntersects(intersections, event, delta, callback) {
    if (intersections.length) {
      const localState = {
        stopped: false
      };
      for (const hit of intersections) {
        let state2 = getRootState(hit.object);
        if (!state2) {
          hit.object.traverseAncestors((obj) => {
            const parentState = getRootState(obj);
            if (parentState) {
              state2 = parentState;
              return false;
            }
          });
        }
        if (state2) {
          const {
            raycaster,
            pointer,
            camera,
            internal
          } = state2;
          const unprojectedPoint = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Vector3(pointer.x, pointer.y, 0).unproject(camera);
          const hasPointerCapture = (id) => {
            var _internal$capturedMap, _internal$capturedMap2;
            return (_internal$capturedMap = (_internal$capturedMap2 = internal.capturedMap.get(id)) == null ? undefined : _internal$capturedMap2.has(hit.eventObject)) != null ? _internal$capturedMap : false;
          };
          const setPointerCapture = (id) => {
            const captureData = {
              intersection: hit,
              target: event.target
            };
            if (internal.capturedMap.has(id)) {
              internal.capturedMap.get(id).set(hit.eventObject, captureData);
            } else {
              internal.capturedMap.set(id, /* @__PURE__ */ new Map([[hit.eventObject, captureData]]));
            }
            event.target.setPointerCapture(id);
          };
          const releasePointerCapture = (id) => {
            const captures = internal.capturedMap.get(id);
            if (captures) {
              releaseInternalPointerCapture(internal.capturedMap, hit.eventObject, captures, id);
            }
          };
          let extractEventProps = {};
          for (let prop in event) {
            let property = event[prop];
            if (typeof property !== "function") extractEventProps[prop] = property;
          }
          let raycastEvent = {
            ...hit,
            ...extractEventProps,
            pointer,
            intersections,
            stopped: localState.stopped,
            delta,
            unprojectedPoint,
            ray: raycaster.ray,
            camera,
            // Hijack stopPropagation, which just sets a flag
            stopPropagation() {
              const capturesForPointer = "pointerId" in event && internal.capturedMap.get(event.pointerId);
              if (
                // ...if this pointer hasn't been captured
                !capturesForPointer || // ... or if the hit object is capturing the pointer
                capturesForPointer.has(hit.eventObject)
              ) {
                raycastEvent.stopped = localState.stopped = true;
                if (internal.hovered.size && Array.from(internal.hovered.values()).find((i2) => i2.eventObject === hit.eventObject)) {
                  const higher = intersections.slice(0, intersections.indexOf(hit));
                  cancelPointer([...higher, hit]);
                }
              }
            },
            // there should be a distinction between target and currentTarget
            target: {
              hasPointerCapture,
              setPointerCapture,
              releasePointerCapture
            },
            currentTarget: {
              hasPointerCapture,
              setPointerCapture,
              releasePointerCapture
            },
            nativeEvent: event
          };
          callback(raycastEvent);
          if (localState.stopped === true) break;
        }
      }
    }
    return intersections;
  }
  function cancelPointer(intersections) {
    const {
      internal
    } = store.getState();
    for (const hoveredObj of internal.hovered.values()) {
      if (!intersections.length || !intersections.find((hit) => hit.object === hoveredObj.object && hit.index === hoveredObj.index && hit.instanceId === hoveredObj.instanceId)) {
        const eventObject = hoveredObj.eventObject;
        const instance = eventObject.__r3f;
        internal.hovered.delete(makeId(hoveredObj));
        if (instance != null && instance.eventCount) {
          const handlers = instance.handlers;
          const data = {
            ...hoveredObj,
            intersections
          };
          handlers.onPointerOut == null ? undefined : handlers.onPointerOut(data);
          handlers.onPointerLeave == null ? undefined : handlers.onPointerLeave(data);
        }
      }
    }
  }
  function pointerMissed(event, objects) {
    for (let i2 = 0; i2 < objects.length; i2++) {
      const instance = objects[i2].__r3f;
      instance == null ? undefined : instance.handlers.onPointerMissed == null ? undefined : instance.handlers.onPointerMissed(event);
    }
  }
  function handlePointer(name) {
    switch (name) {
      case "onPointerLeave":
      case "onPointerCancel":
        return () => cancelPointer([]);
      case "onLostPointerCapture":
        return (event) => {
          const {
            internal
          } = store.getState();
          if ("pointerId" in event && internal.capturedMap.has(event.pointerId)) {
            requestAnimationFrame(() => {
              if (internal.capturedMap.has(event.pointerId)) {
                internal.capturedMap.delete(event.pointerId);
                cancelPointer([]);
              }
            });
          }
        };
    }
    return function handleEvent(event) {
      const {
        onPointerMissed,
        internal
      } = store.getState();
      internal.lastEvent.current = event;
      const isPointerMove = name === "onPointerMove";
      const isClickEvent = name === "onClick" || name === "onContextMenu" || name === "onDoubleClick";
      const filter = isPointerMove ? filterPointerEvents : undefined;
      const hits = intersect(event, filter);
      const delta = isClickEvent ? calculateDistance(event) : 0;
      if (name === "onPointerDown") {
        internal.initialClick = [event.offsetX, event.offsetY];
        internal.initialHits = hits.map((hit) => hit.eventObject);
      }
      if (isClickEvent && !hits.length) {
        if (delta <= 2) {
          pointerMissed(event, internal.interaction);
          if (onPointerMissed) onPointerMissed(event);
        }
      }
      if (isPointerMove) cancelPointer(hits);
      function onIntersect(data) {
        const eventObject = data.eventObject;
        const instance = eventObject.__r3f;
        if (!(instance != null && instance.eventCount)) return;
        const handlers = instance.handlers;
        if (isPointerMove) {
          if (handlers.onPointerOver || handlers.onPointerEnter || handlers.onPointerOut || handlers.onPointerLeave) {
            const id = makeId(data);
            const hoveredItem = internal.hovered.get(id);
            if (!hoveredItem) {
              internal.hovered.set(id, data);
              handlers.onPointerOver == null ? undefined : handlers.onPointerOver(data);
              handlers.onPointerEnter == null ? undefined : handlers.onPointerEnter(data);
            } else if (hoveredItem.stopped) {
              data.stopPropagation();
            }
          }
          handlers.onPointerMove == null ? undefined : handlers.onPointerMove(data);
        } else {
          const handler = handlers[name];
          if (handler) {
            if (!isClickEvent || internal.initialHits.includes(eventObject)) {
              pointerMissed(event, internal.interaction.filter((object) => !internal.initialHits.includes(object)));
              handler(data);
            }
          } else {
            if (isClickEvent && internal.initialHits.includes(eventObject)) {
              pointerMissed(event, internal.interaction.filter((object) => !internal.initialHits.includes(object)));
            }
          }
        }
      }
      handleIntersects(hits, event, delta, onIntersect);
    };
  }
  return {
    handlePointer
  };
}
const isRenderer = (def) => !!(def != null && def.render);
const context = /* @__PURE__ */ ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__.createContext(null);
const createStore = (invalidate2, advance2) => {
  const rootStore = createWithEqualityFn((set, get) => {
    const position = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Vector3();
    const defaultTarget = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Vector3();
    const tempTarget = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Vector3();
    function getCurrentViewport(camera = get().camera, target = defaultTarget, size = get().size) {
      const {
        width,
        height,
        top,
        left
      } = size;
      const aspect = width / height;
      if (target.isVector3) tempTarget.copy(target);
      else tempTarget.set(...target);
      const distance = camera.getWorldPosition(position).distanceTo(tempTarget);
      if (isOrthographicCamera(camera)) {
        return {
          width: width / camera.zoom,
          height: height / camera.zoom,
          top,
          left,
          factor: 1,
          distance,
          aspect
        };
      } else {
        const fov = camera.fov * Math.PI / 180;
        const h = 2 * Math.tan(fov / 2) * distance;
        const w = h * (width / height);
        return {
          width: w,
          height: h,
          top,
          left,
          factor: width / w,
          distance,
          aspect
        };
      }
    }
    let performanceTimeout = undefined;
    const setPerformanceCurrent = (current) => set((state3) => ({
      performance: {
        ...state3.performance,
        current
      }
    }));
    const pointer = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Vector2();
    const rootState = {
      set,
      get,
      // Mock objects that have to be configured
      gl: null,
      camera: null,
      raycaster: null,
      events: {
        priority: 1,
        enabled: true,
        connected: false
      },
      scene: null,
      xr: null,
      invalidate: (frames = 1) => invalidate2(get(), frames),
      advance: (timestamp, runGlobalEffects) => advance2(timestamp, runGlobalEffects, get()),
      legacy: false,
      linear: false,
      flat: false,
      controls: null,
      clock: new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Clock(),
      pointer,
      mouse: pointer,
      frameloop: "always",
      onPointerMissed: undefined,
      performance: {
        current: 1,
        min: 0.5,
        max: 1,
        debounce: 200,
        regress: () => {
          const state3 = get();
          if (performanceTimeout) clearTimeout(performanceTimeout);
          if (state3.performance.current !== state3.performance.min) setPerformanceCurrent(state3.performance.min);
          performanceTimeout = setTimeout(() => setPerformanceCurrent(get().performance.max), state3.performance.debounce);
        }
      },
      size: {
        width: 0,
        height: 0,
        top: 0,
        left: 0
      },
      viewport: {
        initialDpr: 0,
        dpr: 0,
        width: 0,
        height: 0,
        top: 0,
        left: 0,
        aspect: 0,
        distance: 0,
        factor: 0,
        getCurrentViewport
      },
      setEvents: (events) => set((state3) => ({
        ...state3,
        events: {
          ...state3.events,
          ...events
        }
      })),
      setSize: (width, height, top = 0, left = 0) => {
        const camera = get().camera;
        const size = {
          width,
          height,
          top,
          left
        };
        set((state3) => ({
          size,
          viewport: {
            ...state3.viewport,
            ...getCurrentViewport(camera, defaultTarget, size)
          }
        }));
      },
      setDpr: (dpr) => set((state3) => {
        const resolved = calculateDpr(dpr);
        return {
          viewport: {
            ...state3.viewport,
            dpr: resolved,
            initialDpr: state3.viewport.initialDpr || resolved
          }
        };
      }),
      setFrameloop: (frameloop = "always") => {
        const clock = get().clock;
        clock.stop();
        clock.elapsedTime = 0;
        if (frameloop !== "never") {
          clock.start();
          clock.elapsedTime = 0;
        }
        set(() => ({
          frameloop
        }));
      },
      previousRoot: undefined,
      internal: {
        // Events
        interaction: [],
        hovered: /* @__PURE__ */ new Map(),
        subscribers: [],
        initialClick: [0, 0],
        initialHits: [],
        capturedMap: /* @__PURE__ */ new Map(),
        lastEvent: /* @__PURE__ */ ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__.createRef(),
        // Updates
        active: false,
        frames: 0,
        priority: 0,
        subscribe: (ref, priority, store) => {
          const internal = get().internal;
          internal.priority = internal.priority + (priority > 0 ? 1 : 0);
          internal.subscribers.push({
            ref,
            priority,
            store
          });
          internal.subscribers = internal.subscribers.sort((a, b) => a.priority - b.priority);
          return () => {
            const internal2 = get().internal;
            if (internal2 != null && internal2.subscribers) {
              internal2.priority = internal2.priority - (priority > 0 ? 1 : 0);
              internal2.subscribers = internal2.subscribers.filter((s) => s.ref !== ref);
            }
          };
        }
      }
    };
    return rootState;
  });
  const state2 = rootStore.getState();
  let oldSize = state2.size;
  let oldDpr = state2.viewport.dpr;
  let oldCamera = state2.camera;
  rootStore.subscribe(() => {
    const {
      camera,
      size,
      viewport,
      gl,
      set
    } = rootStore.getState();
    if (size.width !== oldSize.width || size.height !== oldSize.height || viewport.dpr !== oldDpr) {
      oldSize = size;
      oldDpr = viewport.dpr;
      updateCamera(camera, size);
      if (viewport.dpr > 0) gl.setPixelRatio(viewport.dpr);
      const updateStyle = typeof HTMLCanvasElement !== "undefined" && gl.domElement instanceof HTMLCanvasElement;
      gl.setSize(size.width, size.height, updateStyle);
    }
    if (camera !== oldCamera) {
      oldCamera = camera;
      set((state3) => ({
        viewport: {
          ...state3.viewport,
          ...state3.viewport.getCurrentViewport(camera)
        }
      }));
    }
  });
  rootStore.subscribe((state3) => invalidate2(state3));
  return rootStore;
};
function useInstanceHandle(ref) {
  const instance = ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__.useRef(null);
  ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__.useImperativeHandle(instance, () => ref.current.__r3f, [ref]);
  return instance;
}
function useStore() {
  const store = ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__.useContext(context);
  if (!store) throw new Error("R3F: Hooks can only be used within the Canvas component!");
  return store;
}
function useThree(selector = (state2) => state2, equalityFn) {
  return useStore()(selector, equalityFn);
}
function useFrame(callback, renderPriority = 0) {
  const store = useStore();
  const subscribe = store.getState().internal.subscribe;
  const ref = useMutableCallback(callback);
  useIsomorphicLayoutEffect(() => subscribe(ref, renderPriority, store), [renderPriority, subscribe, store]);
  return null;
}
function useGraph(object) {
  return ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__.useMemo(() => buildGraph(object), [object]);
}
const memoizedLoaders = /* @__PURE__ */ new WeakMap();
const isConstructor$1 = (value) => {
  var _value$prototype;
  return typeof value === "function" && (value == null ? undefined : (_value$prototype = value.prototype) == null ? undefined : _value$prototype.constructor) === value;
};
function loadingFn(extensions, onProgress) {
  return function(Proto, ...input) {
    let loader;
    if (isConstructor$1(Proto)) {
      loader = memoizedLoaders.get(Proto);
      if (!loader) {
        loader = new Proto();
        memoizedLoaders.set(Proto, loader);
      }
    } else {
      loader = Proto;
    }
    if (extensions) extensions(loader);
    return Promise.all(input.map((input2) => new Promise((res, reject) => loader.load(input2, (data) => {
      if (isObject3D(data == null ? undefined : data.scene)) Object.assign(data, buildGraph(data.scene));
      res(data);
    }, onProgress, (error) => reject(new Error(`Could not load ${input2}: ${error == null ? undefined : error.message}`))))));
  };
}
function useLoader(loader, input, extensions, onProgress) {
  const keys = Array.isArray(input) ? input : [input];
  const results = suspend(loadingFn(extensions, onProgress), [loader, ...keys], {
    equal: is.equ
  });
  return Array.isArray(input) ? results : results[0];
}
useLoader.preload = function(loader, input, extensions) {
  const keys = Array.isArray(input) ? input : [input];
  return preload(loadingFn(extensions), [loader, ...keys]);
};
useLoader.clear = function(loader, input) {
  const keys = Array.isArray(input) ? input : [input];
  return clear([loader, ...keys]);
};
function createReconciler(config) {
  const reconciler2 = Reconciler(config);
  reconciler2.injectIntoDevTools({
    bundleType: 0,
    rendererPackageName: "@react-three/fiber",
    version: ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__.version
  });
  return reconciler2;
}
const NoEventPriority = 0;
const catalogue = {};
const PREFIX_REGEX = /^three(?=[A-Z])/;
const toPascalCase = (type) => `${type[0].toUpperCase()}${type.slice(1)}`;
let i = 0;
const isConstructor = (object) => typeof object === "function";
function extend(objects) {
  if (isConstructor(objects)) {
    const Component = `${i++}`;
    catalogue[Component] = objects;
    return Component;
  } else {
    Object.assign(catalogue, objects);
  }
}
function validateInstance(type, props) {
  const name = toPascalCase(type);
  const target = catalogue[name];
  if (type !== "primitive" && !target) throw new Error(`R3F: ${name} is not part of the THREE namespace! Did you forget to extend? See: https://docs.pmnd.rs/react-three-fiber/api/objects#using-3rd-party-objects-declaratively`);
  if (type === "primitive" && !props.object) throw new Error(`R3F: Primitives without 'object' are invalid!`);
  if (props.args !== undefined && !Array.isArray(props.args)) throw new Error("R3F: The args prop must be an array!");
}
function createInstance(type, props, root) {
  var _props$object;
  type = toPascalCase(type) in catalogue ? type : type.replace(PREFIX_REGEX, "");
  validateInstance(type, props);
  if (type === "primitive" && (_props$object = props.object) != null && _props$object.__r3f) delete props.object.__r3f;
  return prepare(props.object, root, type, props);
}
function hideInstance(instance) {
  if (!instance.isHidden) {
    var _instance$parent;
    if (instance.props.attach && (_instance$parent = instance.parent) != null && _instance$parent.object) {
      detach(instance.parent, instance);
    } else if (isObject3D(instance.object)) {
      instance.object.visible = false;
    }
    instance.isHidden = true;
    invalidateInstance(instance);
  }
}
function unhideInstance(instance) {
  if (instance.isHidden) {
    var _instance$parent2;
    if (instance.props.attach && (_instance$parent2 = instance.parent) != null && _instance$parent2.object) {
      attach(instance.parent, instance);
    } else if (isObject3D(instance.object) && instance.props.visible !== false) {
      instance.object.visible = true;
    }
    instance.isHidden = false;
    invalidateInstance(instance);
  }
}
function handleContainerEffects(parent, child, beforeChild) {
  const state2 = child.root.getState();
  if (!parent.parent && parent.object !== state2.scene) return;
  if (!child.object) {
    var _child$props$object, _child$props$args;
    const target = catalogue[toPascalCase(child.type)];
    child.object = (_child$props$object = child.props.object) != null ? _child$props$object : new target(...(_child$props$args = child.props.args) != null ? _child$props$args : []);
    child.object.__r3f = child;
  }
  applyProps(child.object, child.props);
  if (child.props.attach) {
    attach(parent, child);
  } else if (isObject3D(child.object) && isObject3D(parent.object)) {
    const childIndex = parent.object.children.indexOf(beforeChild == null ? undefined : beforeChild.object);
    if (beforeChild && childIndex !== -1) {
      const existingIndex = parent.object.children.indexOf(child.object);
      if (existingIndex !== -1) {
        parent.object.children.splice(existingIndex, 1);
        const adjustedIndex = existingIndex < childIndex ? childIndex - 1 : childIndex;
        parent.object.children.splice(adjustedIndex, 0, child.object);
      } else {
        child.object.parent = parent.object;
        parent.object.children.splice(childIndex, 0, child.object);
        child.object.dispatchEvent({
          type: "added"
        });
        parent.object.dispatchEvent({
          type: "childadded",
          child: child.object
        });
      }
    } else {
      parent.object.add(child.object);
    }
  }
  for (const childInstance of child.children) handleContainerEffects(child, childInstance);
  invalidateInstance(child);
}
function appendChild(parent, child) {
  if (!child) return;
  child.parent = parent;
  parent.children.push(child);
  handleContainerEffects(parent, child);
}
function insertBefore(parent, child, beforeChild) {
  if (!child || !beforeChild) return;
  child.parent = parent;
  const childIndex = parent.children.indexOf(beforeChild);
  if (childIndex !== -1) parent.children.splice(childIndex, 0, child);
  else parent.children.push(child);
  handleContainerEffects(parent, child, beforeChild);
}
function disposeOnIdle(object) {
  if (typeof object.dispose === "function") {
    const handleDispose = () => {
      try {
        object.dispose();
      } catch {
      }
    };
    if (typeof IS_REACT_ACT_ENVIRONMENT !== "undefined") handleDispose();
    else schedulerExports.unstable_scheduleCallback(schedulerExports.unstable_IdlePriority, handleDispose);
  }
}
function removeChild(parent, child, dispose2) {
  if (!child) return;
  child.parent = null;
  const childIndex = parent.children.indexOf(child);
  if (childIndex !== -1) parent.children.splice(childIndex, 1);
  if (child.props.attach) {
    detach(parent, child);
  } else if (isObject3D(child.object) && isObject3D(parent.object)) {
    parent.object.remove(child.object);
    removeInteractivity(findInitialRoot(child), child.object);
  }
  const shouldDispose = child.props.dispose !== null && dispose2 !== false;
  for (let i2 = child.children.length - 1; i2 >= 0; i2--) {
    const node = child.children[i2];
    removeChild(child, node, shouldDispose);
  }
  child.children.length = 0;
  delete child.object.__r3f;
  if (shouldDispose && child.type !== "primitive" && child.object.type !== "Scene") {
    disposeOnIdle(child.object);
  }
  if (dispose2 === undefined) invalidateInstance(child);
}
function setFiberRef(fiber, publicInstance) {
  for (const _fiber of [fiber, fiber.alternate]) {
    if (_fiber !== null) {
      if (typeof _fiber.ref === "function") {
        _fiber.refCleanup == null ? undefined : _fiber.refCleanup();
        const cleanup = _fiber.ref(publicInstance);
        if (typeof cleanup === "function") _fiber.refCleanup = cleanup;
      } else if (_fiber.ref) {
        _fiber.ref.current = publicInstance;
      }
    }
  }
}
const reconstructed = [];
function swapInstances() {
  for (const [instance] of reconstructed) {
    const parent = instance.parent;
    if (parent) {
      if (instance.props.attach) {
        detach(parent, instance);
      } else if (isObject3D(instance.object) && isObject3D(parent.object)) {
        parent.object.remove(instance.object);
      }
      for (const child of instance.children) {
        if (child.props.attach) {
          detach(instance, child);
        } else if (isObject3D(child.object) && isObject3D(instance.object)) {
          instance.object.remove(child.object);
        }
      }
    }
    if (instance.isHidden) unhideInstance(instance);
    if (instance.object.__r3f) delete instance.object.__r3f;
    if (instance.type !== "primitive") disposeOnIdle(instance.object);
  }
  for (const [instance, props, fiber] of reconstructed) {
    instance.props = props;
    const parent = instance.parent;
    if (parent) {
      var _instance$props$objec, _instance$props$args;
      const target = catalogue[toPascalCase(instance.type)];
      instance.object = (_instance$props$objec = instance.props.object) != null ? _instance$props$objec : new target(...(_instance$props$args = instance.props.args) != null ? _instance$props$args : []);
      instance.object.__r3f = instance;
      setFiberRef(fiber, instance.object);
      applyProps(instance.object, instance.props);
      if (instance.props.attach) {
        attach(parent, instance);
      } else if (isObject3D(instance.object) && isObject3D(parent.object)) {
        parent.object.add(instance.object);
      }
      for (const child of instance.children) {
        if (child.props.attach) {
          attach(instance, child);
        } else if (isObject3D(child.object) && isObject3D(instance.object)) {
          instance.object.add(child.object);
        }
      }
      invalidateInstance(instance);
    }
  }
  reconstructed.length = 0;
}
const handleTextInstance = () => {
};
const NO_CONTEXT = {};
let currentUpdatePriority = NoEventPriority;
const NoFlags = 0;
const Update = 4;
const reconciler = /* @__PURE__ */ createReconciler({
  isPrimaryRenderer: false,
  warnsIfNotActing: false,
  supportsMutation: true,
  supportsPersistence: false,
  supportsHydration: false,
  createInstance,
  removeChild,
  appendChild,
  appendInitialChild: appendChild,
  insertBefore,
  appendChildToContainer(container, child) {
    const scene = container.getState().scene.__r3f;
    if (!child || !scene) return;
    appendChild(scene, child);
  },
  removeChildFromContainer(container, child) {
    const scene = container.getState().scene.__r3f;
    if (!child || !scene) return;
    removeChild(scene, child);
  },
  insertInContainerBefore(container, child, beforeChild) {
    const scene = container.getState().scene.__r3f;
    if (!child || !beforeChild || !scene) return;
    insertBefore(scene, child, beforeChild);
  },
  getRootHostContext: () => NO_CONTEXT,
  getChildHostContext: () => NO_CONTEXT,
  commitUpdate(instance, type, oldProps, newProps, fiber) {
    var _newProps$args, _oldProps$args, _newProps$args2;
    validateInstance(type, newProps);
    let reconstruct = false;
    if (instance.type === "primitive" && oldProps.object !== newProps.object) reconstruct = true;
    else if (((_newProps$args = newProps.args) == null ? undefined : _newProps$args.length) !== ((_oldProps$args = oldProps.args) == null ? undefined : _oldProps$args.length)) reconstruct = true;
    else if ((_newProps$args2 = newProps.args) != null && _newProps$args2.some((value, index) => {
      var _oldProps$args2;
      return value !== ((_oldProps$args2 = oldProps.args) == null ? undefined : _oldProps$args2[index]);
    })) reconstruct = true;
    if (reconstruct) {
      reconstructed.push([instance, {
        ...newProps
      }, fiber]);
    } else {
      const changedProps = diffProps(instance, newProps);
      if (Object.keys(changedProps).length) {
        Object.assign(instance.props, changedProps);
        applyProps(instance.object, changedProps);
      }
    }
    const isTailSibling = fiber.sibling === null || (fiber.flags & Update) === NoFlags;
    if (isTailSibling) swapInstances();
  },
  finalizeInitialChildren: () => false,
  commitMount() {
  },
  getPublicInstance: (instance) => instance == null ? undefined : instance.object,
  prepareForCommit: () => null,
  preparePortalMount: (container) => prepare(container.getState().scene, container, "", {}),
  resetAfterCommit: () => {
  },
  shouldSetTextContent: () => false,
  clearContainer: () => false,
  hideInstance,
  unhideInstance,
  createTextInstance: handleTextInstance,
  hideTextInstance: handleTextInstance,
  unhideTextInstance: handleTextInstance,
  scheduleTimeout: typeof setTimeout === "function" ? setTimeout : undefined,
  cancelTimeout: typeof clearTimeout === "function" ? clearTimeout : undefined,
  noTimeout: -1,
  getInstanceFromNode: () => null,
  beforeActiveInstanceBlur() {
  },
  afterActiveInstanceBlur() {
  },
  detachDeletedInstance() {
  },
  prepareScopeUpdate() {
  },
  getInstanceFromScope: () => null,
  shouldAttemptEagerTransition: () => false,
  trackSchedulerEvent: () => {
  },
  resolveEventType: () => null,
  resolveEventTimeStamp: () => -1.1,
  requestPostPaintCallback() {
  },
  maySuspendCommit: () => false,
  preloadInstance: () => true,
  // true indicates already loaded
  startSuspendingCommit() {
  },
  suspendInstance() {
  },
  waitForCommitToBeReady: () => null,
  NotPendingTransition: null,
  HostTransitionContext: /* @__PURE__ */ ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__.createContext(null),
  setCurrentUpdatePriority(newPriority) {
    currentUpdatePriority = newPriority;
  },
  getCurrentUpdatePriority() {
    return currentUpdatePriority;
  },
  resolveUpdatePriority() {
    var _window$event;
    if (currentUpdatePriority !== NoEventPriority) return currentUpdatePriority;
    switch (typeof window !== "undefined" && ((_window$event = window.event) == null ? undefined : _window$event.type)) {
      case "click":
      case "contextmenu":
      case "dblclick":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
        return constantsExports.DiscreteEventPriority;
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "pointerenter":
      case "pointerleave":
      case "wheel":
        return constantsExports.ContinuousEventPriority;
      default:
        return constantsExports.DefaultEventPriority;
    }
  },
  resetFormInstance() {
  }
});
const _roots = /* @__PURE__ */ new Map();
const shallowLoose = {
  objects: "shallow",
  strict: false
};
function computeInitialSize(canvas, size) {
  if (!size && typeof HTMLCanvasElement !== "undefined" && canvas instanceof HTMLCanvasElement && canvas.parentElement) {
    const {
      width,
      height,
      top,
      left
    } = canvas.parentElement.getBoundingClientRect();
    return {
      width,
      height,
      top,
      left
    };
  } else if (!size && typeof OffscreenCanvas !== "undefined" && canvas instanceof OffscreenCanvas) {
    return {
      width: canvas.width,
      height: canvas.height,
      top: 0,
      left: 0
    };
  }
  return {
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    ...size
  };
}
function createRoot(canvas) {
  const prevRoot = _roots.get(canvas);
  const prevFiber = prevRoot == null ? undefined : prevRoot.fiber;
  const prevStore = prevRoot == null ? undefined : prevRoot.store;
  if (prevRoot) console.warn("R3F.createRoot should only be called once!");
  const logRecoverableError = typeof reportError === "function" ? (
    // In modern browsers, reportError will dispatch an error event,
    // emulating an uncaught JavaScript error.
    reportError
  ) : (
    // In older browsers and test environments, fallback to console.error.
    console.error
  );
  const store = prevStore || createStore(invalidate, advance);
  const fiber = prevFiber || reconciler.createContainer(
    store,
    // container
    constantsExports.ConcurrentRoot,
    // tag
    null,
    // hydration callbacks
    false,
    // isStrictMode
    null,
    // concurrentUpdatesByDefaultOverride
    "",
    // identifierPrefix
    logRecoverableError,
    // onUncaughtError
    logRecoverableError,
    // onCaughtError
    logRecoverableError,
    // onRecoverableError
    null
    // transitionCallbacks
  );
  if (!prevRoot) _roots.set(canvas, {
    fiber,
    store
  });
  let onCreated;
  let lastCamera;
  let configured = false;
  let pending = null;
  return {
    async configure(props = {}) {
      let resolve2;
      pending = new Promise((_resolve) => resolve2 = _resolve);
      let {
        gl: glConfig,
        size: propsSize,
        scene: sceneOptions,
        events,
        onCreated: onCreatedCallback,
        shadows = false,
        linear = false,
        flat = false,
        legacy = false,
        orthographic = false,
        frameloop = "always",
        dpr = [1, 2],
        performance,
        raycaster: raycastOptions,
        camera: cameraOptions,
        onPointerMissed
      } = props;
      let state2 = store.getState();
      let gl = state2.gl;
      if (!state2.gl) {
        const defaultProps = {
          canvas,
          powerPreference: "high-performance",
          antialias: true,
          alpha: true
        };
        const customRenderer = typeof glConfig === "function" ? await glConfig(defaultProps) : glConfig;
        if (isRenderer(customRenderer)) {
          gl = customRenderer;
        } else {
          gl = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.WebGLRenderer({
            ...defaultProps,
            ...glConfig
          });
        }
        state2.set({
          gl
        });
      }
      let raycaster = state2.raycaster;
      if (!raycaster) state2.set({
        raycaster: raycaster = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Raycaster()
      });
      const {
        params,
        ...options
      } = raycastOptions || {};
      if (!is.equ(options, raycaster, shallowLoose)) applyProps(raycaster, {
        ...options
      });
      if (!is.equ(params, raycaster.params, shallowLoose)) applyProps(raycaster, {
        params: {
          ...raycaster.params,
          ...params
        }
      });
      if (!state2.camera || state2.camera === lastCamera && !is.equ(lastCamera, cameraOptions, shallowLoose)) {
        lastCamera = cameraOptions;
        const isCamera = cameraOptions == null ? undefined : cameraOptions.isCamera;
        const camera = isCamera ? cameraOptions : orthographic ? new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.OrthographicCamera(0, 0, 0, 0, 0.1, 1e3) : new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.PerspectiveCamera(75, 0, 0.1, 1e3);
        if (!isCamera) {
          camera.position.z = 5;
          if (cameraOptions) {
            applyProps(camera, cameraOptions);
            if (!camera.manual) {
              if ("aspect" in cameraOptions || "left" in cameraOptions || "right" in cameraOptions || "bottom" in cameraOptions || "top" in cameraOptions) {
                camera.manual = true;
                camera.updateProjectionMatrix();
              }
            }
          }
          if (!state2.camera && !(cameraOptions != null && cameraOptions.rotation)) camera.lookAt(0, 0, 0);
        }
        state2.set({
          camera
        });
        raycaster.camera = camera;
      }
      if (!state2.scene) {
        let scene;
        if (sceneOptions != null && sceneOptions.isScene) {
          scene = sceneOptions;
          prepare(scene, store, "", {});
        } else {
          scene = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Scene();
          prepare(scene, store, "", {});
          if (sceneOptions) applyProps(scene, sceneOptions);
        }
        state2.set({
          scene
        });
      }
      if (events && !state2.events.handlers) state2.set({
        events: events(store)
      });
      const size = computeInitialSize(canvas, propsSize);
      if (!is.equ(size, state2.size, shallowLoose)) {
        state2.setSize(size.width, size.height, size.top, size.left);
      }
      if (dpr && state2.viewport.dpr !== calculateDpr(dpr)) state2.setDpr(dpr);
      if (state2.frameloop !== frameloop) state2.setFrameloop(frameloop);
      if (!state2.onPointerMissed) state2.set({
        onPointerMissed
      });
      if (performance && !is.equ(performance, state2.performance, shallowLoose)) state2.set((state3) => ({
        performance: {
          ...state3.performance,
          ...performance
        }
      }));
      if (!state2.xr) {
        var _gl$xr;
        const handleXRFrame = (timestamp, frame2) => {
          const state3 = store.getState();
          if (state3.frameloop === "never") return;
          advance(timestamp, true, state3, frame2);
        };
        const handleSessionChange = () => {
          const state3 = store.getState();
          state3.gl.xr.enabled = state3.gl.xr.isPresenting;
          state3.gl.xr.setAnimationLoop(state3.gl.xr.isPresenting ? handleXRFrame : null);
          if (!state3.gl.xr.isPresenting) invalidate(state3);
        };
        const xr = {
          connect() {
            const gl2 = store.getState().gl;
            gl2.xr.addEventListener("sessionstart", handleSessionChange);
            gl2.xr.addEventListener("sessionend", handleSessionChange);
          },
          disconnect() {
            const gl2 = store.getState().gl;
            gl2.xr.removeEventListener("sessionstart", handleSessionChange);
            gl2.xr.removeEventListener("sessionend", handleSessionChange);
          }
        };
        if (typeof ((_gl$xr = gl.xr) == null ? undefined : _gl$xr.addEventListener) === "function") xr.connect();
        state2.set({
          xr
        });
      }
      if (gl.shadowMap) {
        const oldEnabled = gl.shadowMap.enabled;
        const oldType = gl.shadowMap.type;
        gl.shadowMap.enabled = !!shadows;
        if (is.boo(shadows)) {
          gl.shadowMap.type = ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.PCFSoftShadowMap;
        } else if (is.str(shadows)) {
          var _types$shadows;
          const types = {
            basic: ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.BasicShadowMap,
            percentage: ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.PCFShadowMap,
            soft: ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.PCFSoftShadowMap,
            variance: ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.VSMShadowMap
          };
          gl.shadowMap.type = (_types$shadows = types[shadows]) != null ? _types$shadows : ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.PCFSoftShadowMap;
        } else if (is.obj(shadows)) {
          Object.assign(gl.shadowMap, shadows);
        }
        if (oldEnabled !== gl.shadowMap.enabled || oldType !== gl.shadowMap.type) gl.shadowMap.needsUpdate = true;
      }
      ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.ColorManagement.enabled = !legacy;
      if (!configured) {
        gl.outputColorSpace = linear ? ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.LinearSRGBColorSpace : ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.SRGBColorSpace;
        gl.toneMapping = flat ? ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.NoToneMapping : ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.ACESFilmicToneMapping;
      }
      if (state2.legacy !== legacy) state2.set(() => ({
        legacy
      }));
      if (state2.linear !== linear) state2.set(() => ({
        linear
      }));
      if (state2.flat !== flat) state2.set(() => ({
        flat
      }));
      if (glConfig && !is.fun(glConfig) && !isRenderer(glConfig) && !is.equ(glConfig, gl, shallowLoose)) applyProps(gl, glConfig);
      onCreated = onCreatedCallback;
      configured = true;
      resolve2();
      return this;
    },
    render(children) {
      if (!configured && !pending) this.configure();
      pending.then(() => {
        reconciler.updateContainer(/* @__PURE__ */ jsxRuntimeExports.jsx(Provider, {
          store,
          children,
          onCreated,
          rootElement: canvas
        }), fiber, null, () => undefined);
      });
      return store;
    },
    unmount() {
      unmountComponentAtNode(canvas);
    }
  };
}
function Provider({
  store,
  children,
  onCreated,
  rootElement
}) {
  useIsomorphicLayoutEffect(() => {
    const state2 = store.getState();
    state2.set((state3) => ({
      internal: {
        ...state3.internal,
        active: true
      }
    }));
    if (onCreated) onCreated(state2);
    if (!store.getState().events.connected) state2.events.connect == null ? undefined : state2.events.connect(rootElement);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(context.Provider, {
    value: store,
    children
  });
}
function unmountComponentAtNode(canvas, callback) {
  const root = _roots.get(canvas);
  const fiber = root == null ? undefined : root.fiber;
  if (fiber) {
    const state2 = root == null ? undefined : root.store.getState();
    if (state2) state2.internal.active = false;
    reconciler.updateContainer(null, fiber, null, () => {
      if (state2) {
        setTimeout(() => {
          try {
            var _state$gl, _state$gl$renderLists, _state$gl2, _state$gl3;
            state2.events.disconnect == null ? void 0 : state2.events.disconnect();
            (_state$gl = state2.gl) == null ? void 0 : (_state$gl$renderLists = _state$gl.renderLists) == null ? void 0 : _state$gl$renderLists.dispose == null ? void 0 : _state$gl$renderLists.dispose();
            (_state$gl2 = state2.gl) == null ? void 0 : _state$gl2.forceContextLoss == null ? void 0 : _state$gl2.forceContextLoss();
            if ((_state$gl3 = state2.gl) != null && _state$gl3.xr) state2.xr.disconnect();
            dispose(state2.scene);
            _roots.delete(canvas);
            if (callback) callback(canvas);
          } catch (e) {
          }
        }, 500);
      }
    });
  }
}
function createPortal(children, container, state2) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, {
    children,
    container,
    state: state2
  });
}
function Portal({
  state: state2 = {},
  children,
  container
}) {
  const {
    events,
    size,
    ...rest
  } = state2;
  const previousRoot = useStore();
  const [raycaster] = ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__.useState(() => new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Raycaster());
  const [pointer] = ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__.useState(() => new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Vector2());
  const inject = useMutableCallback((rootState, injectState) => {
    let viewport = undefined;
    if (injectState.camera && size) {
      const camera = injectState.camera;
      viewport = rootState.viewport.getCurrentViewport(camera, new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Vector3(), size);
      if (camera !== rootState.camera) updateCamera(camera, size);
    }
    return {
      // The intersect consists of the previous root state
      ...rootState,
      ...injectState,
      // Portals have their own scene, which forms the root, a raycaster and a pointer
      scene: container,
      raycaster,
      pointer,
      mouse: pointer,
      // Their previous root is the layer before it
      previousRoot,
      // Events, size and viewport can be overridden by the inject layer
      events: {
        ...rootState.events,
        ...injectState.events,
        ...events
      },
      size: {
        ...rootState.size,
        ...size
      },
      viewport: {
        ...rootState.viewport,
        ...viewport
      },
      // Layers are allowed to override events
      setEvents: (events2) => injectState.set((state3) => ({
        ...state3,
        events: {
          ...state3.events,
          ...events2
        }
      }))
    };
  });
  const usePortalStore = ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__.useMemo(() => {
    const store = createWithEqualityFn((set, get) => ({
      ...rest,
      set,
      get
    }));
    const onMutate = (prev) => store.setState((state3) => inject.current(prev, state3));
    onMutate(previousRoot.getState());
    previousRoot.subscribe(onMutate);
    return store;
  }, [previousRoot, container]);
  return (
    // @ts-ignore, reconciler types are not maintained
    /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, {
      children: reconciler.createPortal(/* @__PURE__ */ jsxRuntimeExports.jsx(context.Provider, {
        value: usePortalStore,
        children
      }), usePortalStore, null)
    })
  );
}
function flushSync(fn) {
  return reconciler.flushSync(fn);
}
function createSubs(callback, subs) {
  const sub = {
    callback
  };
  subs.add(sub);
  return () => void subs.delete(sub);
}
const globalEffects = /* @__PURE__ */ new Set();
const globalAfterEffects = /* @__PURE__ */ new Set();
const globalTailEffects = /* @__PURE__ */ new Set();
const addEffect = (callback) => createSubs(callback, globalEffects);
const addAfterEffect = (callback) => createSubs(callback, globalAfterEffects);
const addTail = (callback) => createSubs(callback, globalTailEffects);
function run(effects, timestamp) {
  if (!effects.size) return;
  for (const {
    callback
  } of effects.values()) {
    callback(timestamp);
  }
}
function flushGlobalEffects(type, timestamp) {
  switch (type) {
    case "before":
      return run(globalEffects, timestamp);
    case "after":
      return run(globalAfterEffects, timestamp);
    case "tail":
      return run(globalTailEffects, timestamp);
  }
}
let subscribers;
let subscription;
function update(timestamp, state2, frame2) {
  let delta = state2.clock.getDelta();
  if (state2.frameloop === "never" && typeof timestamp === "number") {
    delta = timestamp - state2.clock.elapsedTime;
    state2.clock.oldTime = state2.clock.elapsedTime;
    state2.clock.elapsedTime = timestamp;
  }
  subscribers = state2.internal.subscribers;
  for (let i2 = 0; i2 < subscribers.length; i2++) {
    subscription = subscribers[i2];
    subscription.ref.current(subscription.store.getState(), delta, frame2);
  }
  if (!state2.internal.priority && state2.gl.render) state2.gl.render(state2.scene, state2.camera);
  state2.internal.frames = Math.max(0, state2.internal.frames - 1);
  return state2.frameloop === "always" ? 1 : state2.internal.frames;
}
let running = false;
let useFrameInProgress = false;
let repeat;
let frame;
let state;
function loop(timestamp) {
  frame = requestAnimationFrame(loop);
  running = true;
  repeat = 0;
  flushGlobalEffects("before", timestamp);
  useFrameInProgress = true;
  for (const root of _roots.values()) {
    var _state$gl$xr;
    state = root.store.getState();
    if (state.internal.active && (state.frameloop === "always" || state.internal.frames > 0) && !((_state$gl$xr = state.gl.xr) != null && _state$gl$xr.isPresenting)) {
      repeat += update(timestamp, state);
    }
  }
  useFrameInProgress = false;
  flushGlobalEffects("after", timestamp);
  if (repeat === 0) {
    flushGlobalEffects("tail", timestamp);
    running = false;
    return cancelAnimationFrame(frame);
  }
}
function invalidate(state2, frames = 1) {
  var _state$gl$xr2;
  if (!state2) return _roots.forEach((root) => invalidate(root.store.getState(), frames));
  if ((_state$gl$xr2 = state2.gl.xr) != null && _state$gl$xr2.isPresenting || !state2.internal.active || state2.frameloop === "never") return;
  if (frames > 1) {
    state2.internal.frames = Math.min(60, state2.internal.frames + frames);
  } else {
    if (useFrameInProgress) {
      state2.internal.frames = 2;
    } else {
      state2.internal.frames = 1;
    }
  }
  if (!running) {
    running = true;
    requestAnimationFrame(loop);
  }
}
function advance(timestamp, runGlobalEffects = true, state2, frame2) {
  if (runGlobalEffects) flushGlobalEffects("before", timestamp);
  if (!state2) for (const root of _roots.values()) update(timestamp, root.store.getState());
  else update(timestamp, state2, frame2);
  if (runGlobalEffects) flushGlobalEffects("after", timestamp);
}
const DOM_EVENTS = {
  onClick: ["click", false],
  onContextMenu: ["contextmenu", false],
  onDoubleClick: ["dblclick", false],
  onWheel: ["wheel", true],
  onPointerDown: ["pointerdown", true],
  onPointerUp: ["pointerup", true],
  onPointerLeave: ["pointerleave", true],
  onPointerMove: ["pointermove", true],
  onPointerCancel: ["pointercancel", true],
  onLostPointerCapture: ["lostpointercapture", true]
};
function createPointerEvents(store) {
  const {
    handlePointer
  } = createEvents(store);
  return {
    priority: 1,
    enabled: true,
    compute(event, state2, previous) {
      state2.pointer.set(event.offsetX / state2.size.width * 2 - 1, -(event.offsetY / state2.size.height) * 2 + 1);
      state2.raycaster.setFromCamera(state2.pointer, state2.camera);
    },
    connected: undefined,
    handlers: Object.keys(DOM_EVENTS).reduce((acc, key) => ({
      ...acc,
      [key]: handlePointer(key)
    }), {}),
    update: () => {
      var _internal$lastEvent;
      const {
        events,
        internal
      } = store.getState();
      if ((_internal$lastEvent = internal.lastEvent) != null && _internal$lastEvent.current && events.handlers) events.handlers.onPointerMove(internal.lastEvent.current);
    },
    connect: (target) => {
      const {
        set,
        events
      } = store.getState();
      events.disconnect == null ? undefined : events.disconnect();
      set((state2) => ({
        events: {
          ...state2.events,
          connected: target
        }
      }));
      if (events.handlers) {
        for (const name in events.handlers) {
          const event = events.handlers[name];
          const [eventName, passive] = DOM_EVENTS[name];
          target.addEventListener(eventName, event, {
            passive
          });
        }
      }
    },
    disconnect: () => {
      const {
        set,
        events
      } = store.getState();
      if (events.connected) {
        if (events.handlers) {
          for (const name in events.handlers) {
            const event = events.handlers[name];
            const [eventName] = DOM_EVENTS[name];
            events.connected.removeEventListener(eventName, event);
          }
        }
        set((state2) => ({
          events: {
            ...state2.events,
            connected: undefined
          }
        }));
      }
    }
  };
}

function g(n,t){let o;return (...i)=>{window.clearTimeout(o),o=window.setTimeout(()=>n(...i),t);}}function j({debounce:n,scroll:t,polyfill:o,offsetSize:i}={debounce:0,scroll:false,offsetSize:false}){const a=o||(typeof window=="undefined"?class{}:window.ResizeObserver);if(!a)throw new Error("This browser does not support ResizeObserver out of the box. See: https://github.com/react-spring/react-use-measure/#resize-observer-polyfills");const[c,h]=ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__.useState({left:0,top:0,width:0,height:0,bottom:0,right:0,x:0,y:0}),e=ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__.useRef({element:null,scrollContainers:null,resizeObserver:null,lastBounds:c,orientationHandler:null}),d=n?typeof n=="number"?n:n.scroll:null,f=n?typeof n=="number"?n:n.resize:null,w=ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__.useRef(false);ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__.useEffect(()=>(w.current=true,()=>void(w.current=false)));const[z,m,s]=ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__.useMemo(()=>{const r=()=>{if(!e.current.element)return;const{left:y,top:C,width:H,height:O,bottom:S,right:x,x:B,y:R}=e.current.element.getBoundingClientRect(),l={left:y,top:C,width:H,height:O,bottom:S,right:x,x:B,y:R};e.current.element instanceof HTMLElement&&i&&(l.height=e.current.element.offsetHeight,l.width=e.current.element.offsetWidth),Object.freeze(l),w.current&&!D(e.current.lastBounds,l)&&h(e.current.lastBounds=l);};return [r,f?g(r,f):r,d?g(r,d):r]},[h,i,d,f]);function v(){e.current.scrollContainers&&(e.current.scrollContainers.forEach(r=>r.removeEventListener("scroll",s,true)),e.current.scrollContainers=null),e.current.resizeObserver&&(e.current.resizeObserver.disconnect(),e.current.resizeObserver=null),e.current.orientationHandler&&("orientation"in screen&&"removeEventListener"in screen.orientation?screen.orientation.removeEventListener("change",e.current.orientationHandler):"onorientationchange"in window&&window.removeEventListener("orientationchange",e.current.orientationHandler));}function b(){e.current.element&&(e.current.resizeObserver=new a(s),e.current.resizeObserver.observe(e.current.element),t&&e.current.scrollContainers&&e.current.scrollContainers.forEach(r=>r.addEventListener("scroll",s,{capture:true,passive:true})),e.current.orientationHandler=()=>{s();},"orientation"in screen&&"addEventListener"in screen.orientation?screen.orientation.addEventListener("change",e.current.orientationHandler):"onorientationchange"in window&&window.addEventListener("orientationchange",e.current.orientationHandler));}const L=r=>{!r||r===e.current.element||(v(),e.current.element=r,e.current.scrollContainers=E(r),b());};return X(s,!!t),W(m),ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__.useEffect(()=>{v(),b();},[t,s,m]),ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__.useEffect(()=>v,[]),[L,c,z]}function W(n){ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__.useEffect(()=>{const t=n;return window.addEventListener("resize",t),()=>void window.removeEventListener("resize",t)},[n]);}function X(n,t){ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__.useEffect(()=>{if(t){const o=n;return window.addEventListener("scroll",o,{capture:true,passive:true}),()=>void window.removeEventListener("scroll",o,true)}},[n,t]);}function E(n){const t=[];if(!n||n===document.body)return t;const{overflow:o,overflowX:i,overflowY:a}=window.getComputedStyle(n);return [o,i,a].some(c=>c==="auto"||c==="scroll")&&t.push(n),[...t,...E(n.parentElement)]}const k=["x","y","top","bottom","left","right","width","height"],D=(n,t)=>k.every(o=>n[o]===t[o]);

function CanvasImpl({
  ref,
  children,
  fallback,
  resize,
  style,
  gl,
  events = createPointerEvents,
  eventSource,
  eventPrefix,
  shadows,
  linear,
  flat,
  legacy,
  orthographic,
  frameloop,
  dpr,
  performance,
  raycaster,
  camera,
  scene,
  onPointerMissed,
  onCreated,
  ...props
}) {
  // Create a known catalogue of Threejs-native elements
  // This will include the entire THREE namespace by default, users can extend
  // their own elements by using the createRoot API instead
  ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__.useMemo(() => extend(THREE), []);
  const Bridge = useBridge();
  const [containerRef, containerRect] = j({
    scroll: true,
    debounce: {
      scroll: 50,
      resize: 0
    },
    ...resize
  });
  const canvasRef = ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__.useRef(null);
  const divRef = ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__.useRef(null);
  ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__.useImperativeHandle(ref, () => canvasRef.current);
  const handlePointerMissed = useMutableCallback(onPointerMissed);
  const [block, setBlock] = ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__.useState(false);
  const [error, setError] = ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__.useState(false);

  // Suspend this component if block is a promise (2nd run)
  if (block) throw block;
  // Throw exception outwards if anything within canvas throws
  if (error) throw error;
  const root = ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__.useRef(null);
  useIsomorphicLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (containerRect.width > 0 && containerRect.height > 0 && canvas) {
      if (!root.current) root.current = createRoot(canvas);
      async function run() {
        await root.current.configure({
          gl,
          scene,
          events,
          shadows,
          linear,
          flat,
          legacy,
          orthographic,
          frameloop,
          dpr,
          performance,
          raycaster,
          camera,
          size: containerRect,
          // Pass mutable reference to onPointerMissed so it's free to update
          onPointerMissed: (...args) => handlePointerMissed.current == null ? undefined : handlePointerMissed.current(...args),
          onCreated: state => {
            // Connect to event source
            state.events.connect == null ? undefined : state.events.connect(eventSource ? isRef(eventSource) ? eventSource.current : eventSource : divRef.current);
            // Set up compute function
            if (eventPrefix) {
              state.setEvents({
                compute: (event, state) => {
                  const x = event[eventPrefix + 'X'];
                  const y = event[eventPrefix + 'Y'];
                  state.pointer.set(x / state.size.width * 2 - 1, -(y / state.size.height) * 2 + 1);
                  state.raycaster.setFromCamera(state.pointer, state.camera);
                }
              });
            }
            // Call onCreated callback
            onCreated == null ? undefined : onCreated(state);
          }
        });
        root.current.render( /*#__PURE__*/jsxRuntimeExports.jsx(Bridge, {
          children: /*#__PURE__*/jsxRuntimeExports.jsx(ErrorBoundary, {
            set: setError,
            children: /*#__PURE__*/jsxRuntimeExports.jsx(ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__.Suspense, {
              fallback: /*#__PURE__*/jsxRuntimeExports.jsx(Block, {
                set: setBlock
              }),
              children: children != null ? children : null
            })
          })
        }));
      }
      run();
    }
  });
  ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__.useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) return () => unmountComponentAtNode(canvas);
  }, []);

  // When the event source is not this div, we need to set pointer-events to none
  // Or else the canvas will block events from reaching the event source
  const pointerEvents = eventSource ? 'none' : 'auto';
  return /*#__PURE__*/jsxRuntimeExports.jsx("div", {
    ref: divRef,
    style: {
      position: 'relative',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      pointerEvents,
      ...style
    },
    ...props,
    children: /*#__PURE__*/jsxRuntimeExports.jsx("div", {
      ref: containerRef,
      style: {
        width: '100%',
        height: '100%'
      },
      children: /*#__PURE__*/jsxRuntimeExports.jsx("canvas", {
        ref: canvasRef,
        style: {
          display: 'block'
        },
        children: fallback
      })
    })
  });
}

/**
 * A DOM canvas which accepts threejs elements as children.
 * @see https://docs.pmnd.rs/react-three-fiber/api/canvas
 */
function Canvas(props) {
  return /*#__PURE__*/jsxRuntimeExports.jsx(m, {
    children: /*#__PURE__*/jsxRuntimeExports.jsx(CanvasImpl, {
      ...props
    })
  });
}

export { Canvas, threeTypes as ReactThreeFiber, _roots, act, addAfterEffect, addEffect, addTail, advance, applyProps, buildGraph, context, createEvents, createPortal, createRoot, dispose, createPointerEvents as events, extend, flushGlobalEffects, flushSync, getRootState, invalidate, reconciler, unmountComponentAtNode, useFrame, useGraph, useInstanceHandle, useLoader, useStore, useThree };
