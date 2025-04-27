import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';

const propertyTypes = ["monthly", "yearly", "weekly", "daily"];
const furnishing = ["unfurnished", "furnished"];

interface FilterScreenProps {
  onApplyFilters: (filters: {
    rentFrequency: string;
    roomsMin: number | null;
    roomsMax: number | null;
    bathsMin: number | null;
    bathsMax: number | null;
    furnishingStatus: string;
  }) => void;
  onClose: () => void;
}


const FilterScreen: React.FC<FilterScreenProps> = ({ onApplyFilters, onClose }) => {
  const [rentFrequency, setRentFrequency] = useState("");
  const [roomsMin, setRoomsMin] = useState<number | null>(null);
  const [roomsMax, setRoomsMax] = useState<number | null>(null);
  const [bathsMin, setBathsMin] = useState<number | null>(null);
  const [bathsMax, setBathsMax] = useState<number | null>(null);
  const [furnishingStatus, setFurnishingStatus] = useState("");

  const applyFilters = () => {
    const filters = {
      rentFrequency,
      roomsMin,
      roomsMax,
      bathsMin,
      bathsMax,
      furnishingStatus,
    };
    onApplyFilters(filters);
    onClose(); // Call the close function after applying filters
  };

  return (
    <ScrollView className="flex-1 p-2">
      {/* Rental Type */}
      <Text className="text-lg font-semibold mt-6 mb-4">Rental Type</Text>
      <View className="flex-row flex-wrap">
        {propertyTypes.map((type) => {
          const selected = rentFrequency === type;
          return (
            <TouchableOpacity
              key={type}
              onPress={() => setRentFrequency(type)}
              className={`px-4 py-2 rounded-full mr-2 mb-2 ${selected ? "bg-black" : "bg-gray-200"}`}
            >
              <Text className={`font-medium ${selected ? "text-white" : "text-black"}`}>{type}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Rooms */}
      <Text className="text-lg font-bold mt-6 mb-4">Rooms</Text>
      <Text className="mb-4 text-lg">Min:</Text>
      <View className="flex-row flex-wrap">
        {[1, 2, 3, 4].map((num) => {
          const selected = roomsMin === num;
          return (
            <TouchableOpacity
              key={num}
              onPress={() => setRoomsMin(num)}
              className={`w-12 h-12 rounded-full gap-12 justify-center items-center mr-3 mb-2 ${selected ? "bg-black" : "bg-gray-200"}`}
            >
              <Text className={`${selected ? "text-white" : "text-black"} font-medium`}>{num}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      
      <Text className="mb-4 text-lg">Max:</Text>
      <View className="flex-row flex-wrap">
        {[5, 6, 7, 8].map((num) => {
          const selected = roomsMax === num;
          return (
            <TouchableOpacity
              key={num}
              onPress={() => setRoomsMax(num)}
              className={`w-12 h-12 rounded-full justify-center items-center mr-3 mb-2 ${selected ? "bg-black" : "bg-gray-200"}`}
            >
              <Text className={`${selected ? "text-white" : "text-black"} font-medium`}>{num}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Bathrooms */}
      <Text className="text-lg font-bold mt-6 mb-4">Bathrooms</Text>
      <Text className="mb-4 text-lg">Min:</Text>
      <View className="flex-row flex-wrap">
        {[1, 2, 3, 4].map((num) => {
          const selected = bathsMin === num;
          return (
            <TouchableOpacity
              key={num}
              onPress={() => setBathsMin(num)}
              className={`w-12 h-12 rounded-full justify-center items-center mr-3 mb-2 ${selected ? "bg-black" : "bg-gray-200"}`}
            >
              <Text className={`${selected ? "text-white" : "text-black"} font-medium`}>{num}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      
      <Text className="mb-4 text-lg">Max:</Text>
      <View className="flex-row flex-wrap">
        {[5, 6, 7, 8].map((num) => {
          const selected = bathsMax === num;
          return (
            <TouchableOpacity
              key={num}
              onPress={() => setBathsMax(num)}
              className={`w-12 h-12 rounded-full justify-center items-center mr-3 mb-2 ${selected ? "bg-black" : "bg-gray-200"}`}
            >
              <Text className={`${selected ? "text-white" : "text-black"} font-medium`}>{num}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Furnishing Option */}
      <Text className="text-lg font-semibold mt-6 mb-4">Furnishing Option</Text>
      <View className="flex-row flex-wrap">
        {furnishing.map((type) => {
          const selected = furnishingStatus === type;
          return (
            <TouchableOpacity
              key={type}
              onPress={() => setFurnishingStatus(type)}
              className={`px-4 py-2 rounded-full mr-2 mb-6 ${selected ? "bg-black" : "bg-gray-200"}`}
            >
              <Text className={`font-bold ${selected ? "text-white" : "text-black"}`}>{type}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Apply Button */}
      <TouchableOpacity onPress={applyFilters} className="bg-black rounded-full py-4 mt-6 mb-4">
        <Text className="text-white text-center font-semibold text-lg">Apply Filters</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default FilterScreen;

