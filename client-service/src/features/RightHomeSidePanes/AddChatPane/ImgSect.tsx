import { useState } from "react";
import { IconButton, makeStyles } from "@material-ui/core";
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate";
import EditIcon from "@material-ui/icons/Edit";
import { EditImageComponent } from "../../EditImageComponent";
import { ExpandedComponenet } from "../../ExpandedComponenet";

interface ImageSectProps {
  image: string;
  setImage: any;
}

export const ImageSect: React.FC<ImageSectProps> = ({ image, setImage }) => {
  const [hoveringOverInput, setHoveringOverInput] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const classes = useStyles();

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    if (!file) return;
    setImage(URL.createObjectURL(file));
  };

  const handleEditMode = () => {
    setEditMode(true);
  };

  return (
    <div className={classes.imgSectMain}>
      {!editMode ? (
        <>
          <div className={classes.actionContainer}>
            <IconButton onClick={handleEditMode}>
              <EditIcon />
            </IconButton>
          </div>
          <div className={classes.imgBox}>
            <img className={classes.img} src={image} />
            {hoveringOverInput && <AddProfileOverlay />}
            <input
              onChange={handleFileInputChange}
              onMouseOut={() => setHoveringOverInput(false)}
              onMouseOver={() => setHoveringOverInput(true)}
              className={classes.imgInput}
              type="file"
              accept="image/*"
            />
          </div>
        </>
      ) : (
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
          image={image}
          onComplete={(img) => {
            setImage(img.sourced);
            setEditMode(false);
          }}
        />
      )}
    </div>
  );
};

function AddProfileOverlay() {
  return (
    <ExpandedComponenet
      styles={{
        position: "absolute",
        top: 0,
        left: 0,
        backgroundColor: "#000000a0",
      }}
      center
    >
      <AddPhotoAlternateIcon />
    </ExpandedComponenet>
  );
}

const useStyles = makeStyles({
  imgBox: {
    width: "10rem",
    height: "10rem",
    borderRadius: "50%",
    overflow: "hidden",
    position: "relative",
    marginBottom: "1rem",
  },
  img: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
  },
  imgInput: {
    width: "100%",
    height: "100%",
    opacity: "0",
    position: "absolute",
    top: "0",
    left: "0",
  },
  imgSectMain: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  actionContainer: {
    display: "flex",
    width: "100%",
    justifyContent: "flex-end",
  },
});
