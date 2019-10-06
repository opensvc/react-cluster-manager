import React, { useState } from "react";
import { useStateValue } from '../state.js';
import { makeStyles } from '@material-ui/core/styles';
import { ObjAvail } from "./ObjAvail.jsx"
import { splitPath } from "../utils.js";

const useStyles = makeStyles(theme => ({
        flex: {
                display: "flex",
                flexWrap: "wrap",
        },
}))

function SvcMap(props) {
        const [{ cstat }, dispatch] = useStateValue();
	const classes = useStyles()
        if (cstat.monitor === undefined) {
                return null
        }

	var svcs = []
	var paths = Object.keys(cstat.monitor.services)
	paths.sort()
	for (var path of paths) {
		var sp = splitPath(path)
		if (sp.kind != "svc") {
			continue
		}
		svcs.push({...cstat.monitor.services[path], path: path})
	}
        const handleClick = path => event => {
		event.stopPropagation()
                dispatch({
                        type: "setNav",
                        page: "Services",
                        links: ["Services", path]
                })
        }

	return (
		<div className={classes.flex}>
			{svcs.map((data, i) => (
				<div key={i} className={classes.item} onClick={handleClick(data.path)}>
					<ObjAvail avail={data.avail} overall={data.overall} />
				</div>
			))}
		</div>
	)
}

export {
	SvcMap,
}
