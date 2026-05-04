import { g as getDefaultExportFromCjs } from './_commonjsHelpers-B85MJLTf.js';
import { a as index_cjs, b as ballerstaedt_mf_2_veredelung__mf_v__runtimeInit__mf_v__ } from './ballerstaedt_mf_2_veredelung__mf_v__runtimeInit__mf_v__-BrmfrqAs.js';

function _mergeNamespaces(n, m) {
  for (var i = 0; i < m.length; i++) {
    const e = m[i];
    if (typeof e !== 'string' && !Array.isArray(e)) { for (const k in e) {
      if (k !== 'default' && !(k in n)) {
        const d = Object.getOwnPropertyDescriptor(e, k);
        if (d) {
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: () => e[k]
          });
        }
      }
    } }
  }
  return Object.freeze(Object.defineProperty(n, Symbol.toStringTag, { value: 'Module' }));
}

// dev uses dynamic import to separate chunks
    
    const {loadShare} = index_cjs;
    const {initPromise} = ballerstaedt_mf_2_veredelung__mf_v__runtimeInit__mf_v__;
    const res = initPromise.then(_ => loadShare("three", {
    customShareInfo: {shareConfig:{
      singleton: true,
      strictVersion: false,
      requiredVersion: "^0.177.0"
    }}}));
    const exportModule = await res.then(factory => factory());
    var ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__ = exportModule;

const ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__$1 = /*@__PURE__*/getDefaultExportFromCjs(ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__);

const THREE = /*#__PURE__*/_mergeNamespaces({
  __proto__: null,
  default: ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__$1
}, [ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__]);

export { THREE as T, ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__ as b };
