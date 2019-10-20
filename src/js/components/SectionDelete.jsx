import React, { useState } from "react";

import { useReactOidc } from '@axa-fr/react-oidc-context'
import { useTranslation } from 'react-i18next';
import { useStateValue } from '../state.js';
import { splitPath, createDataHasPathKey } from '../utils.js';
import { apiInstanceAction } from "../api.js"

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

function SectionDelete(props) {
	const {path, rid} = props
        const sp = splitPath(path)

        if (["vol", "svc"].indexOf(sp.kind) < 0) {
                return null
        }

	const { oidcUser } = useReactOidc()
	const [open, setOpen] = useState(false)
	const { t, i18n } = useTranslation()
	const [{}, dispatch] = useStateValue()
        function handleClick(e) {
                e.stopPropagation()
                setOpen(true)
        }
        function handleClose(e) {
                setOpen(false)
        }
        function handleSubmit() {
		var _data = {
			rid: rid,
		}
		var ok = "Resource " + rid + " deleted."
                apiInstanceAction("ANY", path, "delete", _data, ($) => dispatch({
                        type: "parseApiResponse",
                        ok: ok,
                        data: $
                }), oidcUser)
		handleClose()
	}

	return (
		<React.Fragment>
			<DeleteForeverIcon color="action" onClick={handleClick} />
                        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                                <DialogTitle id="form-dialog-title">
					{t("Delete section {{rid}} of {{path}}", {rid: rid, path: path})}
				</DialogTitle>
                                <DialogContent>
					{t("delete_resource")}
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
	SectionDelete,
}
