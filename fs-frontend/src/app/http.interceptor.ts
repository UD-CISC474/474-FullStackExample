import { HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { LoginService } from "./services/login.service";
import { inject } from "@angular/core";

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
	// Inject the current `AuthService` and use it to get an authentication token:
	const authToken = inject(LoginService).token;
	// Clone the request to add the authentication header.
	if (authToken.length > 0) {
		const newReq = req.clone({
			headers: req.headers.append('Authorization', authToken),
		});
		return next(newReq);
	} else {
		return next(req);
	}
}