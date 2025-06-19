import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, FlatList, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Clock, Settings, History, Info } from 'lucide-react-native';

// CONTEXTO GLOBAL
const AppContext = createContext();
const Tab = createBottomTabNavigator();

/** ClockScreen Component **/
function ClockScreen() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const timerIntervalRef = useRef(null);
  const { addActivity } = useContext(AppContext);

  useEffect(() => {
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  useEffect(() => {
    if (timerRunning) {
      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerIntervalRef.current);
    }
    return () => clearInterval(timerIntervalRef.current);
  }, [timerRunning]);

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return [hours, minutes, seconds]
      .map(v => (v < 10 ? '0' + v : v))
      .join(':');
  };

  const handleStartPause = () => {
    if (timerRunning && timerSeconds > 0) {
      addActivity({
        id: Date.now(),
        description: 'Timed Session',
        durationSeconds: timerSeconds,
        timestamp: new Date().toISOString(),
      });
      Alert.alert('Session Logged', `Duration: ${formatTime(timerSeconds)}`);
    }
    setTimerRunning(prev => !prev);
  };

  const handleReset = () => {
    clearInterval(timerIntervalRef.current);
    setTimerRunning(false);
    setTimerSeconds(0);
  };

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.screenTitle}>Current Time & Timer</Text>
      <Text style={styles.currentTimeText}>{currentTime.toLocaleTimeString()}</Text>
      <View style={styles.timerContainer}>
        <Text style={styles.timerDisplay}>{formatTime(timerSeconds)}</Text>
        <View style={styles.timerControls}>
          <TouchableOpacity
            style={[styles.timerButton, timerRunning ? styles.pauseButton : styles.startButton]}
            onPress={handleStartPause}
          >
            <Text style={styles.buttonText}>{timerRunning ? 'Pause' : 'Start'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.timerButton}
            onPress={handleReset}
            disabled={timerSeconds === 0 && !timerRunning}
          >
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.screenText}>
        Monitor real-time clock and manage your stopwatch sessions.
      </Text>
    </View>
  );
}

/** SettingsScreen Component **/
function SettingsScreen() {
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.screenTitle}>App Settings</Text>
      <Text style={styles.screenText}>
        Configure your time zone, notification preferences, and display options here.
      </Text>
      <TouchableOpacity style={styles.settingOption}>
        <Text style={styles.settingOptionText}>Time Zone Selection 🌐</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.settingOption}>
        <Text style={styles.settingOptionText}>Notification Frequency 🔔</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.settingOption}>
        <Text style={styles.settingOptionText}>Dark Mode Toggle 🌙</Text>
      </TouchableOpacity>
      <Text style={styles.screenText}>
        [Future Enhancement: Interactive toggles and selectors for settings]
      </Text>
    </View>
  );
}

/** ActivityLogScreen Component **/
function ActivityLogScreen() {
  const { activityLog } = useContext(AppContext);

  const renderActivityItem = ({ item }) => (
    <View style={styles.activityItem}>
      <Text style={styles.activityDescription}>{item.description}</Text>
      <Text style={styles.activityDuration}>
        Duration: {Math.floor(item.durationSeconds / 3600).toString().padStart(2, '0')}:
        {Math.floor((item.durationSeconds % 3600) / 60).toString().padStart(2, '0')}:
        {(item.durationSeconds % 60).toString().padStart(2, '0')}
      </Text>
      <Text style={styles.activityTimestamp}>
        Logged: {new Date(item.timestamp).toLocaleString()}
      </Text>
    </View>
  );

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.screenTitle}>Activity Log</Text>
      {activityLog.length === 0 ? (
        <Text style={styles.screenText}>No activities logged yet. Start the timer!</Text>
      ) : (
        <FlatList
          data={activityLog}
          renderItem={renderActivityItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.activityListContent}
          style={styles.activityList}
        />
      )}
    </View>
  );
}

