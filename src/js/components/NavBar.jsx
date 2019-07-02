'use strict';

//import PropTypes from "prop-types";
import React from "react";
import { useStateValue } from '../state.js';
import { state } from "../utils.js";
import { clusterIssue } from "../issues.js";

function NavBar(props) {
	const [{ cstat, nav }, dispatch] = useStateValue();
	if (!cstat) {
		return null
	}
	return (
		<div className="navbar navbar-light px-0">
			<div className="h2">
				<NavLinks links={nav.links} />
			</div>
		</div>
	)
}

function NavLink(props) {
	const [{}, dispatch] = useStateValue();
	function handleClick(e) {
		var i = props.links.indexOf(props.link)
		dispatch({
			type: "setNav",
			page: props.links[i],
			links: props.links.slice(0, i+1)
		})
	}
	return (
		<div>&nbsp;&gt;&nbsp;<a href="#" className="text-dark" onClick={handleClick}>{props.link}</a></div>
	)
}

function UserLink(props) {
	const [{ user }, dispatch] = useStateValue();
	function handleClick(e) {
		dispatch({
			type: "setNav",
			page: "User",
			links: []
		})
	}
	return (
		<a href="#" className="text-dark" onClick={handleClick}>{user.name}</a>
	)
}

function NavLinks(props) {
	return (
		<div className="d-inline-flex flex-wrap">
			<UserLink />
			&nbsp;@&nbsp;
			<ClusterName />
			{Object.keys(props.links).map((l) => (
				<NavLink key={l} link={props.links[l]} links={props.links} />
			))}
		</div>
	)
}

function ClusterName(props) {
	const [{ cstat }, dispatch] = useStateValue();
	if (!cstat.cluster) {
		return null
	}
	var clissue = clusterIssue(cstat)
	if (clissue == state.OPTIMAL) {
		var cl = "text-dark"
	} else {
		var cl = "text-" + clissue.color
	}
	function handleClick(e) {
		dispatch({
			type: "setNav",
			page: "Cluster",
			links: []
		})
	}
	return (
		<a href="#" className={cl} onClick={handleClick}>{cstat.cluster.name}</a>
	)
}

export {
	NavBar
}
