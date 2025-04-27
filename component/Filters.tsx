// components/Filter.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';

interface FilterProps {
  onApplyFilters: (filters: {
    locationExternalIDs: string;
    purpose: string;
    roomsMin: number;
    roomsMax: number;
    bathsMin: number;
    bathsMax: number;
    furnishingStatus: string;
  }) => void;
}

const Filter: React.FC<FilterProps> = ({ onApplyFilters }) => {
  const [location, setLocation] = useState<string>('');
  const [purpose, setPurpose] = useState<string>('for-rent');
  const [roomsMin, setRoomsMin] = useState<number>(1);
  const [roomsMax, setRoomsMax] = useState<number>(5);
  const [bathsMin, setBathsMin] = useState<number>(1);
  const [bathsMax, setBathsMax] = useState<number>(4);
  const [furnishingStatus, setFurnishingStatus] = useState<string>('furnished');

  const applyFilters = () => {
    const filters = {
      locationExternalIDs: location,
      purpose,
      roomsMin,
      roomsMax,
      bathsMin,
      bathsMax,
      furnishingStatus,
    };
    onApplyFilters(filters);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Filters</Text>

      <Text>Location External IDs</Text>
      <TextInput
        style={styles.input}
        value={location}
        onChangeText={setLocation}
        placeholder="Enter Location IDs"
      />

      <Text>Purpose</Text>
      <Picker selectedValue={purpose} onValueChange={setPurpose} style={styles.picker}>
        <Picker.Item label="For Rent" value="for-rent" />
        <Picker.Item label="For Sale" value="for-sale" />
      </Picker>

      <Text>Rooms</Text>
      <Slider minimumValue={1} maximumValue={10} step={1} value={roomsMin} onValueChange={setRoomsMin} />
      <Text>Min Rooms: {roomsMin}</Text>

      <Slider minimumValue={1} maximumValue={10} step={1} value={roomsMax} onValueChange={setRoomsMax} />
      <Text>Max Rooms: {roomsMax}</Text>

      <Text>Bathrooms</Text>
      <Slider minimumValue={1} maximumValue={5} step={1} value={bathsMin} onValueChange={setBathsMin} />
      <Text>Min Bathrooms: {bathsMin}</Text>

      <Slider minimumValue={1} maximumValue={5} step={1} value={bathsMax} onValueChange={setBathsMax} />
      <Text>Max Bathrooms: {bathsMax}</Text>

      <Text>Furnishing Status</Text>
      <Picker selectedValue={furnishingStatus} onValueChange={setFurnishingStatus} style={styles.picker}>
        <Picker.Item label="Furnished" value="furnished" />
        <Picker.Item label="Unfurnished" value="unfurnished" />
      </Picker>

      <Button title="Apply Filters" onPress={applyFilters} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 10, backgroundColor: '#f8f8f8' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 5, marginBottom: 10 },
  picker: { height: 40, marginBottom: 10 },
});

export default Filter;
