import { IconButton, makeStyles } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { EditImageComponent } from "../../features/EditImageComponent";
import { ExpandedComponenet } from "../../features/ExpandedComponenet";
import { PageComponenet } from "../../features/PageComponent";
import DoneIcon from "@material-ui/icons/Done";
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate";
import { selectUser, setProfileAct } from "../../features/user/userSlice";
import EditIcon from "@material-ui/icons/Edit";
import { uploadFileAction } from "../../features/FileUpload/uploadSlice";
import { jsonReq } from "../../features/JSON";
import { HOME_PAGE_PATH } from "../home";
import { useHistory } from "react-router-dom";

export const CHANGE_PROFILE_PAGE_PATH = "/change/profile";

export const ChangeProfile: React.FC = () => {
  const classes = useStyles();
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const [imageSrc, setImageSrc] = useState("");
  const [imageBlob, setImageBlob] = useState(new Blob());
  const [changedImage, setChangedImage] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const history = useHistory();

  useEffect(() => {
    if (user) {
      setImageSrc(user.picture);
    }
  }, [user]);

  if (!user) return <></>;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    if (!file) return;
    setChangedImage(true);
    setImageBlob(file.slice());
    setImageSrc(URL.createObjectURL(file));
  };

  const handleDoneClick = () => {
    ifNewUserThenSetToFalse();
    if (changedImage) {
      // upload the image first
      dispatch(
        uploadFileAction("profile", imageBlob, (picture) => {
          requestToChangeProfile(picture)
            .then(() => {
              dispatch(setProfileAct(picture));
              history.push(HOME_PAGE_PATH);
            })
            .catch((e) => {
              history.push(HOME_PAGE_PATH);
              console.log(e);
            });
        })
      );
    } else {
      // moveon
      history.push(HOME_PAGE_PATH);
    }
  };

  const requestToChangeProfile = async (picture: string) => {
    return jsonReq("http://localhost:4000/auth/users/change/picture", "post", {
      picture,
    });
  };

  const ifNewUserThenSetToFalse = () => {
    const newuser = document.cookie.split("=")[1] === "true";
    if (newuser) {
      document.cookie = "new=false;";
    }
  };

  return (
    <PageComponenet duration={0.4} enter="middle" leave="left">
      <ExpandedComponenet center>
        <div className={classes.main}>
          {editMode ? (
            <EditImageComponent
              style={{
                width: "100%",
                height: "auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginBottom: "1rem",
              }}
              cropperStyles={{
                borderRadius: "50%",
                overflow: "hidden",
                width: "15rem",
                height: "15rem",
                marginBottom: "1rem",
              }}
              image={imageSrc}
              onComplete={(img) => {
                setImageSrc(img.sourced);
                setImageBlob(img.blob);
                setChangedImage(true);
                setEditMode(false);
              }}
            />
          ) : (
            <div className={classes.imgSect}>
              <div className={classes.topactions}>
                <IconButton onClick={() => setEditMode(true)}>
                  <EditIcon />
                </IconButton>
              </div>
              <div className={classes.icontainer}>
                <img
                  onMouseOver={() => setHovering(true)}
                  className={classes.img}
                  src={imageSrc}
                  alt="user image"
                />
                {hovering && (
                  <>
                    <div className={classes.overlay}>
                      <AddPhotoAlternateIcon />
                    </div>
                    <input
                      onChange={handleInputChange}
                      className={classes.input}
                      onMouseLeave={() => setHovering(false)}
                      type="file"
                      accept="image/*"
                    />
                  </>
                )}
              </div>
              <div className={classes.call}>
                Confirm or click on image to change
              </div>
              <div className={classes.bottomAction}>
                <IconButton onClick={handleDoneClick}>
                  <DoneIcon />
                </IconButton>
              </div>
            </div>
          )}
        </div>
      </ExpandedComponenet>
    </PageComponenet>
  );
};

const useStyles = makeStyles({
  main: {
    width: "20rem",
    height: "auto",
  },
  imgSect: {
    width: "100%",
    height: "30rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  icontainer: {
    width: "10rem",
    height: "10rem",
    borderRadius: "50%",
    overflow: "hidden",
    position: "relative",
    marginBottom: "1rem",
  },
  img: {
    height: "100%",
    width: "100%",
    objectFit: "cover",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "#000000aa",
    display: "grid",
    placeItems: "center",
  },
  input: {
    position: "absolute",
    opacity: "0",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    cursor: "pointer",
  },
  topactions: {
    width: "100%",
    textAlign: "right",
    marginBottom: "0.5rem",
  },
  bottomAction: {
    width: "100%",
    textAlign: "right",
  },
  call: {
    textAlign: "center",
    fontSize: "1rem",
    marginBottom: "1rem",
  },
});
