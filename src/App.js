import React, { useEffect, useState } from "react";
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import Mysidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Templates from "./scenes/templates";
import TemplateForm from "./scenes/templates/TemplateForm";
import Constraints from "./scenes/constraints";
import ConstraintForm from "./scenes/constraints/ConstraintForm";
import Login from "./scenes/login";
import { useNavigate } from "react-router-dom";


function App() {
  const [Theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const navigate = useNavigate();


  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={Theme}>
        <CssBaseline />

        <div className="flex relative  h-screen ">
          <Mysidebar isSidebar={isSidebar} />

          <main className="h-full w-full ">
            <Routes>
              <Route path="/frontend" element={<Dashboard />} />
              <Route path="/frontend/login" element={<Login />} />

              <Route path="/frontend/templates" element={<Templates />} />
              <Route path="/frontend/templates/create" element={<TemplateForm />} />
              <Route path="/frontend/constraints" element={<Constraints />} />
              <Route path="/frontend/constraints/create" element={<ConstraintForm />} />
            </Routes>

          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
