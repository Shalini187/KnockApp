import { Icon, Input, Layout, Modal } from '@ui-kitten/components';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { COLORS, fontFamily, hitSlop, moderateScale, moderateScaleVertical, textScale } from '../../constants';
import { useSelector } from 'react-redux';

interface IModal {
    modalVisible?: boolean;
    setModalVisible?: any;
    children?: JSX.Element;
    onCreate?: Function;
    onAddExisting?: Function;
    groupName?: string;
    setGroupName?: Function;
}

const SystemModal = (props: IModal) => {
    const { theme } = useSelector((state: any) => state.auth);
    let colorStyle = (theme != "dark") ? COLORS.black : COLORS.white;

    const { setGroupName, groupName, modalVisible, setModalVisible, children, onCreate, onAddExisting }: any = props || {};

    return (
        <Layout style={styles.centeredView}>
            <Modal
                visible={modalVisible}
                backdropStyle={{ backgroundColor: COLORS.blackopacity70 }}
            >
                {
                    !children ?
                        <Layout level={'4'} style={styles.centeredView}>
                            <Layout level={'4'} style={styles.modalView}>
                                <TouchableOpacity onPress={onCreate} hitSlop={hitSlop} style={{ marginBottom: moderateScale(16), borderRadius: moderateScale(8), alignSelf: "center" }}>
                                    <Text style={{ ...styles.modalText, color: colorStyle }}>{'Create New Group'}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={onAddExisting} hitSlop={hitSlop} style={{ marginBottom: moderateScale(8), borderRadius: moderateScale(8), alignSelf: "center" }}>
                                    <Text style={{ ...styles.modalText, color: colorStyle }}>{'Add to Existing Group'}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => setModalVisible(!modalVisible)}>
                                    <Text style={styles.textStyle}>{'CLOSE'}</Text>
                                </TouchableOpacity>
                            </Layout>
                        </Layout>
                        :
                        <Layout level={'4'} style={styles.centeredView}>
                            <Layout level={'4'} style={styles.modalView}>
                                <Input
                                    size={'large'}
                                    style={{ marginVertical: 12, borderRadius: moderateScale(16) }}
                                    autoCapitalize={'none'}
                                    textStyle={{ fontFamily: fontFamily.proximaMedium, fontSize: textScale(13) }}
                                    placeholder={'Enter GroupName'}
                                    value={groupName}
                                    onChangeText={setGroupName}
                                    accessoryRight={(props: any) => {
                                        return (
                                            (groupName) ? <Icon name={'close'} {...props} color={COLORS.red} size={24} pack={'eva'} onPress={() => setGroupName("")} /> : <></>
                                        )
                                    }}
                                />
                                <Layout level={'4'} style={{ flexDirection: "row", marginTop: moderateScale(16) }}>
                                    {
                                        groupName ?
                                            <TouchableOpacity
                                                onPress={onCreate}>
                                                <Layout level={'1'} style={{ padding: moderateScale(16), borderRadius: moderateScale(16), margin: moderateScale(16) }}>
                                                    <Text style={{
                                                        fontFamily: fontFamily.proximaMedium,
                                                        textAlign: 'center',
                                                        color: (theme != "dark") ? COLORS.black : COLORS.white
                                                    }}>{'CREATE'}</Text>
                                                </Layout>
                                            </TouchableOpacity>
                                            :
                                            <></>
                                    }
                                    <TouchableOpacity
                                        onPress={() => setModalVisible(!modalVisible)}>
                                        <Layout style={{ backgroundColor: COLORS.red, padding: moderateScale(16), borderRadius: moderateScale(16), margin: moderateScale(16) }}>
                                            <Text style={{
                                                color: COLORS.white,
                                                fontFamily: fontFamily.proximaMedium,
                                                textAlign: 'center',
                                            }}>{'CLOSE'}</Text>
                                        </Layout>
                                    </TouchableOpacity>
                                </Layout>
                            </Layout>
                        </Layout>
                }
            </Modal>
        </Layout>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: moderateScale(250),
        width: moderateScale(300),
        borderRadius: moderateScale(16),
        marginTop: moderateScaleVertical(16),
    },
    modalView: {
        margin: moderateScale(16),
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: '#000',
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonClose: {
        backgroundColor: COLORS.red,
        marginTop: moderateScale(16)
    },
    textStyle: {
        color: COLORS.white,
        fontFamily: fontFamily.proximaMedium,
        textAlign: 'center',
    },
    modalText: {
        marginBottom: textScale(14),
        fontFamily: fontFamily.proximaBold,
        textAlign: 'center',
        textTransform: "uppercase"
    },
});

export default SystemModal;