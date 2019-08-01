import React, { useState } from "react";
import { useStateValue } from '../state.js';
import { DeployEmpty } from "./DeployEmpty.jsx";
import { DeployClone } from "./DeployClone.jsx";
import { DeployCatalog } from "./DeployCatalog.jsx";
import { DeployTemplate } from "./DeployTemplate.jsx";

import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';


const useStyles = makeStyles(theme => ({
        root: {
                padding: theme.spacing(3, 2),
                marginTop: theme.spacing(3),
        },
        tabContent: {
                paddingTop: theme.spacing(2),
        },
        fab: {
                marginTop: theme.spacing(2),
        },
}))

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
	const {data, setData} = props
	const classes = useStyles()

	const set = key => val => {
		setData({...data, [key]: val})
	}
        const handleChange = (event, newValue) => {
                set("active")(newValue)
        }

	return (
		<React.Fragment>
                        <Tabs
                                value={data.active}
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
                                {data.active === 0 && <DeployEmpty data={data.empty} set={set("empty")} />}
                                {data.active === 1 && <DeployClone data={data.clone} set={set("clone")} />}
                                {data.active === 2 && <DeployCatalog data={data.catalog} set={set("catalog")} />}
                                {data.active === 3 && <DeployTemplate data={data.template} set={set("template")} />}
                        </Box>
		</React.Fragment>
	)
}

export {
	Deploy,
}
