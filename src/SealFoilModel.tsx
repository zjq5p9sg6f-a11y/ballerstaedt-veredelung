// @ts-nocheck
import { useEffect, useState } from "react";
import { DynamicModel } from "k3-plugin-api";
import { SealFoil } from "./SealFoil";
import {
  dataUrlToDiffuseTexture,
  dataUrlToNormalMap,
} from "./utils/imageToNormalMap";
import screenshot from "../public/Image.png";

const extractImageUrl = (val: any): string | undefined => {
  if (!val) return undefined;
  if (typeof val === "string") return val;
  if (typeof val === "object") {
    if (val.url) return val.url;
    if (val.dataUrl) return val.dataUrl;
    if (val.src) return val.src;
    if (Array.isArray(val) && val[0]) return extractImageUrl(val[0]);
    if (val[0]?.data) return extractImageUrl(val[0].data);
    if (val.data) return extractImageUrl(val.data);
  }
  return undefined;
};

const SealFoilDynamic = (props: any) => {
  const [diffuseTexture, setDiffuseTexture] = useState<any>(null);
  const [normalMap, setNormalMap] = useState<any>(null);

  if (typeof window !== "undefined") {
    // Diagnostic: see what K3 is feeding into the model
    // eslint-disable-next-line no-console
    console.log("[SealFoilPlugin] received props", props);
  }

  const printLogoUrl = extractImageUrl(
    props.printLogoUrl ?? props.logoUpload ?? props.logo
  );
  const embossingLogoUrl = extractImageUrl(
    props.embossingLogoUrl ?? props.embossingLogo
  );
  const embossingMode: boolean =
    Boolean(props.embossingMode) || Boolean(embossingLogoUrl);
  const activeUrl = embossingMode ? embossingLogoUrl ?? printLogoUrl : printLogoUrl;

  useEffect(() => {
    let cancelled = false;
    if (!activeUrl) {
      setDiffuseTexture(null);
      setNormalMap(null);
      return;
    }
    (async () => {
      try {
        const diff = await dataUrlToDiffuseTexture(activeUrl);
        const norm = embossingMode
          ? await dataUrlToNormalMap(activeUrl, { strength: 4.0 })
          : null;
        if (cancelled) return;
        setDiffuseTexture(embossingMode ? null : diff);
        setNormalMap(norm);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("[SealFoilPlugin] texture-load failed", err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [activeUrl, embossingMode]);

  return (
    <group
      position={props.position}
      scale={[props.width ?? 1, props.height ?? 1, props.depth ?? 1]}
      userData={{ modelId: props.id }}
    >
      <SealFoil
        shape={props.shape ?? "round"}
        diameterMm={props.diameterMm ?? 95}
        widthMm={props.widthMm ?? 60}
        heightMm={props.heightMm ?? 40}
        baseColor={props.baseColor ?? "#cfcfcf"}
        metalness={props.metalness ?? 0.85}
        roughness={props.roughness ?? 0.32}
        diffuseTexture={diffuseTexture}
        normalMap={normalMap}
      />
    </group>
  );
};

export const dynamicSealFoil: DynamicModel = {
  type: "sealFoilPlugin",
  label: "Siegelfolie",
  disabledForAR: false,
  component: SealFoilDynamic,
  propsDialog: {
    basic: { type: "basic" },
    shape: {},
    diameterMm: {},
    baseColor: {},
    metalness: {},
    roughness: {},
    embossingMode: {},
    printLogoUrl: { type: "image" },
    embossingLogoUrl: { type: "image" },
  },
  defaultProps: {
    width: { expression: "1" },
    height: { expression: "1" },
    depth: { expression: "1" },
    shape: { expression: '"round"' },
    diameterMm: { expression: "95" },
    baseColor: { expression: '"#cfcfcf"' },
    metalness: { expression: "0.85" },
    roughness: { expression: "0.32" },
    embossingMode: { expression: "false" },
    printLogoUrl: { expression: "null" },
    embossingLogoUrl: { expression: "null" },
  },
  materials: ["body"],
  screenshot,
};
