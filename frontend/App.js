import './src/utils/polyfills';
import { useEffect } from 'react';
import { LogBox } from 'react-native';
import { ExpoRoot } from 'expo-router';

// Ignore specific warnings
LogBox.ignoreLogs([
  'Sending',
  'The route files',
  'Warning: Error: The route files',
  'Warning: Do not call Hooks inside useEffect'
]);

export default function App() {
  return <ExpoRoot />;
}