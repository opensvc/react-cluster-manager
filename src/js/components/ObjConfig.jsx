import React, { useState, Fragment } from "react"
import { useStateValue } from "../state.js"
import { useObjConfig } from "../hooks/ObjConfig.jsx"
import { useTranslation } from "react-i18next"
import clsx from "clsx"
import { ResourceAddButton } from "./ResourceAddButton.jsx"
import { parseIni, splitPath } from "../utils.js"
import { SectionEdit } from "./SectionEdit.jsx"
import { SectionDelete } from "./SectionDelete.jsx"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction"
import Card from "@mui/material/Card"
import CardHeader from "@mui/material/CardHeader"
import CardContent from "@mui/material/CardContent"
import CardActions from "@mui/material/CardActions"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import CircularProgress from "@mui/material/CircularProgress"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import EditIcon from "@mui/icons-material/Edit"
import Collapse from "@mui/material/Collapse"
import Tooltip from "@mui/material/Tooltip"
import useClasses from "../hooks/useClasses.jsx";

const styles = theme => ({
        card: {
                height: "100%",
        },
	expand: {
		transform: 'rotate(0deg)',
		marginLeft: 'auto',
		transition: theme.transitions.create('transform', {
			duration: theme.transitions.duration.shortest,
		}),
	},
	expandOpen: {
		transform: 'rotate(180deg)',
	},
})

function EditButton(props) {
	const sp = splitPath(props.path)
	const [{ user }, dispatch] = useStateValue()
	const { t } = useTranslation()
        if (!user.grant) {
                return null
        }
        if (!("root" in user.grant) && (user.grant.admin.indexOf(sp.namespace) < 0)) {
                return null
	}
        return (
		<Tooltip title={t("Edit")}>
			<IconButton
				aria-label="Edit Labels"
				aria-haspopup={true}
				onClick={props.toggle}
			>
				<EditIcon />
			</IconButton>
		</Tooltip>
        )
}

function ExpandRawConfigButton(props) {
        const { path, expanded, setExpanded } = props
	const [{ user }, dispatch] = useStateValue()
	const { t } = useTranslation()
        const classes = useClasses(styles)
	const sp = splitPath(path)
        if (!user.grant) {
                return null
        }
        if (!("root" in user.grant) && (user.grant.admin.indexOf(sp.namespace) < 0)) {
                return null
	}
	function handleExpandClick(e) {
		setExpanded(!expanded)
	}
	return (
		<Tooltip title={t("Raw")}>
			<IconButton
				className={clsx(classes.expand, {[classes.expandOpen]: expanded})}
				onClick={handleExpandClick}
				aria-expanded={expanded}
				aria-label="show more"
			>
				<ExpandMoreIcon />
			</IconButton>
		</Tooltip>
	)
}

function ObjConfigDigest(props) {
	const { path, edit } = props
	const [{ cstat, user }, dispatch] = useStateValue()
        const config = useObjConfig(path)
        if (cstat.monitor === undefined) {
                return null
        }
	if (user.grant === undefined) {
		return null
	}
	if (!config) {
		return null
	}
	var data = parseIni(config.data)
	var instance = null
	for (var node in cstat.monitor.nodes) {
		instance = cstat.monitor.nodes[node].services.status[path]
		if (instance) {
			break
		}
	}
	if (!instance) {
		return null
	}
	var sections = []
	for (var section in data) {
		try {
			var label = instance.resources[section].label
		} catch(e) {
			var label = ""
		}
		sections.push({
			section: section,
			label: label,
		})
	}
	return (
		<List dense={true}>
			{sections.map((s, i) => {
				return (
					<ListItem key={i}>
						<ListItemText
							primary={s.section}
							secondary={s.label}
							secondaryTypographyProps={{component: "div"}}
						/>
						<ListItemSecondaryAction>
							{edit && <SectionDelete path={path} rid={s.section} />}
							{edit && <SectionEdit path={path} rid={s.section} conf={data} />}
						</ListItemSecondaryAction>
					</ListItem>
				)
			})}
		</List>
	)
}

function ObjConfigFile(props) {
	const { path } = props
        const data = useObjConfig(path)

        if (!data) {
                var content = ( <CircularProgress /> )
        } else {
                var date = new Date(data.mtime * 1000)
                var content = (
                        <Fragment>
                                <Typography variant="caption" color="textSecondary">Last Modified {date.toLocaleString()}</Typography>
                                <pre style={{overflowX: "auto"}}>{data.data}</pre>
                        </Fragment>
                )
        }

        return (
		<Fragment>
			{content}
		</Fragment>
        )
}

function ObjConfig(props) {
	const { path } = props
        const classes = useClasses(styles)
        const { t, i18n } = useTranslation()
	const [expanded, setExpanded] = useState(false)
	const [edit, setEdit] = useState(false)

        return (
                <Card className={classes.card}>
                        <CardHeader
                                title={t("Configuration")}
                                subheader={path}
				action={
					<Fragment>
						<EditButton path={path} toggle={() => {setEdit(!edit)}} />
						<ResourceAddButton path={path} />
					</Fragment>
				}
                        />
                        <CardContent>
				<ObjConfigDigest path={path} edit={edit} />
                        </CardContent>
			<CardActions disableSpacing>
				<ExpandRawConfigButton path={path} expanded={expanded} setExpanded={setExpanded} />
			</CardActions>
			<Collapse in={expanded} timeout="auto" unmountOnExit>
				<CardContent>
					<ObjConfigFile path={path} />
				</CardContent>
			</Collapse>
                </Card>
        )
}

export default ObjConfig
