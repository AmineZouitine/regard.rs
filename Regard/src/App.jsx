import { ColorModeContext, useMode } from "./theme";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Table from "./scenes/table";
import { QueryClient, QueryClientProvider } from "react-query";

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
                {/* <Dashboard /> */}
                <Table />
              </main>
            </div>
          </CssBaseline>
        </QueryClientProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
