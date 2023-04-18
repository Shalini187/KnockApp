import React from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import { height, COLORS as colors } from '../../constants';

interface IBottom {
  closeOnDragDown?: boolean;
  closeMask?: boolean;
  type?: string;
  children?: JSX.Element;
  sheetRef?: Function;
  sheetHeight?: Float64Array;
  onClose?: Function;
  backgroundColor?: string;
}

export default function BottomUpRawSheet(props: IBottom) {
  const { closeOnDragDown = false, closeMask = true, type = "fade", children, sheetRef = () => { }, sheetHeight = height * 0.78, onClose, backgroundColor = colors.cardBlack }: any = props || {};

  return (
    <RBSheet
      ref={sheetRef}
      animationType={type}
      openDuration={250}
      closeDuration={0}
      closeOnDragDown={closeOnDragDown}
      closeOnPressMask={closeMask}
      dragFromTopOnly={false}
      customStyles={{
        wrapper: {
          backgroundColor: colors.blackopacity70
        },
        container: {
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          height: sheetHeight,
          backgroundColor
        },
        draggableIcon: {
          backgroundColor: colors.lightGray6
        }
      }}
      onClose={onClose}
    >
      {children}
    </RBSheet>
  );
}
