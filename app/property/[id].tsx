import { View, Text, Image, FlatList, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';


interface Property {
    id: string;
    title: string;
    price: number;
    description: string;
    rooms: number;
    baths: number;
    area: number;
    coverPhoto?: { url: string };
    photos: { id: number; url: string }[];
    location?: { name: string }[];
    geography?: {
      lat: number;
      lng: number;
    };
    contactName?: string;
    phoneNumber?: {
      mobile?: string;
      whatsapp?: string;
    };
  }
  

export default function PropertyDetail() {
  const { id } = useLocalSearchParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProperty = async () => {
    try {
      const response = await axios.get(`https://bayut.p.rapidapi.com/properties/detail`, {
        params: { externalID: id },
        // params: { externalID: 4937770},
        headers: {
          'x-rapidapi-host': 'bayut.p.rapidapi.com',
          'x-rapidapi-key': '24847262bbmsh2ee129512964a7bp143e64jsnc1df746ef874',
        },
      });
      setProperty(response.data);
    } catch (error) {
      console.error('Error fetching property:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperty();
  }, [id]);

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  if (!property) return <Text style={{ marginTop: 20 }}>Property not found</Text>;

  return (
    <>       
    <Stack.Screen options={{ headerShown: true, title: '' }} />
           
    <ScrollView style={{ padding: 16 }}>
      {/* Cover Photo */}
      <Image
        source={{ uri: property.coverPhoto?.url }}
        style={{ width: '100%', height: 250, borderRadius: 12 }}
        resizeMode="cover"
      />
   <Text>property: {id}</Text>
      {/* Title and Price */}
      <View style={{ marginTop: 16 }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold' }}>{property.title}</Text>
        <Text style={{ fontSize: 18, color: '#555', marginTop: 4 }}>
          AED {property.price.toLocaleString()}
        </Text>
      </View>

      {/* Icons for Info */}
      <View style={{ flexDirection: 'row', marginTop: 12, gap: 16, alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="bed-outline" size={18} color="#555" />
          <Text style={{ marginLeft: 4 }}>{property.rooms} Beds</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="water-outline" size={18} color="#555" />
          <Text style={{ marginLeft: 4 }}>{property.baths} Baths</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <FontAwesome5 name="ruler-combined" size={16} color="#555" />
          <Text style={{ marginLeft: 4 }}>{Math.round(property.area)} sqft</Text>
        </View>
      </View>

      {/* Location */}
      <Text style={{ marginTop: 8, color: '#777' }}>
        {property.location?.map((loc) => loc.name).join(', ')}
      </Text>

      {/* Description */}
      <Text style={{ marginTop: 12, lineHeight: 22 }}>{property.description}</Text>

      {/* Gallery */}
      <Text style={{ marginTop: 20, fontSize: 18, fontWeight: '600' }}>Gallery</Text>
      <FlatList
        horizontal
        data={property.photos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item.url }}
            style={{
              width: 200,
              height: 140,
              marginRight: 10,
              marginTop: 8,
              borderRadius: 10,
            }}
            resizeMode="cover"
          />
        )}
        showsHorizontalScrollIndicator={false}
      />

      {/* Map Location */}
      {property.geography?.lat && property.geography?.lng && (
        <View style={{ marginTop: 24 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 8 }}>Location</Text>
          <MapView
            style={{ width: '100%', height: 200, borderRadius: 12 }}
            initialRegion={{
              latitude: property.geography.lat,
              longitude: property.geography.lng,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={{
                latitude: property.geography.lat,
                longitude: property.geography.lng,
              }}
              title={property.title}
              description={property.location?.map((loc) => loc.name).join(', ')}
            />
          </MapView>
        </View>
      )}

      {/* Contact Info */}
      <View style={{ marginTop: 24, borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: '600' }}>Contact</Text>
        <Text style={{ marginTop: 4 }}>Agent: {property.contactName}</Text>
        <Text>Phone: {property.phoneNumber?.mobile}</Text>
        <Text>WhatsApp: {property.phoneNumber?.whatsapp}</Text>
      </View>
    </ScrollView>
    </>
  );
}
