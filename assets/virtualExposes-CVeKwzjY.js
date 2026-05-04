import { _ as __vitePreload } from './preload-helper-B5tfdMne.js';

const exposesMap = {
    
        "./Plugin": async () => {
          const importModule = await __vitePreload(() => import('./Plugin-BPWIU6DZ.js'),true?[]:undefined);
          const exportModule = {};
          Object.assign(exportModule, importModule);
          Object.defineProperty(exportModule, "__esModule", {
            value: true,
            enumerable: false
          });
          return exportModule
        }
      
  };

export { exposesMap as default };
