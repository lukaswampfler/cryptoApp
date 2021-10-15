import React from 'react';
import { View } from 'react-native';

import LanguagePicker from '../components/LanguagePicker';

export default function SettingsScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <LanguagePicker />
    </View>
  );
}