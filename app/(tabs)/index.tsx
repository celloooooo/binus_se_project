import {
  ArrowLeft,
  Bell,
  BellOff,
  Calendar,
  Camera,
  ChevronRight,
  Ellipsis,
  Filter,
  Home as HomeIcon,
  Image as ImageIcon,
  MessageCircleOff,
  MessageSquare,
  Plus,
  PlusCircle,
  Search,
  Target,
  User as UserIcon,
  UserPlus,
  Users2,
} from "lucide-react-native";

// import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useRef, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { supabase } from "@/backend/lib/supabase";
import { useEffect } from "react";
import MapView from "react-native-maps";

const { width } = Dimensions.get("window");

// ✅ DATABASE SIMULASI
// const mockUsers = [];

export default function App() {
  const [screen, setScreen] = useState("login");
  const [currentUser, setCurrentUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const mapRef = useRef(null);

  const [myGroups, setMyGroups] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [myGroupsSearch, setMyGroupsSearch] = useState("");

  useEffect(() => {
    if (currentUser && screen === "groups") {
      fetchMyGroups();
    }
  }, [screen, currentUser]);

  const fetchMyGroups = async () => {
    setLoadingGroups(true);
    try {
      // Fetch groups the user joined via the group_members junction table
      const { data: membershipData, error } = await supabase
        .from("group_members")
        .select("group_id, groups(*)")
        .eq("user_id", currentUser.id);

      if (error) throw error;

      // Extract the nested group objects safely
      const joined = membershipData?.map((m) => m.groups).filter(Boolean) || [];
      setMyGroups(joined);
    } catch (err: any) {
      console.error("Error fetching groups:", err.message);
    } finally {
      setLoadingGroups(false);
    }
  };

  const handleCreateGroupQuickly = async () => {
    Alert.prompt(
      "Create New Group",
      "Enter community group name:",
      async (name) => {
        if (!name || name.trim() === "") return;
        try {
          // Inserts directly into your exact columns: name, description, visibility, created_by
          const { data: newGroup, error } = await supabase
            .from("groups")
            .insert({
              name: name.trim(),
              description: "A community built inside DriveTribe",
              visibility: "public",
              created_by: currentUser.id,
              cover_image:
                "https://images.unsplash.com/photo-1617531653520-4893f7bbf978?w=1200",
              logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg",
            })
            .select()
            .single();

          if (error) throw error;

          // Automatically add the creator as the first member in your junction table
          await supabase
            .from("group_members")
            .insert({ group_id: newGroup.id, user_id: currentUser.id });

          Alert.alert("Success 🎉", `Community "${name}" is now live!`);

          // Refresh your group list immediately
          fetchMyGroups();
        } catch (err: any) {
          Alert.alert("Creation Failed", err.message);
        }
      },
    );
  };

  const handleLeaveGroup = async (groupId) => {
    try {
      const { error } = await supabase
        .from("group_members")
        .delete()
        .eq("group_id", groupId)
        .eq("user_id", currentUser.id);

      if (error) throw error;

      Alert.alert(
        "Left Group",
        "You are no longer a member of this community.",
      );

      // Refresh the group list immediately
      fetchMyGroups();
    } catch (err: any) {
      Alert.alert("Error leaving group", err.message);
    }
  };

  // React.useEffect(() => {
  //   loadUsers();
  // }, []);

  // const loadUsers = async () => {
  //   try {
  //     const data = await AsyncStorage.getItem("users");

  //     if (data) {
  //       const parsed = JSON.parse(data);

  //       mockUsers.push(...parsed);
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  useEffect(() => {
    // Restore session on app load
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single()
          .then(({ data: profile }) => {
            if (profile) {
              setCurrentUser({
                ...profile,
                stats: { badges: 0, posts: 0, followers: 0, following: 0 },
              });
              setScreen("home");
            }
          });
      }
    });
  }, []);

  // ✅ VALIDASI LOGIN
  const handleLogin = async () => {
    try {
      // 1. Find email from username
      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("username", loginForm.username)
        .single();

      if (profileError || !profile) {
        Alert.alert("❌ Login Failed", "Username tidak ditemukan!");
        return;
      }

      // 2. Sign in with email + password
      const { data, error } = await supabase.auth.signInWithPassword({
        email: profile.email,
        password: loginForm.password,
      });
      if (error) throw error;

      setCurrentUser({
        ...profile,
        stats: { badges: 0, posts: 0, followers: 0, following: 0 },
      });
      setScreen("home");
      Alert.alert("✅ Login Success", `Welcome back, ${profile.first_name}!`);
    } catch (e: any) {
      Alert.alert("❌ Login Failed", e.message);
    }
  };

  // ✅ VALIDASI REGISTER (NEW USER = FULLY EMPTY)
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

      const { error: profileError } = await supabase.from("users").insert({
        id: data.user.id,
        username: signupForm.username,
        first_name: signupForm.firstName,
        last_name: signupForm.lastName,
        email: signupForm.email,
      });
      if (profileError) throw profileError;

      setCurrentUser({
        id: data.user.id,
        username: signupForm.username,
        first_name: signupForm.firstName,
        last_name: signupForm.lastName,
        stats: { badges: 0, posts: 0, followers: 0, following: 0 },
      });
      setScreen("home");
      Alert.alert("✅ Register Success", `Welcome, ${signupForm.firstName}!`);
    } catch (e: any) {
      Alert.alert("❌ Error", e.message);
    }
  };

  // ✅ LOGOUT
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setScreen("login");
    Alert.alert("👋 Logged out", "See you soon!");
  };

  // GPS CENTER (DIPERTAHANKAN)
  const goToMyLocation = () => {
    mapRef.current?.animateCamera({
      center: {
        latitude: -6.1754,
        longitude: 106.8272,
      },
      zoom: 17,
    });
  };

  // HOME SCREEN (DIPERTAHANKAN)
  const HomeScreen = () => (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        showsUserLocation={true}
        showsMyLocationButton={false}
        followsUserLocation={false}
        initialRegion={{
          latitude: -6.1754,
          longitude: 106.8272,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      />

      <View style={styles.header}>
        <Text style={styles.brandText}>DriveTribe</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => setScreen("inbox")}>
            <MessageSquare size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setScreen("notifications")}>
            <Bell size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.leftActionStack}>
        <TouchableOpacity style={styles.circularActionBtn}>
          <Users2 size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.circularActionBtn}
          onPress={goToMyLocation}
        >
          <Target size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.circularActionBtn}>
          <Filter size={24} color="black" />
        </TouchableOpacity>
      </View>

      <BottomBar active="home" />
    </View>
  );

  // ✅ GROUPS SCREEN (REVISI - EMPTY UNTUK NEW USER)
  const GroupsScreen = () => {
    // Filters the fetched backend groups locally using the search bar input
    const filteredMyGroups = myGroups.filter((g) =>
      g.name?.toLowerCase().includes(myGroupsSearch.toLowerCase()),
    );

    return (
      <View style={styles.whiteContainer}>
        <View style={styles.topPageHeader}>
          <View style={{ width: 28 }} />
          <Text style={styles.topPageTitle}>My Groups</Text>
          <TouchableOpacity onPress={handleCreateGroupQuickly}>
            <Plus size={28} color="black" />
          </TouchableOpacity>
        </View>

        <View style={{ paddingHorizontal: 15, marginTop: 15 }}>
          <TextInput
            placeholder="Search My Groups"
            style={styles.searchField}
            placeholderTextColor="#999"
            value={myGroupsSearch}
            onChangeText={setMyGroupsSearch}
          />
        </View>

        {loadingGroups ? (
          <ActivityIndicator
            size="large"
            color="#4A81D3"
            style={{ marginTop: 40 }}
          />
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 120, paddingTop: 15 }}
          >
            {/* ✅ EMPTY STATE IF BACKEND HAS NO MEMBERSHIPS FOR USER */}
            {filteredMyGroups.length === 0 ? (
              <View style={styles.emptyGroupsContainer}>
                <Users2 size={70} color="#999" strokeWidth={1.5} />
                <Text style={styles.emptyGroupsTitle}>No Groups Yet</Text>
                <Text style={styles.emptyGroupsText}>
                  Join groups to connect with other car enthusiasts{"\n"}
                  near you or worldwide!
                </Text>
                <TouchableOpacity
                  style={styles.joinGroupsBtn}
                  onPress={() => setScreen("searchMain")}
                >
                  <Text style={styles.joinGroupsBtnText}>Find Groups</Text>
                </TouchableOpacity>
              </View>
            ) : (
              // Loops through real groups found in your Supabase table
              filteredMyGroups.map((group) => (
                <TouchableOpacity key={group.id} style={styles.groupCard}>
                  {group.cover_image && (
                    <Image
                      source={{ uri: group.cover_image }}
                      style={styles.groupImage}
                    />
                  )}
                  <View style={styles.groupInfo}>
                    <View style={styles.groupRow}>
                      {group.logo && (
                        <Image
                          source={{ uri: group.logo }}
                          style={styles.groupLogo}
                        />
                      )}
                      <View>
                        <Text style={styles.groupTitle}>{group.name}</Text>
                        <View style={styles.groupMetaRow}>
                          <Text style={styles.groupMeta}>
                            {group.visibility?.toLowerCase() === "public"
                              ? "🌐 Public"
                              : "🔒 Private"}
                          </Text>
                          <Text style={styles.groupMeta}>👥 Active</Text>
                        </View>
                        <TouchableOpacity
                          style={[
                            styles.joinGroupsBtn,
                            {
                              backgroundColor: "#FF3B30",
                              marginLeft: 180,
                              marginTop: -30,
                              paddingVertical: 8,
                              paddingHorizontal: 13,
                              borderRadius: 20,
                              alignSelf: "center",
                            },
                          ]}
                          onPress={() => handleLeaveGroup(group.id)}
                        >
                          <Text
                            style={{
                              color: "white",
                              fontSize: 13,
                              fontWeight: "600",
                            }}
                          >
                            Leave
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        )}
        <BottomBar active="groups" />
      </View>
    );
  };

  // PROFILE SCREEN (DIPERTAHANKAN)
  const ProfileScreen = () => (
    <View style={styles.whiteContainer}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View style={styles.profileCoverWrapper}>
          <View
            style={[
              styles.profileCover,
              {
                backgroundColor: currentUser?.coverImage
                  ? "transparent"
                  : "#F5F5F5",
              },
            ]}
          >
            {!currentUser?.coverImage && (
              <View style={styles.emptyCoverOverlay}>
                <Camera size={40} color="#999" strokeWidth={2} />
                <Text style={styles.emptyCoverText}>Add Cover Photo</Text>
              </View>
            )}
            {currentUser?.coverImage && (
              <Image
                source={{ uri: currentUser.coverImage }}
                style={styles.profileCover}
              />
            )}
          </View>

          <View style={styles.profileTopOverlay}>
            <View />

            <View style={styles.profileTopActions}>
              <Text style={styles.profileFire}>🔥 0</Text>
              <TouchableOpacity
                onPress={() =>
                  Alert.alert("Logout of account?", "", [
                    {
                      text: "Logout",
                      onPress: handleLogout,
                      style: "destructive",
                    },
                    { text: "Cancel", style: "cancel" },
                  ])
                }
              >
                <Ellipsis size={28} color="black" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.profileAvatarWrapper}>
            {currentUser?.profileImage ? (
              <Image
                source={{ uri: currentUser.profileImage }}
                style={styles.profileAvatar}
              />
            ) : (
              <View style={styles.emptyAvatar}>
                <Camera size={32} color="#999" strokeWidth={2} />
              </View>
            )}
          </View>
        </View>

        <View style={styles.profileStatsRow}>
          <View style={styles.profileStatItem}>
            <Text style={styles.profileStatNumber}>
              {currentUser?.stats.badges || 0}
            </Text>
            <Text style={styles.profileStatLabel}>Badges</Text>
          </View>
          <View style={styles.profileStatItem}>
            <Text style={styles.profileStatNumber}>
              {currentUser?.stats.posts || 0}
            </Text>
            <Text style={styles.profileStatLabel}>Posts</Text>
          </View>
          <View style={styles.profileStatItem}>
            <Text style={styles.profileStatNumber}>
              {currentUser?.stats.followers || 0}
            </Text>
            <Text style={styles.profileStatLabel}>Followers</Text>
          </View>
          <View style={styles.profileStatItem}>
            <Text style={styles.profileStatNumber}>
              {currentUser?.stats.following || 0}
            </Text>
            <Text style={styles.profileStatLabel}>Following</Text>
          </View>
        </View>

        <View style={styles.profileContent}>
          <Text style={styles.profileName}>
            {currentUser?.first_name} {currentUser?.last_name}
          </Text>
          <Text style={styles.profileUsername}>@{currentUser?.username}</Text>

          {currentUser?.bio ? (
            <Text style={styles.profileBio}>{currentUser.bio}</Text>
          ) : (
            <View style={styles.emptyBio}>
              <Text style={styles.emptyBioText}>
                Add bio to tell your story...
              </Text>
            </View>
          )}

          <View style={styles.ownedHeader}>
            <Text style={styles.ownedTitle}>Owned Vehicles</Text>
            <Text style={styles.ownedSub}>
              {currentUser?.cars?.length || 0} Vehicles
            </Text>
          </View>

          <View style={styles.vehicleCardsRow}>
            {currentUser?.cars?.length > 0 ? (
              currentUser.cars.slice(0, 1).map((car, index) => (
                <TouchableOpacity key={index} style={styles.vehicleCard}>
                  <Image
                    source={{
                      uri: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1000",
                    }}
                    style={styles.vehicleImage}
                  />
                  <View style={styles.ownBadge}>
                    <Text style={styles.ownBadgeText}>Own</Text>
                  </View>
                  <View style={styles.vehicleOverlay}>
                    <Text style={styles.vehicleName}>My Car</Text>
                    <Text style={styles.vehicleModel}>{car}</Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <TouchableOpacity
                style={[styles.showAllCard, styles.emptyVehicleCard]}
              >
                <Text style={styles.emptyVehicleText}>
                  Add your first{"\n"}vehicle
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.showAllCard}>
              <Text style={styles.showAllText}>Show All{"\n"}Vehicles</Text>
            </TouchableOpacity>
          </View>

          {/* <TouchableOpacity style={styles.vehicleTab}>
            <Text style={styles.vehicleTabText}>Vehicles</Text>
          </TouchableOpacity> */}
          <Text style={styles.postTitle}>Your Posts</Text>
          <Text style={styles.ownedSub}>
            {currentUser?.posts?.length || 0} Posts
          </Text>
        </View>
      </ScrollView>
      <BottomBar active="profile" />
    </View>
  );

  // INBOX SCREEN (DIPERTAHANKAN)
  const InboxScreen = () => (
    <View style={styles.whiteContainer}>
      <View style={styles.topPageHeader}>
        <TouchableOpacity onPress={() => setScreen("home")}>
          <ArrowLeft size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.topPageTitle}>Inbox</Text>
        <TouchableOpacity>
          <Plus size={32} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.emptyStateWrapper}>
        <MessageCircleOff size={70} color="black" strokeWidth={1.7} />
        <Text style={styles.emptyStateText}>No Conversation</Text>
      </View>
    </View>
  );

  // NOTIFICATION SCREEN (DIPERTAHANKAN)
  const NotificationScreen = () => (
    <View style={styles.whiteContainer}>
      <View style={styles.topPageHeader}>
        <TouchableOpacity onPress={() => setScreen("home")}>
          <ArrowLeft size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.topPageTitle}>Notifications</Text>
        <View style={{ width: 28 }} />
      </View>
      <View style={styles.emptyStateWrapper}>
        <BellOff size={70} color="black" strokeWidth={1.7} />
        <Text style={styles.emptyStateText}>No Notification</Text>
      </View>
    </View>
  );

  // LOGIN SCREEN (DIPERTAHANKAN)
  const LoginScreen = () => (
    <View style={styles.authContainer}>
      <Text style={styles.authLogo}>DriveTribe</Text>

      <TextInput
        placeholder="Username"
        style={styles.authInput}
        placeholderTextColor="#999"
        value={loginForm.username}
        onChangeText={(text) => setLoginForm({ ...loginForm, username: text })}
      />

      <TextInput
        placeholder="Password"
        style={styles.authInput}
        secureTextEntry
        placeholderTextColor="#999"
        value={loginForm.password}
        onChangeText={(text) => setLoginForm({ ...loginForm, password: text })}
      />

      <TouchableOpacity style={styles.authPrimaryBtn} onPress={handleLogin}>
        <Text style={styles.authBtnText}>Sign in</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.authLinkSmall}>Forgot Password?</Text>
      </TouchableOpacity>

      <View style={styles.authFooter}>
        <Text style={styles.authFooterText}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => setScreen("signup")}>
          <Text style={styles.authLinkBlue}> Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // SIGNUP SCREEN (DIPERTAHANKAN)
  const SignUpScreen = () => (
    <ScrollView contentContainerStyle={styles.authContainer}>
      <Text style={styles.authLogo}>DriveTribe</Text>

      <View style={styles.authRow}>
        <TextInput
          placeholder="First Name"
          style={[styles.authInput, { flex: 1, marginRight: 10 }]}
          value={signupForm.firstName}
          onChangeText={(text) =>
            setSignupForm({ ...signupForm, firstName: text })
          }
        />
        <TextInput
          placeholder="Last Name"
          style={[styles.authInput, { flex: 1 }]}
          value={signupForm.lastName}
          onChangeText={(text) =>
            setSignupForm({ ...signupForm, lastName: text })
          }
        />
      </View>

      <TextInput
        placeholder="Username"
        style={styles.authInput}
        value={signupForm.username}
        onChangeText={(text) =>
          setSignupForm({ ...signupForm, username: text })
        }
      />

      <TextInput
        placeholder="Email"
        style={styles.authInput}
        value={signupForm.email}
        onChangeText={(text) => setSignupForm({ ...signupForm, email: text })}
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Password"
        style={styles.authInput}
        secureTextEntry
        value={signupForm.password}
        onChangeText={(text) =>
          setSignupForm({ ...signupForm, password: text })
        }
      />

      <TextInput
        placeholder="Confirm Password"
        style={styles.authInput}
        secureTextEntry
        value={signupForm.confirmPassword}
        onChangeText={(text) =>
          setSignupForm({ ...signupForm, confirmPassword: text })
        }
      />

      <TouchableOpacity style={styles.authPrimaryBtn} onPress={handleSignup}>
        <Text style={styles.authBtnText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.authSecondaryBtn}
        onPress={() => setScreen("login")}
      >
        <Text style={styles.authSecondaryText}>← Back to Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  // ✅ SEARCH SCREEN (REVISI - GROUPS EMPTY UNTUK NEW USER)
  const SearchMainScreen = () => (
    <View style={styles.whiteContainer}>
      <View style={styles.searchHeaderTop}>
        <TextInput
          placeholder="Search"
          style={styles.searchField}
          placeholderTextColor="#999"
        />
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitleText}>Discover</Text>
        </View>
        <View style={styles.discoverTagsContainer}>
          {[
            "🔥 Trending Near Posts",
            "📌 Trending Hashtags",
            "🌍 Trending Worldwide Posts",
            "🎉 Today's Events",
            "🆕 New Events",
            "👋 Nearby Users",
            "👥 Popular Groups",
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
          <Text style={styles.noResultSubText}>
            No Posts could be found at this time
          </Text>
        </View>

        {/* ✅ GROUPS SECTION - EMPTY UNTUK NEW USER */}
        <SectionRow label="Groups" action="Discover all Groups" />
        {myGroups.length === 0 ? (
          <View style={styles.emptyGroupsContainer}>
            <Users2 size={60} color="#999" strokeWidth={1.5} />
            <Text style={[styles.noResultMainText, { color: "#666" }]}>
              No Groups Joined
            </Text>
            <Text style={styles.noResultSubText}>
              Join groups to see your communities here!
            </Text>
          </View>
        ) : (
          // Loops and lists your actual joined groups right on your Discover screen!
          myGroups.map((group) => (
            <View key={group.id} style={styles.groupCard}>
              {group.cover_image && (
                <Image
                  source={{ uri: group.cover_image }}
                  style={styles.groupImage}
                />
              )}
              <View style={styles.groupInfo}>
                <View style={styles.groupRow}>
                  {group.logo && (
                    <Image
                      source={{ uri: group.logo }}
                      style={styles.groupLogo}
                    />
                  )}
                  <View>
                    <Text style={styles.groupTitle}>{group.name}</Text>
                    <View style={styles.groupMetaRow}>
                      <Text style={styles.groupMeta}>
                        {group.visibility?.toLowerCase() === "public"
                          ? "🌐 Public"
                          : "🔒 Private"}
                      </Text>
                      <Text style={styles.groupMeta}>👥 Joined</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          ))
        )}

        <SectionRow label="Events" action="Discover all Events" />
        <View style={styles.noResultContainer}>
          <Calendar size={70} color="#777" strokeWidth={1.5} />
          <Text style={styles.noResultMainText}>No Results</Text>
          <Text style={styles.noResultSubText}>
            No Events could be found at this time,{"\n"}use Map View to widen
            your search!
          </Text>
        </View>
      </ScrollView>
      <BottomBar active="search" />
    </View>
  );

  // ADD POST (DIPERTAHANKAN)
  const AddPostScreen = () => (
    <View style={styles.whiteContainer}>
      <View style={styles.addPostMain}>
        <Text style={styles.addPostTitle}>Create Content</Text>
        <Text style={styles.addPostSubtitle}>
          Share your thoughts, stories, or upcoming event...
        </Text>
        <TouchableOpacity style={styles.addCard}>
          <View style={[styles.iconBox, { backgroundColor: "#8E24AA" }]}>
            <PlusCircle size={30} color="white" />
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardLabel}>Post</Text>
            <Text style={styles.cardSub}>Post to the map...</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addCard}>
          <View style={[styles.iconBox, { backgroundColor: "#1E88E5" }]}>
            <Calendar size={30} color="white" />
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardLabel}>Event</Text>
            <Text style={styles.cardSub}>Organize an event...</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addCard}
          onPress={handleCreateGroupQuickly}
        >
          <View style={[styles.iconBox, { backgroundColor: "#43A047" }]}>
            <UserPlus size={30} color="white" />
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardLabel}>Group</Text>
            <Text style={styles.cardSub}>Create a group...</Text>
          </View>
        </TouchableOpacity>
      </View>
      <BottomBar active="plus" />
    </View>
  );

  // SECTION ROW (DIPERTAHANKAN)
  const SectionRow = ({ label, action }) => (
    <View style={styles.searchSectionRow}>
      <Text style={styles.sectionTitleText}>{label}</Text>
      <TouchableOpacity style={styles.rowAlign}>
        <Text style={styles.linkTextGray}>{action}</Text>
        <ChevronRight size={18} color="#999" />
      </TouchableOpacity>
    </View>
  );

  // ✅ BOTTOM BAR (REVISI - PROFIL ICON FIX)
  const BottomBar = ({ active }) => (
    <View style={styles.tabBar}>
      <TouchableOpacity onPress={() => setScreen("home")}>
        <HomeIcon size={26} color={active === "home" ? "#2196F3" : "black"} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setScreen("searchMain")}>
        <Search size={26} color={active === "search" ? "#2196F3" : "black"} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setScreen("addPost")}>
        <Plus size={26} color={active === "plus" ? "#2196F3" : "black"} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setScreen("groups")}>
        <Users2 size={26} color={active === "groups" ? "#2196F3" : "black"} />
      </TouchableOpacity>

      {/* ✅ ICON PROFIL FIX - SELALU USER ICON */}
      <TouchableOpacity onPress={() => setScreen("profile")}>
        <UserIcon
          size={26}
          color={active === "profile" ? "#2196F3" : "black"}
          style={{ borderRadius: 13 }}
        />
      </TouchableOpacity>
    </View>
  );

  // ROUTING (DIPERTAHANKAN + AUTH CHECK)
  if (
    !currentUser &&
    (screen === "home" ||
      screen === "profile" ||
      screen === "groups" ||
      screen === "searchMain" ||
      screen === "addPost" ||
      screen === "inbox" ||
      screen === "notifications")
  ) {
    setScreen("login");
    return <LoginScreen />;
  }

  if (screen === "login") return LoginScreen();
  if (screen === "signup") return SignUpScreen();
  if (screen === "addPost") return AddPostScreen();
  if (screen === "searchMain") return SearchMainScreen();
  if (screen === "inbox") return InboxScreen();
  if (screen === "notifications") return NotificationScreen();
  if (screen === "profile") return ProfileScreen();
  if (screen === "groups") return GroupsScreen();

  return HomeScreen();
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  whiteContainer: { flex: 1, backgroundColor: "#fff" },
  authContainer: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 35,
  },
  authLogo: {
    fontSize: 42,
    fontWeight: "900",
    color: "black",
    marginBottom: 60,
  },
  authInput: {
    width: "100%",
    height: 45,
    backgroundColor: "#D9D9D9",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 12,
  },
  authPrimaryBtn: {
    width: "100%",
    height: 45,
    backgroundColor: "#4A81D3",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
  authSecondaryBtn: {
    width: "100%",
    height: 45,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#DDD",
  },
  authBtnText: { color: "white", fontSize: 16, fontWeight: "700" },
  authSecondaryText: { color: "#4A81D3", fontSize: 16, fontWeight: "600" },
  authLinkSmall: { fontSize: 12, color: "#666", marginTop: 15 },
  authFooter: { flexDirection: "row", marginTop: 10 },
  authFooterText: { fontSize: 12, color: "#666" },
  authLinkBlue: { fontSize: 12, color: "#4A81D3", fontWeight: "bold" },
  authRow: { flexDirection: "row", width: "100%" },

  // ✅ NEW GROUPS EMPTY STYLES
  emptyGroupsContainer: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyGroupsTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
    color: "#333",
  },
  emptyGroupsText: {
    fontSize: 15,
    color: "#888",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 22,
    marginBottom: 25,
  },
  joinGroupsBtn: {
    backgroundColor: "#4A81D3",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  joinGroupsBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  map: { ...StyleSheet.absoluteFillObject },
  header: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  brandText: { fontSize: 24, fontWeight: "900" },
  headerIcons: { flexDirection: "row", gap: 18 },
  leftActionStack: { position: "absolute", bottom: 110, left: 20, gap: 10 },
  circularActionBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  searchHeaderTop: { paddingTop: 60, paddingHorizontal: 15, paddingBottom: 10 },
  searchField: {
    height: 45,
    backgroundColor: "#F2F2F2",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  sectionHeader: { paddingHorizontal: 15, marginTop: 15 },
  sectionTitleText: { fontSize: 24, fontWeight: "700", color: "#333" },
  discoverTagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 10,
    marginTop: 15,
    gap: 8,
  },
  tagBadge: {
    backgroundColor: "#F2F2F2",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 25,
  },
  tagText: { fontSize: 14, color: "#444" },
  searchSectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    marginTop: 30,
    marginBottom: 15,
  },
  rowAlign: { flexDirection: "row", alignItems: "center" },
  linkTextGray: { color: "#999", fontSize: 15, marginRight: 5 },
  noResultContainer: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 40,
  },
  noResultMainText: { fontSize: 22, fontWeight: "bold", marginTop: 15 },
  noResultSubText: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 22,
  },
  groupCard: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginBottom: 18,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#EEE",
  },
  groupImage: { width: "100%", height: 190 },
  groupInfo: { padding: 14 },
  groupRow: { flexDirection: "row", alignItems: "center" },
  groupLogo: { width: 52, height: 52, borderRadius: 26, marginRight: 14 },
  groupTitle: { fontSize: 18, fontWeight: "700", color: "#111" },
  groupMetaRow: { flexDirection: "row", marginTop: 6, gap: 12 },
  groupMeta: { color: "#777", fontSize: 14 },
  addPostMain: {
    flex: 1,
    paddingTop: 100,
    paddingHorizontal: 25,
    alignItems: "center",
  },
  addPostTitle: { fontSize: 28, fontWeight: "bold", marginBottom: 12 },
  addPostSubtitle: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    marginBottom: 40,
  },
  addCard: {
    width: "100%",
    backgroundColor: "#D9D9D9",
    borderRadius: 15,
    flexDirection: "row",
    padding: 18,
    alignItems: "center",
    marginBottom: 15,
  },
  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  cardInfo: { flex: 1, marginLeft: 15 },
  cardLabel: { fontSize: 18, fontWeight: "bold" },
  cardSub: { fontSize: 12, color: "#555", marginTop: 2 },
  tabBar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 85,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 25,
    borderTopWidth: 0.5,
    borderTopColor: "#EEE",
  },
  topPageHeader: {
    paddingTop: 65,
    paddingHorizontal: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  topPageTitle: { fontSize: 20, fontWeight: "700", color: "black" },
  emptyStateWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -120,
  },
  emptyStateText: {
    marginTop: 15,
    fontSize: 18,
    color: "black",
    fontWeight: "500",
  },
  bottomProfile: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#2196F3",
  },
  profileCoverWrapper: { position: "relative" },
  profileCover: { width: "100%", height: 250 },
  emptyCoverOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  emptyCoverText: {
    marginTop: 8,
    color: "#999",
    fontSize: 14,
    fontWeight: "500",
  },
  profileTopOverlay: {
    position: "absolute",
    top: 55,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profileTopTime: { color: "black", fontSize: 18, fontWeight: "700" },
  profileTopActions: {
    backgroundColor: "white",
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  profileFire: { fontSize: 20, fontWeight: "700", color: "#ff4da6" },
  profileAvatarWrapper: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 7,
    borderColor: "white",
    position: "absolute",
    left: 20,
    bottom: -50,
  },
  profileAvatar: { width: 140, height: 140, borderRadius: 70 },
  emptyAvatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  profileStatsRow: {
    marginTop: 35,
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingLeft: 150,
    paddingRight: 15,
  },
  profileStatItem: { alignItems: "center" },
  profileStatNumber: { fontSize: 24, color: "#222" },
  profileStatLabel: { fontSize: 15, color: "#777", marginTop: 4 },
  profileContent: { paddingHorizontal: 18, marginTop: 25 },
  profileName: { fontSize: 28, fontWeight: "bold", color: "#222" },
  profileUsername: { fontSize: 18, color: "#999", marginTop: 4 },
  profileBio: { fontSize: 18, color: "#222", marginTop: 20, lineHeight: 30 },
  emptyBio: {
    marginTop: 20,
    padding: 20,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E9ECEF",
    alignItems: "center",
  },
  emptyBioText: { fontSize: 16, color: "#6C757D", textAlign: "center" },
  profileCars: { fontSize: 18, color: "#222", lineHeight: 32, marginTop: 22 },
  ownedHeader: { marginTop: 40 },
  ownedTitle: { fontSize: 22, fontWeight: "bold", color: "#222" },
  ownedSub: { color: "#999", fontSize: 16, marginTop: 4 },
  vehicleCardsRow: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "space-between",
  },
  vehicleCard: {
    width: width * 0.42,
    height: 210,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#DDD",
  },
  emptyVehicleCard: {
    backgroundColor: "#F8F9FA",
    borderWidth: 2,
    borderColor: "#E9ECEF",
    borderStyle: "dashed",
  },
  emptyVehicleText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6C757D",
    textAlign: "center",
    lineHeight: 28,
  },
  vehicleImage: { width: "100%", height: "100%" },
  ownBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#DDEEFF",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  ownBadgeText: { color: "#4A81D3", fontWeight: "600", fontSize: 16 },
  vehicleOverlay: { position: "absolute", bottom: 15, left: 15 },
  vehicleName: { color: "white", fontSize: 22, fontWeight: "bold" },
  vehicleModel: { color: "white", fontSize: 16, marginTop: 4 },
  showAllCard: {
    width: width * 0.42,
    height: 210,
    borderRadius: 16,
    backgroundColor: "#F2F2F2",
    justifyContent: "center",
    alignItems: "center",
  },
  showAllText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#222",
    textAlign: "center",
    lineHeight: 34,
  },
  vehicleTab: {
    marginTop: 30,
    backgroundColor: "#F2F2F2",
    alignSelf: "flex-start",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  vehicleTabText: { fontSize: 18, color: "#222" },
  postTitle: { marginTop: 30, fontSize: 24, fontWeight: "bold", color: "#222" },
});
