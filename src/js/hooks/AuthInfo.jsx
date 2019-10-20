import React, { useState } from "react";

function useAuthInfo(props) {
	const [authInfo, setAuthInfo] = useState()
	if (authInfo) {
		return authInfo
	}
	fetch('/authinfo')
		.then(res => res.json())
		.then((data) => {
			console.log(data)
			setAuthInfo(data)
		})
		.catch(console.log)
	return authInfo
}

export default useAuthInfo
