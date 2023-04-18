import React from "react";
import { KeyboardAvoidingView, TouchableOpacity } from "react-native";
import { Icon, Input, Layout } from '@ui-kitten/components';

import { searchStyle } from '../../styles';
import { COLORS, hitSlop } from "../../constants";
import { useSelector } from "react-redux";

interface ISearch {
    value: string;
    setValue: Function;
}

function SystemSearch(props: ISearch) {
    let { value, setValue } = props || {};
    const { theme } = useSelector((state: any) => state?.auth);
    let colorStyle = (theme == "dark") ? "#F2F8FF" : "#002885";

    let { centeredView, input } = searchStyle || {};

    return (
        <KeyboardAvoidingView behavior={'padding'}
            enabled style={{ ...centeredView }}>
            <Input
                value={value}
                style={{ ...input }}
                textStyle={{ ...input }}
                keyboardType={'web-search'}
                returnKeyLabel={'Go'}
                placeholder={'Search here...'}
                onChangeText={(text: string) => setValue(text)}
                accessoryRight={(props: any) => {
                    return value ?
                        <TouchableOpacity hitSlop={hitSlop} onPress={() => setValue("")}>
                            <Icon
                                {...props}
                                pack={'feather'}
                                name={"x"}
                                style={{ height: 22, width: 22, tintColor: colorStyle }}
                            />
                        </TouchableOpacity>
                        : <></>
                }}
            />
        </KeyboardAvoidingView>
    );
};

export default SystemSearch;