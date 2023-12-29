import {
  Outlet,
  RouterProvider,
  Link,
  Route,
  ErrorComponent,
  Router,
  RootRoute,
  ErrorRouteProps,
  NotFoundRoute,
  useRouter,
  useNavigate,
  createMemoryHistory,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { useLayoutEffect } from "react";

const rootRoute = new RootRoute({
  component: NestedComponent,
});

function NestedComponent() {
  const router = useRouter();
  const navigate = useNavigate();
  useLayoutEffect(() => {
    const unsubscribe = router.history.subscribe((location) => {
      console.log("location", location);
    });
    return () => {
      unsubscribe();
    };
  });
  return (
    <>
      <div className="p-2 flex gap-2 text-lg">
        <Link
          to="/"
          activeProps={{
            className: "font-bold",
          }}
          activeOptions={{ exact: true }}
        >
          Home
        </Link>{" "}
        <Link
          to={"/posts"}
          activeProps={{
            className: "font-bold",
          }}
        >
          Posts
        </Link>
        <Link
          to={"/target"}
          activeProps={{
            className: "font-bold",
          }}
        >
          Target
        </Link>
        <div
          onClick={() => {
            router.history.back();
          }}
        >
          back
        </div>
        <div
          onClick={() => {
            router.history.forward();
          }}
        >
          forward
        </div>
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}
const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: IndexComponent,
});

function IndexComponent() {
  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
    </div>
  );
}

export const postsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "posts",
  component: () => {
    return (
      <div className="p-2">
        <h3>Posts</h3>
        <Link to={targetRoute.id}>Navigate to target</Link>
      </div>
    );
  },
});

export const targetRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "target",
  component: () => (
    <div className="p-2">
      <h3>Target</h3>
    </div>
  ),
});

const notFoundRoute = new NotFoundRoute({
  getParentRoute: () => rootRoute,
  component: NotFound,
});

function NotFound() {
  return (
    <div className="p-2">
      <h3>404 - Not Found</h3>
    </div>
  );
}

const routeTree = rootRoute.addChildren([postsRoute, targetRoute, indexRoute]);

// Set up a Router instance
export const nestedRouter = new Router({
  routeTree,
  notFoundRoute,
  defaultPreload: "intent",
  history: createMemoryHistory({ initialEntries: ["/"] }),
});
