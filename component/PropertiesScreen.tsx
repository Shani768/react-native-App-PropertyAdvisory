// screens/PropertiesScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import Filter from './Filters';
import PropertyList from './PropertyList';
import axios from 'axios';

interface Property {
  id: number;
  coverPhoto?: {
    url: string;
  };
  title: string;
  price: number;
  rentFrequency: string;
  rooms: number;
  baths: number;
}

interface Filters {
  locationExternalIDs: string;
  purpose?: string;
  roomsMin?: number;
  roomsMax?: number;
  bathsMin?: number;
  bathsMax?: number;
  furnishingStatus?: string;
}

const PropertiesScreen: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filters, setFilters] = useState<Filters>({ locationExternalIDs: '5002' });
  const [loading, setLoading] = useState<boolean>(false);

  const fetchProperties = async (queryParams: Filters) => {
    setLoading(true);
    try {
      const response = await axios.get('https://bayut.p.rapidapi.com/properties/list', {
        params: queryParams,
        headers: {
          'x-rapidapi-host': 'bayut.p.rapidapi.com',
          'x-rapidapi-key': '24847262bbmsh2ee129512964a7bp143e64jsnc1df746ef874',
        },
      });
      setProperties(response.data.hits);
      console.log('properties', response)
        console.log('params', queryParams)
      
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (newFilters: Filters) => {
    setFilters(newFilters);
    // fetchProperties(newFilters);
  };
  console.log('filters', filters);
  // console.log('properties', properties);

  return (
    <View style={styles.container}>
      <ScrollView horizontal style={styles.sidebar}>
        <Filter onApplyFilters={applyFilters} />
      </ScrollView>
      <View style={styles.propertyList}>
        {loading ? <ActivityIndicator size="large" color="#0000ff" /> : <PropertyList properties={properties} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row' },
  sidebar: { width: '30%', padding: 10, backgroundColor: '#f0f0f0' },
  propertyList: { width: '70%', padding: 10, justifyContent: 'center', alignItems: 'center' },
});

export default PropertiesScreen;
