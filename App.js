import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Audio } from 'expo-av';

export default function App() {
  const [recording, setRecording] = useState(null);
  const [sound, setSound] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      setRecording(recording);
      setIsRecording(true);
      await recording.startAsync();
    } catch (error) {
      console.error('Failed to start recording', error);
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    try {
      await recording.stopAndUnloadAsync();
    } catch (error) {
      console.error('Failed to stop recording', error);
    }
  };

  const playSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(recording.getURI());
      setSound(sound);
      setIsPlaying(true);
      await sound.playAsync();
    } catch (error) {
      console.error('Failed to play sound', error);
    }
  };

  const stopSound = async () => {
    setIsPlaying(false);
    try {
      await sound.stopAsync();
    } catch (error) {
      console.error('Failed to stop sound', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Button
          title={isRecording ? 'Stop Recording' : 'Start Recording'}
          onPress={isRecording ? stopRecording : startRecording}
        />
        <Text style={styles.status}>{isRecording ? 'Recording...' : ''}</Text>
      </View>
      <View style={styles.row}>
        <Button
          title={isPlaying ? 'Stop Playing' : 'Play Recorded Sound'}
          onPress={isPlaying ? stopSound : playSound}
          disabled={!recording}
        />
        <Text style={styles.status}>{isPlaying ? 'Playing...' : ''}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  status: {
    marginLeft: 10,
  },
});

