import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList,SafeAreaView,ScrollView,ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import { Stack } from 'expo-router';


// Types
interface License {
  authority: string;
  number: string;
}

interface OwnerAgent {
  isTruBroker: boolean;
  name: string;
  user_image: string;
}

interface Listing {
  agency: {
    active: boolean;
    licenses: License[];
    logo: { url: string };
    name: string;
  };
  coverPhoto: { url: string };
  ownerAgent: OwnerAgent;
  phoneNumber: { mobile: string };
  price: string;
  title: string;
}

// Route params type
interface RouteParams {
  id: string;
}

const ListingCard = () => {
  const route = useRoute();
  const { id } = route.params as RouteParams;

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await axios.get('https://bayut-com1.p.rapidapi.com/agencies/get-listings', {
          params: {
            agencySlug: id,
            hitsPerPage: 30,
            page: 0,
          },
          headers: {
            'x-rapidapi-host': 'bayut-com1.p.rapidapi.com',
            'x-rapidapi-key': process.env.EXPO_PUBLIC_AGENCIES_API_KEY,
          },
        });
  
        setListings(response?.data?.hits || []); // Just set hits directly!
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchListings();
  }, [id]);
  

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  if (listings.length === 0) return <Text>No Listings Found.</Text>;

  const sharedLogo = listings[0].agency.logo.url;
  const name = listings[0].agency.name;
  const agencyActive = listings[0].agency.active;
  const licenses = listings[0].agency.licenses;

  return (
    <>
       <Stack.Screen options={{ headerShown: true, title: '' }} />
       
      <ScrollView>
      <View className="flex-row mx-4 mt-2 items-center bg-gray-100 py-4 px-4 rounded-xl space-x-4">
        {/* Logo */}
        <Image source={{ uri: sharedLogo }} className="h-36 w-36 rounded-full object-contain" />

        {/* Info */}
        <View className="flex-1 ml-10">
          <Text className="text-lg font-semibold text-gray-800">{name}</Text>

          <Text className="text-sm text-gray-600 mt-1">
            Status: <Text className={agencyActive ? 'text-green-600' : 'text-red-500'}>
              {agencyActive ? 'Active' : 'Inactive'}
            </Text>
          </Text>

          <View className="mt-1">
            <Text className="text-sm text-gray-700 font-medium">Licenses:</Text>
            {licenses.map((lic, index) => (
              <Text key={index} className="text-xs mt-1 text-gray-600 ml-2">
                • {lic.authority}: {lic.number}
              </Text>
            ))}
          </View>
        </View>
      </View>

       <SafeAreaView>
      <FlatList
        data={listings}
        keyExtractor={(_, index) => index.toString()}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View className="bg-white rounded-2xl shadow-md mx-4 mb-4 overflow-hidden">
            {/* Shared Logo */}

            {/* Cover Photo */}
            <Image source={{ uri: item.coverPhoto.url }} className="w-full h-48" resizeMode="cover" />

            {/* Content */}
            <View className="p-4">
              <Text className="text-lg font-semibold text-gray-800 mb-2">{item.title}</Text>

              <View className="flex-row justify-between items-center mb-2">
                {/* Agent Info */}
                <View className="flex-row items-center">
                  <Image source={{ uri: item.ownerAgent.user_image }} className="h-8 w-8 rounded-full mr-2" />
                  <Text className="text-sm text-gray-700">{item.ownerAgent.name}</Text>
                </View>

                {/* Price */}
                <Text className="text-base font-bold text-black">AED {item.price}</Text>
              </View>

              {/* Phone */}
              <View className="flex-row items-center">
                <MaterialIcons name="phone" size={16} color="gray" />
                <Text className="ml-2 text-sm text-gray-600">{item.phoneNumber.mobile}</Text>
              </View>
            </View>
          </View>
        )}
      />
      </SafeAreaView>
      </ScrollView>
    </>
  );
};

export default ListingCard;
