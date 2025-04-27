import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Modal,
  Pressable,
  Dimensions,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Feather, MaterialIcons } from 'react-native-vector-icons';

interface Agency {
  id: string;
  name: string;
  logo: string;
  location: string;
  agentsCount: number;
  isFeatured: boolean;
  latitude: number;
  longitude: number;
}

interface Props {
  agency: Agency;
}

export const AgencyCard: React.FC<Props> = ({ agency }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    if (modalVisible && mapRef.current) {
      // Delay to ensure MapView has rendered before animating
      setTimeout(() => {
        mapRef.current?.animateToRegion(
          {
            latitude: agency.latitude,
            longitude: agency.longitude,
            latitudeDelta: 0.002, // High zoom level
            longitudeDelta: 0.002,
          },
          3000
        );
      }, 100);
    }
  }, [modalVisible]);

  return (
    <View style={styles.card}>
      <Image source={{ uri: agency.logo }} style={styles.logo} />

      <View style={styles.info}>
        <View style={styles.headerRow}>
          <Text style={styles.name}>{agency.name}</Text>
          {agency.isFeatured && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>FEATURED</Text>
            </View>
          )}
        </View>

        <Pressable style={styles.row} onPress={() => setModalVisible(true)}>
          <Feather name="map-pin" size={16} color="#777" style={styles.icon} />
          <Text style={styles.subText}>{agency.location}</Text>
        </Pressable>

        <View style={styles.row}>
          <MaterialIcons name="groups" size={16} color="#777" style={styles.icon} />
          <Text style={styles.subText}>{agency.agentsCount} Agents</Text>
        </View>
      </View>

      {/* 📍 Map Modal */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
  <View style={styles.modalOverlay}>
    <View style={styles.halfModal}>
      <MapView
        style={{ flex: 1 }}
        ref={mapRef}
        showsUserLocation={true}
        zoomEnabled={true}
        zoomControlEnabled={true}
      >
        <Marker
          coordinate={{
            latitude: agency.latitude,
            longitude: agency.longitude,
          }}
          title={agency.name}
          description={agency.location}
        />
      </MapView>

      <Pressable style={styles.closeButton} className='bg-gray-600 m-4' onPress={() => setModalVisible(false)}>
        <Text style={styles.closeButtonText}>Close Map</Text>
      </Pressable>
    </View>
  </View>
</Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  
  halfModal: {
    height: Dimensions.get('window').height / 2,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  logo: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 16,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
  },
  subText: {
    fontSize: 14,
    color: '#555',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  icon: {
    marginRight: 6,
  },
  closeButton: {
    backgroundColor: 'gray',
    padding: 14,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
