import React, { useRef, useState, useEffect } from "react";
import { useStateValue } from '../state.js'
import { useReactOidc } from '@axa-fr/react-oidc-context'
import { addAuthorizationHeader } from "../api.js";

const context = {}

function useUser(props) {
	const [{user, basicLogin, authChoice}, dispatch] = useStateValue()
	const { oidcUser } = useReactOidc()

	var auth = {
		"access_token": oidcUser ? oidcUser.access_token : null,
		"username": basicLogin.username,
		"password": basicLogin.password,
		"authChoice": authChoice,
	}
	function unloadUser() {
		context.isLoading = false
		context.auth = null
		context.error = null
		dispatch({
			type: "loadUser",
			data: {},
		})
	}

	useEffect(() => {
		async function fetchData() {
			if (context.isLoading) {
				return
			}
			if (context.auth && (context.auth.access_token == auth.access_token) && (context.auth.username == auth.username)) {
				return
			}
			context.isLoading = true
			context.auth = auth
			var headers = {
				"Accept": "application/json",
				"Content-Type": "application/json",
			}
			headers = addAuthorizationHeader(headers, auth)
			try {
				const fetcher = await fetch("/whoami", {
					headers: headers,
					method: "GET",
				})
				const data = await fetcher.json()
				console.log("I am", data)
				dispatch({
					type: "loadUser",
					data: data,
				})
			} catch (error) {
				context.auth = null
				context.error = error
			} finally {
				context.isLoading = false
			}
		}
		fetchData()
	})

	return {
		user: user,
		auth: auth,
		unloadUser: unloadUser,
	}
}

export default useUser
