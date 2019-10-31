const baseUrl = window.location.protocol + "//" + window.location.host
const initData = {
	client_id: "ringfs",
	redirect_uri: baseUrl + "/authentication/callback",
	response_type: "id_token token",
	scope: "openid profile email",
	silent_redirect_uri: baseUrl + "/authentication/silent_callback",
	automaticSilentRenew: true,
	loadUserInfo: false,
	triggerAuthFlow: true,
	post_logout_redirect_uri: baseUrl + "/",
	authority: "",
}

function OidcConfiguration(authInfo) {
	if (!authInfo || authInfo.openid === undefined || authInfo.openid.well_known_uri === undefined) {
		return initData
	}
	return {
		...initData,
		authority: authInfo.openid.well_known_uri,
		client_id: authInfo.openid.client_id
	}
}

export default OidcConfiguration
