# useBackNavigation()

A hook used in react-router apps that solves common problems:

## Problem 1

- Your web app has modals (under urls) which open and have the ability to be closed by an X or similar
- Your modals also have sub-routes/sub-pages which the user can navigate through, pushing to the history stack
- When you click the X, you want to close the entire modal and go back to where you opened it from, regardless of where you navigated to since opening it

```tsx
function MyModal() {
    const { backUrl } = useBackNavigation();

    return (
        <dialog>
            <h1>My Modal</h1>
            <nav>
            <ul>
                <li><Link to="modal/sub-route">Sub-Route</Link></li>
                <li><Link to="modal/sub-route-2">Sub-Route 2</Link></li>
            </ul>
            </nav>
            {/* This will never change while the modal is mounted. */}
            <Link to={backUrl}>Close</Link>
        </dialog>
    );
}

function Dashboard() {
    const { createBackUrlState } = useBackNavigation();
    return (
        <div>
            <h1>Dashboard</h1>
            <Link to="modal-route" state={createBackUrlState()}>Open Modal</Link>
        </div>
    );
}
```


1. `useBackNavigation()` is used in the modal component that we want to open.
1.  Entrypoints to said modal (links, buttons, `useNavigate` etc) use `useBackNavigation()` to push to `location.state` when they navigate i.e `<Link to="modal/route" state={createBackUrlState()}>Open Modal</Link>`
1. `useBackNavigation()` in point 1 sets the `backUrl` from `location.state` that was pushed in 2 and can now build functions that will navigate to that `backUrl` when triggered.
1. Closing X in the modal has something like `<Link to={backUrl}>Close</Link>`



## Problem 2

- A user lands at your app on a modal with a closing X
- We have no previous in-app route to go back to, so we just want to go back to the root of the app

```tsx
function MyModal() {
    const { backUrl } = useBackNavigation();

    return (
        <dialog>
            <h1>My Modal</h1>
            <Link to={backUrl ?? '/'}>Close</Link>
        </dialog>
    );
}
```

1. if `backUrl` is undefined, we want can fallback to a desired route.

## Problem 3

- When a user clicks to go back, i.e on a "back arrow" in a header of some sort
- You want to go back to the previous route that was in the URL bar before they clicked the back arrow
- However, it might be that they landed on said route from somewhere outside the app
- We don't want to send the user back outside the app
- If we detect that a route is a "landing route" by using the `useSetLandingRoute` we can detect this and act accordingly.
- When the user clicks back we can do the following:
  - Is it a landing route? Go to the root of the app
  - Do we have a backUrl in the state? Go to that route
  - Otherwise, `navigate(-1)` on the browser history

```tsx
function AppRoot() {
    useSetLandingRoute();

    return <AppRoutes />
}

function SomePageWithBackArrow() {
    const { onBack } = useBackNavigation();

    return (
        <header>
            <button type="button" onClick={onBack}>Back</button>
            <p>content...</p>
        </header>
    );
}
```
