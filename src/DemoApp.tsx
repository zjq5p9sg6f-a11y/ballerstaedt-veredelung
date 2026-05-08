// @ts-nocheck
import { useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import {
  Box,
  Container,
  Stack,
  Typography,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Slider,
  Paper,
  Chip,
  Divider,
  Link,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { SealFoil } from "./SealFoil";
import {
  dataUrlToDiffuseTexture,
  dataUrlToNormalMap,
} from "./utils/imageToNormalMap";

const FOIL_COLORS: { label: string; color: string; metalness: number; roughness: number }[] = [
  { label: "Aluminium glänzend", color: "#d8d8d8", metalness: 0.92, roughness: 0.18 },
  { label: "Aluminium matt", color: "#bdbdbd", metalness: 0.6, roughness: 0.55 },
  { label: "Kunststoff weiß", color: "#f6f6f4", metalness: 0.0, roughness: 0.62 },
  { label: "Gold-Lack", color: "#d4af37", metalness: 1.0, roughness: 0.15 },
  { label: "Silber-Lack", color: "#cfd6dd", metalness: 1.0, roughness: 0.1 },
  { label: "Kupfer-Lack", color: "#b87333", metalness: 1.0, roughness: 0.18 },
];

export function DemoApp() {
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);
  // shape-IDs matchen FORMEN aus baco-catalog.ts. Die mit STEP-File werden
  // direkt aus CAD geladen (occt-import-js), die anderen parametrisch.
  const [shape, setShape] = useState<string>("ronde");
  const [diameter, setDiameter] = useState(95);
  const [embossingMode, setEmbossingMode] = useState(false);
  const [colorIdx, setColorIdx] = useState(0);
  const [embossStrength, setEmbossStrength] = useState(4);

  const [diffuseTexture, setDiffuseTexture] = useState<any>(null);
  const [normalMap, setNormalMap] = useState<any>(null);

  const palette = FOIL_COLORS[colorIdx];

  useEffect(() => {
    let cancelled = false;
    if (!logoDataUrl) {
      setDiffuseTexture(null);
      setNormalMap(null);
      return;
    }
    (async () => {
      try {
        const diff = await dataUrlToDiffuseTexture(logoDataUrl);
        const norm = embossingMode
          ? await dataUrlToNormalMap(logoDataUrl, { strength: embossStrength })
          : null;
        if (cancelled) return;
        setDiffuseTexture(embossingMode ? null : diff);
        setNormalMap(norm);
      } catch (err) {
        console.error("texture-load failed", err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [logoDataUrl, embossingMode, embossStrength]);

  const handleLogoUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setLogoDataUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const reset = () => {
    setLogoDataUrl(null);
    setShape("ronde");
    setDiameter(95);
    setEmbossingMode(false);
    setColorIdx(0);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fafafa" }}>
      {/* Header */}
      <Box sx={{ bgcolor: "#1a1a1a", color: "white", py: 3 }}>
        <Container maxWidth="lg">
          <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2} flexWrap="wrap">
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 600, letterSpacing: -0.5 }}>
                Ballerstaedt Veredelungs-Mockup
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.7, mt: 0.5 }}>
                Live-Demo · K3-Plugin · Siegelfolien-Veredelung in 3D erlebbar
              </Typography>
            </Box>
            <Stack direction="row" gap={1}>
              <Chip label="React 19 + R3F" size="small" sx={{ bgcolor: "#333", color: "white" }} />
              <Chip label="Vite Module Federation" size="small" sx={{ bgcolor: "#333", color: "white" }} />
              <Chip label="Phase 0" size="small" sx={{ bgcolor: "#2c5", color: "white" }} />
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack direction={{ xs: "column", md: "row" }} gap={3}>
          {/* Controls */}
          <Paper elevation={1} sx={{ p: 3, width: { xs: "100%", md: 340 }, flexShrink: 0 }}>
            <Stack gap={3}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Konfiguration
              </Typography>

              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
                  FORM
                </Typography>
                <ToggleButtonGroup
                  size="small"
                  value={shape}
                  exclusive
                  onChange={(_e, v) => v && setShape(v)}
                  fullWidth
                  orientation="vertical"
                  sx={{ "& .MuiToggleButton-root": { justifyContent: "flex-start", textAlign: "left" } }}
                >
                  <ToggleButton value="ronde">Ronde (parametrisch)</ToggleButton>
                  <ToggleButton value="ronde-lasche">Ronde mit Lasche (parametrisch)</ToggleButton>
                  <ToggleButton value="kappe">K · Kappe ohne Lasche</ToggleButton>
                  <ToggleButton value="kappe-lasche">AK · Kappe mit Lasche</ToggleButton>
                  <ToggleButton value="verformt-lasche">AL · Tiefgezogen mit Lasche</ToggleButton>
                  <ToggleButton value="verformte-ronde">Tiefgezogen ohne Lasche</ToggleButton>
                </ToggleButtonGroup>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  DURCHMESSER · {diameter} mm
                </Typography>
                <Slider
                  min={20}
                  max={150}
                  value={diameter}
                  onChange={(_e, v) => setDiameter(v as number)}
                  size="small"
                />
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
                  MATERIAL / FOLIE
                </Typography>
                <Stack direction="row" flexWrap="wrap" gap={0.5}>
                  {FOIL_COLORS.map((p, idx) => (
                    <Chip
                      key={p.label}
                      label={p.label}
                      size="small"
                      onClick={() => setColorIdx(idx)}
                      sx={{
                        bgcolor: colorIdx === idx ? p.color : undefined,
                        color: colorIdx === idx ? "#000" : undefined,
                        border: colorIdx === idx ? "2px solid #1a1a1a" : "1px solid #ddd",
                      }}
                    />
                  ))}
                </Stack>
              </Box>

              <Divider />

              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
                  LOGO / DRUCKBILD
                </Typography>
                <Stack gap={1}>
                  <Button variant="outlined" component="label" size="small" fullWidth>
                    {logoDataUrl ? "Anderes Logo wählen" : "Logo hochladen (PNG/JPG/SVG)"}
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/svg+xml"
                      hidden
                      onChange={handleLogoUpload}
                    />
                  </Button>
                  {logoDataUrl && (
                    <Box
                      sx={{
                        width: "100%",
                        height: 64,
                        backgroundImage: `url(${logoDataUrl})`,
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundColor: "#f4f4f4",
                        border: "1px solid #e0e0e0",
                        borderRadius: 1,
                      }}
                    />
                  )}
                </Stack>
              </Box>

              <FormControlLabel
                control={
                  <Switch
                    checked={embossingMode}
                    onChange={(e) => setEmbossingMode(e.target.checked)}
                    disabled={!logoDataUrl}
                  />
                }
                label={
                  <Typography variant="body2">
                    Logo als <strong>Blindprägung</strong> {embossingMode ? "(an)" : "(aus = Druck)"}
                  </Typography>
                }
              />

              {embossingMode && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    PRÄGE-TIEFE · {embossStrength.toFixed(1)}
                  </Typography>
                  <Slider
                    min={1}
                    max={10}
                    step={0.5}
                    value={embossStrength}
                    onChange={(_e, v) => setEmbossStrength(v as number)}
                    size="small"
                  />
                </Box>
              )}

              <Divider />

              <Button onClick={reset} size="small" color="inherit">
                Zurücksetzen
              </Button>
            </Stack>
          </Paper>

          {/* 3D Canvas */}
          <Paper elevation={1} sx={{ flex: 1, minHeight: 560, overflow: "hidden", position: "relative" }}>
            <Canvas camera={{ position: [0, 0.6, 2.4], fov: 32 }} shadows>
              <ambientLight intensity={0.35} />
              <directionalLight
                position={[3, 5, 4]}
                intensity={1.2}
                castShadow
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
              />
              <Environment preset="studio" />
              <SealFoil
                shape={shape}
                diameterMm={diameter}
                widthMm={diameter * 0.85}
                heightMm={diameter * 0.6}
                baseColor={palette.color}
                metalness={palette.metalness}
                roughness={palette.roughness}
                diffuseTexture={diffuseTexture}
                normalMap={normalMap}
              />
              <ContactShadows position={[0, -0.05, 0]} opacity={0.4} scale={3} blur={2.5} far={1} />
              <OrbitControls
                makeDefault
                enableZoom
                enablePan={false}
                minPolarAngle={0.2}
                maxPolarAngle={Math.PI / 2.1}
                target={[0, 0, 0]}
              />
            </Canvas>
            <Box
              sx={{
                position: "absolute",
                bottom: 12,
                left: 12,
                bgcolor: "rgba(0,0,0,0.6)",
                color: "white",
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                fontSize: 11,
                fontFamily: "monospace",
              }}
            >
              {(() => {
                const labels: Record<string, string> = {
                  "ronde":           `Ronde Ø${diameter}mm`,
                  "ronde-lasche":    `Ronde mit Lasche Ø${diameter}mm`,
                  "kappe":           `K · Kappe ohne Lasche Ø${diameter}mm`,
                  "kappe-lasche":    `AK · Kappe mit Lasche Ø${diameter}mm`,
                  "verformt-lasche": `AL · Tiefgezogen mit Lasche Ø${diameter}mm`,
                  "verformte-ronde": `Tiefgezogen ohne Lasche Ø${diameter}mm`,
                };
                return labels[shape] ?? `${shape} Ø${diameter}mm`;
              })()}
              {logoDataUrl && (embossingMode ? " · Blindprägung" : " · Druck")} · {palette.label}
            </Box>
          </Paper>
        </Stack>

        <Paper elevation={0} sx={{ mt: 4, p: 3, bgcolor: "transparent" }}>
          <Stack direction="row" gap={4} flexWrap="wrap">
            <Box sx={{ minWidth: 180 }}>
              <Typography variant="overline" color="text.secondary">
                Status
              </Typography>
              <Typography variant="body2">Phase 0 · Hello-World</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                Form · Material · Logo-Upload · Druck/Prägung-Toggle
              </Typography>
            </Box>
            <Box sx={{ minWidth: 180 }}>
              <Typography variant="overline" color="text.secondary">
                Phase 1 (nächst)
              </Typography>
              <Typography variant="body2">Veredelungs-Bibliothek</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                12 BaCo-Prägungen · 4 Druckstile · metallische Logo-Veredelung
              </Typography>
            </Box>
            <Box sx={{ minWidth: 180 }}>
              <Typography variant="overline" color="text.secondary">
                Plugin-URL für K3
              </Typography>
              <Typography variant="caption" sx={{ fontFamily: "monospace", display: "block", wordBreak: "break-all" }}>
                /remoteEntry.js
              </Typography>
              <Link
                href="./remoteEntry.js"
                target="_blank"
                rel="noopener"
                variant="caption"
                sx={{ display: "block", mt: 0.5 }}
              >
                Module-Federation Endpoint öffnen
              </Link>
            </Box>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
