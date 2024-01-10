import { useState, useEffect } from "react";

function useAuthInfo(props) {
	const [authInfo, setAuthInfo] = useState()
	useEffect(() => {
		async function fetchData() {
			const res = await fetch('/authinfo')
			res
				.json()
				.then((data) => {
					console.log(data)
					setAuthInfo(data)
				})
				.catch((e) => {
					console.log(e)
				})
		}
		fetchData()
	}, [])
	return authInfo
}

export default useAuthInfo
