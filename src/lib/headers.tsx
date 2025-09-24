import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { geolocation } from "@vercel/functions";

export const getLocation = createServerFn({
	method: "GET",
}).handler(() => {
	const request = getRequest();
	const location = geolocation(request);
	return location;
});
