import React from "react";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useTheme, ThemeProvider } from "./app/src/context/ThemeContext";
import JobFinderScreen from "./app/src/screens/JobFinderScreen";
import SavedJobScreen from "./app/src/screens/SavedJobScreen";
import ApplicationFormScreen from "./app/src/screens/ApplicationFormScreen";

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { isDarkMode } = useTheme();

  return (
    <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
      <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: isDarkMode ? "#333" : "#007bff" }, headerTintColor: "#fff" }}>
        <Stack.Screen name="JobFinder" component={JobFinderScreen} options={{ title: "Job Finder" }} />
        <Stack.Screen name="SavedJobs" component={SavedJobScreen} options={{ title: "Saved Jobs" }} />
        <Stack.Screen name="ApplicationForm" component={ApplicationFormScreen} options={{ title: "Apply for Job" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App = () => (
  <ThemeProvider>
    <AppNavigator />
  </ThemeProvider>
);

export default App;
