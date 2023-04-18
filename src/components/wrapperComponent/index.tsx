import React from 'react';
import { StatusBar } from 'react-native';
import { Layout } from '@ui-kitten/components';
import { COLORS } from '../../constants';
import Loader from '../loader';

interface IWrap {
    children: any;
    isLoading?: boolean;
}

const WrapperContainer = (props: IWrap) => {
    let { children, isLoading = false } = props || {};

    return (
        <Layout style={{ flex: 1 }}>
            <Layout style={{ flex: 1 }}>{children}</Layout>
            <Loader isLoading={isLoading} />
        </Layout>
    );
};

export default WrapperContainer;
