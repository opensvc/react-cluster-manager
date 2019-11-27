import React from "react"
import { useTranslation } from "react-i18next"
import useAuthInfo from "../hooks/AuthInfo.jsx"
import { useStateValue } from '../state.js'

import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'

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

