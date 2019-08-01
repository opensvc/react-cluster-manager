import React, { useState } from "react";

import { useStateValue } from '../state.js';
import { splitPath, createDataHasPathKey } from '../utils.js';
import { ResourceAdd } from "./ResourceAdd.jsx"
import { apiInstanceAction } from "../api.js"

import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
        fab: {
                marginTop: theme.spacing(2),
        },
}))

function ResourceAddButton(props) {
        const sp = splitPath(props.path)

        if (["vol", "svc"].indexOf(sp.kind) < 0) {
                return null
        }

	const [open, setOpen] = useState(false)
	const classes = useStyles()
	const [{}, dispatch] = useStateValue()
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
		var section = data.kind+"#"+data.keywords.sectionName
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
                apiInstanceAction("ANY", props.path, "set", _data, ($) => dispatch({
                        type: "parseApiResponse",
                        ok: ok,
                        data: $
                }))
		setData({
			kind: "",
			keywords: {}
		})
		handleClose()
	}

	return (
		<React.Fragment>
			<Fab
				color="primary"
				onClick={handleClick}
				className={classes.fab}
			>
				<AddIcon />
			</Fab>
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
