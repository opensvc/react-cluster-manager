import React from "react"
import { state } from "../utils.js"
import { versionIssue } from "../issues.js"
import { useTranslation } from "react-i18next"
import { useStateValue } from '../state.js'
import Typography from '@material-ui/core/Typography'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import WarningIcon from "@material-ui/icons/Warning"
import { makeStyles } from '@material-ui/core/styles'

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

