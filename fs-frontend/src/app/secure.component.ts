import { ReplaySubject } from "rxjs";
import { LoginService } from "./services/login.service";

export abstract class SecureComponent{
	get loggedIn():ReplaySubject<boolean>{
		return this._loginSvc.loggedIn;
	}
	constructor(protected _loginSvc:LoginService){
		this.setupClass(_loginSvc);
		_loginSvc.authorize();
	}
	private setupClass=(svc:LoginService)=>{
		svc.loggedIn.subscribe(this.onLoginChange);
	}

	protected abstract onLoginChange(loggedIn:boolean):void;
}