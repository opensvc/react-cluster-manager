import React, { useState } from "react";
import { useStateValue } from '../state.js';
import { DeployEmpty } from "./DeployEmpty.jsx";
import { DeployClone } from "./DeployClone.jsx";
import { DeployCatalog } from "./DeployCatalog.jsx";
import { DeployTemplate } from "./DeployTemplate.jsx";

import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';


const useStyles = makeStyles(theme => ({
        root: {
                padding: theme.spacing(3, 2),
                marginTop: theme.spacing(3),
        },
        tabContent: {
                paddingTop: theme.spacing(2),
        },
}))

function DeployButton(props) {
	const [ {}, dispatch ] = useStateValue()
	const classes = useStyles()
	function handleClick(e) {
		dispatch({
			type: "setNav",
			page: "Deploy",
			links: ["Objects", "Deploy"]
		})
	}
	return (
		<Fab
			color="primary"
			onClick={handleClick}
		>
			<AddIcon />
		</Fab>
	)
}

const tabs = [
        {
                name: "Empty",
                disabled: false,
        },
        {
                name: "Clone",
                disabled: false,
        },
        {
                name: "Catalog",
                disabled: false,
        },
        {
                name: "Template",
                disabled: false,
        },
]

function Deploy(props) {
	const classes = useStyles()
        const [active, setActive] = useState(0)

        const handleChange = (event, newValue) => {
                setActive(newValue)
        }

	return (
		<Paper className={classes.root}>
			<Typography variant="h4" component="h2">
				Deploy
			</Typography>
                        <Tabs
                                value={active}
                                onChange={handleChange}
                                indicatorColor="primary"
                                textColor="primary"
                                variant="scrollable"
                                scrollButtons="auto"
                        >
                                {tabs.map((tab, i) => (
                                        <Tab key={i} href="#" label={tab.name} disabled={tab.disabled} />
                                ))}
                        </Tabs>
                        <Box className={classes.tabContent}>
                                {active === 0 && <DeployEmpty />}
                                {active === 1 && <DeployClone />}
                                {active === 2 && <DeployCatalog />}
                                {active === 3 && <DeployTemplate />}
                        </Box>
		</Paper>
	)
}

export {
	Deploy,
	DeployButton
}
