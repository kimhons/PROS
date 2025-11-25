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
import AdminJobs from "./pages/admin/Jobs";
import AdminApplications from "./pages/admin/Applications";
import AdminContacts from "./pages/admin/Contacts";
import AdminSubscribers from "./pages/admin/Subscribers";
import AdminBlogManagement from "./pages/admin/BlogManagement";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";

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
      <Route path={"/admin/jobs"} component={AdminJobs} />
      <Route path={"/admin/applications"} component={AdminApplications} />
      <Route path={"/admin/contacts"} component={AdminContacts} />
      <Route path={"/admin/subscribers"} component={AdminSubscribers} />
      <Route path={"/admin/blog"} component={AdminBlogManagement} />
      <Route path={"/blog"} component={Blog} />
      <Route path={"/blog/:slug"} component={BlogPost} />
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
