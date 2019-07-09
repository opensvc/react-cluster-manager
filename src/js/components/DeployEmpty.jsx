import React, { useState } from "react";
import { useStateValue } from '../state.js';
import { apiObjCreate } from "../api.js";
import { nameValid } from "../utils.js";
import { Form, Button, FormGroup, FormFeedback, Label, Input, } from 'reactstrap';
import { ObjKindSelector } from './ObjKindSelector.jsx';
import { NamespaceSelector } from './NamespaceSelector.jsx';

function DeployEmpty(props) {
	const [{}, dispatch] = useStateValue();
	const [kind, setKind] = useState("svc");
	const [namespace, setNamespace] = useState();
	const [name, setName] = useState();
	function createEmpty(e) {
		var path = [namespace, kind, name].join("/")
		var data = {
			namespace: namespace[0],
			provision: false,
			restore: true,
			data: {}
		}
		data.data[path] = {}
		apiObjCreate(data, (data) => dispatch({
			type: "parseApiResponse",
			ok: "Object " + path + " created",
			data: data
		}))
	}
	function handleObjKindClick(kind) {
		setKind(kind)
	}
	return (
		<Form>
			<p className="text-secondary">Deploy an empty service to a single node, to configure later.</p>
			<div className="dropdown-divider"></div>
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
				<Label for="kind">Kind</Label>
				<ObjKindSelector id="kind" value={kind} onClick={handleObjKindClick} />
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
			<Button color="primary" onClick={createEmpty}>Submit</Button>
		</Form>
	)
}

export {
	DeployEmpty
}
