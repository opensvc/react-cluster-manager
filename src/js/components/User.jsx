import React from "react";
import { useStateValue } from '../state.js';

function User(props) {
	const [{ user }, dispatch] = useStateValue();
	if (!user) {
		return (
			<div>No user data</div>
		)
	}
	return (
		<div>
			<p>Authenticated via <strong>{user.auth}</strong>.</p>
			<p className="pt-3">Granted</p>
			<table className="table">
				<thead>
					<tr className="text-secondary">
						<td>Role</td>
						<td>Namespaces</td>
					</tr>
				</thead>
				<tbody>
					{Object.keys(user.grant).map((g) => (
						<GrantLine key={g} namespaces={user.grant[g]} role={g} />
					))}
				</tbody>
			</table>
		</div>
	)
}

function GrantLine(props) {
	if (!props.namespaces) {
		var ns = ""
	} else {
		var ns = props.namespaces.join(", ")
	}
	return (
		<tr>
			<td>{props.role}</td>
			<td>{ns}</td>
		</tr>
	)
}

export {
	User
}
