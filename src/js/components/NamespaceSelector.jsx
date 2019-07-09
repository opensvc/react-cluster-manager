import React, { useState } from "react";
import { useStateValue } from '../state.js';
import { namespaceValid, splitPath } from '../utils.js';
import { Typeahead } from 'react-bootstrap-typeahead';

function getRoleNamespaces(user, role) {
	if (user.grant === undefined) {
		return []
	}
	if (!(role in user.grant)) {
		return []
	}
	var namespaces = [].concat(user.grant[role])
	namespaces.sort()
	return namespaces
}

function getAllNamespaces(cstat) {
	var namespaces = []
	for (var path in cstat.monitor.services) {
		var sp = splitPath(path)
		if (namespaces.indexOf(sp.namespace) >= 0) {
			continue
		}
		namespaces.push(sp.namespace)
	}
	namespaces.sort()
	return namespaces
}

function isSquatter(user) {
	return "squatter" in user.grant
}

function NamespaceSelector(props) {
	const [{ cstat, user }, dispatch] = useStateValue()
	var namespaces = []
	if (props.role) {
		namespaces = getRoleNamespaces(user, props.role)
	} else {
		namespaces = getNamespaces(cstat)
	}

	return (
		<Typeahead
			id={props.id}
			placeholder={props.placeholder}
			selected={props.selected}
			options={namespaces}
			onChange={props.onChange}
			className="flex-grow-1"
			allowNew={isSquatter(user)}
			newSelectionPrefix="Add a new namespace: "
			invalid={!namespaceValid(props.selected)}
			valid={namespaceValid(props.selected)}
		/>
	)
}

export {
	NamespaceSelector
}
