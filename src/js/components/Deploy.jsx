import React from "react";
import { DeployEmpty } from "./DeployEmpty.jsx";
import { DeployCatalog } from "./DeployCatalog.jsx";
import { DeployTemplate } from "./DeployTemplate.jsx";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import useClasses from "../hooks/useClasses.jsx";


const useStyles = theme => ({
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
})

const tabs = [
        {
                name: "Empty",
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
	const classes = useClasses(useStyles)

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
                                {data.active === 1 && <DeployCatalog data={data.catalog} set={set("catalog")} />}
                                {data.active === 2 && <DeployTemplate data={data.template} set={set("template")} />}
                        </Box>
		</React.Fragment>
	)
}

export {
	Deploy,
}
