import React from "react"
import { useReactOidc } from '@axa-fr/react-oidc-context'
import { useTranslation } from 'react-i18next'
import { useStateValue } from '../state.js'
import { apiNodeAction } from "../api.js"

import IconButton from '@material-ui/core/IconButton'
import DeleteForeverIcon from "@material-ui/icons/DeleteForever"

function NodeLabelRemove(props) {
	const {node, labelKey} = props
	const [{}, dispatch] = useStateValue()
	const { oidcUser } = useReactOidc()

	function unset() {
                console.log("unset", node, "label", labelKey)
                var kw = []
                if (!labelKey) {
                        return
                }
                var _kw = "labels."+labelKey
                kw.push(_kw)
                apiNodeAction(node, "unset", {kw: kw}, (data) => dispatch({type: "parseApiResponse", data: data}), oidcUser)
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
