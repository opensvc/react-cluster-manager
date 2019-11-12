import React, { useState, useEffect } from "react";

function useApiInfo(props) {
	const [apiInfo, setApiInfo] = useState()
	useEffect(() => {
		async function fetchData() {
			const res = await fetch('/api')
			res
				.json()
				.then((data) => {
					console.log(data)
					setApiInfo(data)
				})
				.catch(console.log)
		}
		fetchData()
	}, [])
	return apiInfo
}

export default useApiInfo
