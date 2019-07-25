import React from "react";
import { lighten, makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';

const useToolbarStyles = makeStyles(theme => ({
        root: {
                paddingLeft: theme.spacing(2),
                paddingRight: theme.spacing(1),
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
        },
        title: {
                flex: '0 0 auto',
        },
}));

const TableToolbar = props => {
        const classes = useToolbarStyles();
        const { selected } = props;

        return (
                <Toolbar
                        className={clsx(classes.root, {
                                [classes.highlight]: selected.length > 0,
                        })}
                >
                        <div className={classes.title}>
                                {selected.length > 0 ? (
                                        <Typography color="inherit" variant="subtitle1">
                                                {selected.length} selected
                                        </Typography>
                                ) : (
                                        <Typography variant="h6" id="tableTitle">
                                        </Typography>
                                )}
                        </div>
                        <div className={classes.spacer} />
                        <div className={classes.actions}>
                                {props.children}
                        </div>
                </Toolbar>
        );
};

export {
	TableToolbar,
}
