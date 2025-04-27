
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView,  ScrollView, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import FilterScreen from '@/component/filter';
import axios from 'axios';
import PropertyList from '@/component/PropertyList';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";

interface Property {
  id: number;
  coverPhoto: { url: string };
  price: string;
  location: { name: string }[];
  rooms: number;
  baths: number;
  agency: { name: string };
  isVerified: boolean;
  rentFrequency: string;
}

interface Filters {
  rentFrequency: string;
  roomsMin?: number | null;
  roomsMax?: number | null;
  bathsMin?: number | null;
  bathsMax?: number | null;
  furnishingStatus?: string;
}

const categoryIds: { [key: string]: number } = {
  "Apartment": 4,
  "Townhouses": 16,
  "Villas": 3,
  "Penthouses": 18,
  "Hotel Apartments": 21,
  "Villa Compound": 19,
  "Residential Plot": 14,
  "Residential Floor": 12,
  "Residential Building": 17,
  "Office": 5,
  "Shop": 6,
  "Warehouse": 7,
  "Labour camp": 9,
  "Commercial Villa": 25,
  "Bulk Units": 20,
  "Commercial Plot": 15,
  "Commercial Floor": 13,
  "Commercial Building": 10,
  "Factory": 8,
  "Industrial Land": 22,
  "Mixed Use Land": 23,
  "Showroom": 24,
  "Other Commercial": 11,
};

const Index = () => {
  const [selectedType, setSelectedType] = useState<string>("For Sale");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<Filters>({ rentFrequency: "" });

  const fetchProperties = async (queryParams: Filters) => {
  setLoading(true);

  try {
    const response = await axios.get(`https://bayut.p.rapidapi.com/properties/list`, {
      params: {
        ...queryParams,
        categoryExternalID: categoryIds[selectedCategory] || "",
        locationExternalIDs: "5002",
        purpose:
          selectedType === "For Rent" ? "for-rent" :
          selectedType === "For Sale" ? "for-sale" : undefined,
      },
      headers: {
        "x-rapidapi-host": "bayut.p.rapidapi.com",
        "x-rapidapi-key": process.env.EXPO_PUBLIC_BAYUT_API_KEY,
      },
    });

    const newProperties = response?.data?.hits || [];
    setProperties(newProperties);
    // console.log('properties', newProperties);
  } catch (error) {
    console.error("Error fetching properties:", error);
  } finally {
    setLoading(false);
  }
};

const applyFilters = (newFilters: Filters) => {
  setFilters(newFilters);
};

useEffect(() => {
  if (selectedCategory || selectedType || Object.keys(filters).length) {
    fetchProperties(filters);
  }
}, [selectedCategory, selectedType, filters]);


  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["25%", "50%", "90%"], []);

  const handleSnapPress = useCallback((index: number) => {
    sheetRef.current?.snapToIndex(index);
  }, []);
  const handleClose = useCallback(() => {
    sheetRef.current?.close();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="flex-1 bg-white">
        {/* Search Bar */}
        <ScrollView>
          <View className="p-4 px-10 flex flex-row justify-between items-center">
            <Text className="text-lg font-medium">Filters :</Text>
            <TouchableOpacity className="p-2" onPress={() => handleSnapPress(1)}>
            <Ionicons name="filter" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <View className="flex-col justify-between mb-4 p-4">
            <View className="flex-row justify-between">
              {["For Sale", "For Rent"].map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setSelectedType(type as "For Rent" | "For Sale")}
                  className={`flex-1 py-3 mx-1 rounded-full ${selectedType === type ? "bg-black" : "bg-gray-200"}`}
                >
                  <Text className={`text-center font-medium ${selectedType === type ? "text-white" : "text-black"}`}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-2 h-20">
              {Object.keys(categoryIds).map((category) => (
                <TouchableOpacity
                  key={category}
                  onPress={() => setSelectedCategory(category)}
                  className={`px-4 py-2 items-center my-auto mb-2 rounded-full mr-2 ${selectedCategory === category ? "bg-black text-white" : "bg-gray-200"}`}
                >
                  <Text className={`text-sm font-medium ${selectedCategory === category ? "text-white" : "text-black"}`}>{category}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          <PropertyList
            properties={properties}
            loading={loading}
          />
        </ScrollView>

        {/* Bottom Sheet for Filters */}
        <BottomSheet
          ref={sheetRef}
          index={-1}
          snapPoints={snapPoints}
          enableDynamicSizing={false}
        >
          <BottomSheetScrollView contentContainerStyle={{ backgroundColor: "#fff", padding: 20 }}>
            <FilterScreen
              onApplyFilters={(filters) => applyFilters(filters)}
              onClose={handleClose}
            />
          </BottomSheetScrollView>
          <View className='bg-gray-200 mx-4 mb-1 rounded-md '>
            <TouchableOpacity
              onPress={() => handleClose()}
              className="mt-2 mx-10 mb-2 bg-gray-200 py-2 px-4  rounded-lg "
            >
              <Text className="text-black text-center font-medium">Close </Text>
            </TouchableOpacity>
          </View>
        </BottomSheet>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default Index