import { useState } from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import { tokens } from '../../theme';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ContactsOutlinedIcon from '@mui/icons-material/ContactsOutlined';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import { getWithExpiry } from '../../util/localstorage';
import { setWithExpiry } from '../../util/localstorage';

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Link to={to}>
        <Typography>{title}</Typography>
      </Link>
    </MenuItem>
  );
};

const Mysidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState('Dashboard');

  const isLogin = getWithExpiry('userToken');

 //const isLogin = true;

const logoutHandler= ()=>{
  console.log("is logged out");
  localStorage.removeItem('userToken');
  localStorage.removeItem('kubeToken');

}


  if (isLogin)
    return (
      <Box
        sx={{
          '& .pro-sidebar-inner': {
            background: `${colors.primary[400]} !important`,
          },
          '& .pro-icon-wrapper': {
            backgroundColor: 'transparent !important',
          },
          '& .pro-inner-item': {
            padding: '5px 35px 5px 20px !important',
          },
          '& .pro-inner-item:hover': {
            color: '#868dfb !important',
          },
          '& .pro-menu-item.active': {
            color: '#6870fa !important',
          },
        }}
      >
        <Sidebar collapsed={isCollapsed}>
          <Menu iconShape="square">
            <MenuItem
              onClick={() => setIsCollapsed(!isCollapsed)}
              icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
              style={{
                margin: '10px 0 20px 0',
                color: colors.grey[100],
              }}
            >
              {!isCollapsed && (
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  ml="15px"
                >
                  <Typography variant="h3" color={colors.grey[100]}>
                    ADMINIS
                  </Typography>
                  <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                    <MenuOutlinedIcon />
                  </IconButton>
                </Box>
              )}
            </MenuItem>

            {!isCollapsed && (
              <Box mb="25px">
                <Box display="flex" justifyContent="center" alignItems="center">
                  <img
                    alt="profile-user"
                    width="100px"
                    height="100px"
                    src={'../../assets/proxym_logo.jpg'}
                    style={{ cursor: 'pointer', borderRadius: '50%' }}
                  />
                </Box>
                <Box textAlign="center">
                  <Typography
                    variant="h2"
                    color={colors.grey[100]}
                    fontWeight="bold"
                    sx={{ m: '10px 0 0 0' }}
                  >
                    Proxym
                  </Typography>
{/* <Typography variant="h5" color={colors.blueAccent[500]}>
  "Admin"
</Typography> */}
                </Box>
              </Box>
            )}

            <Box paddingLeft={isCollapsed ? undefined : '10%'}>
              <Item
                title="Dashboard"
                to="/frontend"
                icon={<HomeOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
  

              <Item
                title="Templates"
                to="/frontend/templates"
                icon={<ReceiptOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />    
              <Item
                title="Constraints"
                to="/frontend/constraints"
                icon={<ContactsOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />     
              <div onClick={()=>{
                  logoutHandler()
                }}>
              <Item
                title="Log out"
                to="/frontend/login"
                icon={<LogoutIcon />}
                selected={selected}
                setSelected={setSelected}
              /> 
                </div>  
              
            </Box>
          </Menu>
        </Sidebar>
      </Box>
    );
  else {
    return null;
  }
};

export default Mysidebar;
