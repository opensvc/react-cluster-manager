import React from "react"
import { useTranslation } from 'react-i18next'
import { lighten, makeStyles } from '@mui/styles'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import clsx from 'clsx'

const useToolbarStyles = makeStyles(theme => ({
        root: {
                paddingLeft: theme.spacing(1),
                paddingRight: theme.spacing(0),
        },
        highlight:
                theme.palette.type === 'light'
                ? {
                        color: theme.palette.secondary.main,
                        //backgroundColor: lighten(theme.palette.secondary.light, 0.85),
                }
                : {
                        color: theme.palette.text.primary,
                        backgroundColor: theme.palette.secondary.dark,
                },
        spacer: {
                flex: '1 1 100%',
        },
        actions: {
                color: theme.palette.text.secondary,
		display: "flex",
		flexWrap: "nowrap",
        },
        title: {
                flex: '0 0 auto',
        },
}))

const TableToolbar = props => {
	const { t, i18n } = useTranslation()
        const classes = useToolbarStyles()
        const { selected } = props

        return (
                <Toolbar
                        className={clsx(classes.root, {
                                [classes.highlight]: selected.length > 0,
                        })}
                >
                        <div className={classes.title}>
                                {(selected.length > 0) &&
				<Typography color="inherit" variant="subtitle1">
					{t("{{count}} selected", {count: selected.length})}
				</Typography>
                                }
                        </div>
                        <div className={classes.spacer} />
                        <div className={classes.actions}>
                                {props.children}
                        </div>
                </Toolbar>
        )
}

export {
	TableToolbar,
}
