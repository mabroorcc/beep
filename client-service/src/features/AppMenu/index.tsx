import React from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { IconButton, makeStyles } from "@material-ui/core";
import SettingsIcon from "@material-ui/icons/Settings";
import { logout } from "../api";
import { useHistory } from "react-router-dom";
import { LOGIN_PAGE_PATH } from "../../pages/login";
import { CHANGE_PROFILE_PAGE_PATH } from "../../pages/ChangeProfile";
import { CHANGE_USER_DETAILS_PAGE_PATH } from "../../pages/ChangeUserDetails";
import { useAppDispatch } from "../../app/hooks";
import { logoutUser } from "../user/userSlice";
interface Props {}

export const AppMenu: React.FC<Props> = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const history = useHistory();
  const dispatch = useAppDispatch();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    const result = await logout();
    if (result) {
      history.push(LOGIN_PAGE_PATH);
      dispatch(logoutUser());
    }
    setAnchorEl(null);
  };

  const handleChangePicture = () => {
    history.push(CHANGE_PROFILE_PAGE_PATH);
    setAnchorEl(null);
  };

  const handleChangeDetails = () => {
    history.push(CHANGE_USER_DETAILS_PAGE_PATH);
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <SettingsIcon />
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
        <MenuItem onClick={handleChangePicture}>Change Picture</MenuItem>
        <MenuItem onClick={handleChangeDetails}>Change Details</MenuItem>
      </Menu>
    </div>
  );
};
