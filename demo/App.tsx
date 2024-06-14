import { createRoot } from "react-dom/client";
import "./App.css";
import { RouterProvider } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";
import Home from "./routes/Home.js";
import Modal from "./routes/Modal.js";
import { useSetLandingRoute } from "../lib/index.js";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Home />,
		children: [
			{
				path: "modal",
				element: <Modal />,
				children: [
					{
						path: "page1",
						element: <div>Page 1 content</div>,
					},
					{
						path: "page2",
						element: <div>Page 2 content</div>,
					},
					{
						path: "page3",
						element: <div>Page 3 content</div>,
					},
				],
			},
		],
	},
]);

function App() {
	return <RouterProvider router={router} />;
}

const root = document.getElementById("root");

if (!root) throw new Error("Failed to find the root element");

createRoot(root).render(<App />);

