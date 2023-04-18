import React from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { useSelector } from 'react-redux';

import { FeatherIconsPack } from './feather-icons';
import { MaterialIconsPack } from './material-icons';
import { FoundationIconsPack } from './foundation-icons';
import { IonicIconsPack } from './ ionic.-icons';
import { fontFamily, textScale } from '../../constants';


interface IProvider {
    children?: any;
}

const ThemeProvider = (props: IProvider) => {
    const { theme } = useSelector((state: any) => state.auth);
    let { children } = props;

    let colorStyle = theme == "dark" ? { "color-primary-500": "#F2F8FF" } : { "color-primary-500": "#002885" };

    return (
        <>
            <IconRegistry icons={[EvaIconsPack, IonicIconsPack, FeatherIconsPack, MaterialIconsPack, FoundationIconsPack]} />
            <ApplicationProvider
                {...eva}
                theme={{ ...eva?.[theme], ...colorStyle, "fontFamily": fontFamily.helveticaMedium, "fontSize": textScale(12) }}
            >
                {children}
            </ApplicationProvider>
        </>
    )
};

export default ThemeProvider;