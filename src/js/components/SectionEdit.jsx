import React, { useState } from "react";

import { useReactOidc } from '@axa-fr/react-oidc-context'
import { splitPath, createDataHasPathKey } from '../utils.js';
import { ResourceAdd } from "./ResourceAdd.jsx"
import { apiInstanceAction } from "../api.js"
import useApiResponse from "../hooks/ApiResponse.jsx"

import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

import EditIcon from '@material-ui/icons/Edit';

const useStyles = makeStyles(theme => ({
        icon: {
                marginLeft: theme.spacing(1),
        },
}))

function SectionEdit(props) {
	const {path, rid, conf} = props
        const sp = splitPath(path)

        if (["vol", "svc"].indexOf(sp.kind) < 0) {
                return null
        }

	const { oidcUser } = useReactOidc()
	const [open, setOpen] = useState(false)
	const classes = useStyles()
	const { dispatchAlerts } = useApiResponse()
	const [data, setData] = useState(null)
	var sectionData = conf[rid]
	var kind = rid.split("#")[0]
	var sectionName = rid.split("#")[1]
	if (!sectionData) {
		return null
	}
	sectionData.sectionName = sectionName
	if (!data) {
		setData({
			kind: kind,
			keywords: sectionData,
		})
		return null
	}
        function handleClick(e) {
                e.stopPropagation()
		setData(false)
                setOpen(true)
        }
        function handleClose(e) {
		setData(false)
                setOpen(false)
        }
        function handleSubmit() {
		var kws = []
		if (["DEFAULT", "env", "data"].indexOf(data.kind) < 0) {
			var section = data.kind+"#"+data.keywords.sectionName
		} else {
			var section = data.kind
		}
		for (var k in data.keywords) {
			if (k == "sectionName") {
				continue
			}
			if (data.keywords[k] === undefined) {
				continue
			}
			kws.push(section+"."+k+"="+data.keywords[k])
		}
		var _data = {
			kw: kws,
		}
		var ok = "Resource " + data.keywords.sectionName + " added."
                apiInstanceAction("ANY", path, "set", _data, ($) => dispatchAlerts({
                        ok: ok,
                        data: $
                }), oidcUser)
		handleClose()
	}

	return (
		<React.Fragment>
			<EditIcon color="action" className={classes.icon} onClick={handleClick} />
                        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                                <DialogTitle id="form-dialog-title">Edit Resource {rid} of {path}</DialogTitle>
                                <DialogContent>
                                        <ResourceAdd path={path} data={data} setData={setData} />
                                </DialogContent>
                                <DialogActions>
                                        <Button onClick={handleClose} color="primary">
                                                Cancel
                                        </Button>
                                        <Button onClick={handleSubmit} color="secondary">
                                                Submit
                                        </Button>
                                </DialogActions>
                        </Dialog>
		</React.Fragment>
	)
}

export {
	SectionEdit,
}
