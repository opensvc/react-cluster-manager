import React, { useState } from "react";
import { useStateValue } from '../state.js';
import { Button } from 'reactstrap';
import { DeployEmpty } from "./DeployEmpty.jsx";
import { DeployClone } from "./DeployClone.jsx";
import { DeployCatalog } from "./DeployCatalog.jsx";
import { DeployTemplate } from "./DeployTemplate.jsx";

function DeployButton(props) {
	const [ {}, dispatch ] = useStateValue()
	function handleClick(e) {
		dispatch({
			type: "setNav",
			page: "Deploy",
			links: ["Objects", "Deploy"]
		})
	}
	return (
		<div className="dropright">
			<Button color="outline-secondary" type="button" onClick={handleClick}>Deploy</Button>
		</div>
	)
}

function Deploy(props) {
	const [tab, setTab] = useState("empty")
	var title
	if ((props.noTitle === undefined) || !props.noTitle) {
		title = (
			<h2>Deploy</h2>
		)
	}

	return (
		<div>
			{title}
			<nav>
				<div className="nav nav-tabs mb-3">
					<Tab active={tab} id="empty" text="Empty" setTab={setTab} />
					<Tab active={tab} id="clone" text="Clone" setTab={setTab} />
					<Tab active={tab} id="catalog" text="Catalog" setTab={setTab} />
					<Tab active={tab} id="template" text="Template" setTab={setTab} />
				</div>
			</nav>
			<div className="tab-content">
				<div className="tab-pane show active">
					<DeployCurrentTab
						tab={tab}
					/>
				</div>
			</div>
		</div>
	)
}

function Tab(props) {
	//
	// props.setTab
	// props.id
	// props.name
	// props.active
	//
	var cl = "nav-item nav-link"
	if (props.active == props.id) {
		cl += " active"
	} else {
		cl += " text-secondary"
	}
	return (
		<a className={cl} id={props.id} onClick={() => {props.setTab(props.id)}}>{props.text}</a>
	)
}

function DeployCurrentTab(props) {
	if (props.tab == "empty") {
		return ( <DeployEmpty /> )
	} else if (props.tab == "clone") {
		return ( <DeployClone /> )
	} else if (props.tab == "catalog") {
		return ( <DeployCatalog /> )
	} else if (props.tab == "template") {
		return ( <DeployTemplate /> )
	} else {
		return null
	}
}

export {
	Deploy,
	DeployButton
}
