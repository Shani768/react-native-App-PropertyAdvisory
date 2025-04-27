import React from 'react'
import { TouchableOpacity, View, Image,Text  } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';

const PropertyCardMini = React.memo(({ item }: { item: any }) => (
    <TouchableOpacity
      style={{
        marginRight: 10,
        backgroundColor: "#f3f3f3",
        padding: 10,
        borderRadius: 10,
      }}
    >
      <View className="flex-row">
        <Image
          source={{ uri: item.coverPhoto?.url }}
          className="w-[130px] h-[170px] rounded-lg"
        />
  
        <View className="ml-4 mt-2">
          <View className="flex-row items-center">
            <Text className="font-extrabold ">${item.price}</Text>
            <Text className=" px-4 py-[2px] ml-8 rounded-full bg-gray-400 text-black ">
              {item.purpose}
            </Text>
          </View>
          <Text className="text-sm text-gray-500 mt-2">
            {item.title.split(" ").slice(0, 4).join(" ")}
          </Text>
  
          <View className="flex-row items-center mt-2">
            <MaterialCommunityIcons name="bed" size={18} color="gray" />
            <Text className="ml-1 text-gray-500">{item.rooms} Rooms</Text>
            <MaterialCommunityIcons name="shower" size={18} color="gray" style={{ marginLeft: 10 }} />
            <Text className="ml-1 text-gray-500">{item.baths} Baths</Text>
          </View>
  
          <Text className="mt-1 text-md text-gray-500">
            Rental: {item.rentFrequency}
          </Text>
  
          <TouchableOpacity className="bg-slate-800 p-2 mt-2 rounded-full items-center justify-center">
            <Text className="text-white text-lg font-bold uppercase">
              View Detail
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  ));
  