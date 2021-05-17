import { IconButton, makeStyles, Typography } from "@material-ui/core";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { BeepTopLeftLogo } from "../../features/BeepTopLeftLogo";
import { Container } from "../../features/Container";
import { ExpandedComponenet } from "../../features/ExpandedComponenet";
import Cropper from "react-easy-crop";
import { PageComponenet } from "../../features/PageComponent";
import { selectUser } from "../../features/user/userSlice";
import EditIcon from "@material-ui/icons/Edit";
import CancelIcon from "@material-ui/icons/Cancel";
import DoneIcon from "@material-ui/icons/Done";
import { useEffect, useState } from "react";
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate";
import { useChangeProfile } from "./useChangeProfile";
import { HOME_PAGE_PATH } from "../home";
import { useHistory } from "react-router-dom";
import { uploadFileAction } from "../../features/FileUpload/uploadSlice";
import { jsonReq } from "../../features/JSON";

export interface Props {}

export const CHANGE_PROFILE_PAGE_PATH = "/changeprofile";

export const ChangeProfile: React.FC<Props> = () => {
  const user = useAppSelector(selectUser);
  const [hoveringOverInput, setHoveringOverInput] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const [imageBlob, setImageBlob] = useState<Blob>();
  const [editMode, setEditingMode] = useState(false);
  const dispatch = useAppDispatch();
  const history = useHistory();
  const classes = useStyles();
  const {
    crop,
    zoom,
    setCrop,
    onCropComplete,
    setZoom,
    doneWithCropping,
  } = useChangeProfile(imageSrc);

  useEffect(() => {
    if (user) {
      setImageSrc(user.picture);
    }
  }, []);

  if (!user) return <></>;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    setImageBlob(file);
    setImageSrc(URL.createObjectURL(file));
  };

  const handleEdit = () => {
    setEditingMode(true);
  };

  const handleCancelEdit = () => {
    setEditingMode(false);
  };

  const handleDoneEdit = async () => {
    const result = await doneWithCropping();
    setImageSrc(result.sourced);
    setImageBlob(result.blob);
    setEditingMode(false);
  };

  const changeUserProfile = async (url: string) => {
    return jsonReq("http://localhost:4000/auth/users/change/picture", "post", {
      picture: url,
    });
  };

  const handleFinalizeUpload = () => {
    dispatch(
      uploadFileAction("profilePic", imageBlob as Blob, async (arg) => {
        const res = await changeUserProfile(arg);
        if (res.ok) history.push(HOME_PAGE_PATH);
        // update app state here
      })
    );
  };

  const handleCancelImageChange = () => {
    history.push(HOME_PAGE_PATH);
  };

  return (
    <PageComponenet enter="middle" leave="left" duration={0.2}>
      <BeepTopLeftLogo />
      <ExpandedComponenet center>
        {!editMode ? (
          <Container
            width="22rem"
            height="30rem"
            center
            style={{ flexDirection: "column" }}
          >
            <Container
              width="100%"
              height="2rem"
              style={{ textAlign: "right" }}
            >
              <IconButton onClick={handleEdit}>
                <EditIcon />
              </IconButton>
            </Container>
            <Container
              center
              width="200px"
              height="200px"
              style={styles.imageContainer()}
            >
              <img style={styles.image()} src={imageSrc} />
              {hoveringOverInput && <AddProfileOverlay />}
              <input
                onMouseOut={() => setHoveringOverInput(false)}
                onMouseOver={() => setHoveringOverInput(true)}
                onChange={handleInputChange}
                style={styles.fileInput()}
                type="file"
                accept="image/*"
              />
            </Container>
            <Typography className={classes.typo} variant="h6" align="center">
              Change Profile
            </Typography>
            <Container width="100%" height="auto" style={styles.controls()}>
              <IconButton onClick={handleCancelImageChange} aria-label="done">
                <CancelIcon />
              </IconButton>
              <IconButton onClick={handleFinalizeUpload} aria-label="done">
                <DoneIcon />
              </IconButton>
            </Container>
          </Container>
        ) : (
          <Container
            width="22rem"
            height="30rem"
            center
            style={{ flexDirection: "column" }}
          >
            <Container
              style={styles.cropperContainer()}
              width="20rem"
              height="20rem"
            >
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </Container>
            <Typography>Scroll to adjust the zoom</Typography>
            <Container width="100%" height="auto" style={styles.controls()}>
              <IconButton onClick={handleCancelEdit} aria-label="done">
                <CancelIcon />
              </IconButton>
              <IconButton onClick={handleDoneEdit} aria-label="done">
                <DoneIcon />
              </IconButton>
            </Container>
          </Container>
        )}
      </ExpandedComponenet>
    </PageComponenet>
  );
};

const useStyles = makeStyles({
  typo: {
    fontWeight: "normal",
    marginBottom: "1rem",
  },
});

const styles: Record<string, () => React.CSSProperties> = {
  controls: () => ({
    textAlign: "right",
  }),
  fileInput: () => ({
    position: "absolute",
    width: "100%",
    height: "100%",
    cursor: "pointer",
    opacity: 0,
  }),
  image: () => ({
    width: "100%",
    height: "auto",
  }),
  imageContainer: () => ({
    position: "relative",
    borderRadius: "50%",
    overflow: "hidden",
    marginBottom: "1rem",
  }),
  cropperContainer: () => ({
    position: "relative",
    marginBottom: "1rem",
    borderRadius: "50%",
    overflow: "hidden",
  }),
};

function AddProfileOverlay() {
  return (
    <ExpandedComponenet
      styles={{ position: "absolute", backgroundColor: "#000000a0" }}
      center
    >
      <AddPhotoAlternateIcon />
    </ExpandedComponenet>
  );
}
