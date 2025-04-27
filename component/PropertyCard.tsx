import React from "react";
import { View, Text, Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

const PropertyCard = ({ property }: { property: any }) => {
  const router = useRouter();

  return (
    <TouchableOpacity
    onPress={() =>
      router.push({
        pathname: "/property/[id]",
        params: {
          id: property.id,
          data: JSON.stringify(property),
        },
      })
    }
  >
    <View className="mb-4 bg-white rounded-lg p-6 shadow-2xl">
     
      <Image
        source={{ uri: property?.coverPhoto?.url }}
         className="w-full h-52 rounded-xl"

      />
      <View
        className="flex-row justify-between"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 5,
        }}
      >
        <View>
          <Text className="text-xl font-semibold mt-2">{property?.price}</Text>
          <Text className="text-gray-500">
            {property?.location?.[0]?.name}, {property?.location?.[1]?.name}
          </Text>
        </View>

        <View className="flex-col gap-y-2">
          <View className="flex-row items-center mt-2">
            <MaterialCommunityIcons name="bed" size={18} color="gray" />
            <Text className="ml-1 text-gray-800">{property?.rooms} Rooms</Text>
            <Text> | </Text>
            <MaterialCommunityIcons name="shower" size={18} color="gray" />
            <Text className="ml-1 text-gray-800">{property?.baths} Baths</Text>
          </View>

          <View className="flex-row items-center justify-between space-x-2">
            {property?.isVerified && (
              <MaterialCommunityIcons
                name="check-decagram"
                size={16}
                color="blue"
              />
            )}
            <Text className="text-sm text-gray-400">
              {property?.agency?.name?.split(" ").slice(0, 3).join(" ")}
            </Text>
            <Text className="text-sm text-gray-400 ml-2">
              {property?.rentFrequency}
            </Text>
          </View>
        </View>
      </View>
    </View>
    </TouchableOpacity>
  );
};

export default PropertyCard;
