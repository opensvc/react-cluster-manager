import React, { Fragment } from "react"
import useApiInfo from "../hooks/ApiInfo.jsx"
import { useTranslation } from 'react-i18next'
import { useHistory, useLocation } from "react-router"

import { makeStyles } from "@material-ui/core/styles"
import Card from "@material-ui/core/Card"
import CardHeader from "@material-ui/core/CardHeader"
import CardContent from "@material-ui/core/CardContent"
import Typography from "@material-ui/core/Typography"
import Chip from "@material-ui/core/Chip"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import Skeleton from "@material-ui/lab/Skeleton"

const useStyles = makeStyles(theme => ({
        root: {
                marginTop: theme.spacing(3),
        },
	param: {
		paddingTop: theme.spacing(1),
		paddingBottom: theme.spacing(1),
	},
        wrapper: {
                overflowX: 'auto',
                marginLeft: -theme.spacing(2),
                marginRight: -theme.spacing(2),
        },
}))

function Api(props) {
	const data = useApiInfo()
	const classes = useStyles()
        const loc = useLocation()
	const { t, i18n } = useTranslation()
	let params = new URLSearchParams(loc.search)
	const index = params.get("index")

	if (data && index !== null) {
		return <ApiHandler data={data[index]} index={index} />
	}

	return (
		<Card id="api" className={classes.root}>
                        <CardHeader title={t("Api")} />
                        <CardContent>
				<ApiHandlers data={data} />
                        </CardContent>
		</Card>
	)
}

function ApiHandler(props) {
	const {data, index} = props
	const { t, i18n } = useTranslation()
	const classes = useStyles()

	if (!data) {
		var title = <Skeleton />
	} else {
		var title = data.routes[0].method + " /" + data.routes[0].path
	}
	return (
		<Card className={classes.root}>
                        <CardHeader
				title={title}
			 />
                        <CardContent>
				<Typography>
					{data.desc}
				</Typography>
				<br />
				<ApiHandlerParameters method={data.routes[0].method} data={data.prototype} />
                        </CardContent>
		</Card>
	)
}

function ApiHandlerParameter(props) {
	const {data} = props
	const { t, i18n } = useTranslation()
	const classes = useStyles()
	return (
		<div className={classes.param}>
			<Typography variant="h6">
				{data.name}
				{data.required &&
				<Typography variant="h6" component="span" color="primary">&nbsp;*</Typography>
				}
			</Typography>
			<Typography color="textSecondary">
				{data.desc}
			</Typography>
			<Chip
				size="small"
				label={data.format}
			/>
		</div>
	)
}

function ApiHandlerParameters(props) {
	const {data, method} = props
	const { t, i18n } = useTranslation()
	if (!data.length) {
		return null
	}
	return (
		<Fragment>
			<Typography variant="h5">
				{method == "GET" ? t("Parameters") : t("Data")}
			</Typography>
			{data.map((param, i) => (
				<ApiHandlerParameter key={i} data={param} />
			))}
		</Fragment>
	)
}

function ApiHandlers(props) {
	const {data} = props
	if (!data) {
		return <Skeleton variant="rect" width="100%" height="8rem" />
	}

	return (
		<List>
			{data.map((handler, i) => (
				<ApiHandlerItem data={handler} index={i} key={i} />
			))}
		</List>
	)
}

function ApiHandlerItem(props) {
	const {data, index} = props
	const history = useHistory()

	function handleClick(e) {
		history.push("/api?index="+index)
	}

	return (
		<ListItem button component="a" onClick={handleClick}>
			<ListItemText>
				{data.routes[0].method} /{data.routes[0].path}
			</ListItemText>
		</ListItem>
	)
}

export default Api
