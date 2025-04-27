import React from 'react';
import { FlatList, ActivityIndicator, View, Text } from 'react-native';
import PropertyCard from './PropertyCard';

interface PropertyListProps {
  properties: any[];
  loading: boolean;
}

const PropertyList = ({
  properties,
  loading,
}: PropertyListProps) => {
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center mt-6">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (properties.length === 0) {
    return (
      <View className="flex-1 justify-center items-center mt-6">
        <Text style={{ fontSize: 16, color: '#555' }}>No properties found</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={properties}
      keyExtractor={(item, index) => `${item.id}-${index}`}
      renderItem={({ item }) => <PropertyCard property={item} />}
      contentContainerStyle={{ padding: 8, marginTop: 8 }}
      scrollEnabled={false}
    />
  );
};

export default PropertyList;
