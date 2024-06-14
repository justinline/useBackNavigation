import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const landingRouteStateKey = "landingRoute";
const landingRouteState = { [landingRouteStateKey]: true };

/** Needs to go in the root of your app */
export function useSetLandingRoute() {
	const location = useLocation();
	const navigate = useNavigate();

	const setLandingRoute = () => {
		navigate(location.pathname, { state: landingRouteState, replace: true });
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: on mount only
	useEffect(() => {
		setLandingRoute();
	}, []);

	return null;
}

const getLandingRouteKeyFromState = (
	state: ReturnType<typeof useLocation>["state"],
):
	| { success: true; data: { [landingRouteStateKey]: boolean } }
	| { success: false; data: undefined } => {
	if (
		typeof state === "object" &&
		state !== null &&
		typeof state[landingRouteStateKey] === "boolean"
	) {
		return {
			success: true,
			data: { [landingRouteStateKey]: state[landingRouteStateKey] },
		};
	}

	return { success: false, data: undefined };
};

const getBackUrlFromState = (
	state: ReturnType<typeof useLocation>["state"],
):
	| { success: true; data: { backUrl: string } }
	| { success: false; data: undefined } => {
	if (
		typeof state === "object" &&
		state !== null &&
		typeof state.backUrl === "string"
	) {
		return { success: true, data: { backUrl: state.backUrl } };
	}

	return { success: false, data: undefined };
};

/**
 * Is this the first route the user landed on? We need to know in order to correctly
 * navigate back one page or to a specific page.
 *
 * i.e user lands on /profile/:id -> mark as landing route -> when going back, navigate to /, because -1
 * would send them elsewhere on the internet.
 */
const isLandingRoute = (location: ReturnType<typeof useLocation>) => {
	const state = getLandingRouteKeyFromState(location.state);

	if (!state.success) return false;

	return state.data[landingRouteStateKey] === true;
};

/**
 * Hook to manage back navigation by storing the current location in the state.
 * This is useful for cases where you want to navigate back to the previous page,
 * but you don't want to use the browser's back button.
 *
 * @example using the backUrl state to navigate back
 * const { onBack, backUrl } = useBackNavigation();
 *
 * return <button onClick={onBack}>Go back to {backUrl}</button>;
 *
 * @example navigation
 * const { navigateWithBackUrl, createBackUrlState } = useBackNavigation();
 *
 * const onClick = () => navigateWithBackUrl('/some-page');
 *
 * return <Link to="/some-page" state={createBackUrlState()}>Go to some page</Link>;
 */
const useBackNavigation = () => {
	const location = useLocation();
	const navigate = useNavigate();

	const result = getBackUrlFromState(location.state);

	const [backUrl] = useState<string | undefined>(
		result.success ? result.data.backUrl : undefined,
	);

	const createBackUrlState = () => ({ backUrl: location.pathname });

	const navigateUpOnePath = () => {
		const pathParts = location.pathname.split("/");

		pathParts.pop();
		const newPath = pathParts.join("/");

		navigate(newPath);
	};

	const handleOnBack = () => {
		if (backUrl !== undefined) navigate(backUrl);
		else if (isLandingRoute(location)) navigate("/");
		else navigate(-1);
	};

	return {
		onBack: handleOnBack,
		backUrl,
		navigateWithBackUrl: (url: string) =>
			navigate(url, { state: createBackUrlState() }),
		navigateUpOnePath,
		/** For use with <Link to={url} state={backUrlState} /> */
		createBackUrlState,
	};
};

export { isLandingRoute, landingRouteState, landingRouteStateKey };
export default useBackNavigation;
