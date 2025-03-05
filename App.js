import Nav from "./components/Nav.js";
import NewsList from "./components/NewsList.js";

document.addEventListener("DOMContentLoaded", () => {
	const root = document.getElementById("root");

	root.appendChild(Nav());
	root.appendChild(NewsList());
});
