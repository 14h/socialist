import React, { useContext } from 'react';
import { CoreCtx, serializeNavData } from './store';
import { TCoreStateNav } from '../types';

export const NavLink = (props: React.PropsWithChildren<{
    navData: TCoreStateNav,
}>) => {
    const coreState = useContext(CoreCtx);

    const handleClick = (evt: React.MouseEvent<HTMLAnchorElement>) => {
        coreState.nav[1](props.navData);

        evt.preventDefault();

        return false;
    };

    return <a
        href={serializeNavData(props.navData)}
        onClick={handleClick}
    >
        {props.children}
    </a>;
};
