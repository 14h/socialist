import React, { useContext } from 'react';
import { CoreCtx } from './store';
import { TCoreStateNavType, TCoreStateNavVariant } from '../types';

type TExpand<T, P = T | null> = P | P[];

type VariantMatchProps = {
    type?: TExpand<TCoreStateNavType>,
    id?: string | string[],
    variant?: TExpand<TCoreStateNavVariant>,
}

export const VariantMatch = (
    props: React.PropsWithChildren<VariantMatchProps>,
) => {
    const coreState = useContext(CoreCtx);

    const [nav] = coreState.nav;

    if (
        props.type
        && !([] as TCoreStateNavType[])
            .concat(props.type as TCoreStateNavType)
            .includes(nav.type)
    ) {
        return null;
    }

    if (
        props.id
        && !([] as string[])
            .concat(props.id)
            .includes(nav.id)
    ) {
        return null;
    }

    if (
        props.variant
        && !([] as any[])
            .concat(props.variant)
            .includes(nav.variant)
    ) {
        return null;
    }

    return <>{props.children}</>;
};
