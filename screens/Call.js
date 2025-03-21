// import React from 'react'
// import { View, StyleSheet } from 'react-native'
// import { ZegoUIKitPrebuiltCall, ONE_ON_ONE_VIDEO_CALL_CONFIG } from '@zegocloud/zego-uikit-prebuilt-call-rn'
// import { useRoute } from '@react-navigation/native'
// export default function VoiceCallPage(props) {
//     const {
//         params: { item },
//     } = useRoute()

//     return (
//         <View style={styles.container}>
//             <ZegoUIKitPrebuiltCall
//                 appID={1866331340}
//                 appSign={'1866331340'}
//                 userID={item.id} // userID can be something like a phone number or the user id on your own user system.
//                 userName={item.name}
//                 callID={Math.random().to} // callID can be any unique string.
//                 config={{
//                     // You can also use ONE_ON_ONE_VOICE_CALL_CONFIG/GROUP_VIDEO_CALL_CONFIG/GROUP_VOICE_CALL_CONFIG to make more types of calls.
//                     ...ONE_ON_ONE_VIDEO_CALL_CONFIG,
//                     onCallEnd: (callID, reason, duration) => {
//                         props.navigation.goBack()
//                     },
//                 }}
//             />
//         </View>
//     )
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         alignItems: 'center',
//         justifyContent: 'center',
//         zIndex: 0,
//     },
// })

// import React from 'react'
// import ZegoUIKitPrebuiltCall, { ONE_ON_ONE_VIDEO_CALL_CONFIG } from '@zegocloud/zego-uikit-prebuilt-call-rn'
// import { useRoute } from '@react-navigation/native'

// export default function VoiceCallPage(props) {
//     const {
//         params: { item },
//     } = useRoute()
//     return (
//         <View style={styles.container}>
//             <ZegoUIKitPrebuiltCall
//                 appID={1866331340}
//                 appSign={'9f3175b691a995b2e07c87594b04837d755d9b2c43de5ced2ad47f07a9c3d6c6'}
//                 userID={item.id} // userID can be something like a phone number or the user id on your own user system.
//                 userName={item.name}
//                 callID={Math.random().to} // callID can be any unique string.
//                 config={{
//                     // You can also use ONE_ON_ONE_VOICE_CALL_CONFIG/GROUP_VIDEO_CALL_CONFIG/GROUP_VOICE_CALL_CONFIG to make more types of calls.
//                     ...ONE_ON_ONE_VIDEO_CALL_CONFIG,
//                     onHangUp: () => {
//                         props.navigation.goBack()
//                     },
//                 }}
//             />
//         </View>
//     )
// }
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         alignItems: 'center',
//         justifyContent: 'center',
//         zIndex: 0,
//     },
// })


import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Call = () => {
  return (
    <View>
      <Text>Call</Text>
    </View>
  )
}

export default Call

const styles = StyleSheet.create({})