// components/PropertyItem.tsx
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface Property {
  coverPhoto?: {
    url: string;
  };
  title: string;
  price: number;
  rentFrequency: string;
  rooms: number;
  baths: number;
}

interface PropertyItemProps {
  property: Property;
}

const PropertyItem: React.FC<PropertyItemProps> = ({ property }) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: property.coverPhoto?.url }} style={styles.image} />
      <Text style={styles.title}>{property.title}</Text>
      <Text>{property.price} AED / {property.rentFrequency}</Text>
      <Text>{property.rooms} Beds | {property.baths} Baths</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { padding: 10, backgroundColor: '#fff', marginBottom: 10, borderRadius: 5 },
  image: { width: '100%', height: 150, borderRadius: 5 },
  title: { fontSize: 16, fontWeight: 'bold', marginTop: 5 },
});

export default PropertyItem;
