import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Careers from "./pages/Careers";
import Services from "./pages/Services";
import About from "./pages/About";
import Government from "./pages/Government";
import Newsletter from "./pages/Newsletter";
import Tools from "./pages/Tools";
import StaffingCalculator from "./pages/StaffingCalculator";
import BEDCalculator from "./pages/BEDCalculator";
import ProtocolLibrary from "./pages/ProtocolLibrary";
import QAChecklistGenerator from "./pages/QAChecklistGenerator";
import ResourceAggregator from "./pages/ResourceAggregator";
import Contact from "./pages/Contact";
import JobDetail from "./pages/JobDetail";
import AdminDashboard from "./pages/admin/Dashboard";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/about"} component={About} />
      <Route path={"/services"} component={Services} />
      <Route path={"/government"} component={Government} />
      <Route path={"/newsletter"} component={Newsletter} />
      <Route path={"/tools"} component={Tools} />
      <Route path={"/tools/staffing-calculator"} component={StaffingCalculator} />
      <Route path={"/tools/bed-calculator"} component={BEDCalculator} />
      <Route path={"/tools/protocol-library"} component={ProtocolLibrary} />
      <Route path={"/tools/qa-checklist"} component={QAChecklistGenerator} />
      <Route path={"/tools/resources"} component={ResourceAggregator} />
      <Route path={"/careers"} component={Careers} />
      <Route path={"/careers/:id"} component={JobDetail} />
      <Route path={"/admin"} component={AdminDashboard} />
      <Route path={"/contact"} component={Contact} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
