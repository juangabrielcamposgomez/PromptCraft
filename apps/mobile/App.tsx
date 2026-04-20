import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { useAuth } from '@devflow/core';

export default function App() {
  const { user, isAuthenticated, login, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shared Logic (Mobile)</Text>
      {isAuthenticated ? (
        <>
          <Text>Welcome, {user?.name}!</Text>
          <Button title="Logout" onPress={logout} />
        </>
      ) : (
        <>
          <Text>You are not logged in.</Text>
          <Button 
            title="Login as Mobile Architect" 
            onPress={() => login({ id: "1", name: "Mobile Architect", email: "mobile@example.com" })} 
          />
        </>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
