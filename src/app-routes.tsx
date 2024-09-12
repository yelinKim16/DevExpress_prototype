import {
  HomePage,
  TasksPage,
  ProfilePage,
  VisitorManagement,
  AccessStructure,
  AccessCount,
  CompanyPage,
  // VisitorCount,
} from "./pages";
import { withNavigationWatcher } from "./contexts/navigation";

const routes = [
  {
    path: "/tasks",
    element: TasksPage,
  },
  {
    path: "/profile",
    element: ProfilePage,
  },
  {
    path: "/visitor-management",
    element: VisitorManagement,
  },
  {
    path: "/home",
    element: HomePage,
  },
  {
    path: "/access-structure",
    element: AccessStructure,
  },
  {
    path: "/visitor-count",
    element: AccessStructure,
  },
  {
    path: "/access-count",
    element: AccessCount,
  },
  {
    path: "/company",
    element: CompanyPage,
  },
];

export default routes.map((route) => {
  return {
    ...route,
    element: withNavigationWatcher(route.element, route.path),
  };
});
