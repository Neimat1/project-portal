# Notes:

## 1. Why the HOCs must be applied at module level, and what breaks if they are created inside a component?

Every time the App component is rendered this will cause the call to hoc will create new componement function.
Recat treat it as a different component type and that can resst it's state in component tree. (ex. withAuth we are using in the project). So, creating in module level is better like this

```
    const ProtectedDashboardLayout = withAuth(DashboardLayout);
    export default function App() {
        return (
            <Routes>
            <Route element={<RootLayout />}>

                <Route path="dashboard" element={<ProtectedDashboardLayout />}>
                <Route index element={<OverviewPage />} />
                </Route>
                <Route path="*" element={<NotFoundPage />} />
            </Route>
            </Routes>
        );
    }

```

## 2. How your withLoading types keep isLoading from reaching the wrapped component?

I used a generic type P to represent the original component's props. The wrapper accepts these props along with an additional isLoading boolean.

Using object destructuring, I separate isLoading from the remaining props. The HOC uses isLoading to display the loading indicator, while only the remaining props are passed to the wrapped component. The implementation assumes the original component does not itself require an isLoading prop.

```
export function withLoading<P extends object>(Component: ComponentType<P>) {
  function WithLoading({ isLoading, ...componentProps }: P & LoadingProps) {
    if (isLoading) {
      return <p role="status">Loading...</p>;
    }

    return <Component {...(componentProps as P)} />;
  }

  WithLoading.displayName = `withLoading(${Component.displayName || Component.name || "Component"})`;
  return WithLoading;
}
```

so in component I mainly should pass as P

```
<Component {...(componentProps as P)} />
```

## 3. How returning to the originally requested page after login works, step by step?

When a signed-out user tries to access a protected page, withAuth redirects them to /login and stores their original location in React Router's navigation state.

```
    if (!user) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }
```

After successful authentication, the Login page reads the stored location and navigates back to it. If the user opened Login directly, the default destination is /dashboard. This allows users to continue where they originally intended to go.

```
    let redirectTo = "/dashboard";

    await login(username);
    navigate(redirectTo, { replace: true });
```

## 4. One thing you would change with more time.

Fetching the project details as this is used in 2 files for projects list page and overview page, from UI prespective I think it's need to serve the usability concept a little bit more.

And I would say more practice will make me do it better or undersatnd what I need to focus more one.
