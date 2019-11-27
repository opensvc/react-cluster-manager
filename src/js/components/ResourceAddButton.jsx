import React, { useState } from "react";

import useUser from "../hooks/User.jsx"
import { splitPath, createDataHasPathKey } from '../utils.js';
import { ResourceAdd } from "./ResourceAdd.jsx"
import { apiInstanceAction } from "../api.js"
import useApiResponse from "../hooks/ApiResponse.jsx"


import AddIcon from '@material-ui/icons/Add';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

function ResourceAddButton(props) {
        const sp = splitPath(props.path)

        if (["vol", "svc"].indexOf(sp.kind) < 0) {
                return null
        }

	const { auth } = useUser()
	const { dispatchAlerts } = useApiResponse()
	const [open, setOpen] = useState(false)
        const [data, setData] = useState({
		kind: "",
                keywords: {}
	})
        function handleClick(e) {
                e.stopPropagation()
                setOpen(true)
        }
        function handleClose(e) {
                setOpen(false)
        }
        function handleSubmit() {
		var kws = []
		if (data.keywords.sectionName) {
			var section = data.kind+"#"+data.keywords.sectionName
		} else {
			var section = data.kind
		}
		for (var k in data.keywords) {
			if (k == "sectionName") {
				continue
			}
			if (!data.keywords[k]) {
				continue
			}
			kws.push(section+"."+k+"="+data.keywords[k])
		}
		var _data = {
			kw: kws,
		}
		var ok = "Resource " + data.keywords.sectionName + " added."
                apiInstanceAction("ANY", props.path, "set", _data, ($) => dispatchAlerts({
                        ok: ok,
                        data: $
                }), auth)
		setData({
			kind: "",
			keywords: {}
		})
		handleClose()
	}

	return (
		<React.Fragment>
			<IconButton
				aria-label="Add Resource"
				aria-haspopup="true"
				onClick={handleClick}
			>
				<AddIcon />
			</IconButton>
                        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                                <DialogTitle id="form-dialog-title">Add Resource to {props.path}</DialogTitle>
                                <DialogContent>
                                        <ResourceAdd path={props.path} data={data} setData={setData} />
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
	ResourceAddButton,
}
