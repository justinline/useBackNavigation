import { Link, Outlet } from "react-router-dom";
import useBackNavigation from "../../lib/index.js";
import styles from "./Modal.module.css";

export default function Modal() {
	const { backUrl, onBack } = useBackNavigation();

	return (
		<dialog open className={styles.Modal}>
			<main>
				<code>backurl: {backUrl ?? "undefined"}</code>
				<p>
					This content is in a modal! Navigate through the sub-pages and you'll
					notice that the back url doesn't change while the modal stays open.
				</p>
				<ul>
					<li>
						If you clicked here from the link on the homepage that used
						`createBackUrlState()`, you'll get a `backUrl` from where you opened
						it. You can click the link in the bottom right to return there at
						any time, no matter how far you navigated
					</li>
					<li>
						If you reload on a sub-page, the `onBack()` function will work out
						that you navigated here directly and onBack will send you to the
						root of the app when triggered
					</li>
					<li>
						If you navigate to a sub-page after reloading, the onback will go
						back
					</li>
				</ul>
				<nav>
					<Link to="page1">Page 1</Link>
					<Link to="page2">Page 2</Link>
					<Link to="page3">Page 3</Link>
				</nav>

				<h2>Sub-route content:</h2>
				<section className={styles.ModalContent}>
					<Outlet />
				</section>
			</main>
			<div className={styles.ModalFooter}>
				<button type="button" onClick={onBack}>
					&lt; onBack functionality
				</button>
				{backUrl && <Link to={backUrl}>Back url as link</Link>}
			</div>
		</dialog>
	);
}
