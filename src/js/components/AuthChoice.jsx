import React from "react"
import { useTranslation } from "react-i18next"
import useAuthInfo from "../hooks/AuthInfo.jsx"
import { useStateValue } from '../state.js'

import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'

function AuthChoice(props) {
        const {i18n, t} = useTranslation()
	const authInfo = useAuthInfo()
	const [{ authChoice }, dispatch] = useStateValue()
        return (
                <Dialog
                        open={true}
                        aria-labelledby="dialog-title"
                >
                        <DialogTitle id="dialog-title">
                                {t("Authentication Methods")}
                        </DialogTitle>
                        <DialogContent>
                                <DialogContentText>
                                        {t("Please select one of the following authentication method the cluster advertizes.")}
                                </DialogContentText>
                        </DialogContent>
                        <DialogActions>
				{authInfo && authInfo.openid && authInfo.openid.well_known_uri &&
                                <Button onClick={() => dispatch({type: "setAuthChoice", data: "openid"})}>
                                        OpenId
                                </Button>
				}
                                <Button onClick={() => dispatch({type: "setAuthChoice", data: "x509"})}>
                                        x509
                                </Button>
				{authInfo && authInfo.methods && authInfo.methods.indexOf("basic") >= 0 &&
                                <Button onClick={() => dispatch({type: "setAuthChoice", data: "basic"})}>
                                        Basic
                                </Button>
				}
                        </DialogActions>
                </Dialog>
        )
}

export default AuthChoice

