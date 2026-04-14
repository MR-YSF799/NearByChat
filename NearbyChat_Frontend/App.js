import { registerRootComponent } from 'expo';
import AppNavigator from './src/navigation/AppNavigator';

function App() {
  return <AppNavigator />;
}

registerRootComponent(App);