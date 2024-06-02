import { useTheme } from "@mui/material";
import { tokens } from "../../theme";


const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
  <h1> dashboard</h1>
  );
};

export default Dashboard;