import Toast, { ToastOptions } from 'react-native-root-toast';

export const DefaultToastMessageOptions = ({
  shouldShowWithBottomNavBar = false,
}: {
  shouldShowWithBottomNavBar?: boolean;
}): ToastOptions => ({
  delay: 0.0,
  shadow: true,
  animation: true,
  hideOnPress: true,
  duration: 2000,
  position: Toast.positions.BOTTOM,
  opacity: 1.0,
  containerStyle: {
    width: '80%',
    position: 'absolute',
    backgroundColor: '#FF0000',
    bottom: !shouldShowWithBottomNavBar ? 10.0 : 80.0,
  },
  textStyle: { fontSize: 14.0, lineHeight: 22.0 },
});
