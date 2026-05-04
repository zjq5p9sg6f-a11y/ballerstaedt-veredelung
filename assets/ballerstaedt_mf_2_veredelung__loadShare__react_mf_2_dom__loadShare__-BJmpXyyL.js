import { g as getDefaultExportFromCjs } from './_commonjsHelpers-B85MJLTf.js';
import { a as index_cjs, b as ballerstaedt_mf_2_veredelung__mf_v__runtimeInit__mf_v__ } from './ballerstaedt_mf_2_veredelung__mf_v__runtimeInit__mf_v__-BrmfrqAs.js';

// dev uses dynamic import to separate chunks
    
    const {loadShare} = index_cjs;
    const {initPromise} = ballerstaedt_mf_2_veredelung__mf_v__runtimeInit__mf_v__;
    const res = initPromise.then(_ => loadShare("react-dom", {
    customShareInfo: {shareConfig:{
      singleton: true,
      strictVersion: false,
      requiredVersion: "19.1.1"
    }}}));
    const exportModule = await res.then(factory => factory());
    var ballerstaedt_mf_2_veredelung__loadShare__react_mf_2_dom__loadShare__ = exportModule;

const ReactDOM = /*@__PURE__*/getDefaultExportFromCjs(ballerstaedt_mf_2_veredelung__loadShare__react_mf_2_dom__loadShare__);

export { ReactDOM as R, ballerstaedt_mf_2_veredelung__loadShare__react_mf_2_dom__loadShare__ as b };
