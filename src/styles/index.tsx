import { Dimensions, StyleSheet } from "react-native";
import { fontFamily, moderateScale, moderateScaleVertical, textScale } from "../constants";

export const imageStyle = StyleSheet.create({
    container: {
        flex: 1,
        margin: 16,
        bottom: 100,
        borderRadius: 30,
        position: 'absolute',
        backgroundColor: 'tansparent',
        width: Dimensions.get('screen').width,
    },
    card: {
        flex: 1,
        width: 300,
        margin: 12,
        padding: 16,
        flexWrap: 'wrap',
        borderRadius: 20,
        flexDirection: 'row',
    },
});

export const flexStyle = StyleSheet.create({
    container: {
        bottom: 0,
        position: 'absolute',
        width: '100%',
        height: 90,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    containerCircle: {
        backgroundColor: 'red',
        height: 60,
        width: 60,
        bottom: 48,
        padding: 2,
        position: 'absolute',
        borderRadius: 100,
        alignItems: 'center'
    },
    circle: {
        alignItems: 'center',
        padding: 24
    },
    option: {
        height: 40,
        margin: 8,
        borderRadius: 100,
        alignContent: 'center',
        justifyContent: "center"
    }
});

export const searchStyle = StyleSheet.create({
    centeredView: {
        flex: 1,
        width: '100%',
        marginTop: moderateScale(30),
        borderRadius: 30,
        position: 'absolute',
        flexDirection: 'row',
    },
    buttonSearch: {
        right: '100%'
    },
    buttonClose: {
        top: '4%',
        right: '280%',
    },
    input: {
        width: '100%',
        fontSize: textScale(13),
        fontFamily: fontFamily.proximaMedium,
        borderRadius: moderateScale(8),
        borderColor: '#000',
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
});


export const loginStyles = StyleSheet.create({
    text: {
        fontSize: textScale(22),
        margin: 10
    },
    img: {
        width: 200,
        height: 200,
        borderRadius: moderateScale(100)
    },
    box1: {
        alignItems: "center",
        paddingBottom: moderateScaleVertical(16)
    },
    box2: {
        paddingHorizontal: moderateScaleVertical(40),
        justifyContent: "space-evenly",
        height: "50%"
    }
});

export const chatStyles = StyleSheet.create({
    text: {
        fontSize: textScale(18),
        marginLeft: moderateScale(12),
        textTransform: "capitalize"
    },
    subText: {
        marginLeft: moderateScale(12),
        fontSize: textScale(12)
    },
    mycard: {
        flexDirection: "row",
        margin: moderateScale(8),
        padding: moderateScale(8),
        borderRadius: moderateScale(16)
    }
});

