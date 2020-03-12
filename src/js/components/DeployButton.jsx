import React, { useState } from "react"
import { useTranslation } from "react-i18next"

import useUser from "../hooks/User.jsx"
import { createDataHasPathKey } from "../utils.js"
import { Deploy } from "./Deploy.jsx"
import { apiObjGetConfig, apiObjCreate } from "../api.js"
import useApiResponse from "../hooks/ApiResponse.jsx"

import AddIcon from "@material-ui/icons/Add"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogTitle from "@material-ui/core/DialogTitle"
import Button from "@material-ui/core/Button"
import IconButton from "@material-ui/core/IconButton"
import Tooltip from "@material-ui/core/Tooltip"

function DeployButton(props) {
	const { auth } = useUser()
	const { t } = useTranslation()
	const [open, setOpen] = useState(false)
        const [data, setData] = useState({
		active: 0,
                empty: {
                        name: "",
                        namespace: "",
                        kind: "svc",
                },      
                clone: {
			src: null,
                        name: "",
                        namespace: "",
                },
                catalog: {
			catalog: null,
                        template: null,
                        text: "",
                        data: null,
                        name: "",
                        namespace: "",
			envs: {},
                },
                template: {
                        uri: "",
                        text: "",
                        data: null,
                        name: "",
                        namespace: "",
                },
        })
	if (props.kind && props.kind != data.empty.kind) {
		setData({...data, empty: {...data.empty, kind: props.kind, kindForced: true}})
	}
        function handleClick(e) {
                e.stopPropagation()
                setOpen(true)
        }
        function handleClose(e) {
                setOpen(false)
        }
        function createEmpty() {
                var path = [data.empty.namespace, data.empty.kind, data.empty.name].join("/")
                var _data = {
                        namespace: data.empty.namespace,
                        provision: false,
                        restore: true,
                        data: {
				[path]: {}
			}
                }
                apiObjCreate(_data, ($) => dispatchAlerts({
                        ok: "Object " + path + " created",
                        data: $
                }), auth)
        }
        function createClone() {
                var path = [data.clone.namespace, "svc", data.clone.name].join("/")
                var _data = {
                        namespace: data.clone.namespace,
                        provision: true,
                        restore: false,
                        data: {}
                }
                apiObjGetConfig({path: data.clone.src, format: "json"}, (cdata) => {
                        if ("metadata" in cdata) {
                                delete cdata["metadata"]
                        }
                        _data.data[path] = cdata
                        apiObjCreate(_data, ($) => dispatchAlerts({
                                ok: "Object " + path + " cloned",
                                data: $
                        }))
                }, auth)
        }
        function createTemplate() {
                if (createDataHasPathKey()) {
                        var _data = {
                                "provision": true,
                                "namespace": data.template.namespace,
                                "data": data.template.data,
                        }
                        var nObj = Object.keys(_data).length
                        if (nObj > 1) {
                                var ok = "Objects " + Object.keys(_data) + " deployed."
                        } else {
                                var ok = "Object " + Object.keys(_data) + " deployed."
                        }
                } else {
                        var path = data.template.namespace+"/svc/"+data.template.name
                        var _data = {
                                "provision": true,
                                "namespace": data.template.namespace,
                                "data": {
                                        [path]: data.template.data,
                                }
                        }
                        var ok = "Object " + path + " deployed."
                }
                apiObjCreate(_data, ($) => dispatchAlerts({
                        ok: ok,
                        data: $,
                }), auth)
        }
        function createCatalog() {
                if (createDataHasPathKey()) {
                        var _data = {
                                "provision": true,
                                "namespace": data.catalog.namespace,
                                "template": data.catalog.template.id,
                                "data": data.catalog.envs
                        }
                        var nObj = Object.keys(_data).length
                        if (nObj > 1) {
                                var ok = "Objects " + Object.keys(_data) + " deployed."
                        } else {
                                var ok = "Object " + Object.keys(_data) + " deployed."
                        }
                } else {
                        var path = data.catalog.namespace+"/svc/"+data.catalog.name
                        var _data = {
                                "path": path,
                                "provision": true,
                                "namespace": data.catalog.namespace,
                                "template": data.catalog.template.id,
                                "data": data.catalog.envs
                        }
                        var ok = "Object " + path + " deployed."
                }
                console.log("submit", _data)
                apiObjCreate(_data, ($) => dispatchAlerts({
                        ok: ok,
                        data: $
                }), auth)
        }
        function handleSubmit(e) {
		if (data.active == 0) {
			createEmpty()
		} else if (data.active == 1) {
			createClone()
		} else if (data.active == 2) {
			createCatalog()
		} else if (data.active == 3) {
			createTemplate()
		}
		handleClose(e)
	}

	return (
		<React.Fragment>
			<Tooltip title={t("Deploy")}>
				<IconButton
					onClick={handleClick}
					aria-label="Deploy"
					aria-haspopup="true"
				>
					<AddIcon />
				</IconButton>
			</Tooltip>
                        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                                <DialogTitle id="form-dialog-title">Deploy</DialogTitle>
                                <DialogContent>
                                        <Deploy data={data} setData={setData} />
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
	DeployButton,
}
