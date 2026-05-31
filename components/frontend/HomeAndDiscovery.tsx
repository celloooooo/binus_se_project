import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
} from 'react-native';
import {
  MessageSquare,
  Bell,
  Users2,
  Target,
  Filter,
  Search,
  ChevronRight,
  ImageIcon,
  Calendar,
  PlusCircle,
  UserPlus
} from 'lucide-react-native';
import MapView from '../MapViewComponent';
import { BottomBar } from './BottomBar';
import { styles } from './styles';

interface HomeProps {
  mapRef: any;
  setScreen: (screen: string) => void;
  goToMyLocation: () => void;
  currentUser: any;
}

export const HomeScreen = ({ mapRef, setScreen, goToMyLocation, currentUser }: HomeProps) => (
  <View style={styles.container}>
    <MapView 
      ref={mapRef} 
      style={styles.map} 
      showsUserLocation={true} 
      showsMyLocationButton={false} 
      followsUserLocation={false} 
      initialRegion={{ latitude: -6.1754, longitude: 106.8272, latitudeDelta: 0.05, longitudeDelta: 0.05 }} 
    />
    <View style={styles.header}>
      <Text style={styles.brandText}>DriveTribe</Text>
      <View style={styles.headerIcons}>
        <TouchableOpacity onPress={() => setScreen('inbox')}>
          <MessageSquare size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setScreen('notifications')}>
          <Bell size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
    <View style={styles.leftActionStack}>
      <TouchableOpacity style={styles.circularActionBtn}>
        <Users2 size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.circularActionBtn} onPress={goToMyLocation}>
        <Target size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.circularActionBtn}>
        <Filter size={24} color="black" />
      </TouchableOpacity>
    </View>
    <BottomBar active="home" setScreen={setScreen} currentUser={currentUser} />
  </View>
);

interface SearchMainProps {
  setScreen: (screen: string) => void;
  currentUser: any;
  myGroups: any[];
}

export const SearchMainScreen = ({ setScreen, currentUser, myGroups }: SearchMainProps) => {
  const SectionRow = ({ label, action }: { label: string; action: string }) => (
    <View style={styles.searchSectionRow}>
      <Text style={styles.sectionTitleText}>{label}</Text>
      <TouchableOpacity style={styles.rowAlign}>
        <Text style={styles.linkTextGray}>{action}</Text>
        <ChevronRight size={18} color="#999" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.whiteContainer}>
      <View style={styles.searchHeaderTop}>
        <TextInput placeholder="Search" style={styles.searchField} placeholderTextColor="#999" />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitleText}>Discover</Text>
        </View>
        <View style={styles.discoverTagsContainer}>
          {[
            '🔥 Trending Near Posts', 
            '📌 Trending Hashtags', 
            '🌍 Trending Worldwide Posts', 
            '🎉 Today\'s Events', 
            '🆕 New Events', 
            '👋 Nearby Users', 
            '👥 Popular Groups'
          ].map((tag, index) => (
            <TouchableOpacity key={index} style={styles.tagBadge}>
              <Text style={styles.tagText}>{tag}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <SectionRow label="Posts" action="Discover all Posts" />
        <View style={styles.noResultContainer}>
          <ImageIcon size={70} color="#777" strokeWidth={1.5} />
          <Text style={styles.noResultMainText}>No Results</Text>
          <Text style={styles.noResultSubText}>No Posts could be found at this time</Text>
        </View>
        
        <SectionRow label="Groups" action="Discover all Groups" />
        {(!myGroups || myGroups.length === 0) ? (
          <View style={styles.emptyGroupsContainer}>
            <Users2 size={60} color="#999" strokeWidth={1.5} />
            <Text style={[styles.noResultMainText, { color: '#666' }]}>No Groups Joined</Text>
            <Text style={styles.noResultSubText}>Join groups to see your communities here!</Text>
          </View>
        ) : (
          myGroups.map((group, index) => (
            <TouchableOpacity 
              key={group.id || index} 
              style={styles.groupCard}
              onPress={() => {
                // Biarkan user navigasi ke group feed
                setScreen('groups');
              }}
            >
              <Image source={{ uri: group.cover_image || 'https://images.unsplash.com/photo-1617531653520-4893f7bbf978?w=1200' }} style={styles.groupImage} />
              <View style={styles.groupInfo}>
                <View style={styles.groupRow}>
                  <Image source={{ uri: group.logo || 'https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg' }} style={styles.groupLogo} />
                  <View>
                    <Text style={styles.groupTitle}>{group.name}</Text>
                    <View style={styles.groupMetaRow}>
                      <Text style={styles.groupMeta}>
                        {group.visibility?.toLowerCase() === 'public' ? '🌐 Public' : '🔒 Private'}
                      </Text>
                      <Text style={styles.groupMeta}>👥 Joined</Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
        
        <SectionRow label="Events" action="Discover all Events" />
        <View style={styles.noResultContainer}>
          <Calendar size={70} color="#777" strokeWidth={1.5} />
          <Text style={styles.noResultMainText}>No Results</Text>
          <Text style={styles.noResultSubText}>No Events could be found at this time,{"\n"}use Map View to widen your search!</Text>
        </View>
      </ScrollView>
      <BottomBar active="search" setScreen={setScreen} currentUser={currentUser} />
    </View>
  );
};

interface AddPostProps {
  setScreen: (screen: string) => void;
  currentUser: any;
  handleCreateGroupQuickly?: () => void;
}

export const AddPostScreen = ({ setScreen, currentUser, handleCreateGroupQuickly }: AddPostProps) => (
  <View style={styles.whiteContainer}>
    <View style={styles.addPostMain}>
      <Text style={styles.addPostTitle}>Create Content</Text>
      <Text style={styles.addPostSubtitle}>Share your thoughts, stories, or upcoming event...</Text>
      
      <TouchableOpacity style={styles.addCard} onPress={() => setScreen('createPost')}>
        <View style={[styles.iconBox, { backgroundColor: '#8E24AA' }]}><PlusCircle size={30} color="white" /></View>
        <View style={styles.cardInfo}><Text style={styles.cardLabel}>Post</Text><Text style={styles.cardSub}>Post to the map...</Text></View>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.addCard} onPress={() => setScreen('createEvent')}>
        <View style={[styles.iconBox, { backgroundColor: '#1E88E5' }]}><Calendar size={30} color="white" /></View>
        <View style={styles.cardInfo}><Text style={styles.cardLabel}>Event</Text><Text style={styles.cardSub}>Organize an event...</Text></View>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.addCard} onPress={() => setScreen('createGroup')}>
        <View style={[styles.iconBox, { backgroundColor: '#43A047' }]}><UserPlus size={30} color="white" /></View>
        <View style={styles.cardInfo}><Text style={styles.cardLabel}>Group</Text><Text style={styles.cardSub}>Create a group...</Text></View>
      </TouchableOpacity>
    </View>
    <BottomBar active="plus" setScreen={setScreen} currentUser={currentUser} />
  </View>
);
