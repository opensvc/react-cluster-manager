import React, { Fragment, useState } from "react"
import useApiInfo from "../hooks/ApiInfo.jsx"
import { useTranslation } from 'react-i18next'
import { useHistory, useLocation } from "react-router"
import { SectionForm } from "./SectionForm.jsx"
import { apiReq } from "../api.js"
import { useReactOidc } from "@axa-fr/react-oidc-context"

import { makeStyles } from "@material-ui/core/styles"
import Card from "@material-ui/core/Card"
import CardHeader from "@material-ui/core/CardHeader"
import CardContent from "@material-ui/core/CardContent"
import CardActions from "@material-ui/core/CardActions"
import Typography from "@material-ui/core/Typography"
import Chip from "@material-ui/core/Chip"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import Button from "@material-ui/core/Button"
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
	method: {
		width: "7em",
		marginRight: theme.spacing(2),
	},
	cardAction: {
                marginLeft: 'auto',
        },
}))

function Api(props) {
	const data = useApiInfo()
	const classes = useStyles()
        const loc = useLocation()
	const { t, i18n } = useTranslation()
	let params = new URLSearchParams(loc.search)
	const index = params.get("index")

	if (data === undefined) {
		return null
	}
	var _data = data.sort((a, b) => {
		return a.routes[0].path.localeCompare(b.routes[0].path) || a.routes[0].method.localeCompare(b.routes[0].method)
	})

	if (_data && index !== null) {
		return <ApiHandler data={_data[index]} index={index} />
	}

	return (
		<Card id="api" className={classes.root}>
                        <CardHeader title={t("Api")} />
                        <CardContent>
				<ApiHandlers data={_data} />
                        </CardContent>
		</Card>
	)
}

function ApiHandler(props) {
	const {data, index} = props
	const { oidcUser } = useReactOidc()
	const classes = useStyles()
	const [formData, setFormData] = useState({})
	const [formResult, setFormResult] = useState("")

	function handleSubmit(e) {
		apiReq(data.routes[0].method, "ANY", data.routes[0].path, formData, (_) => {
			setFormResult(_)
		}, oidcUser)
	}

	return (
		<Card className={classes.root}>
                        <CardHeader
				title=<HandlerTitle data={data} />
			 />
                        <CardContent>
				<Typography>
					{data.desc}
				</Typography>
				<br />
				<ApiHandlerAccess data={data.access} />
				<br />
				<ApiHandlerParameters
					method={data.routes[0].method}
					data={data.prototype}
					formData={formData}
					setFormData={setFormData}
				/>
				<FormResult data={formResult} />
                        </CardContent>
			<CardActions>
				<Button
					className={classes.cardAction}
					onClick={handleSubmit}
					color={data.routes[0].method == "GET" ? "primary" : "secondary"}
				>
					{data.routes[0].method}
				</Button>
			</CardActions>
		</Card>
	)
}

function ApiHandlerAccess(props) {
	const { t, i18n } = useTranslation()
	const { data } = props
	var buff = ""
console.log(data)
	if (data == "custom") {
		buff = t("Custom access policy.")
	} else if (!data.roles) {
		buff = t("World-usable.")
	} else {
		var roles = data.roles.join(", ")
		if (!data.namespaces) {
			buff = t("Usable with {{roles}} privileges.", {"roles": roles})
		} else {
			if (data.namespaces == "FROM:path") {
				var namespaces = t("extracted from the 'path' request parameter or data key")
				buff = t("Usable with {{roles}} privileges on namespaces {{namespaces}}.", {"roles": roles, "namespaces": namespaces})
			} else if (data.namespaces == "ANY") {
				var namespaces = t("any")
				buff = t("Usable with {{roles}} privileges on any namespace.", {"roles": roles})
			} else {
				var namespaces = data.namespaces.join(", ")
				buff = t("Usable with {{roles}} privileges on namespaces {{namespaces}}.", {"roles": roles, "namespaces": namespaces})
			}
		}
	}
	return (
		<Fragment>
			<Typography variant="h5">
				{t("Access")}
			</Typography>
			<Typography component="div">
				{buff}
			</Typography>
		</Fragment>
	)
}

function FormResult(props) {
	const { t, i18n } = useTranslation()
	const { data } = props
	if (!data) {
		return null
	}
	return (
		<Fragment>
			<Typography variant="h5">
				{t("Response")}
			</Typography>
			<Typography component="div">
				<pre>
					{JSON.stringify(data, null, 4)}
				</pre>
			</Typography>
		</Fragment>
	)
}

function ApiHandlerParameters(props) {
	const {data, method, formData, setFormData } = props
	const { t, i18n } = useTranslation()
	if (!data.length) {
		return null
	}
	var kws = []
	for (var param of data) {
		var kw = {
			"keyword": param.name,
			"default": param.default,
			"convert": param.format,
			"text": param.desc,
			"candidates": param.candidates,
			"required": param.required,
		}
		kws.push(kw)
	}
	var what = method == "GET" ? t("Parameters") : t("Data")
	return (
		<SectionForm
			kind="data"
			kws={kws}
			data={formData}
			setData={setFormData}
			requiredTitle={t("Required {{what}}", {"what": what})}
			optionalTitle={t("Optional {{what}}", {"what": what})}
		/>
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

function Method(props) {
	const { method } = props
	const classes = useStyles()
	return (
		<Chip
			color={method == "GET" ? "primary" : "secondary"}
			label={method}
			className={classes.method}
		/>
	)
}

function HandlerTitle(props) {
	const { data } = props
	if (!data) {
		return <Skeleton />
	}
	return (
		<Fragment>
			<Method method={data.routes[0].method} />
			/{data.routes[0].path}
		</Fragment>
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
				<HandlerTitle data={data} />
			</ListItemText>
		</ListItem>
	)
}

export default Api
