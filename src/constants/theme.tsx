import { Dimensions, StatusBar, Platform } from "react-native";

const { width, height } = Dimensions.get("window");

export const hitSlop = { top: 16, bottom: 16, left: 16, right: 16 }

export const fontFamily: any = {
    proximaBold: "Proxima-Bold",
    proximaExtraBold: "Proxima-ExtraBold",
    proximaLight: "Proxima-Light",
    proximaSemiBold: "Proxima-SemiBold",
    proximaRegular: "Proxima-Regular",
    proximaMedium: "Proxima-Medium",
    helveticaBold: "HelveticaNeue-Bold",
    helveticaExtaBold: "HelveticaNeue-ExtraBold",
    helveticaMedium: "HelveticaNeue-Medium",
    helveticaRegular: "HelveticaNeue-Regular",
    helveticaLight: "HelveticaNeue-Light",
};

export const COLORS: any = {
    darkGreen: "#229879",
    darkLime: "#1A8871",
    lightLime: "#BBD6C5",
    lime: "#2AD699",
    red: "#EB1010",

    backGroundBlack: '#141414',
    cardBlack: '#1f1f1f',

    blackopacity70: 'rgba(0, 0, 0, 0.7)',

    white: "#fff",
    white2: '#F9F9F9',
    white3:"#ffffffcc",
    white4:"#ffffffb3",
    white5:"#ffffffe6",

    black: "#020202",
    black_1:"#111111",
    black_2:"#282828",
    black_3:"#000000",
    black_4: '#282828',
    darkBlue:"#121730",
    blue: "#654DD7",
    transparent_black:"#00000080",

    gray: "#868686",
    gray2: '#F8F8F8',
    gray3: '#F2F2F2',
    gray4: '#514D4D',
    lightGray: "#DEDEDE",
    lightGray2: '#757575',
    lightGray3: "#BABABA",
    lightGray4: "#BCBCBC",
    lightGray5: "#B0B0B0",
    lightGray6: "#D9D9D9",
    lightGray7: "#F6F7F9",
    darkGray: "#3D3D3D",

    gradients: ['#9850E9', '#6F54EC', '#CD5AE0'],
    transparentBlack: 'rgba(2, 2, 2, 0.1)',

    transparentBlue: 'rgba(167, 141, 233, 0.19)',
    transparentGray: 'rgba(77,77,77, 0.8)',
    transparentDarkGray: 'rgba(20,20,20, 0.9)',
};

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;
const scale = (size: any) => (width / guidelineBaseWidth) * size;
const verticalScale = (size: any) => (height / guidelineBaseHeight) * size;
const moderateScale = (size: any, factor = 0.5) => size + (scale(size) - size) * factor;
const moderateScaleVertical = (size: any, factor = 0.5) => size + (verticalScale(size) - size) * factor;
const textScale = (percent: any) => {
	const screenHeight = Dimensions.get('window').height;
	//calculate absolute ratio for bigger screens 18.5:9 requiring smaller scaling
	const ratio = Dimensions.get('window').height / Dimensions.get('window').width;
	//Guideline sizes are based on standard ~5″ screen mobile device
	const deviceHeight = 375
		? screenHeight * (ratio > 1.8 ? 0.126 : 0.15) //Set guideline depending on absolute ratio
		: Platform.OS === 'android'
			? screenHeight - StatusBar?.currentHeight
			: screenHeight;

	const heightPercent = (percent * deviceHeight) / 100;
	return Math.round(heightPercent);
};

export { scale, verticalScale, textScale, moderateScale, moderateScaleVertical,width,height };

const appTheme: any = { textScale, moderateScale, moderateScaleVertical, width, height };

export default appTheme;