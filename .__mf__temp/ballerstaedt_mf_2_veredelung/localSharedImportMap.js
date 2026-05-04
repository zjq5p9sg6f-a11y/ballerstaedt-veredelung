
// Windows temporarily needs this file, https://github.com/module-federation/vite/issues/68

    const importMap = {
      
        "@emotion/cache": async () => {
          let pkg = await import("__mf__virtual/ballerstaedt_mf_2_veredelung__prebuild___mf_0_emotion_mf_1_cache__prebuild__.js")
          return pkg
        }
      ,
        "@emotion/react": async () => {
          let pkg = await import("__mf__virtual/ballerstaedt_mf_2_veredelung__prebuild___mf_0_emotion_mf_1_react__prebuild__.js")
          return pkg
        }
      ,
        "@emotion/styled": async () => {
          let pkg = await import("__mf__virtual/ballerstaedt_mf_2_veredelung__prebuild___mf_0_emotion_mf_1_styled__prebuild__.js")
          return pkg
        }
      ,
        "@mui/material": async () => {
          let pkg = await import("__mf__virtual/ballerstaedt_mf_2_veredelung__prebuild___mf_0_mui_mf_1_material__prebuild__.js")
          return pkg
        }
      ,
        "@mui/styled-engine": async () => {
          let pkg = await import("__mf__virtual/ballerstaedt_mf_2_veredelung__prebuild___mf_0_mui_mf_1_styled_mf_2_engine__prebuild__.js")
          return pkg
        }
      ,
        "@react-three/drei": async () => {
          let pkg = await import("__mf__virtual/ballerstaedt_mf_2_veredelung__prebuild___mf_0_react_mf_2_three_mf_1_drei__prebuild__.js")
          return pkg
        }
      ,
        "@react-three/fiber": async () => {
          let pkg = await import("__mf__virtual/ballerstaedt_mf_2_veredelung__prebuild___mf_0_react_mf_2_three_mf_1_fiber__prebuild__.js")
          return pkg
        }
      ,
        "react": async () => {
          let pkg = await import("__mf__virtual/ballerstaedt_mf_2_veredelung__prebuild__react__prebuild__.js")
          return pkg
        }
      ,
        "react-dom": async () => {
          let pkg = await import("__mf__virtual/ballerstaedt_mf_2_veredelung__prebuild__react_mf_2_dom__prebuild__.js")
          return pkg
        }
      ,
        "three": async () => {
          let pkg = await import("__mf__virtual/ballerstaedt_mf_2_veredelung__prebuild__three__prebuild__.js")
          return pkg
        }
      
    }
      const usedShared = {
      
          "@emotion/cache": {
            name: "@emotion/cache",
            version: "11.14.0",
            scope: ["default"],
            loaded: false,
            from: "ballerstaedt-veredelung",
            async get () {
              usedShared["@emotion/cache"].loaded = true
              const {"@emotion/cache": pkgDynamicImport} = importMap 
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^11.14.0"
            }
          }
        ,
          "@emotion/react": {
            name: "@emotion/react",
            version: "11.14.0",
            scope: ["default"],
            loaded: false,
            from: "ballerstaedt-veredelung",
            async get () {
              usedShared["@emotion/react"].loaded = true
              const {"@emotion/react": pkgDynamicImport} = importMap 
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^11.10.0"
            }
          }
        ,
          "@emotion/styled": {
            name: "@emotion/styled",
            version: "11.14.1",
            scope: ["default"],
            loaded: false,
            from: "ballerstaedt-veredelung",
            async get () {
              usedShared["@emotion/styled"].loaded = true
              const {"@emotion/styled": pkgDynamicImport} = importMap 
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^11.10.5"
            }
          }
        ,
          "@mui/material": {
            name: "@mui/material",
            version: "7.3.5",
            scope: ["default"],
            loaded: false,
            from: "ballerstaedt-veredelung",
            async get () {
              usedShared["@mui/material"].loaded = true
              const {"@mui/material": pkgDynamicImport} = importMap 
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^7.1.1"
            }
          }
        ,
          "@mui/styled-engine": {
            name: "@mui/styled-engine",
            version: "7.1.1",
            scope: ["default"],
            loaded: false,
            from: "ballerstaedt-veredelung",
            async get () {
              usedShared["@mui/styled-engine"].loaded = true
              const {"@mui/styled-engine": pkgDynamicImport} = importMap 
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^7.1.1"
            }
          }
        ,
          "@react-three/drei": {
            name: "@react-three/drei",
            version: "10.5.1",
            scope: ["default"],
            loaded: false,
            from: "ballerstaedt-veredelung",
            async get () {
              usedShared["@react-three/drei"].loaded = true
              const {"@react-three/drei": pkgDynamicImport} = importMap 
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^10.1.2"
            }
          }
        ,
          "@react-three/fiber": {
            name: "@react-three/fiber",
            version: "9.2.0",
            scope: ["default"],
            loaded: false,
            from: "ballerstaedt-veredelung",
            async get () {
              usedShared["@react-three/fiber"].loaded = true
              const {"@react-three/fiber": pkgDynamicImport} = importMap 
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^9.1.2"
            }
          }
        ,
          "react": {
            name: "react",
            version: "19.1.1",
            scope: ["default"],
            loaded: false,
            from: "ballerstaedt-veredelung",
            async get () {
              usedShared["react"].loaded = true
              const {"react": pkgDynamicImport} = importMap 
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "19.1.1"
            }
          }
        ,
          "react-dom": {
            name: "react-dom",
            version: "19.1.1",
            scope: ["default"],
            loaded: false,
            from: "ballerstaedt-veredelung",
            async get () {
              usedShared["react-dom"].loaded = true
              const {"react-dom": pkgDynamicImport} = importMap 
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "19.1.1"
            }
          }
        ,
          "three": {
            name: "three",
            version: "0.177.0",
            scope: ["default"],
            loaded: false,
            from: "ballerstaedt-veredelung",
            async get () {
              usedShared["three"].loaded = true
              const {"three": pkgDynamicImport} = importMap 
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^0.177.0"
            }
          }
        
    }
      const usedRemotes = [
      ]
      export {
        usedShared,
        usedRemotes
      }
      