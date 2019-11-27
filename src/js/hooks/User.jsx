import React, { useState, useEffect } from "react";
import { useStateValue } from '../state.js'
import { useReactOidc } from '@axa-fr/react-oidc-context'
import { apiWhoAmI } from "../api.js";

function useUser(props) {
	const [{user, basicLogin}, dispatch] = useStateValue()
	const { oidcUser } = useReactOidc()

	var auth = {
		"access_token": oidcUser ? oidcUser.access_token : null,
		"username": basicLogin.username,
		"password": basicLogin.password,
	}
        function loadUser() {
                apiWhoAmI(data => {
                        console.log("I am", data)
                        dispatch({
                                type: "loadUser",
                                data: data
                        })
                }, auth)
        }
	function unloadUser() {
		dispatch({
			type: "loadUser",
			data: null,
		})
	}

	useEffect(() => {
		loadUser()
	}, [auth.access_token, auth.username])

	return {
		user: user,
		auth: auth,
		loadUser: loadUser,
		unloadUser: unloadUser,
	}
}

export default useUser
