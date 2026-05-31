import React, { useRef, useState, useEffect } from 'react';
import { Alert, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/backend/lib/supabase';

// Impor komponen UI dari folder frontend terpisah
import { LoginScreen, SignUpScreen } from '../../components/frontend/AuthScreens';
import { HomeScreen, SearchMainScreen, AddPostScreen } from '../../components/frontend/HomeAndDiscovery';
import { GroupsScreen, GroupFeedScreen, CreateGroupScreen } from '../../components/frontend/GroupsScreens';
import { ProfileScreen, VehiclesListScreen, VehicleDetailScreen, AddModificationScreen } from '../../components/frontend/ProfileAndVehicles';
import { InboxScreen, NotificationScreen, CreatePostScreen, CreateEventScreen } from '../../components/frontend/MiscScreens';

// Data Mock untuk Presentasi
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
          images: ['https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=800', 'https://images.unsplash.com/photo-1617650728468-8581e439c864?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'https://images.unsplash.com/photo-1617650728468-8581e439c864?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
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
  
  // State Input Form
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [signupForm, setSignupForm] = useState({ firstName: '', lastName: '', username: '', email: '', password: '', confirmPassword: '' });

  // Map Referensi
  const mapRef = useRef<any>(null);

  // Group & Posts database states
  const [myGroups, setMyGroups] = useState<any[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);

  // Detail Group Menu & Interactions
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [savedPosts, setSavedPosts] = useState<Record<string, boolean>>({});
  const [activeSlides, setActiveSlides] = useState<Record<string, number>>({});
  const [showGroupMenu, setShowGroupMenu] = useState(false);

  // Pembuatan Group Baru
  const [isPrivate, setIsPrivate] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [groupCoverUri, setGroupCoverUri] = useState<string | null>(null);
  const [groupPhotoUri, setGroupPhotoUri] = useState<string | null>(null);
  const [groupName, setGroupName] = useState('');
  const [groupBio, setGroupBio] = useState('');
  const [groupTag, setGroupTag] = useState('');
  const [groupLocation, setGroupLocation] = useState('');
  const [groupWebsite, setGroupWebsite] = useState('');

  // Pembuatan Post & Event
  const [postCaption, setPostCaption] = useState('');
  const [disableComments, setDisableComments] = useState(false);
  const [boostEvent, setBoostEvent] = useState(false);

  // Kendaraan & Modifikasi
  const [modifications, setModifications] = useState<any[]>([]);
  const [showVehicleMenu, setShowVehicleMenu] = useState(false);
  const [vehicleBackScreen, setVehicleBackScreen] = useState('profile');

  const { width } = Dimensions.get('window');

  // Menyelaraskan currentUser format database (snake_case) ke frontend format (camelCase)
  const normalizeAndSetUser = (profile: any) => {
    if (!profile) {
      setCurrentUser(null);
      return;
    }
    setCurrentUser({
      ...profile,
      firstName: profile.first_name || profile.firstName || '',
      lastName: profile.last_name || profile.lastName || '',
      stats: profile.stats || { badges: 0, posts: 0, followers: 0, following: 0 },
      cars: profile.cars || ['2010 Mazda Rx8'],
    });
  };

  // Restore session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }: any) => {
      if (session) {
        supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single()
          .then(({ data: profile }: any) => {
            if (profile) {
              normalizeAndSetUser(profile);
              setScreen("home");
            }
          });
      }
    });
  }, []);

  // Fetch groups yang diikuti dari database Supabase
  useEffect(() => {
    if (currentUser && screen === "groups") {
      fetchMyGroups();
    }
  }, [screen, currentUser]);

  const fetchMyGroups = async () => {
    if (!currentUser) return;
    setLoadingGroups(true);
    try {
      const { data: membershipData, error } = await supabase
        .from("group_members")
        .select("group_id, groups(*)")
        .eq("user_id", currentUser.id);

      if (error) throw error;

      const joined = membershipData?.map((m: any) => m.groups).filter(Boolean) || [];
      
      // Tambahkan grup presentasi kustom (DrivnBye) agar UI selalu terlihat ramai dan cantik
      const hasDrivnBye = joined.some((g: any) => g.name === 'DrivnBye');
      const finalGroups = hasDrivnBye ? joined : [PRESENTATION_USER.groups[0], ...joined];
      setMyGroups(finalGroups);
    } catch (err: any) {
      console.error("Error fetching groups:", err.message);
    } finally {
      setLoadingGroups(false);
    }
  };

  // VALIDASI LOGIN (Supabase Auth)
  const handleLogin = async () => {
    try {
      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("username", loginForm.username)
        .single();

      if (profileError || !profile) {
        Alert.alert("❌ Login Failed", "Username tidak ditemukan!");
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: profile.email,
        password: loginForm.password,
      });
      if (error) throw error;

      normalizeAndSetUser(profile);
      setScreen("home");
      Alert.alert("✅ Login Success", `Welcome back, ${profile.first_name || profile.username}!`);
    } catch (e: any) {
      Alert.alert("❌ Login Failed", e.message);
    }
  };

  // VALIDASI SIGNUP (Supabase Auth & Database Insert)
  const handleSignup = async () => {
    if (
      !signupForm.firstName ||
      !signupForm.lastName ||
      !signupForm.username ||
      !signupForm.email ||
      !signupForm.password ||
      !signupForm.confirmPassword
    ) {
      Alert.alert("❌ Error", "Semua field harus diisi!");
      return;
    }
    if (signupForm.password !== signupForm.confirmPassword) {
      Alert.alert("❌ Error", "Password tidak cocok!");
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: signupForm.email,
        password: signupForm.password,
      });
      if (error) throw error;

      if (!data.user) throw new Error("Gagal membuat user.");

      const { error: profileError } = await supabase.from("users").insert({
        id: data.user.id,
        username: signupForm.username,
        first_name: signupForm.firstName,
        last_name: signupForm.lastName,
        email: signupForm.email,
      });
      if (profileError) throw profileError;

      const profile = {
        id: data.user.id,
        username: signupForm.username,
        first_name: signupForm.firstName,
        last_name: signupForm.lastName,
        email: signupForm.email
      };

      normalizeAndSetUser(profile);
      setScreen("home");
      Alert.alert("✅ Register Success", `Welcome, ${signupForm.firstName}!`);
    } catch (e: any) {
      Alert.alert("❌ Error", e.message);
    }
  };

  // LOGOUT (Supabase Auth)
  const handleLogout = async () => {
    Alert.alert("Logout of account?", "", [
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await supabase.auth.signOut();
          setCurrentUser(null);
          setScreen("login");
          Alert.alert("👋 Logged out", "See you soon!");
        }
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  // PEMBUATAN GRUP BARU (Supabase Insert)
  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      Alert.alert('❌ Error', 'Group name is required!');
      return;
    }

    try {
      const { data: newGroup, error } = await supabase
        .from("groups")
        .insert({
          name: groupName.trim(),
          description: groupBio || "A community built inside DriveTribe",
          visibility: isPrivate ? "private" : "public",
          created_by: currentUser.id,
          cover_image: groupCoverUri || "https://images.unsplash.com/photo-1617531653520-4893f7bbf978?w=1200",
          logo: groupPhotoUri || "https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg",
          tag_name: groupTag ? `[${groupTag.toUpperCase().replace(/[\[\]]/g, '')}]` : undefined,
        })
        .select()
        .single();

      if (error) throw error;

      await supabase
        .from("group_members")
        .insert({ group_id: newGroup.id, user_id: currentUser.id });

      Alert.alert('🎉 Success', `Group "${groupName}" created successfully!`);
      
      // Reset State
      setGroupName('');
      setGroupBio('');
      setGroupTag('');
      setGroupLocation('');
      setGroupWebsite('');
      setGroupCoverUri(null);
      setGroupPhotoUri(null);
      setIsPrivate(false);

      await fetchMyGroups();
      setScreen('groups');
    } catch (err: any) {
      Alert.alert("Creation Failed", err.message);
    }
  };

  // PENGAMBILAN GAMBAR (Expo Image Picker)
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

  // AKSI MODIFIKASI KENDARAAN (Tambahkan Modifikasi)
  const handleSaveModification = (modData: { name: string; description: string; link: string; classification: string }) => {
    const newMod = {
      id: Date.now(),
      name: modData.name,
      description: modData.description,
      link: modData.link,
      classification: modData.classification
    };
    setModifications(prev => [...prev, newMod]);
    setScreen('vehicleDetail');
  };

  // Center peta ke lokasi GPS pengguna
  const goToMyLocation = () => {
    mapRef.current?.animateCamera({
      center: { latitude: -6.1754, longitude: 106.8272 },
      zoom: 17
    });
  };

  // Interaksi Feed Postingan
  const toggleLike = (postId: any) => setLikedPosts(prev => ({ ...prev, [postId]: !prev[postId] }));
  const toggleSave = (postId: any) => setSavedPosts(prev => ({ ...prev, [postId]: !prev[postId] }));
  const handleScrollImage = (event: any, postId: any) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveSlides(prev => ({ ...prev, [postId]: slideIndex }));
  };

  // Menyisipkan postingan visual ke grup jika data dari server kosong
  const getGroupWithContent = (group: any) => {
    if (!group) return null;
    if (group.posts && group.posts.length > 0) return group;
    
    // Default mock data agar visual tetap keren
    const isMockGroup = group.id === 'g1' || group.name === 'DrivnBye';
    const mockPosts = isMockGroup ? PRESENTATION_USER.groups[0].posts : PRESENTATION_USER.groups[1].posts;
    return {
      ...group,
      posts: mockPosts
    };
  };

  // --- ROUTING DAN RENDER SCREEN ---
  
  if (!currentUser && (
    screen === 'home' || 
    screen === 'profile' || 
    screen === 'groups' || 
    screen === 'groupFeed' || 
    screen === 'createGroup' || 
    screen === 'createPost' || 
    screen === 'createEvent' ||
    screen === 'searchMain' || 
    screen === 'addPost' || 
    screen === 'inbox' || 
    screen === 'notifications' || 
    screen === 'vehicleDetail' || 
    screen === 'addModification' || 
    screen === 'vehicles'
  )) {
    return <LoginScreen loginForm={loginForm} setLoginForm={setLoginForm} handleLogin={handleLogin} setScreen={setScreen} />;
  }

  if (screen === 'login') {
    return <LoginScreen loginForm={loginForm} setLoginForm={setLoginForm} handleLogin={handleLogin} setScreen={setScreen} />;
  }
  if (screen === 'signup') {
    return <SignUpScreen signupForm={signupForm} setSignupForm={setSignupForm} handleSignup={handleSignup} setScreen={setScreen} />;
  }
  if (screen === 'addPost') {
    return <AddPostScreen setScreen={setScreen} currentUser={currentUser} />;
  }
  if (screen === 'searchMain') {
    return <SearchMainScreen setScreen={setScreen} currentUser={currentUser} myGroups={myGroups} />;
  }
  if (screen === 'inbox') {
    return <InboxScreen setScreen={setScreen} />;
  }
  if (screen === 'notifications') {
    return <NotificationScreen setScreen={setScreen} />;
  }
  if (screen === 'profile') {
    return <ProfileScreen setScreen={setScreen} currentUser={currentUser} handleLogout={handleLogout} setVehicleBackScreen={setVehicleBackScreen} />;
  }
  if (screen === 'groups') {
    return <GroupsScreen setScreen={setScreen} currentUser={currentUser} myGroups={myGroups} setSelectedGroup={setSelectedGroup} loadingGroups={loadingGroups} />;
  }
  if (screen === 'groupFeed') {
    return (
      <GroupFeedScreen 
        setScreen={setScreen} 
        selectedGroup={getGroupWithContent(selectedGroup)} 
        showGroupMenu={showGroupMenu} 
        setShowGroupMenu={setShowGroupMenu} 
        likedPosts={likedPosts} 
        savedPosts={savedPosts} 
        activeSlides={activeSlides} 
        toggleLike={toggleLike} 
        toggleSave={toggleSave} 
        handleScrollImage={handleScrollImage} 
        width={width} 
      />
    );
  }
  if (screen === 'createGroup') {
    return (
      <CreateGroupScreen 
        setScreen={setScreen}
        groupCoverUri={groupCoverUri}
        pickGroupCover={pickGroupCover}
        groupPhotoUri={groupPhotoUri}
        pickGroupPhoto={pickGroupPhoto}
        groupName={groupName}
        setGroupName={setGroupName}
        groupBio={groupBio}
        setGroupBio={setGroupBio}
        groupTag={groupTag}
        setGroupTag={setGroupTag}
        groupLocation={groupLocation}
        setGroupLocation={setGroupLocation}
        groupWebsite={groupWebsite}
        setGroupWebsite={setGroupWebsite}
        isPrivate={isPrivate}
        setIsPrivate={setIsPrivate}
        isLocked={isLocked}
        setIsLocked={setIsLocked}
        handleCreateGroup={handleCreateGroup}
      />
    );
  }
  if (screen === 'createPost') {
    return (
      <CreatePostScreen 
        setScreen={setScreen}
        postCaption={postCaption}
        setPostCaption={setPostCaption}
        disableComments={disableComments}
        setDisableComments={setDisableComments}
        boostEvent={boostEvent}
        setBoostEvent={setBoostEvent}
      />
    );
  }
  if (screen === 'createEvent') {
    return (
      <CreateEventScreen 
        setScreen={setScreen}
        boostEvent={boostEvent}
        setBoostEvent={setBoostEvent}
      />
    );
  }
  if (screen === 'vehicleDetail') {
    return (
      <VehicleDetailScreen 
        setScreen={setScreen} 
        currentUser={currentUser} 
        vehicleBackScreen={vehicleBackScreen} 
        modifications={modifications} 
        setModifications={setModifications} 
        showVehicleMenu={showVehicleMenu} 
        setShowVehicleMenu={setShowVehicleMenu} 
      />
    );
  }
  if (screen === 'vehicles') {
    return <VehiclesListScreen setScreen={setScreen} currentUser={currentUser} setVehicleBackScreen={setVehicleBackScreen} />;
  }
  if (screen === 'addModification') {
    return <AddModificationScreen setScreen={setScreen} onSaveModification={handleSaveModification} />;
  }

  return <HomeScreen mapRef={mapRef} setScreen={setScreen} goToMyLocation={goToMyLocation} currentUser={currentUser} />;
}
