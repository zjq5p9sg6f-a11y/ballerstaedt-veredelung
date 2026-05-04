import { g as getDefaultExportFromCjs } from './_commonjsHelpers-B85MJLTf.js';
import { a as index_cjs, b as ballerstaedt_mf_2_veredelung__mf_v__runtimeInit__mf_v__ } from './ballerstaedt_mf_2_veredelung__mf_v__runtimeInit__mf_v__-BrmfrqAs.js';

// dev uses dynamic import to separate chunks
    
    const {loadShare} = index_cjs;
    const {initPromise} = ballerstaedt_mf_2_veredelung__mf_v__runtimeInit__mf_v__;
    const res = initPromise.then(_ => loadShare("@emotion/cache", {
    customShareInfo: {shareConfig:{
      singleton: true,
      strictVersion: false,
      requiredVersion: "^11.14.0"
    }}}));
    const exportModule = await res.then(factory => factory());
    var ballerstaedt_mf_2_veredelung__loadShare___mf_0_emotion_mf_1_cache__loadShare__ = exportModule;

const createCache = /*@__PURE__*/getDefaultExportFromCjs(ballerstaedt_mf_2_veredelung__loadShare___mf_0_emotion_mf_1_cache__loadShare__);

export { createCache as c };
