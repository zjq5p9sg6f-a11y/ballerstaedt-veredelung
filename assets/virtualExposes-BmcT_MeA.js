import { _ as __vitePreload } from './preload-helper-BazNuh42.js';

const exposesMap = {
    
        "./Plugin": async () => {
          const importModule = await __vitePreload(() => import('./Plugin-5jrIEktq.js'),true?[]:undefined,import.meta.url);
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
