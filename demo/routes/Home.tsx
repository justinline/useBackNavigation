import { Link, Outlet } from "react-router-dom";
import useBackNavigation, { useSetLandingRoute } from "../../lib/index.js";

export default function Home() {
	useSetLandingRoute();

	const { createBackUrlState } = useBackNavigation();
	return (
		<div>
			<h1>Hello, world!</h1>
			<p>
				This is a small demo for <code>useBackNavigation</code>
			</p>
			<p>
				<Link to="/modal" state={createBackUrlState()}>
					Open Modal which will return here on close.
				</Link>
			</p>
			<Outlet />
		</div>
	);
}
