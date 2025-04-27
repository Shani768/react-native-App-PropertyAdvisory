import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  ActivityIndicator,
  Button,
  Modal, ScrollView, TouchableOpacity
} from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import axios from 'axios';



interface Agent {
  name: string;
}

interface Agency {
  name: string;
  slug: string;
  agentsCount: string;
  location: string;
  logo: { url: string };
  locations: {
    _geoloc: {
      lat: number;
      lng: number;
    };
  }[];
  isFeatured?: boolean;
  agents: Agent[];
  createdAt: string;
  phoneNumber: { mobile: string };

}

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [mapModalVisible, setMapModalVisible] = useState(false);
  const [mapLat, setMapLat] = useState(0);
  const [mapLng, setMapLng] = useState(0);

  const mapRef = useRef<MapView>(null);
  const router = useRouter();

  useEffect(() => {
    if (mapModalVisible && mapRef.current) {
      setTimeout(() => {
        mapRef.current?.animateToRegion(
          {
            latitude: mapLat,
            longitude: mapLng,
            latitudeDelta: 0.002,
            longitudeDelta: 0.002,
          },
          1500 // animation duration in ms
        );
      }, 300); // wait a bit for MapView to be visible
    }
  }, [mapModalVisible, mapLat, mapLng]);


  const handleOpenLocationMap = (agency: Agency) => {
    const geoLoc = agency.locations?.[0]?._geoloc;
    const latitude = geoLoc?.lat ?? 0;
    const longitude = geoLoc?.lng ?? 0;
    setMapLat(latitude);
    setMapLng(longitude);
    setMapModalVisible(true);
  };



  useEffect(() => {
    const fetchAgencies = async () => {
      if (!hasMore) return;

      setLoading(true);
      try {
        const response = await axios.get('https://bayut-com1.p.rapidapi.com/agencies/list', {
          params: {
            query: searchQuery,
            hitsPerPage: 30,
            page: page,
            lang: 'en',
          },
          headers: {
            'x-rapidapi-host': 'bayut-com1.p.rapidapi.com',
            'x-rapidapi-key': process.env.EXPO_PUBLIC_AGENCIES_API_KEY,
          },
        });

        const data = response.data;

        if (page === 0) {
          setAgencies(data?.hits || []);
        } else {
          setAgencies((prev) => [...prev, ...(data?.hits || [])]);
        }

        if ((data?.hits || []).length < 30) {
          setHasMore(false);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchAgencies();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, page]);

  const handleOpenModal = (agency: Agency) => {
    setSelectedAgency(agency);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedAgency(null);
  };


  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    setPage(0);
    setHasMore(true);
  };



  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-row items-center bg-[#f3f3f3] m-2 rounded-lg px-3">
          <Ionicons name="search" size={20} color="gray" />
          <TextInput
            placeholder="Search agency..."
            value={searchQuery}
            onChangeText={handleSearchChange}
            className="flex-1 h-14 px-2"
          />
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#555" className="mt-5" />
        ) : (
          <FlatList
            data={agencies}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => {
              return (
                <View className="bg-white shadow-lg p-4 m-2 rounded-lg border border-[#ddd]">
                  <View className="flex-row items-center">
                    <Image
                      source={{ uri: item.logo.url }}
                      className="w-20 h-12 bg-gray-200 shadow-lg rounded-lg mr-6"
                    />
                    <View className="flex-1">

                      <Text className="text-lg font-bold">{item.name}</Text>

                      {/* Location Touchable */}
                      <TouchableOpacity
                        className="flex-row mt-2 items-center"
                        onPress={() => handleOpenLocationMap(item)}
                      >
                        <Ionicons name="location-sharp" size={16} color="#777" className="mr-2" />

                        <Text className="text-sm text-gray-700 underline">View Location</Text>
                        <MaterialCommunityIcons name="calendar-today" size={16} color="gray" className="ml-6" />
                        <Text className='text-sm text-gray-700 ml-2'>{new Date(item.createdAt).toLocaleDateString()}</Text>

                      </TouchableOpacity>


                      {/* Agents & Phone */}
                      <View className="flex-row mt-2 items-center justify-between">
                        <TouchableOpacity
                          className="flex-row items-center"
                          onPress={() => handleOpenModal(item)}
                        >
                          <MaterialCommunityIcons name="account-group" size={20} color="#777" className="mr-2" />
                          <Text className="text-sm text-gray-700 underline">Agents: {item.agentsCount}</Text>
                        </TouchableOpacity>

                        {item.phoneNumber?.mobile && (
                          <View className="flex-row items-center space-x-1">
                            <Ionicons name="call" size={16} color="gray" />
                            <Text className="text-sm text-gray-700">{item.phoneNumber.mobile}</Text>
                          </View>
                        )}
                      </View>


                      <TouchableOpacity
                        onPress={() =>
                          router.push({
                            pathname: "/listing/[id]",
                            params: {
                              id: item.slug,

                            },
                          })
                        }
                        className="mt-6 bg-gray-500 py-2 px-4 rounded-lg"
                      >
                        <Text className="text-white text-center font-medium">View Listing</Text>
                      </TouchableOpacity>

                    </View>
                  </View>
                </View>
              );
            }}

            onEndReached={() => {
              if (!loading && hasMore) {
                setPage((prevPage) => prevPage + 1);
              }
            }}
            onEndReachedThreshold={0.10}
            ListFooterComponent={
              loading ? (
                <ActivityIndicator size="large" color="#555" className="my-5" />
              ) : null
            }
          />
        )}

        {/* 📍 Map Modal */}
        <Modal
          visible={mapModalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setMapModalVisible(false)}
        >
          <View className="flex-1 justify-end bg-opacity-30">
            <View className="h-[70%] bg-white rounded-t-lg overflow-hidden">
              <MapView
                ref={mapRef}
                style={{ flex: 1 }}
                initialRegion={{
                  latitude: mapLat,
                  longitude: mapLng,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                zoomEnabled={true}
                zoomControlEnabled={true}
              >
                <Marker coordinate={{ latitude: mapLat, longitude: mapLng }} />
              </MapView>


              {/* <Button title="Close" onPress={() => setMapModalVisible(false)} /> */}
              <TouchableOpacity
                onPress={() => setMapModalVisible(false)}
                className="mt-2 mx-10 mb-2 bg-gray-500 py-2 px-4 rounded-lg "
              >
                <Text className="text-white text-center font-medium">Close </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>


        {/* Agents Modal */}
        <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={handleCloseModal}>
          <View className="flex-1 justify-end bg-opacity-30">
            <View className="h-2/3 bg-white rounded-t-lg pt-4 px-4">
              <Text className="text-xl font-bold mb-2">
                Agents in {selectedAgency?.name}
              </Text>

              <ScrollView className="mt-2">
                {selectedAgency?.agents.length ? (
                  selectedAgency.agents.map((agent, index) => (
                    <View
                      key={index}
                      className="p-2 mb-2 bg-[#f1f1f1] rounded-lg flex-row items-center"
                    >
                      <MaterialCommunityIcons name="account-tie" size={24} color="#333" />
                      <Text className="ml-2 text-base">{agent.name}</Text>
                    </View>
                  ))
                ) : (
                  <Text className="text-gray-500">No agents available.</Text>
                )}
              </ScrollView>

              {/* <Button title="Close" onPress={handleCloseModal} /> */}
              <TouchableOpacity
                onPress={handleCloseModal}
                className="mt-2 mx-10 mb-2 bg-gray-500 py-2 px-4 rounded-lg "
              >
                <Text className="text-white text-center font-medium">Close </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
