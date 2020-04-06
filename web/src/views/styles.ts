import makeStyles from '@material-ui/core/styles/makeStyles';

export const useStyles = makeStyles(theme => ({
    mainContainer: {
        marginTop: theme.spacing(5),
    },
    stylaLogo: {
        verticalAlign: 'bottom',
        marginRight: theme.spacing(2),
    },
    stylaLogoNavBar: {
        width: '30px',
        height: '30px',
        marginRight: theme.spacing(2),
        position: 'relative',
        top: theme.spacing(1),
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,

    },
    'paper--withMinHeight' : {
        minHeight: '500px',
    },
    listingProgress: {
        height: '300px',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        textAlign: 'center',
        marginBottom: theme.spacing(2),
    },
    sectionTitle: {
        textAlign: 'center',
        marginBottom: theme.spacing(2),
    },
    featureFlagsWrapper:  {
        padding: '25px',
        textAlign: 'center',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 300,
    },
    button: {
        margin: theme.spacing(1),
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    navbarTitle: {
        flexGrow: 1,
        '& a': {
            textDecoration: 'none',
            color: '#ffffff'
        }
    },
    tableHead: {
        '& th' : {
            fontWeight: 'bold'
        }
    },
    formControlLabel: {
        margin: "0 !important",
    },
    breadcrumbs: {
        marginBottom: theme.spacing(1),
        marginLeft: theme.spacing(1),
        '& a': {
            textDecoration: 'none',
        },
        '& a:hover': {
            textDecoration: 'underline',
        }
    },
    verticalCenteredIcon : {
        verticalAlign: 'sub'
    },
    removeFromOrgButton : {
        opacity: 0.3,
        transition: 'opacity 0.3s',
        '&:hover': {
            opacity: 1,
        },
    }
}));

export type Classes = ReturnType<typeof useStyles>;
