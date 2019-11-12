import React, { useState, useEffect } from "react";
import { useStateValue } from '../state.js'
import { useReactOidc } from '@axa-fr/react-oidc-context'
import { apiWhoAmI } from "../api.js";

function useUser(props) {
	const [{user}, dispatch] = useStateValue()
	const { oidcUser } = useReactOidc()

        function loadUser() {
                apiWhoAmI(data => {
                        console.log("I am", data)
                        dispatch({
                                type: "loadUser",
                                data: data
                        })
                }, oidcUser)
        }
	function unloadUser() {
		dispatch({
			type: "loadUser",
			data: null,
		})
	}

	useEffect(() => {
		loadUser()
	}, [])

	return {
		user: user,
		loadUser: loadUser,
		unloadUser: unloadUser,
	}
}

export default useUser
