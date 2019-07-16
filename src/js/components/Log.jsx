import React, {useState, useEffect} from "react";
import { Spinner } from "reactstrap"
import { useLog } from "../hooks/Log.jsx"
import { Input, FormGroup, Label } from 'reactstrap';

function Log(props) {
	const log = useLog(props.url)
	const [search, setSearch] = useState("")
	const [skip, setSkip] = useState()

	if (props.noTitle) {
		var title = null
	} else {
		var title = ( <h3>Logs</h3> )
	}
	function handleChange(e) {
		setSearch(e.target.value)
		location.href = "#"
		setSkip(null)
	}
	useEffect(() => {
		if (skip && (!location.href.match(RegExp("#"+skip+"$")))) {
			location.href = "#"+skip
		}
	})
	return (
		<div className="pb-3">
			{title}
			<FormGroup>
				<Label for="search">Filter</Label>
				<Input id="search" placeholder="RegExp" onChange={handleChange} value={search} />
			</FormGroup>
			<LogLines
				log={log}
				search={search}
				setSearch={setSearch}
				setSkip={setSkip}
			/>
		</div>
	)
}

function LogLines(props) {
	if (!props.log) {
		return ( <Spinner type="grow" color="primary" size="sm" /> )
	}
	if (props.search && (props.search.length>1)) {
		var re = RegExp(props.search, "i")
	} else {
		var re
	}
	return (
		<div className="d-flex flex-column-reverse text-break">
			{props.log.map((line, i) => (
				<LogLine
					key={i}
					id={i}
					data={line}
					re={re}
					setSearch={props.setSearch}
					setSkip={props.setSkip}
				/>
			))}
		</div>
	)	
}

function LogLine(props) {
	var l = props.data.split(" - ")
	var cl = "border-left-4 p-1 pl-2 clickable "
	if (l[2] == "INFO") {
	} else if (l[2] == "WARNING") {
		cl += "border-warning"
	} else if (l[2] == "ERROR") {
		cl += "border-danger"
	} else if (l[2] == "DEBUG") {
		cl += "border-muted"
	}
	if (props.re && !props.data.match(props.re)) {
		return null
	}

	function handleClick(e) {
		props.setSearch("")
		props.setSkip(props.id)
	}
	return (
		<div className={cl} id={props.id} onClick={handleClick}>
			<div className="text-secondary small">{l[0]} - {l[1]}</div>
			<div>{l.slice(3).join(" - ")}</div>
		</div>
	)
}

export {
	Log
}
