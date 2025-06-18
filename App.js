import React from 'react';
import { StyleSheet, Text, View, Dimensions, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

function HomeScreen() {
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.title}>🏠 Home</Text>
      <Text style={styles.paragraph}>Welcome to the main application view.</Text>
    </View>
  );
}

function SettingsScreen() {
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.title}>⚙️ Settings</Text>
      <Text style={styles.paragraph}>Here you can configure the app.</Text>
    </View>
  );
}

function ProfileScreen() {
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.title}>👤 Profile</Text>
      <Text style={styles.paragraph}>This is your user profile.</Text>
    </View>
  );
}

function AboutScreen() {
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.title}>ℹ️ About</Text>
      <Text style={styles.paragraph}>Information about the app.</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color }) => {
            let icon = '❓';
            if (route.name === 'Home') icon = '🏠';
            else if (route.name === 'Settings') icon = '⚙️';
            else if (route.name === 'Profile') icon = '👤';
            else if (route.name === 'About') icon = 'ℹ️';
            return <Text style={{ color, fontSize: 22 }}>{icon}</Text>;
          },
          tabBarActiveTintColor: '#4A00E0',
          tabBarInactiveTintColor: '#aaa',
          tabBarStyle: {
            backgroundColor: '#fff',
            borderTopWidth: 1,
            borderTopColor: '#ccc',
            height: 70,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 10,
            elevation: 10,
            paddingBottom: Platform.OS === 'ios' ? 20 : 10,
            paddingTop: 5,
          },
          tabBarLabelStyle: {
            fontSize: 14,
            fontWeight: '600',
          },
          headerShown: false,
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
        <Tab.Screen name="About" component={AboutScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  paragraph: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    maxWidth: 300,
  },
});
