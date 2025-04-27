import React, { useState, useEffect, useCallback } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, TextInput, ActivityIndicator, ScrollView, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { MaterialIcons } from "@expo/vector-icons";
import { debounce } from "lodash";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import axios from 'axios'

interface Suggestion {
  id: number;
  name: string;
  externalID: string;
  geography?: { lat: number; lng: number };
  latitude?: number;
  longitude?: number;
}


interface Property {
  id: number;
  title: string;
  price: number;
  agency: { logo: { url: string } };
  location: [];
  rooms: number;
  baths: number;
  area: number;
  coverPhoto: { url: string };
  geography: { lat: number; lng: number }; // Added _geoloc property
  purpose: string; // Added purpose property
  rentFrequency?: string; // Added rentFrequency property
}

interface Coordinates {
  latitude: number | undefined
  longitude: number | undefined
}


const PropertyCard = ({ property }: { property: Property }) => (
  <View className="bg-gray-200 p-2 rounded-lg my-1">
    <Image source={{ uri: property.coverPhoto.url }} className="w-full h-50 rounded-sm" />
    <View className="p-2.5">

    </View>
  </View>
);



export default function App() {
  const router = useRouter()
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number }>({
    latitude: 0,
    longitude: 0,
  });


  const fetchData = useCallback(
    async (text: string) => {
      if (text) {
        setLoadingSuggestions(true);
        try {
          const response = await axios.get(
            `https://bayut.p.rapidapi.com/auto-complete?query=${text}&hitsPerPage=25&page=0&lang=en`,
            {
              headers: {
                "x-rapidapi-host": "bayut.p.rapidapi.com",
                "x-rapidapi-key": process.env.EXPO_PUBLIC_BAYUT_API_KEY,
              },
            }
          );
          setSuggestions(response.data?.hits);
        } catch (error) {
          console.error("Error fetching data:", error);
          setSuggestions([]);
        } finally {
          setLoadingSuggestions(false);
        }
      } else {
        setSuggestions([]);
        setLoadingSuggestions(false);
      }
    },
    []
  );

  const debouncedFetchData = useCallback(debounce(fetchData, 1000), [fetchData]);

  useEffect(() => {
    debouncedFetchData(searchText);
    return () => {
      debouncedFetchData.cancel(); // Cleanup on unmount
    };
  }, [searchText, debouncedFetchData]);

  const fetchProperties = useCallback(async (externalID: string) => {
    setLoadingProperties(true);
    try {
      const response = await axios.get(
        `https://bayut.p.rapidapi.com/properties/list?locationExternalIDs=${externalID}&purpose=for-sale`,
        {
          headers: {
            "x-rapidapi-host": "bayut.p.rapidapi.com",
            "x-rapidapi-key": process.env.EXPO_PUBLIC_BAYUT_API_KEY,
          },
        }
      );
      setProperties(response.data.hits);
    } catch (error) {
      console.error("Error fetching properties:", error);
      setProperties([]);
    } finally {
      setLoadingProperties(false);
    }
  }, []);

  const handleSuggestionPress = useCallback(
    (item: Suggestion) => {
      setSearchText(item.name);
      setCoordinates({
        latitude: item?.latitude ?? 0,
        longitude: item?.longitude ?? 0,
      });
      setSuggestions([]);
      setSearchText("")
      fetchProperties(item.externalID);
    },
    [fetchProperties] 
  );


  return (
    <View className="flex-1">
      {/* Search Bar */}
      <View className="absolute top-2 left-2 right-2 flex flex-row bg-white rounded-lg px-3 py-2 items-center shadow-md shadow-black/10 z-10">
        <MaterialIcons name="search" size={24} color="gray" />
        <TextInput
          className="flex-1 ml-2 font-normal"
          placeholder="Search by address..."
          value={searchText}
          onChangeText={setSearchText}
        />
        {loadingSuggestions && <ActivityIndicator />}

      </View>


      {/* Suggestion List */}
      {suggestions?.[0] && (
        <View className="className=absolute top-10 left-2 right-2 bg-white rounded-xl px-4 py-2 shadow-md z-20 max-h-48">
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity className="flex-row gap-2 py-2 border-b border-gray-200"
              onPress={() => handleSuggestionPress(item)}
              >
                <MaterialCommunityIcons name="home-city" size={20} color="#555" className="mr-2" />
                <Text>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}


      {/* React Native Maps */}
      <MapView
        style={{flex : 1}}
        region={{
          latitude: coordinates.latitude || 25.062218,
          longitude: coordinates.longitude || 55.217732,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >


        {properties.map((property) => (
          <Marker
            key={property.id}
            coordinate={{
              latitude: property.geography?.lat,
              longitude: property.geography?.lng,
            }}

          >
            {/* Custom Marker View */}
            <View className="items-center">
              {/* Home Icon */}
              <View className="bg-white p-2 rounded-full shadow-lg">
                <MaterialCommunityIcons name="home" size={24} color="black" />
              </View>
            </View>
          </Marker>

        ))}
      </MapView>

      {/* Bottom Property List */}
      <View className="absolute bottom-0 w-full  p-2.5">
        <FlatList
          horizontal
          data={properties}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
            className="mr-2 bg-gray-200 p-2 rounded-lg"

            >
              <View className="flex-row">
                <Image source={{ uri: item.coverPhoto.url }}
                  className="w-[130px] h-[170px] rounded-lg"

                />

                <View className="ml-4 mt-2">
                  <View className="flex-row items-center">
                    <Text className="font-extrabold ">${item.price}</Text>
                    <Text className=" px-4 py-[2px] ml-8 rounded-full bg-gray-400 text-black ">{item.purpose}</Text>
                  </View>
                  <Text className="text-sm text-gray-500 mt-2">
                    {item.title.split(" ").slice(0, 4).join(" ")}
                  </Text>

                  <View className="flex-row items-center mt-2">
                    {/* Rooms Icon */}
                    <MaterialCommunityIcons name="bed" size={18} color="gray" />
                    <Text className="ml-1 text-gray-500">{item.rooms} Rooms</Text>

                    {/* Bath Icon */}
                    <MaterialCommunityIcons name="shower" size={18} color="gray" className="ml-4" />
                    <Text className="ml-1 text-gray-500">{item.baths} Baths</Text>

                  </View>

                  <Text className="mt-1 text-md text-gray-500">Rental:   {item.rentFrequency}</Text>

                  <TouchableOpacity
                    className="bg-slate-800 p-2 mt-2 rounded-full items-center justify-center"
                    onPress={() =>
                      router.push({
                        pathname: "/property/[id]",
                        params: {
                          id: item.id,
                          data: JSON.stringify(item),
                        },
                      })
                    }
                  >
                    <Text className="text-white text-lg font-bold uppercase">View Detail</Text>
                  </TouchableOpacity>


                </View>
              </View>
            </TouchableOpacity>
          )}
        />

      </View>
    </View>
  );
}


