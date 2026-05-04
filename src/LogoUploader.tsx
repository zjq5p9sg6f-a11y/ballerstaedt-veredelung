// @ts-nocheck
import { Stack, Button, Box, Typography } from "@mui/material";

export const LogoUploader = () => (props: any) => {
  const dataUrl: string | undefined = props.selection?.data?.dataUrl;

  const handleFile = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      props.onChange(props.value.id, {
        dataUrl: reader.result,
        fileName: file.name,
      });
    };
    reader.readAsDataURL(file);
  };

  const clear = () => {
    props.onChange(props.value.id, { dataUrl: null, fileName: null });
  };

  return (
    <Stack direction="row" gap={2} alignItems="center">
      <Button variant="outlined" component="label" size="small">
        Logo wählen
        <input
          type="file"
          accept="image/png,image/jpeg,image/svg+xml"
          hidden
          onChange={handleFile}
        />
      </Button>
      {dataUrl && (
        <>
          <Box
            sx={{
              width: 56,
              height: 56,
              border: "1px solid #ddd",
              borderRadius: 1,
              backgroundImage: `url(${dataUrl})`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundColor: "#fafafa",
            }}
          />
          <Stack>
            <Typography variant="caption" sx={{ maxWidth: 180 }} noWrap>
              {props.selection?.data?.fileName ?? "logo"}
            </Typography>
            <Button size="small" onClick={clear}>
              Entfernen
            </Button>
          </Stack>
        </>
      )}
      {!dataUrl && (
        <Typography variant="caption" color="text.secondary">
          PNG / JPG / SVG · transparenter Hintergrund empfohlen
        </Typography>
      )}
    </Stack>
  );
};
