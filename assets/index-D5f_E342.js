import { g as getDefaultExportFromCjs } from './_commonjsHelpers-B85MJLTf.js';
import { a as index_cjs, b as ballerstaedt_mf_2_veredelung__mf_v__runtimeInit__mf_v__ } from './ballerstaedt_mf_2_veredelung__mf_v__runtimeInit__mf_v__-BrmfrqAs.js';
import { s as serializeStyles } from './emotion-serialize.esm-CN14hD64.js';
import { b as ballerstaedt_mf_2_veredelung__loadShare___mf_0_emotion_mf_1_react__loadShare__ } from './ballerstaedt_mf_2_veredelung__loadShare___mf_0_emotion_mf_1_react__loadShare__-yX63cIPc.js';
import { b as ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__ } from './ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__-D7cIg9rU.js';
import { c as createCache } from './ballerstaedt_mf_2_veredelung__loadShare___mf_0_emotion_mf_1_cache__loadShare__-CFMZ3rIx.js';
import { S as StyleSheet } from './emotion-sheet.esm-D63WiDn1.js';
import { j as jsxRuntimeExports } from './jsx-runtime-dGY4lsZt.js';

// dev uses dynamic import to separate chunks
    
    const {loadShare} = index_cjs;
    const {initPromise} = ballerstaedt_mf_2_veredelung__mf_v__runtimeInit__mf_v__;
    const res = initPromise.then(_ => loadShare("@emotion/styled", {
    customShareInfo: {shareConfig:{
      singleton: true,
      strictVersion: false,
      requiredVersion: "^11.10.5"
    }}}));
    const exportModule = await res.then(factory => factory());
    var ballerstaedt_mf_2_veredelung__loadShare___mf_0_emotion_mf_1_styled__loadShare__ = exportModule;

const emStyled = /*@__PURE__*/getDefaultExportFromCjs(ballerstaedt_mf_2_veredelung__loadShare___mf_0_emotion_mf_1_styled__loadShare__);

const cacheMap = /* @__PURE__ */ new Map();
const createEmotionCache = (options, CustomSheet) => {
  const cache = createCache(options);
  cache.sheet = new CustomSheet({
    key: cache.key,
    nonce: cache.sheet.nonce,
    container: cache.sheet.container,
    speedy: cache.sheet.isSpeedy,
    prepend: cache.sheet.prepend,
    insertionPoint: cache.sheet.insertionPoint
  });
  return cache;
};
let insertionPoint;
if (typeof document === "object") {
  insertionPoint = document.querySelector('[name="emotion-insertion-point"]');
  if (!insertionPoint) {
    insertionPoint = document.createElement("meta");
    insertionPoint.setAttribute("name", "emotion-insertion-point");
    insertionPoint.setAttribute("content", "");
    const head = document.querySelector("head");
    if (head) {
      head.prepend(insertionPoint);
    }
  }
}
function getCache(injectFirst, enableCssLayer) {
  if (injectFirst || enableCssLayer) {
    class MyStyleSheet extends StyleSheet {
      insert(rule, options) {
        if (this.key && this.key.endsWith("global")) {
          this.before = insertionPoint;
        }
        return super.insert(rule, options);
      }
    }
    const emotionCache = createEmotionCache({
      key: "css",
      insertionPoint: injectFirst ? insertionPoint : undefined
    }, MyStyleSheet);
    if (enableCssLayer) {
      const prevInsert = emotionCache.insert;
      emotionCache.insert = (...args) => {
        if (!args[1].styles.startsWith("@layer")) {
          args[1].styles = `@layer mui {${args[1].styles}}`;
        }
        return prevInsert(...args);
      };
    }
    return emotionCache;
  }
  return undefined;
}
function StyledEngineProvider(props) {
  const {
    injectFirst,
    enableCssLayer,
    children
  } = props;
  const cache = ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__.useMemo(() => {
    const cacheKey = `${injectFirst}-${enableCssLayer}`;
    if (cacheMap.has(cacheKey)) {
      return cacheMap.get(cacheKey);
    }
    const fresh = getCache(injectFirst, enableCssLayer);
    cacheMap.set(cacheKey, fresh);
    return fresh;
  }, [injectFirst, enableCssLayer]);
  return cache ? /* @__PURE__ */ jsxRuntimeExports.jsx(ballerstaedt_mf_2_veredelung__loadShare___mf_0_emotion_mf_1_react__loadShare__.CacheProvider, {
    value: cache,
    children
  }) : children;
}

function isEmpty(obj) {
  return obj === undefined || obj === null || Object.keys(obj).length === 0;
}
function GlobalStyles(props) {
  const {
    styles,
    defaultTheme = {}
  } = props;
  const globalStyles = typeof styles === "function" ? (themeInput) => styles(isEmpty(themeInput) ? defaultTheme : themeInput) : styles;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ballerstaedt_mf_2_veredelung__loadShare___mf_0_emotion_mf_1_react__loadShare__.Global, {
    styles: globalStyles
  });
}

function styled(tag, options) {
  const stylesFactory = emStyled(tag, options);
  return stylesFactory;
}
function internal_mutateStyles(tag, processor) {
  if (Array.isArray(tag.__emotion_styles)) {
    tag.__emotion_styles = processor(tag.__emotion_styles);
  }
}
const wrapper = [];
function internal_serializeStyles(styles) {
  wrapper[0] = styles;
  return serializeStyles(wrapper);
}

const ThemeContext = ballerstaedt_mf_2_veredelung__loadShare___mf_0_emotion_mf_1_react__loadShare__.ThemeContext;
const css = ballerstaedt_mf_2_veredelung__loadShare___mf_0_emotion_mf_1_react__loadShare__.css;
const keyframes = ballerstaedt_mf_2_veredelung__loadShare___mf_0_emotion_mf_1_react__loadShare__.keyframes;
export { GlobalStyles, StyledEngineProvider, ThemeContext, css, styled as default, internal_mutateStyles, internal_serializeStyles, keyframes };
