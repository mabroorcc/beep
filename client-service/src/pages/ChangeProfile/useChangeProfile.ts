import { useState } from "react";
import { Point, Area } from "react-easy-crop/types";
export const useChangeProfile = (imgUrlObj: string) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCropAreaPixels] = useState<Area>();

  const onCropComplete = async (
    _croppedArea: Area,
    croppedAreaPixels: Area
  ) => {
    setCropAreaPixels(croppedAreaPixels);
  };

  const doneWithCropping = async () => {
    const croppedImage = await getCroppedImg(
      imgUrlObj,
      croppedAreaPixels as Area
    );
    return { blob: croppedImage, sourced: URL.createObjectURL(croppedImage) };
  };

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: Area,
    rotation = 0
  ) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");

    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    const maxSize = Math.max(image.width, image.height);
    const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

    canvas.width = safeArea;
    canvas.height = safeArea;

    // translate canvas context to a central location on image to allow rotating around the center.
    ctx.translate(safeArea / 2, safeArea / 2);
    ctx.rotate(getRadianAngle(rotation));
    ctx.translate(-safeArea / 2, -safeArea / 2);

    // draw rotated image and store data.
    ctx.drawImage(
      image,
      safeArea / 2 - image.width * 0.5,
      safeArea / 2 - image.height * 0.5
    );

    const data = ctx.getImageData(0, 0, safeArea, safeArea);

    // set canvas width to final desired crop size - this will clear existing context
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    // paste generated rotate image with correct offsets for x,y crop values.
    ctx.putImageData(
      data,
      Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
      Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y)
    );

    // URL.createObjectURL(file)

    // As a blob
    return new Promise<Blob>((resolve) => {
      canvas.toBlob((file) => {
        resolve(file as Blob);
      }, "image/jpeg");
    });
  };

  function getRadianAngle(degreeValue: number) {
    return (degreeValue * Math.PI) / 180;
  }

  const createImage = (url: string) => {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.setAttribute("crossOrigin", "anonymous"); // needed to avoid cross-origin issues on CodeSandbox
      image.src = url;
    });
  };

  return {
    crop,
    zoom,
    setCrop,
    onCropComplete,
    setZoom,
    doneWithCropping,
  };
};
