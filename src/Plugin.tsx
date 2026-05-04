import { LogoUploader } from "./LogoUploader";
import { dynamicSealFoil } from "./SealFoilModel";
import { K3Plugin } from "k3-plugin-api";

export default {
  dynamicModels: [dynamicSealFoil],
  variableTemplates: [
    {
      key: "logoUpload",
      label: "Logo / Druckbild",
      type: "image",
      component: LogoUploader,
    },
  ],
  layoutComponents: {},
} as K3Plugin;
