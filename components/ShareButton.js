import React from 'react';
import {Share, TouchableOpacity, Button, Text} from 'react-native';


export default function ShareButton({ message}) {
    const onShare = async () => {
        try {
          const result = await Share.share({
            message:
              message,
          });
          if (result.action === Share.sharedAction) {
            if (result.activityType) {
              // shared with activity type of result.activityType
            } else {
              // shared
            }
          } else if (result.action === Share.dismissedAction) {
            // dismissed
          }
        } catch (error) {
          alert(error.message);
        }
      };

    return (
    <TouchableOpacity
      style={{
        borderRadius: 8,
        height: 50,
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e94832'
      }}
      activeOpacity={0.7}
      onPress={onShare}
    >
      <Text
        style={{ fontSize: 18, color: 'white', textTransform: 'uppercase' , textAlign: 'center', }}
      >
        Share
      </Text>
    </TouchableOpacity>
    );




}