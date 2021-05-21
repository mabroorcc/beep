import { Container } from "../Container";
import Cropper from "react-easy-crop";
import { CSSProperties } from "react";
import { useEditImage } from "./useEditImage";
import { Typography, IconButton } from "@material-ui/core";
import DoneIcon from "@material-ui/icons/Done";

export interface Props {
  image: string;
  onComplete: (img: { blob: Blob; sourced: string }) => void;
  cropperStyles?: CSSProperties;
  style?: CSSProperties;
}

export const EditImageComponent: React.FC<Props> = ({
  image,
  onComplete,
  style,
  cropperStyles,
}) => {
  const {
    crop,
    zoom,
    setCrop,
    onCropComplete,
    setZoom,
    doneWithCropping,
  } = useEditImage(image);

  const handleDoneEdit = async () => {
    const image = await doneWithCropping();
    onComplete(image);
  };

  return (
    <div style={style}>
      <div style={{ position:"relative",...cropperStyles }}>
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
      </div>
      <Typography>Scroll to adjust the zoom</Typography>
      <Container
        width="100%"
        height="auto"
        style={{
          textAlign: "right",
        }}
      >
        <IconButton onClick={handleDoneEdit} aria-label="done">
          <DoneIcon />
        </IconButton>
      </Container>
    </div>
  );
};
