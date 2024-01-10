import React, { useState } from "react";
import { useTranslation } from "react-i18next"
import useUser from "../hooks/User.jsx"
import { useStateValue } from "../state.js"
import { splitPath } from '../utils.js';
import { ResourceAdd } from "./ResourceAdd.jsx"
import { apiInstanceAction } from "../api.js"
import useApiResponse from "../hooks/ApiResponse.jsx"


import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from "@mui/material/Tooltip"

function ResourceAddButton(props) {
        const sp = splitPath(props.path)
	const { auth } = useUser()
	const { t } = useTranslation()
	const [{ user }, dispatch] = useStateValue()
	const { dispatchAlerts } = useApiResponse()
	const [open, setOpen] = useState(false)
        const [data, setData] = useState({
		kind: "",
                keywords: {}
	})

        if (["vol", "svc"].indexOf(sp.kind) < 0) {
                return null
        }
	if (!user.grant) {
		return null
	}
	if (!("root" in user.grant) && (user.grant.admin.indexOf(sp.namespace) < 0)) {
		return null
	}

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
			<Tooltip title={t("Add Resource")}>
				<IconButton
					aria-label="Add Resource"
					aria-haspopup="true"
					onClick={handleClick}
				>
					<AddIcon />
				</IconButton>
			</Tooltip>
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
