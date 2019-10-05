import React, { useState } from "react";

import { useStateValue } from '../state.js';
import { useObjConfig } from "../hooks/ObjConfig.jsx";
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(theme => ({
        card: {
                height: "100%",
        },
}))

function ObjConfig(props) {
	const { path } = props
        const data = useObjConfig(path)
        const { t, i18n } = useTranslation()
        const classes = useStyles()

        if (!data) {
                var content = ( <CircularProgress /> )
        } else {
                var date = new Date(data.mtime * 1000)
                var content = (
                        <React.Fragment>
                                <Typography variant="caption" color="textSecondary">Last Modified {date.toLocaleString()}</Typography>
                                <pre style={{overflowX: "scroll"}}>{data.data}</pre>
                        </React.Fragment>
                )
        }

        return (
                <Card className={classes.card}>
                        <CardHeader
                                title={t("Configuration")}
                                subheader={path}
                        />
                        <CardContent>
                                {content}
                        </CardContent>
                </Card>
        )
}

export {
	ObjConfig
}
