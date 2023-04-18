import React from 'react';
import { Icon, Layout, Text } from '@ui-kitten/components';
import { TouchableOpacity, View } from 'react-native';
import { useSelector } from "react-redux";
import { COLORS, fontFamily, moderateScale, textScale } from '../../constants';
import { titleWords } from '../../utils';

interface IHeader {
    headerText?: string;
    isBack?: boolean;
    onTap?: Function | any;
    onTitleCallback?: Function | any;
    rightProps?: Function | any;
    extraProps?: any;
    isSearch?: any;
    leftString?: string;
}

const HeaderBar = (props: IHeader) => {
    const { theme } = useSelector((state: any) => state.auth);

    const { isSearch = false, leftString = false, headerText, isBack, onTap, rightProps, onTitleCallback, extraProps } = props || {};
    const { status } = extraProps || {};

    let colorStyle = (theme == "dark") ? "#F2F8FF" : "#002885";
    let fontColor = (theme == "dark") ? "#002885" : "#F2F8FF";

    return (
        <Layout style={{ flex: 1 }} >
            <Layout style={{ margin: 16, flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 0 }}>
                {
                    isBack ?
                        <TouchableOpacity onPress={onTap}>
                            <Icon
                                pack={'feather'}
                                name={'arrow-left'}
                                style={{ height: 24, width: 24, tintColor: COLORS.black }}
                            />
                        </TouchableOpacity>
                        :
                        headerText ?
                            <TouchableOpacity onPress={onTitleCallback} style={{ flexDirection: 'row' }}>
                                <Layout style={{ height: 50, width: 50, backgroundColor: colorStyle, borderRadius: 100, marginRight: 16 }}>
                                    <Text style={{ fontFamily: fontFamily.proximaBold, textTransform: "capitalize", alignSelf: "center", padding: moderateScale(14), color: fontColor }}>{titleWords(headerText)}</Text>
                                </Layout>
                                <Layout>
                                    <Text style={{ fontSize: textScale(18), fontFamily: fontFamily.proximaMedium, textTransform: "capitalize" }}>{headerText}</Text>
                                    <Text style={{ fontSize: textScale(12), color: (status == 'online') ? COLORS.darkGreen : COLORS.red, fontFamily: fontFamily.proximaMedium }}>{status}</Text>
                                </Layout>
                            </TouchableOpacity>
                            :
                            isSearch ? isSearch() :
                                leftString ?
                                    <Layout style={{ flexDirection: "row" }}>
                                        <TouchableOpacity onPress={onTap}>
                                            <Icon
                                                pack={'feather'}
                                                name={'arrow-left'}
                                                style={{ height: 24, width: 24, tintColor: (theme == "dark") ? COLORS.white : COLORS.black }}
                                            />
                                        </TouchableOpacity>
                                        <Text style={{ fontSize: textScale(20), fontFamily: fontFamily.proximaBold, textTransform: "capitalize", marginLeft: moderateScale(8) }}>{leftString}</Text>
                                    </Layout> :
                                    <></>
                }
                {rightProps?.() ?? <View />}
            </Layout>
        </Layout>
    )
}

export default HeaderBar