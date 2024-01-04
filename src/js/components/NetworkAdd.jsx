import React, { useState } from "react";
import { useTranslation } from "react-i18next"

import useUser from "../hooks/User.jsx"
import { apiInstanceAction } from "../api.js"
import { useKeywords } from "../hooks/Keywords.jsx"
import { SectionForm } from "./SectionForm.jsx"
import { useStateValue } from '../state.js';
import useApiResponse from "../hooks/ApiResponse.jsx"

import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Tooltip from "@mui/material/Tooltip"

import AddIcon from '@mui/icons-material/Add';

function NetworkAdd(props) {
	const {path} = props
	const { auth } = useUser()
	const { t } = useTranslation()
	const [open, setOpen] = React.useState(false)
	const [data, setData] = useState({})
	const kws = useKeywords("ccfg")
	const [{user}, dispatch] = useStateValue()
	if (!user.grant) {
		return null
	}
	if (!("root" in user.grant)) {
		return null
	}
	if (!kws) {
		return null
	}
        function handleClickOpen(e) {
                e.stopPropagation()
                setOpen(true)
        }
        function handleClose(e) {
                setOpen(false)
        }
	function handleSubmit(e) {
		var kw = []
		for (var k in data) {
			if (k == "sectionName") {
				continue
			}
			if (!data[k]) {
				continue
			}
			var _kw = "network#"+data.sectionName+"."+k+"="+data[k]
			kw.push(_kw)
		}
		console.log("SUBMIT", data.sectionName, data.type, data, "=>", kw)
		apiInstanceAction("ANY", "cluster", "set", {kw: kw}, (data) => dispatchAlerts({data: data}), auth)
		handleClose(e)
	}
	return (
		<React.Fragment>
			<Tooltip title={t("Add Network")}>
				<IconButton
					aria-label="Add Network"
					aria-haspopup={true}
					onClick={handleClickOpen}
				>
					<AddIcon />
				</IconButton>
			</Tooltip>
			<Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
				<DialogTitle id="form-dialog-title">Create New Network</DialogTitle>
				<DialogContent>
					<DialogContentText>
						A network hosts dynamically allocated ip addresses for ip.cni resources.
						The <code>bridge</code> types is node-local, the <code>routed_bridge</code>
						and <code>weave</code> types are cluster-wide.
					</DialogContentText>
					<SectionForm kind="Network" kws={kws.network} data={data} setData={setData} />
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
	NetworkAdd,
}