/** AboutScreen Component **/
function AboutScreen() {
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.screenTitle}>About This Time App</Text>
      <Text style={styles.screenText}>Version 1.0.0</Text>
      <Text style={styles.screenText}>
        Developed as a sample application for React Native navigation.
      </Text>
      <Text style={styles.screenText}>© 2025 David Portillo - BIS</Text>
    </View>
  );
}

/** Main App Component **/
export default function App() {
  const [activityLog, setActivityLog] = useState([]);

  const addActivity = (activity) => {
    setActivityLog(prev => [activity, ...prev]);
  };

  return (
    <AppContext.Provider value={{ activityLog, addActivity }}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let IconComponent;
              if (route.name === 'Time') IconComponent = Clock;
              else if (route.name === 'Settings') IconComponent = Settings;
              else if (route.name === 'Log') IconComponent = History;
              else if (route.name === 'About') IconComponent = Info;
              return <IconComponent size={size} color={color} />;
            },
            tabBarActiveTintColor: '#06D6A0',
            tabBarInactiveTintColor: 'gray',
            tabBarStyle: {
              backgroundColor: '#ffffff',
              borderTopWidth: 1,
              borderTopColor: '#f0f0f0',
              height: Dimensions.get('window').height * 0.08,
              paddingBottom: Dimensions.get('window').height * 0.01,
              paddingTop: Dimensions.get('window').height * 0.01,
            },
            tabBarLabelStyle: {
              fontSize: Dimensions.get('window').width * 0.03,
              fontWeight: '600',
            },
            headerShown: false,
          })}
        >
          <Tab.Screen name="Time" component={ClockScreen} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
          <Tab.Screen name="Log" component={ActivityLogScreen} />
          <Tab.Screen name="About" component={AboutScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </AppContext.Provider>
  );
}

/**
 * StyleSheet for defining the visual properties of components.
 * Styles are encapsulated within a JavaScript object, mirroring CSS properties.
 */
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F8F8', // Light background for all screens
    padding: 20,
    width: Dimensions.get('window').width, // Ensures full width
    height: Dimensions.get('window').height, // Ensures full height
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#073B4C', // Dark Navy from palette
    textAlign: 'center',
  },
  screenText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginHorizontal: 20,
    marginTop: 10,
  },
  // ClockScreen specific styles
  currentTimeText: {
    fontSize: 56, // Larger for main time display
    fontWeight: '900', // Extra bold for emphasis
    color: '#118AB2', // Blue from palette
    marginVertical: 30, // Vertical spacing
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: '#ffffff',
    borderRadius: 15, // Rounded corners for the timer box
    padding: 25,
    shadowColor: '#000', // Shadow for depth
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8, // Android shadow
  },
  timerDisplay: {
    fontSize: 48,
    fontWeight: '700',
    color: '#073B4C', // Dark Navy
    marginBottom: 20,
  },
  timerControls: {
    flexDirection: 'row', // Buttons in a row
    justifyContent: 'space-around', // Space evenly
    width: '100%',
  },
  timerButton: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    minWidth: 100,
    alignItems: 'center',
    backgroundColor: '#FFD166', // Default button color (Yellow)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  startButton: {
    backgroundColor: '#06D6A0', // Green for Start button
  },
  pauseButton: {
    backgroundColor: '#FF6B6B', // Red for Pause button
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // SettingsScreen specific styles
  settingOption: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 3,
    alignItems: 'center', // Center text within the option box
  },
  settingOptionText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
  // ActivityLogScreen specific styles
  activityList: {
    width: '100%',
    flexGrow: 1, // Allows FlatList to grow and fill available space
  },
  activityListContent: {
    paddingBottom: 20, // Padding at the bottom of the scrollable content
  },
  activityItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 10, // Horizontal margin for list items
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 3,
    width: Dimensions.get('window').width * 0.9, // Make list items take 90% of screen width
  },
  activityDescription: {
    fontSize: 18,
    fontWeight: '600',
    color: '#073B4C', // Dark Navy
    marginBottom: 5,
  },
  activityDuration: {
    fontSize: 16,
    color: '#118AB2', // Blue
    marginBottom: 3,
  },
  activityTimestamp: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
  },
});
