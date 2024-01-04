import React from "react"
import useUser from "../hooks/User.jsx"
import { useTranslation } from 'react-i18next'
import { apiNodeAction } from "../api.js"
import useApiResponse from "../hooks/ApiResponse.jsx"

import IconButton from '@mui/material/IconButton'
import DeleteForeverIcon from "@mui/icons-material/DeleteForever"

function NodeLabelRemove(props) {
	const {node, labelKey} = props
	const { dispatchAlerts } = useApiResponse()
	const { auth } = useUser()

	function unset() {
                console.log("unset", node, "label", labelKey)
                var kw = []
                if (!labelKey) {
                        return
                }
                var _kw = "labels."+labelKey
                kw.push(_kw)
                apiNodeAction(node, "unset", {kw: kw}, (data) => dispatchAlerts({data: data}), auth)
        }

        return (
                <IconButton
                        aria-label="Remove"
                        aria-haspopup={true}
                        onClick={unset}
                >
                        <DeleteForeverIcon />
                </IconButton>
        )
}

export default NodeLabelRemove
