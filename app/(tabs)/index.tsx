import {
  ArrowLeft,
  Bell,
  BellOff,
  Bookmark,
  Calendar,
  Camera,
  Check,
  ChevronDown, // ✅ Ikon baru untuk dropdown
  ChevronRight,
  Ellipsis,
  FileText,
  Filter,
  Flame,
  Heart,
  Home as HomeIcon,
  Image as ImageIcon,
  Map,
  MapPin,
  MessageCircle,
  MessageCircleOff,
  MessageSquare,
  Plus,
  PlusCircle,
  Search,
  Send,
  Share2,
  ShieldAlert,
  ShieldCheck,
  Tag,
  Pencil,
  Target,
  Trash2,
  Upload,
  User as UserIcon,
  UserPlus,
  Users2,
  Wrench
} from 'lucide-react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useRef, useState } from 'react';
import Svg, { Path } from 'react-native-svg';
import * as ImagePicker from 'expo-image-picker';

const ScrewdriverWrenchIcon = ({ size = 24, color = '#555', style }: { size?: number; color?: string; style?: any }) => (
  <Svg width={size} height={size} viewBox="0 0 512 512" style={style}>
    <Path 
      d="M78.6 5C69.1-2.4 55.6-1.5 47 7L7 47c-8.5 8.5-9.4 22-2.1 31.6l80 104c4.5 5.9 11.6 9.4 19 9.4h54.1l109 109c-14.7 29-10 65.4 14.3 89.6l112 112c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-112-112c-24.2-24.2-60.6-29-89.6-14.3l-109-109V135.2c0-7.5 3.5-14.6 9.4-19l104-80c9.7-7.4 10.6-21.7 2.1-30.2L421.3 7c-8.5-8.5-22.1-9.5-31.6-2L286.2 92.4c-3.6 2.8-5.8 7.1-6.2 11.7H226.7c-4.6-.4-8.9-2.6-11.7-6.2L78.6 5zM452 352c-12.5 12.5-12.5 32.8 0 45.3l32 32c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-32-32c-12.5-12.5-32.8-12.5-45.3 0l-64 64z"
      fill={color} 
      transform="translate(512, 0) scale(-1, 1)"
    />
  </Svg>
);


