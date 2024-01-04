import React from "react"
import { state } from "../utils.js"
import { versionIssue } from "../issues.js"
import { useTranslation } from "react-i18next"
import { useStateValue } from '../state.js'
import Typography from '@mui/material/Typography'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import WarningIcon from "@mui/icons-material/Warning"
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles(theme => ({
        root: {
                color: theme.status.warning,
        },
}))

function NodeStateVersionItem(props) {
	const { t, i18n } = useTranslation()
	const [{ cstat }, dispatch] = useStateValue()
	const classes = useStyles()
	var cissue = versionIssue(cstat)
        if (cissue == state.OPTIMAL) {
                return null
        }
        return (
                <ListItem>
                        <ListItemIcon>
                                <WarningIcon className={classes.root} />
                        </ListItemIcon>
                        <ListItemText>
				{t("Nodes run different versions.")}
                        </ListItemText>
                </ListItem>
        )
}

export {
        NodeStateVersionItem
}

