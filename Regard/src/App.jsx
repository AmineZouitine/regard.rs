import { ColorModeContext, useMode } from "./theme";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Watchers from "./scenes/watchers";
import { QueryClient, QueryClientProvider } from "react-query";
import { Routes, Route } from "react-router-dom";
import Calendar from "./scenes/calendar";
import Dashboard from "./scenes/dashboard";

const queryClient = new QueryClient();
function App() {
  const [theme, colorMode] = useMode();
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <CssBaseline>
            <div className="app">
              <Sidebar />
              <main className="content">
                <Topbar />
                <Routes>
                  <Route path={"/"} element={<Dashboard />} />
                  <Route path={"/calendar"} element={<Calendar />} />
                  <Route path={"/watchers"} element={<Watchers />} />
                </Routes>
              </main>
            </div>
          </CssBaseline>
        </QueryClientProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