import {
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  PanResponder,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import MapView from '../../components/MapViewComponent';

const { width } = Dimensions.get('window');

const mockUsers: any[] = [];

const PRESENTATION_USER = {
  id: 999,
  firstName: 'Felix',
  lastName: 'Furukawa',
  username: 'felixfuru',
  email: 'felix@drivetribe.com',
  password: 'password123',
  profileImage: 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=500',
  coverImage: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=1000',
  bio: 'Just a normal guy who is crazy enough to daily his Rx8 for 6 years and own 5 rotary shitbox',
  stats: { badges: 0, posts: 0, followers: 0, following: 0 },
  cars: ['2010 Mazda Rx8'],
  groups: [
    { 
      id: 'g1', 
      name: 'DrivnBye', 
      members: 574,
      tag: '[DRVNBY]',
      bio: 'Driven Together 🚦 Explore, Connect, & Share the Auto-World!',
      website: 'drivnbye.com',
      posts: [
        {
          id: 'p1', user: 'crestedisland', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
          location: 'WeatherTech Raceway Laguna Seca, North Peri...', 
          images: ['https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=800', 'https://images.unsplash.com/photo-1619382304110-6b1674ef581f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
          likes: 5, comments: 0, caption: 'I ❤️ race car silhouettes', time: '14 days ago'
        },
        {
          id: 'p2', user: 'zbarscarz', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100',
          location: '181, Crown Street, Chapel Street Historic District...', 
          images: ['https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=800', 'https://images.unsplash.com/photo-1630312465536-5c6b1f76dc3f?q=80&w=927&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'https://images.unsplash.com/photo-1617650728468-8581e439c864?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
          likes: 12, comments: 3, caption: 'Downtown New Haven has some really nice parking garages for photos! Random spots from a Friday night', time: 'a month ago'
        },
        {
          id: 'p3', user: 'jcarvajal98', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100',
          location: 'Rise Nation, 3814, Northeast 1st Avenue...', 
          images: ['https://images.unsplash.com/photo-1762028691549-3f0bc1736167?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'https://images.unsplash.com/photo-1753522596147-c5b9cbbe9c0e?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
          likes: 8, comments: 1, caption: 'A beautiful 993 parked down at the design district', time: '2 months ago'
        },
        {
          id: 'p4', user: 'domin1c1125', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
          location: 'Los Angeles, California', 
          images: ['https://images.unsplash.com/photo-1664540239244-e09e4dc9e30b?q=80&w=2457&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
          likes: 24, comments: 5, caption: 'My Mustang. Cannot wait to be able to upgrade soon! 🏍️💨', time: '3 months ago'
        },
        {
          id: 'p5', user: 'bimmerfan', avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100',
          location: 'Miami Beach, Florida', 
          images: ['https://images.unsplash.com/photo-1723834084217-bb6c36701cc4?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'https://images.unsplash.com/photo-1558951391-99f8a375df50?q=80&w=1364&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
          likes: 41, comments: 7, caption: 'Spotted this beauty today right by the beach. The paint job is insane!', time: '4 months ago'
        }
      ]
    },
    { 
      id: 'g2', 
      name: 'JDM Heaven 🇯🇵', 
      members: 65,
      tag: '[JDM]',
      bio: 'Join the group if you have a JDM Car 🇯🇵\nJoin the group if you love JDM Cars 🇯🇵🔰',
      website: '',
      posts: [
        {
          id: 'p6', user: 'goatcurry', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
          location: 'Tokyo, Japan', 
          images: ['https://images.unsplash.com/photo-1692574152212-b7c00152af22?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'https://images.unsplash.com/photo-1727373890725-c195fdb4c764?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
          likes: 45, comments: 12, caption: 'Saw this at CU Car Club a couple months back, absolutely beautiful wrx.', time: '1 month ago'
        },
        {
          id: 'p7', user: 'jdm_daily', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100',
          location: 'Osaka, Japan', 
          images: ['https://images.unsplash.com/photo-1725797941736-e4ad075ed2a5?q=80&w=3160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
          likes: 120, comments: 24, caption: 'Godzilla in the streets of Tokyo 🦖. R34 never disappoints.', time: '2 months ago'
        },
        {
          id: 'p8', user: 'rotary_boy', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100',
          location: 'Kyoto, Japan', 
          images: ['https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800', 'https://images.unsplash.com/photo-1692574021676-ab5d8db0114f?q=80&w=1912&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
          likes: 88, comments: 5, caption: 'Brap brap brap! Nothing beats the rotary sound.', time: '3 months ago'
        },
        {
          id: 'p9', user: 'touge_runner', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
          location: 'Mount Fuji, Japan', 
          images: ['https://images.unsplash.com/photo-1611821064430-0d402241afe4?w=800', 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=800'],
          likes: 67, comments: 9, caption: 'Timeless classic. The NSX is a masterpiece on the touge.', time: '4 months ago'
        }
      ]
    }
  ]
};

export default function App() {
  const [screen, setScreen] = useState('login');
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const createSwipeResponder = (onSwipeLeft?: () => void, onSwipeRight?: () => void) => {
    return PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 40 && Math.abs(gestureState.dy) < 25;
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx < -50 && onSwipeLeft) {
          onSwipeLeft();
        } else if (gestureState.dx > 50 && onSwipeRight) {
          onSwipeRight();
        }
      },
    });
  };
  
  const [loginForm, setLoginForm] = useState({ username: 'felixfuru', password: 'password123' });
  const [signupForm, setSignupForm] = useState({ firstName: '', lastName: '', username: '', email: '', password: '', confirmPassword: '' });
  
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [savedPosts, setSavedPosts] = useState<Record<string, boolean>>({});
  const [activeSlides, setActiveSlides] = useState<Record<string, number>>({});
  const [showGroupMenu, setShowGroupMenu] = useState(false);

  // STATE UNTUK CREATE GROUP
  const [isPrivate, setIsPrivate] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [groupCoverUri, setGroupCoverUri] = useState<string | null>(null);
  const [groupPhotoUri, setGroupPhotoUri] = useState<string | null>(null);
  const [groupName, setGroupName] = useState('');
  const [groupBio, setGroupBio] = useState('');
  const [groupTag, setGroupTag] = useState('');
  const [groupLocation, setGroupLocation] = useState('');
  const [groupWebsite, setGroupWebsite] = useState('');

  const pickGroupCover = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setGroupCoverUri(result.assets[0].uri);
    }
  };

  const pickGroupPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setGroupPhotoUri(result.assets[0].uri);
    }
  };

  const handleCreateGroup = () => {
    if (!groupName.trim()) {
      Alert.alert('❌ Error', 'Group name is required!');
      return;
    }

    const newGroup = {
      id: 'g_' + Date.now(),
      name: groupName,
      members: 1,
      tag: groupTag ? `[${groupTag.toUpperCase().replace(/[\[\]]/g, '')}]` : undefined,
      bio: groupBio,
      website: groupWebsite,
      coverPhoto: groupCoverUri || 'https://images.unsplash.com/photo-1603811478698-0b1d6256f79a?w=1200',
      logo: groupPhotoUri || 'https://images.unsplash.com/photo-1584610351025-1cf49565315d?w=400',
      isPrivate: isPrivate,
      posts: []
    };

    if (currentUser) {
      const updatedGroups = [...(currentUser.groups || []), newGroup];
      setCurrentUser({
        ...currentUser,
        groups: updatedGroups
      });
    }

    Alert.alert('🎉 Success', `Group "${groupName}" created successfully!`);
    
    // Reset state
    setGroupName('');
    setGroupBio('');
    setGroupTag('');
    setGroupLocation('');
    setGroupWebsite('');
    setGroupCoverUri(null);
    setGroupPhotoUri(null);
    setIsPrivate(false);

    setScreen('groups');
  };

  // STATE UNTUK NEW POST
  const [postCaption, setPostCaption] = useState('');
  const [disableComments, setDisableComments] = useState(false);

  // ✅ STATE BARU UNTUK NEW EVENT
  const [boostEvent, setBoostEvent] = useState(false);

  // STATE UNTUK MODIFIKASI KENDARAAN
  const [modifications, setModifications] = useState<any[]>([]);
  const [modForm, setModForm] = useState({ name: '', description: '', link: '', classification: 'Classification' });
  const [showClassificationModal, setShowClassificationModal] = useState(false);
  const [catSearchQuery, setCatSearchQuery] = useState('');
  const [tempClassification, setTempClassification] = useState('Performance');
  const [showVehicleMenu, setShowVehicleMenu] = useState(false);
  const [vehicleBackScreen, setVehicleBackScreen] = useState('profile');

  const handleSaveModification = () => {
    if (!modForm.name.trim()) {
      Alert.alert('❌ Error', 'Nama modifikasi tidak boleh kosong!');
      return;
    }
    const newMod = {
      id: Date.now(),
      name: modForm.name,
      description: modForm.description,
      link: modForm.link,
      classification: modForm.classification === 'Classification' ? 'Other' : modForm.classification
    };
    setModifications(prev => [...prev, newMod]);
    setModForm({ name: '', description: '', link: '', classification: 'Classification' });
    setScreen('vehicleDetail');
    Alert.alert('✅ Berhasil', 'Modifikasi berhasil ditambahkan!');
  };

  const mapRef = useRef<any>(null);
  
  React.useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    try {
      const data = await AsyncStorage.getItem('users');
      let users = data ? JSON.parse(data) : [];
      users = users.filter((u: any) => u.username !== 'felixfuru');
      users.push(PRESENTATION_USER);
      await AsyncStorage.setItem('users', JSON.stringify(users));
      mockUsers.length = 0; 
      mockUsers.push(...users); 
      if (currentUser?.username === 'felixfuru') {
        setCurrentUser(PRESENTATION_USER);
      }
    } catch (e) { console.log(e); }
  };

  const handleLogin = async () => {
    try {
      const data = await AsyncStorage.getItem('users');
      const users = data ? JSON.parse(data) : [];
      const user = users.find((u: any) => u.username === loginForm.username && u.password === loginForm.password);
      if (user) {
        setCurrentUser(user);
        setScreen('home');
        Alert.alert('✅ Login Success', `Welcome back, ${user.firstName}!`);
      } else {
        Alert.alert('❌ Login Failed', 'Username atau password salah!');
      }
    } catch (e) { Alert.alert('Error', 'Login failed'); }
  };

  const handleSignup = async () => {
    if (!signupForm.firstName || !signupForm.lastName || !signupForm.username || !signupForm.email || !signupForm.password || !signupForm.confirmPassword) {
      Alert.alert('❌ Error', 'Semua field harus diisi!'); return;
    }
    if (signupForm.password !== signupForm.confirmPassword) {
      Alert.alert('❌ Error', 'Password tidak cocok!'); return;
    }
    if (mockUsers.find(u => u.username === signupForm.username)) {
      Alert.alert('❌ Error', 'Username sudah digunakan!'); return;
    }

    const newUser = {
      id: Date.now(), firstName: signupForm.firstName, lastName: signupForm.lastName, username: signupForm.username, email: signupForm.email, password: signupForm.password,
      profileImage: null, coverImage: null, bio: '', cars: [], groups: [], stats: { badges: 0, posts: 0, followers: 0, following: 0 }
    };

    try {
      mockUsers.push(newUser);
      await AsyncStorage.setItem('users', JSON.stringify(mockUsers));
      setCurrentUser(newUser);
      setScreen('home');
      Alert.alert('✅ Register Success', `Welcome, ${newUser.firstName}!`);
    } catch (e) { Alert.alert('Error', 'Failed saving account'); }
  };

  const handleLogout = () => { setCurrentUser(null); setScreen('login'); Alert.alert('👋 Logged out', 'See you soon!'); };
  const goToMyLocation = () => { mapRef.current?.animateCamera({ center: { latitude: -6.1754, longitude: 106.8272 }, zoom: 17 }); };

  const toggleLike = (postId: any) => setLikedPosts(prev => ({ ...prev, [postId]: !prev[postId] }));
  const toggleSave = (postId: any) => setSavedPosts(prev => ({ ...prev, [postId]: !prev[postId] }));
  const handleScrollImage = (event: any, postId: any) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveSlides(prev => ({ ...prev, [postId]: slideIndex }));
  };

  const HomeScreen = () => (
    <View style={styles.container}>
      <MapView ref={mapRef} style={styles.map} showsUserLocation={true} showsMyLocationButton={false} followsUserLocation={false} initialRegion={{ latitude: -6.1754, longitude: 106.8272, latitudeDelta: 0.05, longitudeDelta: 0.05 }} />
      <View style={styles.header}>
        <Text style={styles.brandText}>DriveTribe</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => setScreen('inbox')}><MessageSquare size={24} color="black" /></TouchableOpacity>
          <TouchableOpacity onPress={() => setScreen('notifications')}><Bell size={24} color="black" /></TouchableOpacity>
        </View>
      </View>
      <View style={styles.leftActionStack}>
        <TouchableOpacity style={styles.circularActionBtn}><Users2 size={24} color="black" /></TouchableOpacity>
        <TouchableOpacity style={styles.circularActionBtn} onPress={goToMyLocation}><Target size={24} color="black" /></TouchableOpacity>
        <TouchableOpacity style={styles.circularActionBtn}><Filter size={24} color="black" /></TouchableOpacity>
      </View>
      <BottomBar active="home" />
    </View>
  );

  const GroupsScreen = () => (
    <View style={styles.whiteContainer}>
      <View style={styles.topPageHeader}>
        <View style={{ width: 28 }} />
        <Text style={styles.topPageTitle}>My Groups</Text>
        <TouchableOpacity onPress={() => setScreen('createGroup')}>
          <Plus size={28} color="black" />
        </TouchableOpacity>
      </View>
      <View style={{ paddingHorizontal: 15, marginTop: 15 }}>
        <TextInput placeholder="Search My Groups" style={styles.searchField} placeholderTextColor="#999" />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120, paddingTop: 15 }}>
        {(!currentUser?.groups || currentUser.groups.length === 0) ? (
          <View style={styles.emptyGroupsContainer}>
            <Users2 size={70} color="#999" strokeWidth={1.5} />
            <Text style={styles.emptyGroupsTitle}>No Groups Yet</Text>
            <Text style={styles.emptyGroupsText}>Join groups to connect with other car enthusiasts{'\n'}near you or worldwide!</Text>
            <TouchableOpacity style={styles.joinGroupsBtn}><Text style={styles.joinGroupsBtnText}>Find Groups</Text></TouchableOpacity>
          </View>
        ) : (
          currentUser.groups.map((group: any, index: number) => (
            <TouchableOpacity 
              key={index} 
              style={styles.groupCard}
              onPress={() => {
                setSelectedGroup(group);
                setScreen('groupFeed');
              }}
            >
              <Image source={{ uri: group.coverPhoto || (index === 0 ? 'https://images.unsplash.com/photo-1617531653520-4893f7bbf978?w=1200' : 'https://images.unsplash.com/photo-1603811478698-0b1d6256f79a?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D') }} style={styles.groupImage} />
              <View style={styles.groupInfo}>
                <View style={styles.groupRow}>
                  <Image source={{ uri: group.logo || (index === 0 ? 'https://images.unsplash.com/photo-1638759811641-1f9296d8f606?q=80&w=3132&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' : 'https://images.unsplash.com/photo-1584610351025-1cf49565315d?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D') }} style={styles.groupLogo} />
                  <View>
                    <Text style={styles.groupTitle}>{group.name}</Text>
                    <View style={styles.groupMetaRow}>
                      <Text style={styles.groupMeta}>{group.isPrivate ? '🔒 Private' : '🌐 Public'}</Text>
                      <Text style={styles.groupMeta}>👥 {group.members}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
      <BottomBar active="groups" />
    </View>
  );

  const GroupFeedScreen = () => {
    if (!selectedGroup) return null;

    const dummyCover = selectedGroup.coverPhoto || (selectedGroup.name === 'DrivnBye' 
      ? 'https://images.unsplash.com/photo-1617531653520-4893f7bbf978?w=1200' 
      : 'https://images.unsplash.com/photo-1603811478698-0b1d6256f79a?w=1200');
      
    const dummyLogo = selectedGroup.logo || (selectedGroup.name === 'DrivnBye'
      ? 'https://images.unsplash.com/photo-1638759811641-1f9296d8f606?w=400'
      : 'https://images.unsplash.com/photo-1584610351025-1cf49565315d?w=400');

    return (
      <View style={styles.feedContainer}>
        <View style={styles.groupDetailTopBar}>
          <TouchableOpacity onPress={() => setScreen('groups')} style={styles.groupDetailTopBtn}>
            <ArrowLeft size={24} color="black" />
          </TouchableOpacity>
          <View style={styles.groupDetailTopRight}>
            <TouchableOpacity><Bell size={20} color="black" /></TouchableOpacity>
            <View style={styles.verticalDivider} />
            <TouchableOpacity onPress={() => setShowGroupMenu(true)}>
              <Ellipsis size={20} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} bounces={false} contentContainerStyle={{ paddingBottom: 120 }}>
          <Image source={{uri: dummyCover}} style={styles.groupCoverPhoto} />
          
          <View style={styles.groupInfoContainer}>
            <View style={styles.avatarTagRow}>
              <View style={styles.groupAvatarWrapper}>
                <Image source={{uri: dummyLogo}} style={styles.groupAvatarImage} />
              </View>
              {selectedGroup.tag && (
                <View style={styles.groupTagBadgeDetailed}>
                  <Text style={styles.groupTagTextDetailed}>{selectedGroup.tag}</Text>
                </View>
              )}
            </View>

            <Text style={styles.groupDetailTitle}>{selectedGroup.name}</Text>
            <View style={styles.groupDetailMetaRow}>
              <Text style={styles.groupDetailMetaText}>{selectedGroup.isPrivate ? '🔒 Private' : '🌐 Public'}  👥 {selectedGroup.members}</Text>
            </View>
            
            {selectedGroup.bio && <Text style={styles.groupDetailBioText}>{selectedGroup.bio}</Text>}
            {selectedGroup.website && <Text style={styles.groupDetailLinkText}>{selectedGroup.website}</Text>}
            
            <TouchableOpacity style={styles.inviteButton}>
              <Text style={styles.inviteButtonText}>Invite Members</Text>
            </TouchableOpacity>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.groupTabsScroll}>
              <View style={[styles.groupTabPill, styles.groupTabActivePill]}><Text style={styles.groupTabActiveText}>Info</Text></View>
              <View style={styles.groupTabPill}><Text style={styles.groupTabTextDetailed}>Group Garage</Text></View>
              <View style={styles.groupTabPill}><Text style={styles.groupTabTextDetailed}>Members</Text></View>
            </ScrollView>
          </View>

          {selectedGroup.posts?.map((post: any, index: number) => {
            const isLiked = likedPosts[post.id];
            const isSaved = savedPosts[post.id];
            const currentLikes = post.likes + (isLiked ? 1 : 0);
            const slideIndex = activeSlides[post.id] || 0;

            return (
              <View key={index} style={styles.postCard}>
                <View style={styles.postHeaderRow}>
                  <View style={styles.postHeaderLeft}>
                    <Image source={{uri: post.avatar}} style={styles.postAvatar} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.postUserText}>
                        {post.user} <Text style={styles.postGroupText}> {'>'} {selectedGroup.name}</Text>
                      </Text>
                      <Text style={styles.postLocationText} numberOfLines={1}>{post.location}</Text>
                    </View>
                  </View>
                </View>

                <ScrollView 
                  horizontal pagingEnabled showsHorizontalScrollIndicator={false}
                  onMomentumScrollEnd={(e) => handleScrollImage(e, post.id)}
                >
                  {post.images.map((imgUrl: any, imgIdx: number) => (
                    <Image key={imgIdx} source={{uri: imgUrl}} style={styles.postMainImage} />
                  ))}
                </ScrollView>

                {post.images.length > 1 && (
                  <View style={styles.carouselDots}>
                    {post.images.map((_: any, i: number) => (
                      <View key={i} style={[styles.dot, slideIndex === i && styles.activeDot]} />
                    ))}
                  </View>
                )}

                <View style={[styles.postActionRow, { marginTop: post.images.length > 1 ? 12 : 16 }]}>
                  <View style={styles.postActionLeft}>
                    <TouchableOpacity style={styles.actionIcon} onPress={() => toggleLike(post.id)}>
                      <Heart size={26} color={isLiked ? '#E53935' : 'black'} fill={isLiked ? '#E53935' : 'transparent'} />
                    </TouchableOpacity>
                    <Text style={styles.actionText}>{currentLikes}</Text>
                    
                    <TouchableOpacity style={styles.actionIcon}><MessageCircle size={26} color="black" /></TouchableOpacity>
                    <Text style={styles.actionText}>{post.comments}</Text>
                    
                    <TouchableOpacity style={styles.actionIcon} onPress={() => setShowGroupMenu(true)}><Send size={26} color="black" /></TouchableOpacity>
                  </View>
                  
                  <TouchableOpacity onPress={() => toggleSave(post.id)}>
                    <Bookmark size={26} color={isSaved ? '#555' : 'black'} fill={isSaved ? '#555' : 'transparent'} />
                  </TouchableOpacity>
                </View>

                <View style={styles.postTextContainer}>
                  <Text style={styles.postCaptionText}>{post.caption}</Text>
                  <Text style={styles.postTimeText}>{post.time}</Text>
                </View>
              </View>
            );
          })}
        </ScrollView>

        <TouchableOpacity style={styles.fabCreatePost}>
          <Plus size={32} color="white" />
        </TouchableOpacity>

        <Modal visible={showGroupMenu} transparent={true} animationType="slide">
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowGroupMenu(false)}>
            <TouchableOpacity style={styles.bottomSheet} activeOpacity={1}>
              <View style={styles.sheetHandle} />
              <TouchableOpacity style={styles.sheetActionRow}>
                <Share2 size={24} color="#2196F3" />
                <Text style={styles.sheetMainText}>Share Group</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.sheetActionRow}>
                <Upload size={24} color="#2196F3" />
                <View>
                  <Text style={styles.sheetMainText}>Send To...</Text>
                  <Text style={styles.sheetSubText}>Send this to a friend</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.sheetActionRow}>
                <ShieldCheck size={24} color="#D84315" />
                <Text style={[styles.sheetMainText, { color: '#D84315' }]}>Report Group</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      </View>
    );
  };

  const CreateGroupScreen = () => {
    return (
      <View style={styles.whiteContainer}>
        <View style={[styles.topPageHeader, { paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#EEE' }]}>
          <TouchableOpacity onPress={() => setScreen('groups')} style={{ width: 80 }}>
            <ArrowLeft size={28} color="black" />
          </TouchableOpacity>
          <Text style={styles.topPageTitle}>New Group</Text>
          <TouchableOpacity 
            onPress={handleCreateGroup} 
            style={{ width: 80, alignItems: 'flex-end' }}
            disabled={!groupName.trim()}
          >
            <Text style={{ color: groupName.trim() ? '#2196F3' : '#999', fontSize: 16, fontWeight: '600' }}>Create</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 50 }} showsVerticalScrollIndicator={false}>
          
          <Text style={styles.formLabel}>Group Cover Photo</Text>
          <TouchableOpacity onPress={pickGroupCover} style={styles.coverPhotoPlaceholder}>
            {groupCoverUri ? (
              <Image source={{ uri: groupCoverUri }} style={{ width: '100%', height: '100%', borderRadius: 8 }} />
            ) : (
              <ImageIcon size={40} color="#999" />
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={pickGroupCover}>
            <Text style={styles.addPictureText}>Add Picture</Text>
          </TouchableOpacity>

          <Text style={[styles.formLabel, { marginTop: 25 }]}>Group Photo</Text>
          <TouchableOpacity onPress={pickGroupPhoto} style={styles.avatarPlaceholder}>
            {groupPhotoUri ? (
              <Image source={{ uri: groupPhotoUri }} style={{ width: '100%', height: '100%', borderRadius: 50 }} />
            ) : (
              <ImageIcon size={35} color="#999" />
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={pickGroupPhoto}>
            <Text style={styles.addPictureText}>Add Picture</Text>
          </TouchableOpacity>

          <Text style={[styles.formLabel, { marginTop: 25 }]}>Group Name *</Text>
          <TextInput 
            style={styles.formInput} 
            value={groupName}
            onChangeText={setGroupName}
            placeholder="e.g. JDM Heaven"
            placeholderTextColor="#999"
          />

          <Text style={[styles.formLabel, { marginTop: 20 }]}>Description</Text>
          <TextInput 
            style={[styles.formInput, { height: 100, textAlignVertical: 'top', paddingTop: 15 }]} 
            multiline 
            value={groupBio}
            onChangeText={setGroupBio}
            placeholder="Describe what your group is about..."
            placeholderTextColor="#999"
          />

          <View style={{ marginTop: 20 }}>
            <Text style={styles.formLabel}>Group Tag</Text>
            <Text style={styles.formSubLabel}>Users can pin this tag to their profile</Text>
            <TextInput 
              style={[styles.formInput, { marginTop: 8 }]} 
              value={groupTag}
              onChangeText={setGroupTag}
              placeholder="e.g. JDM"
              placeholderTextColor="#999"
            />
          </View>

          <View style={{ marginTop: 20 }}>
            <Text style={styles.formLabel}>Location</Text>
            <Text style={styles.formSubLabel}>Add a location to your group to help find local users</Text>
            <View style={[styles.formInput, { marginTop: 8, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15 }]}>
              <Map size={20} color="#888" style={{ marginRight: 10 }} />
              <TextInput 
                style={{ flex: 1, fontSize: 16, color: '#333', padding: 0 }} 
                placeholder="Select Location" 
                placeholderTextColor="#888"
                value={groupLocation}
                onChangeText={setGroupLocation}
              />
            </View>
          </View>

          <View style={{ marginTop: 20 }}>
            <Text style={styles.formLabel}>Group URL</Text>
            <TextInput 
              style={[styles.formInput, { marginTop: 8 }]} 
              value={groupWebsite}
              onChangeText={setGroupWebsite}
              placeholder="https://www.drivnbye.com" 
              placeholderTextColor="#888" 
            />
          </View>

          <View style={styles.toggleRow}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={styles.formLabel}>Private Group</Text>
              <Text style={styles.formSubLabel}>Private groups are only visible to members</Text>
            </View>
            <Switch value={isPrivate} onValueChange={setIsPrivate} trackColor={{ false: '#CCC', true: '#444' }} thumbColor="#FFF" />
          </View>

          <View style={[styles.toggleRow, { marginTop: 15 }]}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={styles.formLabel}>Locked Group</Text>
              <Text style={styles.formSubLabel}>Lock groups do not allow new members to join</Text>
            </View>
            <Switch value={isLocked} onValueChange={setIsLocked} trackColor={{ false: '#CCC', true: '#444' }} thumbColor="#FFF" />
          </View>

        </ScrollView>
      </View>
    );
  };

  const CreatePostScreen = () => {
    return (
      <View style={styles.whiteContainer}>
        <View style={[styles.topPageHeader, { paddingBottom: 15 }]}>
          <TouchableOpacity onPress={() => setScreen('addPost')} style={{ width: 60 }}>
            <ArrowLeft size={28} color="black" />
          </TouchableOpacity>
          <Text style={styles.topPageTitle}>New Post</Text>
          <TouchableOpacity style={{ width: 60, alignItems: 'flex-end', flexDirection: 'row', justifyContent: 'flex-end' }}>
            <Text style={{ color: '#999', fontSize: 16, fontWeight: '600' }}>Create </Text>
            <ChevronRight size={18} color="#999" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
          <View style={styles.captionHeaderRow}>
            <Text style={[styles.formLabel, { color: '#888', fontWeight: '500' }]}>Caption</Text>
            <TouchableOpacity style={styles.boostPostBtn}>
              <Flame size={18} color="#E91E63" fill="#E91E63" />
              <Text style={styles.boostPostText}>Boost Post</Text>
            </TouchableOpacity>
          </View>

          <TextInput 
            style={styles.captionInputTextarea} 
            multiline 
            maxLength={2000}
            value={postCaption}
            onChangeText={setPostCaption}
          />
          <Text style={styles.charCountText}>{postCaption.length}/2000</Text>

          <Text style={styles.preferencesHeader}>Post Preferences</Text>
          <View style={styles.preferencesDivider} />

          <View style={styles.toggleRowPref}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={styles.formLabel}>Disable Comments</Text>
              <Text style={styles.formSubLabel}>Disable comments on this post</Text>
            </View>
            <Switch value={disableComments} onValueChange={setDisableComments} trackColor={{ false: '#CCC', true: '#444' }} thumbColor="#FFF" />
          </View>
        </ScrollView>

        <View style={styles.postBottomToolbar}>
          <View style={styles.toolbarHandle} />
          <View style={styles.toolbarIconRow}>
            <TouchableOpacity><Camera size={28} color="#2E7D32" /></TouchableOpacity>
            <TouchableOpacity><ImageIcon size={28} color="#D32F2F" /></TouchableOpacity>
            <TouchableOpacity><FileText size={28} color="#F57C00" /></TouchableOpacity>
            <TouchableOpacity><MapPin size={28} color="#1565C0" /></TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  // ✅ HALAMAN BARU: CREATE EVENT (DARI TOMBOL BIRU)
  const CreateEventScreen = () => {
    return (
      <View style={styles.whiteContainer}>
        <View style={[styles.topPageHeader, { paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#EEE' }]}>
          <TouchableOpacity onPress={() => setScreen('addPost')} style={{ width: 50 }}>
            <ArrowLeft size={28} color="black" />
          </TouchableOpacity>
          <Text style={styles.topPageTitle}>Create Event</Text>
          <TouchableOpacity style={{ width: 50, alignItems: 'flex-end', flexDirection: 'row', justifyContent: 'flex-end' }}>
            <Text style={{ color: '#999', fontSize: 16, fontWeight: '600' }}>Save </Text>
            <ChevronRight size={18} color="#999" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 50 }} showsVerticalScrollIndicator={false}>
          
          <View style={styles.coverPhotoPlaceholder}>
            <ImageIcon size={40} color="#999" />
          </View>
          <TouchableOpacity>
            <Text style={styles.addPictureText}>Add Picture</Text>
          </TouchableOpacity>

          <Text style={[styles.formLabel, { marginTop: 25 }]}>Event Name</Text>
          <TextInput style={styles.formInput} placeholder="Cars & Coffee" placeholderTextColor="#999" />

          <Text style={[styles.formLabel, { marginTop: 20 }]}>Start Date</Text>
          <TouchableOpacity style={[styles.formInput, { flexDirection: 'row', alignItems: 'center' }]}>
            <Calendar size={20} color="#888" style={{ marginRight: 10 }} />
            <Text style={{ color: '#888', fontSize: 16 }}>Select a date</Text>
          </TouchableOpacity>

          <Text style={[styles.formLabel, { marginTop: 20 }]}>End Date</Text>
          <TouchableOpacity style={[styles.formInput, { flexDirection: 'row', alignItems: 'center' }]}>
            <Calendar size={20} color="#888" style={{ marginRight: 10 }} />
            <Text style={{ color: '#888', fontSize: 16 }}>Select a date</Text>
          </TouchableOpacity>

          <Text style={[styles.formLabel, { marginTop: 20 }]}>Event Type</Text>
          <TouchableOpacity style={[styles.formInput, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
            <Text style={{ color: '#888', fontSize: 16 }}>Select</Text>
            <ChevronDown size={20} color="#888" />
          </TouchableOpacity>

          <Text style={[styles.formLabel, { marginTop: 20 }]}>Event Location</Text>
          <TouchableOpacity style={[styles.formInput, { flexDirection: 'row', alignItems: 'center' }]}>
            <Map size={20} color="#888" style={{ marginRight: 10 }} />
            <Text style={{ color: '#888', fontSize: 16 }}>Select Location</Text>
          </TouchableOpacity>

          <Text style={[styles.formLabel, { marginTop: 20 }]}>Categories</Text>
          <TouchableOpacity style={[styles.formInput, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
            <Text style={{ color: '#888', fontSize: 16 }}>Select some event categories</Text>
            <ChevronDown size={20} color="#888" />
          </TouchableOpacity>

          <Text style={[styles.formLabel, { marginTop: 20 }]}>Description</Text>
          <View>
            <TextInput style={[styles.formInput, { height: 120, textAlignVertical: 'top', paddingTop: 15 }]} multiline />
            <Text style={{ position: 'absolute', top: 25, right: 15, color: '#999', fontSize: 12 }}>1000</Text>
          </View>

          <Text style={[styles.formLabel, { marginTop: 20 }]}>Event URL</Text>
          <TextInput style={styles.formInput} placeholder="https://www.drivnbye.com" placeholderTextColor="#999" />

          {/* Kotak Boost Event Warna Pink */}
          <View style={styles.boostEventContainer}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={styles.boostEventTitle}>Boost Event</Text>
              <Text style={styles.boostEventSub}>Boosting your event will increase its visibility</Text>
            </View>
            <Switch value={boostEvent} onValueChange={setBoostEvent} trackColor={{ false: '#CCC', true: '#444' }} thumbColor="#FFF" />
          </View>

        </ScrollView>
      </View>
    );
  };

  const ProfileScreen = () => {
    const panResponder = createSwipeResponder(
      () => {
        setVehicleBackScreen('profile');
        setScreen('vehicles');
      },
      () => {
        setVehicleBackScreen('profile');
        setScreen('vehicles');
      }
    );

    return (
      <View style={styles.whiteContainer} {...panResponder.panHandlers}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
          <View style={styles.profileCoverWrapper}>
            <View style={[styles.profileCover, { backgroundColor: currentUser?.coverImage ? 'transparent' : '#F5F5F5' }]}>
              {!currentUser?.coverImage && (
                <View style={styles.emptyCoverOverlay}><Camera size={40} color="#999" strokeWidth={2} /><Text style={styles.emptyCoverText}>Add Cover Photo</Text></View>
              )}
              {currentUser?.coverImage && (<Image source={{ uri: currentUser.coverImage }} style={styles.profileCover} />)}
            </View>
            <View style={styles.profileTopOverlay}>
              <View/>
              <View style={styles.profileTopActions}>
                <Text style={styles.profileFire}>🔥 0</Text>
                <TouchableOpacity onPress={handleLogout}><Ellipsis size={20} color="black" /></TouchableOpacity>
              </View>
            </View>
            <View style={styles.profileAvatarWrapper}>
              {currentUser?.profileImage ? (
                <Image source={{ uri: currentUser.profileImage }} style={styles.profileAvatar} />
              ) : (
                <View style={styles.emptyAvatar}><Camera size={32} color="#999" strokeWidth={2} /></View>
              )}
            </View>
          </View>

          <View style={styles.profileStatsRow}>
            <View style={styles.profileStatItem}><Text style={styles.profileStatNumber}>{currentUser?.stats?.badges || 0}</Text><Text style={styles.profileStatLabel}>Badges</Text></View>
            <View style={styles.profileStatItem}><Text style={styles.profileStatNumber}>{currentUser?.stats?.posts || 0}</Text><Text style={styles.profileStatLabel}>Posts</Text></View>
            <View style={styles.profileStatItem}><Text style={styles.profileStatNumber}>{currentUser?.stats?.followers || 0}</Text><Text style={styles.profileStatLabel}>Followers</Text></View>
            <View style={styles.profileStatItem}><Text style={styles.profileStatNumber}>{currentUser?.stats?.following || 0}</Text><Text style={styles.profileStatLabel}>Following</Text></View>
          </View>

          <View style={styles.profileContent}>
            <Text style={styles.profileName}>{currentUser?.firstName} {currentUser?.lastName}</Text>
            <Text style={styles.profileUsername}>@{currentUser?.username}</Text>
            {currentUser?.bio ? (
              <Text style={styles.profileBio}>{currentUser.bio}</Text>
            ) : (
              <View style={styles.emptyBio}><Text style={styles.emptyBioText}>Add bio to tell your story...</Text></View>
            )}
            {currentUser?.cars?.length > 0 && (
               <View style={{ marginTop: 15 }}>
                  {currentUser.cars.map((carItem: any, i: number) => (
                     <Text key={i} style={styles.profileCarItem}>{carItem}</Text>
                  ))}
               </View>
            )}
            <View style={styles.ownedHeader}><Text style={styles.ownedTitle}>Owned Vehicles</Text><Text style={styles.ownedSub}>1 Vehicles</Text></View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.vehicleCardsRow}>
              {currentUser?.cars?.length > 0 ? (
                currentUser.cars.slice(0, 1).map((car: any, index: number) => (
                  <TouchableOpacity 
                    key={index} 
                    style={styles.vehicleCard} 
                    onPress={() => {
                      setVehicleBackScreen('profile');
                      setScreen('vehicleDetail');
                    }}
                  >
                    <Image source={{ uri: 'https://images.unsplash.com/photo-1617531653520-4893f7bbf978?w=500' }} style={styles.vehicleImage} />
                    <View style={styles.ownBadge}><Text style={styles.ownBadgeText}>Own</Text></View>
                    <View style={styles.vehicleOverlay}><Text style={styles.vehicleName}>Akari</Text><Text style={styles.vehicleModel}>{car}</Text></View>
                  </TouchableOpacity>
                ))
              ) : (
                <TouchableOpacity style={[styles.showAllCard, styles.emptyVehicleCard]}><Text style={styles.emptyVehicleText}>Add your first{'\n'}vehicle</Text></TouchableOpacity>
              )}
              <TouchableOpacity style={styles.showAllCard} onPress={() => setScreen('vehicles')}><Text style={styles.showAllText}>Show All{'\n'}Vehicles</Text></TouchableOpacity>
            </ScrollView>
            <TouchableOpacity style={styles.vehicleTab}><Text style={styles.vehicleTabText}>Vehicles</Text></TouchableOpacity>
            <Text style={styles.postTitle}>{currentUser?.firstName}'s Posts</Text>
          </View>
        </ScrollView>
        <BottomBar active="profile" />
      </View>
    );
  };

  const InboxScreen = () => (
    <View style={styles.whiteContainer}><View style={styles.topPageHeader}><TouchableOpacity onPress={() => setScreen('home')}><ArrowLeft size={28} color="black" /></TouchableOpacity><Text style={styles.topPageTitle}>Inbox</Text><TouchableOpacity><Plus size={32} color="black" /></TouchableOpacity></View><View style={styles.emptyStateWrapper}><MessageCircleOff size={70} color="black" strokeWidth={1.7} /><Text style={styles.emptyStateText}>No Conversation</Text></View></View>
  );

  const NotificationScreen = () => (
    <View style={styles.whiteContainer}><View style={styles.topPageHeader}><TouchableOpacity onPress={() => setScreen('home')}><ArrowLeft size={28} color="black" /></TouchableOpacity><Text style={styles.topPageTitle}>Notifications</Text><View style={{ width: 28 }} /></View><View style={styles.emptyStateWrapper}><BellOff size={70} color="black" strokeWidth={1.7} /><Text style={styles.emptyStateText}>No Notification</Text></View></View>
  );

  const LoginScreen = () => (
    <View style={styles.authContainer}>
      <Text style={styles.authLogo}>DriveTribe</Text>
      <TextInput placeholder="Username" style={styles.authInput} placeholderTextColor="#999" value={loginForm.username} onChangeText={text => setLoginForm({...loginForm, username: text})} />
      <TextInput placeholder="Password" style={styles.authInput} secureTextEntry placeholderTextColor="#999" value={loginForm.password} onChangeText={text => setLoginForm({...loginForm, password: text})} />
      <TouchableOpacity style={styles.authPrimaryBtn} onPress={handleLogin}><Text style={styles.authBtnText}>Sign in</Text></TouchableOpacity>
      <TouchableOpacity><Text style={styles.authLinkSmall}>Forgot Password?</Text></TouchableOpacity>
      <View style={styles.authFooter}><Text style={styles.authFooterText}>Don't have an account?</Text><TouchableOpacity onPress={() => setScreen('signup')}><Text style={styles.authLinkBlue}> Sign up</Text></TouchableOpacity></View>
    </View>
  );

  const SignUpScreen = () => (
    <ScrollView contentContainerStyle={styles.authContainer}>
      <Text style={styles.authLogo}>DriveTribe</Text>
      <View style={styles.authRow}><TextInput placeholder="First Name" style={[styles.authInput, { flex: 1, marginRight: 10 }]} value={signupForm.firstName} onChangeText={text => setSignupForm({...signupForm, firstName: text})} /><TextInput placeholder="Last Name" style={[styles.authInput, { flex: 1 }]} value={signupForm.lastName} onChangeText={text => setSignupForm({...signupForm, lastName: text})} /></View>
      <TextInput placeholder="Username" style={styles.authInput} value={signupForm.username} onChangeText={text => setSignupForm({...signupForm, username: text})} />
      <TextInput placeholder="Email" style={styles.authInput} value={signupForm.email} onChangeText={text => setSignupForm({...signupForm, email: text})} keyboardType="email-address" />
      <TextInput placeholder="Password" style={styles.authInput} secureTextEntry value={signupForm.password} onChangeText={text => setSignupForm({...signupForm, password: text})} />
      <TextInput placeholder="Confirm Password" style={styles.authInput} secureTextEntry value={signupForm.confirmPassword} onChangeText={text => setSignupForm({...signupForm, confirmPassword: text})} />
      <TouchableOpacity style={styles.authPrimaryBtn} onPress={handleSignup}><Text style={styles.authBtnText}>Sign Up</Text></TouchableOpacity>
      <TouchableOpacity style={styles.authSecondaryBtn} onPress={() => setScreen('login')}><Text style={styles.authSecondaryText}>← Back to Login</Text></TouchableOpacity>
    </ScrollView>
  );

  const SearchMainScreen = () => (
    <View style={styles.whiteContainer}>
      <View style={styles.searchHeaderTop}><TextInput placeholder="Search" style={styles.searchField} placeholderTextColor="#999" /></View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={styles.sectionHeader}><Text style={styles.sectionTitleText}>Discover</Text></View>
        <View style={styles.discoverTagsContainer}>
          {['🔥 Trending Near Posts', '📌 Trending Hashtags', '🌍 Trending Worldwide Posts', '🎉 Today\'s Events', '🆕 New Events', '👋 Nearby Users', '👥 Popular Groups'].map((tag, index) => (<TouchableOpacity key={index} style={styles.tagBadge}><Text style={styles.tagText}>{tag}</Text></TouchableOpacity>))}
        </View>
        <SectionRow label="Posts" action="Discover all Posts" />
        <View style={styles.noResultContainer}><ImageIcon size={70} color="#777" strokeWidth={1.5} /><Text style={styles.noResultMainText}>No Results</Text><Text style={styles.noResultSubText}>No Posts could be found at this time</Text></View>
        <SectionRow label="Groups" action="Discover all Groups" />
        {(!currentUser?.groups || currentUser.groups.length === 0) ? (
          <View style={styles.emptyGroupsContainer}><Users2 size={60} color="#999" strokeWidth={1.5} /><Text style={[styles.noResultMainText, { color: '#666' }]}>No Groups Joined</Text><Text style={styles.noResultSubText}>Join groups to see your communities here!</Text></View>
        ) : (
          <TouchableOpacity style={styles.groupCard}><Image source={{ uri: 'https://images.unsplash.com/photo-1617531653520-4893f7bbf978?w=1200' }} style={styles.groupImage} /><View style={styles.groupInfo}><View style={styles.groupRow}><Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg' }} style={styles.groupLogo} /><View><Text style={styles.groupTitle}>BMW M Owners</Text><View style={styles.groupMetaRow}><Text style={styles.groupMeta}>🌐 Public</Text><Text style={styles.groupMeta}>👥 166</Text></View></View></View></View></TouchableOpacity>
        )}
        <SectionRow label="Events" action="Discover all Events" />
        <View style={styles.noResultContainer}><Calendar size={70} color="#777" strokeWidth={1.5} /><Text style={styles.noResultMainText}>No Results</Text><Text style={styles.noResultSubText}>No Events could be found at this time,{'\n'}use Map View to widen your search!</Text></View>
      </ScrollView>
      <BottomBar active="search" />
    </View>
  );

  const AddPostScreen = () => (
    <View style={styles.whiteContainer}>
      <View style={styles.addPostMain}>
        <Text style={styles.addPostTitle}>Create Content</Text>
        <Text style={styles.addPostSubtitle}>Share your thoughts, stories, or upcoming event...</Text>
        
        <TouchableOpacity style={styles.addCard} onPress={() => setScreen('createPost')}>
          <View style={[styles.iconBox, { backgroundColor: '#8E24AA' }]}><PlusCircle size={30} color="white" /></View>
          <View style={styles.cardInfo}><Text style={styles.cardLabel}>Post</Text><Text style={styles.cardSub}>Post to the map...</Text></View>
        </TouchableOpacity>
        
        {/* ✅ TOMBOL EVENT SEKARANG MENGARAHKAN KE CREATE EVENT */}
        <TouchableOpacity style={styles.addCard} onPress={() => setScreen('createEvent')}>
          <View style={[styles.iconBox, { backgroundColor: '#1E88E5' }]}><Calendar size={30} color="white" /></View>
          <View style={styles.cardInfo}><Text style={styles.cardLabel}>Event</Text><Text style={styles.cardSub}>Organize an event...</Text></View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.addCard} onPress={() => setScreen('createGroup')}>
          <View style={[styles.iconBox, { backgroundColor: '#43A047' }]}><UserPlus size={30} color="white" /></View>
          <View style={styles.cardInfo}><Text style={styles.cardLabel}>Group</Text><Text style={styles.cardSub}>Create a group...</Text></View>
        </TouchableOpacity>
      </View>
      <BottomBar active="plus" />
    </View>
  );

  const SectionRow = ({ label, action }: { label: string; action: string }) => (
    <View style={styles.searchSectionRow}><Text style={styles.sectionTitleText}>{label}</Text><TouchableOpacity style={styles.rowAlign}><Text style={styles.linkTextGray}>{action}</Text><ChevronRight size={18} color="#999" /></TouchableOpacity></View>
  );

  const BottomBar = ({ active }: { active: string }) => (
    <View style={styles.tabBar}>
      <TouchableOpacity onPress={() => setScreen('home')}><HomeIcon size={26} color={active === 'home' ? '#2196F3' : 'black'} /></TouchableOpacity>
      <TouchableOpacity onPress={() => setScreen('searchMain')}><Search size={26} color={active === 'search' ? '#2196F3' : 'black'} /></TouchableOpacity>
      <TouchableOpacity onPress={() => setScreen('addPost')}><Plus size={26} color={active === 'plus' ? '#2196F3' : 'black'} /></TouchableOpacity>
      <TouchableOpacity onPress={() => setScreen('groups')}><Users2 size={26} color={active === 'groups' ? '#2196F3' : 'black'} /></TouchableOpacity>
      <TouchableOpacity onPress={() => setScreen('profile')}>
        {currentUser?.profileImage ? (
          <Image 
            source={{ uri: currentUser.profileImage }} 
            style={[
              styles.bottomProfile, 
              { borderColor: active === 'profile' ? '#2196F3' : 'transparent', borderWidth: 2 }
            ]} 
          />
        ) : (
          <UserIcon size={26} color={active === 'profile' ? '#2196F3' : 'black'} />
        )}
      </TouchableOpacity>
    </View>
  );
  const VehiclesListScreen = () => {
    const panResponder = createSwipeResponder(
      () => setScreen('profile'),
      () => setScreen('profile')
    );

    return (
      <View style={styles.whiteContainer} {...panResponder.panHandlers}>
        {/* Header Bar */}
        <View style={styles.vehiclesHeader}>
          <TouchableOpacity onPress={() => setScreen('profile')} style={styles.vehiclesHeaderLeft}>
            <ChevronDown size={24} color="black" style={{ transform: [{ rotate: '90deg' }] }} />
          </TouchableOpacity>
          <Text style={styles.vehiclesHeaderTitle}>Vehicles</Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.vehiclesGridContainer}>
          <View style={styles.vehiclesGrid}>
            {currentUser?.cars?.map((car: any, index: number) => (
              <TouchableOpacity 
                key={index} 
                style={styles.vehiclesGridCard} 
                onPress={() => {
                  setVehicleBackScreen('vehicles');
                  setScreen('vehicleDetail');
                }}
              >
                <Image 
                  source={{ uri: 'https://images.unsplash.com/photo-1617531653520-4893f7bbf978?w=500' }} 
                  style={styles.vehiclesGridImage} 
                />
                <View style={styles.vehiclesGridOwnBadge}>
                  <Text style={styles.vehiclesGridOwnBadgeText}>Own</Text>
                </View>
                <View style={styles.vehiclesGridOverlay}>
                  <Text style={styles.vehiclesGridName}>Akari</Text>
                  <Text style={styles.vehiclesGridModel}>{car}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  };
  const VehicleDetailScreen = () => {
    return (
      <View style={styles.whiteContainer}>
        {/* Header Bar */}
        <View style={styles.detailHeader}>
          <TouchableOpacity onPress={() => setScreen(vehicleBackScreen)} style={styles.detailHeaderLeft}>
            <ChevronDown size={24} color="black" style={{ transform: [{ rotate: '90deg' }] }} />
            <Text style={styles.detailHeaderTitle}>Vehicle</Text>
            <View style={styles.detailOwnBadge}>
              <Text style={styles.detailOwnBadgeText}>Own</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.detailHeaderRight}>
            <TouchableOpacity onPress={() => setScreen('addModification')} style={{ padding: 6 }}>
              <Plus size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowVehicleMenu(true)} style={{ padding: 6, marginLeft: 10 }}>
              <Ellipsis size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50 }}>
          {/* Main Image */}
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1617531653520-4893f7bbf978?w=1200' }} 
            style={styles.detailMainImage} 
          />

          <View style={styles.detailContent}>
            {/* Title Block */}
            <Text style={styles.detailVehicleNameQuote}>"Akari "</Text>
            <Text style={styles.detailVehicleModelName}>2010 Mazda Rx8</Text>

            {/* Vertical Detail Cards */}
            <View style={styles.detailCardsList}>
              {/* Trim Card */}
              <View style={styles.detailItemCard}>
                <View style={styles.detailIconBox}>
                  <Wrench size={20} color="#2196F3" />
                </View>
                <View style={styles.detailCardText}>
                  <Text style={styles.detailCardLabel}>Trim</Text>
                  <Text style={styles.detailCardValue}>GT</Text>
                </View>
              </View>

              {/* Color Card */}
              <View style={styles.detailItemCard}>
                <View style={styles.detailIconBox}>
                  <Tag size={20} color="#2196F3" />
                </View>
                <View style={styles.detailCardText}>
                  <Text style={styles.detailCardLabel}>Color</Text>
                  <Text style={styles.detailCardValue}>White</Text>
                </View>
              </View>

              {/* Modifications Card */}
              <View style={styles.detailItemCard}>
                <View style={styles.detailIconBox}>
                  <Wrench size={20} color="#2196F3" />
                </View>
                <View style={styles.detailCardText}>
                  <Text style={styles.detailCardLabel}>Modifications</Text>
                  <Text style={styles.detailCardValue}>{modifications.length} Modifications</Text>
                </View>
              </View>

              {/* Owner Card */}
              <View style={styles.detailItemCard}>
                <View style={styles.detailIconBox}>
                  <UserIcon size={20} color="#2196F3" />
                </View>
                <View style={styles.detailCardText}>
                  <Text style={styles.detailCardLabel}>Owner</Text>
                  <Text style={styles.detailCardValue}>@{currentUser?.username || 'felixfuru'}</Text>
                </View>
              </View>
            </View>

            {/* Description Section */}
            <Text style={styles.detailSectionTitle}>Description</Text>
            <Text style={styles.detailDescriptionText}>
              2010 Mazda Rx8 GT with Renesis Hybrid and a custom improved and reinforced Rx8 S2 Transmission with 10,5k rpm redline
            </Text>

            {/* Modifications Section */}
            {modifications.length === 0 ? (
              <View style={styles.detailEmptyModifications}>
                <View style={styles.crossedWrenchesWrapper}>
                  <ScrewdriverWrenchIcon size={45} color="#555" />
                </View>
                <Text style={styles.detailEmptyModTitle}>No Modifications</Text>
                <Text style={styles.detailEmptyModSub}>This vehicle does not have any modification</Text>
              </View>
            ) : (
              <View style={styles.detailModificationsList}>
                <Text style={styles.detailSectionTitle}>Modification List</Text>
                {modifications.map((mod) => (
                  <View key={mod.id} style={styles.modificationItemCard}>
                    <View style={styles.modItemHeader}>
                      <Text style={styles.modItemName}>{mod.name}</Text>
                      <View style={styles.modClassificationBadge}>
                        <Text style={styles.modClassificationText}>{mod.classification}</Text>
                      </View>
                    </View>
                    {mod.description ? <Text style={styles.modItemDesc}>{mod.description}</Text> : null}
                    {mod.link ? <Text style={styles.modItemLink} numberOfLines={1}>{mod.link}</Text> : null}
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>

        {/* Vehicle Options Bottom Sheet */}
        <Modal visible={showVehicleMenu} transparent animationType="slide">
          <TouchableOpacity 
            style={styles.vMenuOverlay} 
            activeOpacity={1} 
            onPress={() => setShowVehicleMenu(false)}
          >
            <View style={styles.vMenuBottomSheet}>
              <View style={styles.vMenuHandle} />
              
              {/* Share Vehicle Row */}
              <TouchableOpacity 
                style={styles.vMenuActionRow}
                onPress={() => {
                  setShowVehicleMenu(false);
                  Alert.alert('Share Vehicle', 'Sharing option is coming soon!');
                }}
              >
                <Share2 size={24} color="#1E88E5" />
                <Text style={styles.vMenuText}>Share Vehicle</Text>
              </TouchableOpacity>

              {/* Edit Vehicle Row */}
              <TouchableOpacity 
                style={styles.vMenuActionRow}
                onPress={() => {
                  setShowVehicleMenu(false);
                  Alert.alert('Edit Vehicle', 'Editing option is coming soon!');
                }}
              >
                <Pencil size={24} color="#1E88E5" />
                <Text style={styles.vMenuText}>Edit Vehicle</Text>
              </TouchableOpacity>

              {/* Delete Vehicle Row */}
              <TouchableOpacity 
                style={[styles.vMenuActionRow, { borderBottomWidth: 0 }]}
                onPress={() => {
                  setShowVehicleMenu(false);
                  Alert.alert(
                    'Delete Vehicle',
                    'Are you sure you want to delete this vehicle?',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { 
                        text: 'Delete', 
                        style: 'destructive',
                        onPress: () => {
                          setModifications([]); // Clear modifications
                          setScreen('profile');
                          Alert.alert('✅ Deleted', 'Vehicle has been deleted successfully!');
                        } 
                      }
                    ]
                  );
                }}
              >
                <Trash2 size={24} color="#D32F2F" />
                <Text style={[styles.vMenuText, { color: '#D32F2F' }]}>Delete Vehicle</Text>
              </TouchableOpacity>

            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    );
  };

  const AddModificationScreen = () => {
    const openClassificationModal = () => {
      setTempClassification(modForm.classification === 'Classification' ? 'Performance' : modForm.classification);
      setCatSearchQuery('');
      setShowClassificationModal(true);
    };

    const categoriesList = [
      'Audio',
      'Body',
      'Brakes',
      'Cooling',
      'Drivetrain',
      'Electronics',
      'Engine',
      'Exhaust',
      'Exterior',
      'Interior',
      'Lighting',
      'Performance',
      'Safety',
      'Suspension',
      'Tires',
      'Transmission',
      'Visual',
      'Wheels'
    ];

    const filteredCategories = categoriesList.filter(cat => 
      cat.toLowerCase().includes(catSearchQuery.toLowerCase())
    );

    return (
      <View style={styles.whiteContainer}>
        {/* Header Bar */}
        <View style={styles.addModHeader}>
          <TouchableOpacity onPress={() => setScreen('vehicleDetail')} style={styles.addModHeaderLeft}>
            <ChevronDown size={28} color="black" />
          </TouchableOpacity>
          <Text style={styles.addModHeaderTitle}>Add Modification</Text>
          <TouchableOpacity 
            onPress={handleSaveModification} 
            disabled={!modForm.name.trim()}
            style={styles.addModHeaderRight}
          >
            <Text style={[styles.addModSaveText, { color: modForm.name.trim() ? '#2196F3' : '#AAA' }]}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 50 }} showsVerticalScrollIndicator={false}>
          {/* Name Field */}
          <Text style={styles.modFormLabel}>name</Text>
          <TextInput 
            style={styles.modFormInput} 
            value={modForm.name} 
            onChangeText={t => setModForm({ ...modForm, name: t })} 
            placeholder=""
            placeholderTextColor="#AAA"
          />

          {/* Description Field */}
          <Text style={[styles.modFormLabel, { marginTop: 20 }]}>description</Text>
          <View style={{ position: 'relative' }}>
            <TextInput 
              style={[styles.modFormInput, { height: 120, textAlignVertical: 'top', paddingTop: 12, paddingRight: 45 }]} 
              multiline 
              maxLength={255} 
              value={modForm.description} 
              onChangeText={t => setModForm({ ...modForm, description: t })} 
              placeholder=""
              placeholderTextColor="#AAA"
            />
            <Text style={styles.modCharCounterInside}>{255 - modForm.description.length}</Text>
          </View>

          {/* Link Field */}
          <Text style={[styles.modFormLabel, { marginTop: 20 }]}>Link</Text>
          <TextInput 
            style={styles.modFormInput} 
            value={modForm.link} 
            onChangeText={t => setModForm({ ...modForm, link: t })} 
            placeholder=""
            placeholderTextColor="#AAA"
          />

          {/* Classification Field */}
          <Text style={[styles.modFormLabel, { marginTop: 20 }]}>Classification</Text>
          <TouchableOpacity 
            style={[styles.modFormInput, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]} 
            onPress={openClassificationModal}
          >
            <Text style={{ color: modForm.classification === 'Classification' ? '#888' : '#333', fontSize: 16 }}>{modForm.classification}</Text>
            <ChevronDown size={20} color="#888" />
          </TouchableOpacity>
        </ScrollView>

        {/* Dropdown Modal Selector */}
        <Modal visible={showClassificationModal} transparent animationType="fade">
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ flex: 1 }}
          >
            <TouchableOpacity 
              style={styles.catModalWrapper} 
              activeOpacity={1} 
              onPress={() => setShowClassificationModal(false)}
            >
              <TouchableOpacity style={styles.catModalContent} activeOpacity={1}>
                
                {/* Search Bar */}
                <View style={styles.catSearchContainer}>
                  <Search size={20} color="#888" style={{ marginRight: 10 }} />
                  <TextInput 
                    style={styles.catSearchInput}
                    placeholder="Search categories..."
                    placeholderTextColor="#999"
                    value={catSearchQuery}
                    onChangeText={setCatSearchQuery}
                    autoFocus
                  />
                </View>

                {/* Category Scroll List */}
                <ScrollView 
                  style={{ maxHeight: 280, minHeight: 150 }} 
                  contentContainerStyle={{ flexGrow: 1 }}
                  showsVerticalScrollIndicator={false}
                >
                  
                  {/* Classification Header inside ScrollView so it scrolls away */}
                  {catSearchQuery.trim() === '' && (
                    <View style={styles.catHeaderRow}>
                      <Text style={styles.catHeaderTitle}>Classification</Text>
                      <ChevronDown size={20} color="black" style={{ transform: [{ rotate: '180deg' }] }} />
                    </View>
                  )}
                  {filteredCategories.length === 0 ? (
                    <View style={{ paddingVertical: 30, alignItems: 'center' }}>
                      <Text style={{ color: '#999', fontSize: 16 }}>No categories match your search</Text>
                    </View>
                  ) : (
                    filteredCategories.map((item) => (
                      <TouchableOpacity 
                        key={item} 
                        style={styles.catItemRow} 
                        onPress={() => setTempClassification(item)}
                      >
                        <Text style={[
                          styles.catItemText, 
                          tempClassification === item && styles.catItemTextSelected
                        ]}>
                          {item}
                        </Text>
                        {tempClassification === item && (
                          <Check size={18} color="#2E7D32" strokeWidth={3.5} />
                        )}
                      </TouchableOpacity>
                    ))
                  )}
                </ScrollView>

                {/* Confirm Button */}
                <TouchableOpacity 
                  style={styles.catConfirmButton} 
                  onPress={() => {
                    setModForm(prev => ({ ...prev, classification: tempClassification }));
                    setShowClassificationModal(false);
                  }}
                >
                  <Text style={styles.catConfirmButtonText}>Confirm</Text>
                </TouchableOpacity>

              </TouchableOpacity>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    );
  };

  if (!currentUser && (screen === 'home' || screen === 'profile' || screen === 'groups' || screen === 'groupFeed' || screen === 'createGroup' || screen === 'createPost' || screen === 'createEvent' ||
      screen === 'searchMain' || screen === 'addPost' || screen === 'inbox' || screen === 'notifications' || screen === 'vehicleDetail' || screen === 'addModification' || screen === 'vehicles')) {
    setScreen('login');
    return <LoginScreen />;
  }

  if (screen === 'login') return LoginScreen();
  if (screen === 'signup') return SignUpScreen();
  if (screen === 'addPost') return AddPostScreen();
  if (screen === 'searchMain') return SearchMainScreen();
  if (screen === 'inbox') return InboxScreen();
  if (screen === 'notifications') return NotificationScreen();
  if (screen === 'profile') return ProfileScreen();
  if (screen === 'groups') return GroupsScreen();
  if (screen === 'groupFeed') return GroupFeedScreen();
  if (screen === 'createGroup') return CreateGroupScreen();
  if (screen === 'createPost') return CreatePostScreen();
  if (screen === 'createEvent') return CreateEventScreen();
  if (screen === 'vehicleDetail') return VehicleDetailScreen();
  if (screen === 'vehicles') return VehiclesListScreen();
  if (screen === 'addModification') return AddModificationScreen();

  return HomeScreen();
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  whiteContainer: { flex: 1, backgroundColor: '#fff' },
  authContainer: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', padding: 35 },
  authLogo: { fontSize: 42, fontWeight: '900', color: 'black', marginBottom: 60 },
  authInput: { width: '100%', height: 45, backgroundColor: '#D9D9D9', borderRadius: 8, paddingHorizontal: 15, marginBottom: 12 },
  authPrimaryBtn: { width: '100%', height: 45, backgroundColor: '#4A81D3', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 15 },
  authSecondaryBtn: { width: '100%', height: 45, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 10, borderWidth: 1, borderColor: '#DDD' },
  authBtnText: { color: 'white', fontSize: 16, fontWeight: '700' },
  authSecondaryText: { color: '#4A81D3', fontSize: 16, fontWeight: '600' },
  authLinkSmall: { fontSize: 12, color: '#666', marginTop: 15 },
  authFooter: { flexDirection: 'row', marginTop: 10 },
  authFooterText: { fontSize: 12, color: '#666' },
  authLinkBlue: { fontSize: 12, color: '#4A81D3', fontWeight: 'bold' },
  authRow: { flexDirection: 'row', width: '100%' },
  emptyGroupsContainer: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 40 },
  emptyGroupsTitle: { fontSize: 22, fontWeight: 'bold', marginTop: 20, color: '#333' },
  emptyGroupsText: { fontSize: 15, color: '#888', textAlign: 'center', marginTop: 8, lineHeight: 22, marginBottom: 25 },
  joinGroupsBtn: { backgroundColor: '#4A81D3', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 25 },
  joinGroupsBtnText: { color: 'white', fontSize: 16, fontWeight: '600' },
  map: { ...StyleSheet.absoluteFillObject },
  header: { position: 'absolute', top: 50, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brandText: { fontSize: 24, fontWeight: '900' },
  headerIcons: { flexDirection: 'row', gap: 18 },
  leftActionStack: { position: 'absolute', bottom: 110, left: 20, gap: 10 },
  circularActionBtn: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', elevation: 5 },
  searchHeaderTop: { paddingTop: 60, paddingHorizontal: 15, paddingBottom: 10 },
  searchField: { height: 45, backgroundColor: '#F2F2F2', borderRadius: 10, paddingHorizontal: 15, fontSize: 16 },
  sectionHeader: { paddingHorizontal: 15, marginTop: 15 },
  sectionTitleText: { fontSize: 24, fontWeight: '700', color: '#333' },
  discoverTagsContainer: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 10, marginTop: 15, gap: 8 },
  tagBadge: { backgroundColor: '#F2F2F2', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 25 },
  tagText: { fontSize: 14, color: '#444' },
  searchSectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, marginTop: 30, marginBottom: 15 },
  rowAlign: { flexDirection: 'row', alignItems: 'center' },
  linkTextGray: { color: '#999', fontSize: 15, marginRight: 5 },
  noResultContainer: { alignItems: 'center', paddingVertical: 40, paddingHorizontal: 40 },
  noResultMainText: { fontSize: 22, fontWeight: 'bold', marginTop: 15 },
  noResultSubText: { fontSize: 14, color: '#888', textAlign: 'center', marginTop: 8, lineHeight: 22 },
  groupCard: { backgroundColor: '#fff', marginHorizontal: 15, marginBottom: 18, borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: '#EEE' },
  groupImage: { width: '100%', height: 190 },
  groupInfo: { padding: 14 },
  groupRow: { flexDirection: 'row', alignItems: 'center' },
  groupLogo: { width: 52, height: 52, borderRadius: 26, marginRight: 14 },
  groupTitle: { fontSize: 18, fontWeight: '700', color: '#111' },
  groupMetaRow: { flexDirection: 'row', marginTop: 6, gap: 12 },
  groupMeta: { color: '#777', fontSize: 14 },
  addPostMain: { flex: 1, paddingTop: 100, paddingHorizontal: 25, alignItems: 'center' },
  addPostTitle: { fontSize: 28, fontWeight: 'bold', marginBottom: 12 },
  addPostSubtitle: { fontSize: 15, color: '#666', textAlign: 'center', marginBottom: 40 },
  addCard: { width: '100%', backgroundColor: '#D9D9D9', borderRadius: 15, flexDirection: 'row', padding: 18, alignItems: 'center', marginBottom: 15 },
  iconBox: { width: 60, height: 60, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  cardInfo: { flex: 1, marginLeft: 15 },
  cardLabel: { fontSize: 18, fontWeight: 'bold' },
  cardSub: { fontSize: 12, color: '#555', marginTop: 2 },
  tabBar: { position: 'absolute', bottom: 0, width: '100%', height: 85, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingBottom: 25, borderTopWidth: 0.5, borderTopColor: '#EEE' },
  topPageHeader: { paddingTop: 65, paddingHorizontal: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  topPageTitle: { fontSize: 20, fontWeight: '700', color: 'black' },
  emptyStateWrapper: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: -120 },
  emptyStateText: { marginTop: 15, fontSize: 18, color: 'black', fontWeight: '500' },
  bottomProfile: { width: 32, height: 32, borderRadius: 16 },
  profileCoverWrapper: { position: 'relative' },
  profileCover: { width: '100%', height: 250 },
  emptyCoverOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.05)' },
  emptyCoverText: { marginTop: 8, color: '#999', fontSize: 14, fontWeight: '500' },
  profileTopOverlay: { position: 'absolute', top: 55, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  profileTopActions: { backgroundColor: 'white', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6, flexDirection: 'row', alignItems: 'center', gap: 8, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 2 },
  profileFire: { fontSize: 14, fontWeight: '700', color: '#E91E63' },
  profileAvatarWrapper: { width: 130, height: 130, borderRadius: 65, borderWidth: 4, borderColor: 'white', position: 'absolute', left: 20, bottom: -45, overflow: 'hidden', backgroundColor: '#FFF', elevation: 4, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  profileAvatar: { width: '100%', height: '100%', borderRadius: 65 },
  emptyAvatar: { width: 130, height: 130, borderRadius: 65, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center' },
  profileStatsRow: { marginTop: 15, flexDirection: 'row', justifyContent: 'space-around', paddingLeft: 145, paddingRight: 10 },
  profileStatItem: { alignItems: 'center' },
  profileStatNumber: { fontSize: 20, fontWeight: 'bold', color: '#111' },
  profileStatLabel: { fontSize: 12, color: '#888', marginTop: 2 },
  profileContent: { paddingHorizontal: 18, marginTop: 25 },
  profileName: { fontSize: 22, fontWeight: 'bold', color: '#111' },
  profileUsername: { fontSize: 15, color: '#999', marginTop: 2 },
  profileBio: { fontSize: 15, color: '#333', marginTop: 15, lineHeight: 22 },
  emptyBio: { marginTop: 20, padding: 20, backgroundColor: '#F8F9FA', borderRadius: 12, borderWidth: 1, borderColor: '#E9ECEF', alignItems: 'center' },
  emptyBioText: { color: '#999', fontSize: 14 },
  profileCars: { fontSize: 18, color: '#222', lineHeight: 32, marginTop: 22 },
  profileCarItem: { fontSize: 15, color: '#333', marginTop: 5 },
  ownedHeader: { marginTop: 25 },
  ownedTitle: { fontSize: 18, fontWeight: 'bold', color: '#111' },
  ownedSub: { color: '#999', fontSize: 13, marginTop: 2 },
  vehicleCardsRow: { flexDirection: 'row', marginTop: 15, justifyContent: 'flex-start', gap: 12 },
  vehicleCard: { width: width * 0.42, height: 160, borderRadius: 16, overflow: 'hidden', backgroundColor: '#DDD' },
  emptyVehicleCard: { backgroundColor: '#F8F9FA', borderWidth: 2, borderColor: '#E9ECEF', borderStyle: 'dashed' },
  emptyVehicleText: { fontSize: 18, fontWeight: '600', color: '#6C757D', textAlign: 'center', lineHeight: 28 },
  vehicleImage: { width: '100%', height: '100%' },
  ownBadge: { position: 'absolute', top: 10, right: 10, backgroundColor: '#DDEEFF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  ownBadgeText: { color: '#4A81D3', fontWeight: 'bold', fontSize: 11 },
  vehicleOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', padding: 10 },
  vehicleName: { color: 'white', fontSize: 15, fontWeight: 'bold' },
  vehicleModel: { color: 'rgba(255,255,255,0.8)', fontSize: 11, marginTop: 2 },
  showAllCard: { width: width * 0.42, height: 160, borderRadius: 16, backgroundColor: '#F2F2F2', justifyContent: 'center', alignItems: 'center', padding: 10 },
  showAllText: { fontSize: 15, fontWeight: 'bold', color: '#111', textAlign: 'center', lineHeight: 22 },
  vehicleTab: { marginTop: 20, backgroundColor: '#F2F2F2', alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  vehicleTabText: { fontSize: 13, color: '#333', fontWeight: '600' },
  postTitle: { marginTop: 25, fontSize: 18, fontWeight: 'bold', color: '#111' },
  feedContainer: { flex: 1, backgroundColor: '#F9F9F9' },
  groupDetailTopBar: { position: 'absolute', top: 50, left: 15, right: 15, flexDirection: 'row', justifyContent: 'space-between', zIndex: 10 },
  groupDetailTopBtn: { backgroundColor: 'white', padding: 10, borderRadius: 25, elevation: 3, shadowColor: '#000', shadowOffset: { width:0, height:2 }, shadowOpacity: 0.2, shadowRadius: 3 },
  groupDetailTopRight: { backgroundColor: 'white', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, elevation: 3, shadowColor: '#000', shadowOffset: { width:0, height:2 }, shadowOpacity: 0.2, shadowRadius: 3 },
  verticalDivider: { width: 1, height: 18, backgroundColor: '#CCC', marginHorizontal: 12 },
  groupCoverPhoto: { width: '100%', height: 220 },
  groupInfoContainer: { paddingHorizontal: 15, paddingBottom: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#EAEAEA' },
  avatarTagRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: -45 },
  groupAvatarWrapper: { width: 90, height: 90, borderRadius: 45, borderWidth: 4, borderColor: 'white', overflow: 'hidden', backgroundColor: '#EEE' },
  groupAvatarImage: { width: '100%', height: '100%' },
  groupTagBadgeDetailed: { backgroundColor: '#1E88E5', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, marginBottom: 10 },
  groupTagTextDetailed: { color: 'white', fontWeight: 'bold', fontSize: 13 },
  groupDetailTitle: { fontSize: 26, fontWeight: 'bold', color: '#111', marginTop: 10 },
  groupDetailMetaRow: { flexDirection: 'row', marginTop: 6 },
  groupDetailMetaText: { color: '#666', fontSize: 15 },
  groupDetailBioText: { fontSize: 15, color: '#333', marginTop: 14, lineHeight: 22 },
  groupDetailLinkText: { fontSize: 15, color: '#1E88E5', fontWeight: '600', marginTop: 6 },
  inviteButton: { backgroundColor: '#2196F3', width: '100%', paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  inviteButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  groupTabsScroll: { flexDirection: 'row', marginTop: 20, marginBottom: 5 },
  groupTabPill: { backgroundColor: '#F2F2F2', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 20, marginRight: 10 },
  groupTabActivePill: { backgroundColor: 'white', borderWidth: 1, borderColor: '#DDD' },
  groupTabActiveText: { color: '#333', fontWeight: '700', fontSize: 14 },
  groupTabTextDetailed: { color: '#666', fontWeight: '600', fontSize: 14 },
  
  fabCreatePost: { position: 'absolute', bottom: 25, right: 20, width: 60, height: 60, backgroundColor: '#2196F3', borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOffset: { width:0, height:3 }, shadowOpacity: 0.3, shadowRadius: 4 },

  postCard: { backgroundColor: '#fff', marginBottom: 15, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#EAEAEA' },
  postHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 12 },
  postHeaderLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  postAvatar: { width: 44, height: 44, borderRadius: 22, marginRight: 12 },
  postUserText: { fontSize: 16, fontWeight: '700', color: '#111' },
  postGroupText: { fontSize: 14, color: '#888', fontWeight: '500' },
  postLocationText: { fontSize: 13, color: '#888', marginTop: 2, paddingRight: 20 },
  postMainImage: { width: width, height: width * 0.85 },
  carouselDots: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 12 },
  dot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#CCC', marginHorizontal: 4 },
  activeDot: { width: 22, backgroundColor: '#555' },
  postActionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15 },
  postActionLeft: { flexDirection: 'row', alignItems: 'center' },
  actionIcon: { marginRight: 8 },
  actionText: { fontSize: 16, color: '#444', marginRight: 18, fontWeight: '500' },
  postTextContainer: { paddingHorizontal: 15, marginTop: 12 },
  postCaptionText: { fontSize: 15, color: '#222', lineHeight: 22 },
  postTimeText: { fontSize: 13, color: '#999', marginTop: 8 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' },
  bottomSheet: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingHorizontal: 20, paddingTop: 15, paddingBottom: 40 },
  sheetHandle: { width: 45, height: 5, backgroundColor: '#DDD', borderRadius: 3, alignSelf: 'center', marginBottom: 25 },
  sheetActionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, gap: 18 },
  sheetMainText: { fontSize: 18, fontWeight: '500', color: '#222' },
  sheetSubText: { fontSize: 13, color: '#888', marginTop: 2 },

  formLabel: { fontSize: 16, fontWeight: '700', color: '#333' },
  formSubLabel: { fontSize: 13, color: '#888', marginTop: 3 },
  coverPhotoPlaceholder: { width: '100%', height: 180, backgroundColor: '#CCC', borderRadius: 8, marginTop: 12, justifyContent: 'center', alignItems: 'center' },
  addPictureText: { color: '#2196F3', fontSize: 15, fontWeight: '600', textAlign: 'center', marginTop: 10 },
  avatarPlaceholder: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#CCC', alignSelf: 'center', marginTop: 12, justifyContent: 'center', alignItems: 'center' },
  formInput: { width: '100%', minHeight: 45, backgroundColor: '#F2F2F2', borderRadius: 8, paddingHorizontal: 15, marginTop: 10, fontSize: 16 },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 25 },

  captionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 },
  boostPostBtn: { flexDirection: 'row', alignItems: 'center' },
  boostPostText: { color: '#E91E63', fontWeight: '700', fontSize: 15, marginLeft: 6 },
  captionInputTextarea: { width: '100%', height: 160, backgroundColor: '#F2F2F2', borderRadius: 12, padding: 15, marginTop: 12, fontSize: 16, textAlignVertical: 'top' },
  charCountText: { textAlign: 'right', color: '#999', fontSize: 13, marginTop: 8 },
  preferencesHeader: { fontSize: 20, fontWeight: 'bold', color: '#111', marginTop: 30 },
  preferencesDivider: { width: '100%', height: 1, backgroundColor: '#EEE', marginTop: 15, marginBottom: 5 },
  toggleRowPref: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 },
  postBottomToolbar: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#F9F9F9', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 40, paddingTop: 15, elevation: 10, shadowColor: '#000', shadowOffset: { width:0, height:-3 }, shadowOpacity: 0.1, shadowRadius: 5 },
  toolbarHandle: { width: 40, height: 4, backgroundColor: '#DDD', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  toolbarIconRow: { flexDirection: 'row', justifyContent: 'flex-start', paddingHorizontal: 25, gap: 30 },

  // ✅ STYLES BARU UNTUK CREATE EVENT SCREEN
  boostEventContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FCE4EC', padding: 15, borderRadius: 8, marginTop: 25, borderWidth: 1, borderColor: '#F8BBD0' },
  boostEventTitle: { fontSize: 16, fontWeight: '700', color: '#E91E63' },
  boostEventSub: { fontSize: 13, color: '#E91E63', marginTop: 3 },

  // STYLES UNTUK DETAIL KENDARAAN (VEHICLE DETAIL)
  detailHeader: { paddingTop: 60, paddingHorizontal: 15, paddingBottom: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#EEE' },
  detailHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  detailHeaderTitle: { fontSize: 18, fontWeight: '700', color: '#111' },
  detailOwnBadge: { backgroundColor: '#DDEEFF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  detailOwnBadgeText: { color: '#4A81D3', fontWeight: 'bold', fontSize: 11 },
  detailHeaderRight: { flexDirection: 'row', alignItems: 'center' },
  detailMainImage: { width: '100%', height: 260 },
  detailContent: { padding: 20 },
  detailVehicleNameQuote: { fontSize: 16, color: '#555', fontStyle: 'italic' },
  detailVehicleModelName: { fontSize: 24, fontWeight: 'bold', color: '#111', marginTop: 4, marginBottom: 20 },
  detailCardsList: { gap: 10, marginBottom: 25 },
  detailItemCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12 },
  detailIconBox: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#E3F2FD', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  detailCardText: { flex: 1 },
  detailCardLabel: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  detailCardValue: { fontSize: 13, color: '#777', marginTop: 2 },
  detailSectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#111', marginBottom: 10 },
  detailDescriptionText: { fontSize: 15, color: '#444', lineHeight: 22, marginBottom: 25 },
  detailEmptyModifications: { alignItems: 'center', paddingVertical: 40, paddingHorizontal: 20, borderStyle: 'dashed', borderWidth: 1, borderColor: '#DDD', borderRadius: 12, marginTop: 15 },
  crossedWrenchesWrapper: { width: 50, height: 50, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  detailEmptyModTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 10 },
  detailEmptyModSub: { fontSize: 13, color: '#888', textAlign: 'center', marginTop: 5 },
  detailModificationsList: { marginTop: 10 },
  modificationItemCard: { backgroundColor: '#FFF', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#EEE', marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOffset: { width:0, height:1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  modItemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modItemName: { fontSize: 16, fontWeight: 'bold', color: '#111' },
  modClassificationBadge: { backgroundColor: '#E8F5E9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  modClassificationText: { color: '#2E7D32', fontSize: 11, fontWeight: 'bold' },
  modItemDesc: { fontSize: 14, color: '#555', marginTop: 8, lineHeight: 20 },
  modItemLink: { fontSize: 13, color: '#2196F3', marginTop: 8, textDecorationLine: 'underline' },

  // STYLES UNTUK ADD MODIFICATION SCREEN
  addModHeader: { paddingTop: 50, height: 95, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#EEE', backgroundColor: '#FFF' },
  addModHeaderLeft: { width: 50, justifyContent: 'center' },
  addModHeaderTitle: { fontSize: 18, fontWeight: 'bold', color: '#111', textAlign: 'center', flex: 1 },
  addModHeaderRight: { width: 50, alignItems: 'flex-end', justifyContent: 'center' },
  addModSaveText: { fontSize: 16, fontWeight: '600' },
  modFormLabel: { fontSize: 14, fontWeight: 'bold', color: '#222', marginTop: 18 },
  modFormInput: { width: '100%', minHeight: 45, backgroundColor: '#F2F2F2', borderRadius: 12, paddingHorizontal: 15, marginTop: 8, fontSize: 16, color: '#333' },
  modCharCounterInside: { position: 'absolute', top: 20, right: 15, color: '#999', fontSize: 12, fontWeight: '500' },
  catModalWrapper: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 40 },
  catModalContent: { backgroundColor: '#FFF', borderRadius: 24, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 25, width: '100%', maxHeight: '85%', elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 5 },
  catSearchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E0E0E0', paddingBottom: 10, marginBottom: 10 },
  catSearchInput: { flex: 1, fontSize: 16, color: '#333', padding: 0 },
  catHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 15, paddingBottom: 10 },
  catHeaderTitle: { fontSize: 18, fontWeight: 'bold', color: '#111' },
  catItemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  catItemText: { fontSize: 16, color: '#555' },
  catItemTextSelected: { color: '#111', fontWeight: 'bold' },
  catConfirmButton: { backgroundColor: '#007AFF', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 15 },
  catConfirmButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
  vMenuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  vMenuBottomSheet: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 40,
  },
  vMenuHandle: {
    width: 45,
    height: 5,
    backgroundColor: '#DDD',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 25,
  },
  vMenuActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 16,
  },
  vMenuText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#222',
  },
  vehiclesHeader: {
    paddingTop: 60,
    paddingHorizontal: 15,
    paddingBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  vehiclesHeaderLeft: {
    padding: 6,
  },
  vehiclesHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },
  vehiclesGridContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  vehiclesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  vehiclesGridCard: {
    width: (width - 44) / 2,
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#DDD',
  },
  vehiclesGridImage: {
    width: '100%',
    height: '100%',
  },
  vehiclesGridOwnBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#DDEEFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  vehiclesGridOwnBadgeText: {
    color: '#4A81D3',
    fontWeight: 'bold',
    fontSize: 11,
  },
  vehiclesGridOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
  },
  vehiclesGridName: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  vehiclesGridModel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
    marginTop: 2,
  }
});