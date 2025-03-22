import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import JobFinderScreen from '../src/screens/JobFinderScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="JobFinder" component={JobFinderScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
