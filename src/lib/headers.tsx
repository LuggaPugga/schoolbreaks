import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import { geolocation } from "@vercel/functions";

export const getLocation = createServerFn({
	method: "GET",
}).handler(() => {
	const request = getWebRequest();
	const location = geolocation(request);
	return location;
});
