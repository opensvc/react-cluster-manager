import React, { useState } from "react";
import { useStateValue } from '../state.js';
import { apiPostAny, apiObjGetConfig, apiObjCreate } from "../api.js";
import { nameValid } from "../utils.js";
import { Form, Button, FormGroup, FormFeedback, Label, Input } from 'reactstrap';
import { NamespaceSelector } from "./NamespaceSelector.jsx"

function DeployClone(props) {
	const [{}, dispatch] = useStateValue()
	const [srcPath, setSrcPath] = useState()
	const [namespace, setNamespace] = useState()
	const [name, setName] = useState()

	function createClone(e) {
		var path = [namespace, "svc", name].join("/")
		var data = {
			namespace: namespace[0],
			provision: true,
			restore: false,
			data: {}
		}
		apiObjGetConfig({path: srcPath, format: "json"}, (cdata) => {
			if ("metadata" in cdata) {
				delete cdata["metadata"]
			}
			data.data[path] = cdata
			apiObjCreate(data, (data) => dispatch({
				type: "parseApiResponse",
				ok: "Object " + path + " cloned",
				data: data
			}))
		})
	}
	return (
		<Form>
			<p className="text-secondary">Deploy a service as a clone of another existing service. Beware if you have root privileges, cloning a service with fs or disk resources that were not designed for cloning might cause conflicts, source data corruption, end-user service disruption.</p>
			<div className="dropdown-divider"></div>
			<FormGroup>
				<Label for="srcpath">Path of the object to clone</Label>
				<Input
					id="srcpath"
					placeholder="test"
					onChange={(e) => setSrcPath(e.target.value)}
					autoComplete="off"
				/>
			</FormGroup>
			<FormGroup>
				<Label for="namespace">Namespace</Label>
				<NamespaceSelector
					id="namespace"
					role="admin"
					placeholder="test"
					onChange={($) => setNamespace($)}
					selected={namespace}
				/>
				<FormFeedback>Must start with an aplha and continue with aplhanum, dot, underscore or hyphen.</FormFeedback>
			</FormGroup>
			<FormGroup>
				<Label for="name">Name</Label>
				<Input
					id="name"
					placeholder="mysvc1"
					onChange={(e) => setName(e.target.value)}
					valid={nameValid(name)}
					invalid={!nameValid(name)}
					autoComplete="off"
				/>
				<FormFeedback>Must start with an aplha and continue with aplhanum, dot, underscore or hyphen.</FormFeedback>
			</FormGroup>
			<Button color="primary" onClick={createClone}>Submit</Button>
		</Form>
	)
}


export {
	DeployClone
}
