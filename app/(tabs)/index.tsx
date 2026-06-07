import { supabase } from "@/backend/lib/supabase";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Impor komponen UI dari folder frontend terpisah
import {
  LoginScreen,
  SignUpScreen,
} from "../../components/frontend/AuthScreens";
import {
  CreateGroupScreen,
  GroupFeedScreen,
  GroupsScreen,
} from "../../components/frontend/GroupsScreens";
import {
  AddPostScreen,
  HomeScreen,
  SearchMainScreen,
} from "../../components/frontend/HomeAndDiscovery";
import {
  CreateEventScreen,
  CreatePostScreen,
  InboxScreen,
  NotificationScreen,
} from "../../components/frontend/MiscScreens";
import {
  AddModificationScreen,
  CreateVehicleScreen,
  EditVehicleScreen,
  ProfileScreen,
  VehicleDetailScreen,
  VehiclesListScreen,
} from "../../components/frontend/ProfileAndVehicles";

// Data Mock untuk Presentasi
const PRESENTATION_USER = {
  id: 999,
  firstName: "Felix",
  lastName: "Furukawa",
  username: "felixfuru",
  email: "felix@drivetribe.com",
  password: "password123",
  profileImage:
    "https://images.unsplash.com/photo-1542362567-b07e54358753?w=500",
  coverImage:
    "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=1000",
  bio: "Just a normal guy who is crazy enough to daily his Rx8 for 6 years and own 5 rotary shitbox",
  stats: { badges: 0, posts: 0, followers: 0, following: 0 },
  cars: ["2010 Mazda Rx8"],
  groups: [
    {
      id: "g1",
      name: "DrivnBye",
      members: 574,
      tag: "[DRVNBY]",
      bio: "Driven Together 🚦 Explore, Connect, & Share the Auto-World!",
      website: "drivnbye.com",
      posts: [
        {
          id: "p1",
          user: "crestedisland",
          avatar:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
          location: "WeatherTech Raceway Laguna Seca, North Peri...",
          images: [
            "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=800",
            "https://images.unsplash.com/photo-1619382304110-6b1674ef581f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          ],
          likes: 5,
          comments: 0,
          caption: "I ❤️ race car silhouettes",
          time: "14 days ago",
        },
        {
          id: "p2",
          user: "zbarscarz",
          avatar:
            "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100",
          location: "181, Crown Street, Chapel Street Historic District...",
          images: [
            "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=800",
            "https://images.unsplash.com/photo-1617650728468-8581e439c864?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "https://images.unsplash.com/photo-1617650728468-8581e439c864?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          ],
          likes: 12,
          comments: 3,
          caption:
            "Downtown New Haven has some really nice parking garages for photos! Random spots from a Friday night",
          time: "a month ago",
        },
        {
          id: "p3",
          user: "jcarvajal98",
          avatar:
            "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100",
          location: "Rise Nation, 3814, Northeast 1st Avenue...",
          images: [
            "https://images.unsplash.com/photo-1762028691549-3f0bc1736167?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "https://images.unsplash.com/photo-1753522596147-c5b9cbbe9c0e?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          ],
          likes: 8,
          comments: 1,
          caption: "A beautiful 993 parked down at the design district",
          time: "2 months ago",
        },
        {
          id: "p4",
          user: "domin1c1125",
          avatar:
            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
          location: "Los Angeles, California",
          images: [
            "https://images.unsplash.com/photo-1664540239244-e09e4dc9e30b?q=80&w=2457&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          ],
          likes: 24,
          comments: 5,
          caption: "My Mustang. Cannot wait to be able to upgrade soon! 🏍️💨",
          time: "3 months ago",
        },
        {
          id: "p5",
          user: "bimmerfan",
          avatar:
            "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100",
          location: "Miami Beach, Florida",
          images: [
            "https://images.unsplash.com/photo-1723834084217-bb6c36701cc4?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "https://images.unsplash.com/photo-1558951391-99f8a375df50?q=80&w=1364&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          ],
          likes: 41,
          comments: 7,
          caption:
            "Spotted this beauty today right by the beach. The paint job is insane!",
          time: "4 months ago",
        },
      ],
    },
    {
      id: "g2",
      name: "JDM Heaven 🇯🇵",
      members: 65,
      tag: "[JDM]",
      bio: "Join the group if you have a JDM Car 🇯🇵\nJoin the group if you love JDM Cars 🇯🇵🔰",
      website: "",
      posts: [
        {
          id: "p6",
          user: "goatcurry",
          avatar:
            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
          location: "Tokyo, Japan",
          images: [
            "https://images.unsplash.com/photo-1692574152212-b7c00152af22?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "https://images.unsplash.com/photo-1727373890725-c195fdb4c764?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          ],
          likes: 45,
          comments: 12,
          caption:
            "Saw this at CU Car Club a couple months back, absolutely beautiful wrx.",
          time: "1 month ago",
        },
        {
          id: "p7",
          user: "jdm_daily",
          avatar:
            "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100",
          location: "Osaka, Japan",
          images: [
            "https://images.unsplash.com/photo-1725797941736-e4ad075ed2a5?q=80&w=3160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          ],
          likes: 120,
          comments: 24,
          caption:
            "Godzilla in the streets of Tokyo 🦖. R34 never disappoints.",
          time: "2 months ago",
        },
        {
          id: "p8",
          user: "rotary_boy",
          avatar:
            "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100",
          location: "Kyoto, Japan",
          images: [
            "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800",
            "https://images.unsplash.com/photo-1692574021676-ab5d8db0114f?q=80&w=1912&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          ],
          likes: 88,
          comments: 5,
          caption: "Brap brap brap! Nothing beats the rotary sound.",
          time: "3 months ago",
        },
        {
          id: "p9",
          user: "touge_runner",
          avatar:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
          location: "Mount Fuji, Japan",
          images: [
            "https://images.unsplash.com/photo-1611821064430-0d402241afe4?w=800",
            "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=800",
          ],
          likes: 67,
          comments: 9,
          caption: "Timeless classic. The NSX is a masterpiece on the touge.",
          time: "4 months ago",
        },
      ],
    },
  ],
};

export default function App() {
  const [screen, setScreen] = useState("login");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);

  // State Input Form
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Map Referensi
  const mapRef = useRef<any>(null);

  // Group & Posts database states
  const [myGroups, setMyGroups] = useState<any[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [userPosts, setUserPosts] = useState<any[]>([]);

  // Detail Group Menu & Interactions
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [savedPosts, setSavedPosts] = useState<Record<string, boolean>>({});
  const [activeSlides, setActiveSlides] = useState<Record<string, number>>({});
  const [showGroupMenu, setShowGroupMenu] = useState(false);
  const [commentSheetPostId, setCommentSheetPostId] = useState<string | null>(
    null,
  );
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState("");
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>(
    {},
  );

  // Pembuatan Group Baru
  const [isPrivate, setIsPrivate] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [groupCoverUri, setGroupCoverUri] = useState<string | null>(null);
  const [groupPhotoUri, setGroupPhotoUri] = useState<string | null>(null);
  const [groupName, setGroupName] = useState("");
  const [groupBio, setGroupBio] = useState("");
  const [groupTag, setGroupTag] = useState("");
  const [groupLocation, setGroupLocation] = useState("");
  const [groupWebsite, setGroupWebsite] = useState("");

  // Pembuatan Post & Event
  const [postCaption, setPostCaption] = useState("");
  const [postImage, setPostImage] = useState<string | null>(null);
  const [disableComments, setDisableComments] = useState(false);
  const [boostEvent, setBoostEvent] = useState(false);
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [allEvents, setAllEvents] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);

  // Kendaraan & Modifikasi
  const [modifications, setModifications] = useState<any[]>([]);
  const [showVehicleMenu, setShowVehicleMenu] = useState(false);
  const [vehicleBackScreen, setVehicleBackScreen] = useState("profile");

  const { width } = Dimensions.get("window");

  // Menyelaraskan currentUser format database (snake_case) ke frontend format (camelCase)
  const normalizeAndSetUser = (profile: any) => {
    if (!profile) return;

    setCurrentUser({
      id: profile.id,
      firstName: profile.first_name || profile.firstName || "",
      first_name: profile.first_name || profile.firstName || "",
      lastName: profile.last_name || profile.lastName || "",
      last_name: profile.last_name || profile.lastName || "",
      username: profile.username || "",
      email: profile.email || "",
      profileImage: profile.profile_image || profile.profileImage || null,
      profile_image: profile.profile_image || profile.profileImage || null,
      coverImage: profile.cover_image || profile.coverImage || null,
      cover_image: profile.cover_image || profile.coverImage || null,
      bio: profile.bio || "",
    });
  };

  // Restore session on mount
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth State Changed Event:", event);

      if (
        event === "INITIAL_SESSION" ||
        event === "SIGNED_IN" ||
        event === "TOKEN_REFRESHED"
      ) {
        if (session?.user) {
          await fetchAndNormalizeProfile(session.user.id);
        }
      } else if (event === "SIGNED_OUT") {
        setCurrentUser(null);
        setScreen("login");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Helper function to handle fetching data and routing smoothly
  const fetchAndNormalizeProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) throw error;

      if (profile) {
        normalizeAndSetUser(profile);
        setScreen("home");
      }
      // No profile yet = new signup still in progress, do nothing
    } catch (err: any) {
      console.error("Profile sync failed on restore:", err.message);
    }
  };

  // Helper function to upload image file to Supabase Storage
  const uploadImageToStorage = async (localUri: string, bucketName: string) => {
    try {
      const blob: Blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function (e) {
          console.error("XHR failed mapping local file:", e);
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", localUri, true);
        xhr.send(null);
      });

      const fileExt = localUri.split(".").pop() || "jpg";
      const fileName = `${currentUser?.id || "user"}_${Date.now()}.${fileExt}`;
      const filePath = `public/${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, blob, {
          contentType: `image/${fileExt === "png" ? "png" : "jpeg"}`,
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from(bucketName).getPublicUrl(filePath);

      return publicUrl;
    } catch (error: any) {
      console.error("Storage upload error details:", error.message);
      throw error;
    }
  };

  // Fetch groups yang diikuti dari database Supabase
  useEffect(() => {
    if (currentUser) {
      fetchMyGroups();
    }
  }, [screen, currentUser]);

  const fetchMyGroups = async () => {
    if (!currentUser) return;
    setLoadingGroups(true);
    try {
      const { data: membershipData, error } = await supabase
        .from("group_members")
        .select("group_id, groups(*, posts(*, users(*)))") // Added relational select for posts
        .eq("user_id", currentUser.id);

      if (error) throw error;

      // Extract the group object from the join table response
      const joined =
        membershipData?.map((m: any) => m.groups).filter(Boolean) || [];

      console.log("membershipData synced:", JSON.stringify(membershipData));

      // Direct assignment from backend data to state
      setMyGroups(joined);
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
        // Change .eq to .ilike for case-insensitive matching
        .ilike("username", loginForm.username)
        .single();

      if (profileError || !profile) {
        Alert.alert("❌ Login Failed", "User not found!");
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: profile.email,
        password: loginForm.password,
      });
      if (error) throw error;

      normalizeAndSetUser(profile);
      setScreen("home");
      Alert.alert(
        "✅ Login Success",
        `Welcome back, ${profile.first_name || profile.username}!`,
      );
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
      Alert.alert("❌ Error", "All fields are required!");
      return;
    }
    if (signupForm.password !== signupForm.confirmPassword) {
      Alert.alert("❌ Error", "Password doesn't match!");
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: signupForm.email,
        password: signupForm.password,
      });
      if (error) throw error;

      if (!data.user) throw new Error("Failed to create user!");

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
        email: signupForm.email,
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
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleUpdateProfile = async (bio: string) => {
    try {
      const { error } = await supabase
        .from("users")
        .update({ bio })
        .eq("id", currentUser.id);
      if (error) throw error;
      setCurrentUser({ ...currentUser, bio });
      Alert.alert("✅ Updated!", "Profile updated successfully.");
    } catch (e: any) {
      Alert.alert("❌ Error", e.message);
    }
  };

  const pickProfilePhoto = async () => {
    if (!currentUser) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      allowsMultipleSelection: false,
    });

    if (!result.canceled && result.assets && result.assets[0].uri) {
      const localUri = result.assets[0].uri;

      try {
        // 1. Bypass Supabase entirely! Save the local file system path directly to your local UI state
        setCurrentUser((prev: any) => ({
          ...prev,
          profileImage: localUri,
          profile_image: localUri,
        }));

        // 2. (Optional) If you still want the database to remember the local path on this device:
        await supabase
          .from("users")
          .update({ profile_image: localUri })
          .eq("id", currentUser.id);

        Alert.alert("Success", "Profile photo updated locally!");
      } catch (err: any) {
        console.error("Local save notice:", err.message);
      }
    }
  };

  const pickCoverPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Camera roll permission is needed.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });
    if (!result.canceled && result.assets?.length > 0) {
      const uri = result.assets[0].uri;
      await supabase
        .from("users")
        .update({ cover_image: uri })
        .eq("id", currentUser.id);
      setCurrentUser({ ...currentUser, coverImage: uri, cover_image: uri });
    }
  };

  // PEMBUATAN GRUP BARU (Supabase Insert)
  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      Alert.alert("❌ Error", "Group name is required!");
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
          cover_image:
            groupCoverUri ||
            "https://images.unsplash.com/photo-1617531653520-4893f7bbf978?w=1200",
          logo:
            groupPhotoUri ||
            "https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg",
          tag_name: groupTag
            ? `[${groupTag.toUpperCase().replace(/[\[\]]/g, "")}]`
            : undefined,
        })
        .select()
        .single();

      if (error) throw error;

      await supabase
        .from("group_members")
        .insert({ group_id: newGroup.id, user_id: currentUser.id });

      Alert.alert("🎉 Success", `Group "${groupName}" created successfully!`);

      // Reset State
      setGroupName("");
      setGroupBio("");
      setGroupTag("");
      setGroupLocation("");
      setGroupWebsite("");
      setGroupCoverUri(null);
      setGroupPhotoUri(null);
      setIsPrivate(false);

      await fetchMyGroups();
      setScreen("groups");
    } catch (err: any) {
      Alert.alert("Creation Failed", err.message);
    }
  };

  const [eventImage, setEventImage] = useState<string | null>(null);

  const pickEventImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Camera roll permission is required.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });
    if (!result.canceled && result.assets?.length > 0) {
      setEventImage(result.assets[0].uri);
    }
  };

  const pickPostImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Camera roll permission is required.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled && result.assets?.length > 0) {
      setPostImage(result.assets[0].uri);
    }
  };

  const handleCreatePost = async () => {
    if (!postCaption.trim()) {
      Alert.alert("❌ Error", "Please write something before posting!");
      return;
    }
    try {
      const { error } = await supabase.from("posts").insert({
        user_id: currentUser.id,
        content: postCaption.trim(),
        image: postImage,
        group_id: selectedGroup?.id || null,
      });
      if (error) throw error;
      Alert.alert("✅ Posted!", "Your post has been shared.");
      setPostCaption("");
      setPostImage(null);
      setScreen("home");
    } catch (e: any) {
      Alert.alert("❌ Error", e.message);
    }
  };

  const fetchUserPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("user_id", currentUser.id)
      .order("created_at", { ascending: false });
    if (!error) {
      setUserPosts(data || []);
      fetchCommentCounts((data || []).map((p: any) => p.id));
    }
  };

  const fetchAllPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*, users(username, first_name, last_name, profile_image)")
      .order("created_at", { ascending: false });
    if (!error) {
      setAllPosts(data || []);
      fetchCommentCounts((data || []).map((p: any) => p.id));
    }
  };

  const fetchAllEvents = async () => {
    const { data, error } = await supabase
      .from("events")
      .select("*, users(username, first_name, last_name)")
      .order("date", { ascending: true });
    if (!error) setAllEvents(data || []);
  };

  const fetchVehicles = async () => {
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .eq("user_id", currentUser.id)
      .order("created_at", { ascending: false });
    if (!error) setVehicles(data || []);
  };

  useEffect(() => {
    if (currentUser && screen === "profile") {
      fetchUserPosts();
      fetchVehicles();
    }
  }, [screen, currentUser]);

  useEffect(() => {
    if (currentUser && screen === "searchMain") {
      fetchAllPosts();
      fetchAllEvents();
    }
  }, [screen, currentUser]);

  useEffect(() => {
    if (currentUser && screen === "profile") {
      fetchUserPosts();
    }
  }, [screen, currentUser]);

  const fetchGroupMembers = async (groupId: string) => {
    const { data, error } = await supabase
      .from("group_members")
      .select("*, users(id, username, first_name, last_name, profile_image)")
      .eq("group_id", groupId);
    if (error) return [];
    return data.map((m: any) => m.users).filter(Boolean);
  };

  const fetchGroupPosts = async (groupId: string) => {
    const { data, error } = await supabase
      .from("posts")
      .select("*, users(id, username, profile_image)")
      .eq("group_id", groupId)
      .order("created_at", { ascending: false });
    if (error) return [];
    return data || [];
  };

  const fetchMemberVehicles = async (groupId: string) => {
    const { data: memberData, error: memberError } = await supabase
      .from("group_members")
      .select("user_id")
      .eq("group_id", groupId);
    if (memberError || !memberData?.length) return [];

    const userIds = memberData.map((m: any) => m.user_id);

    const { data: vehicleData, error: vehicleError } = await supabase
      .from("vehicles")
      .select("id, name, model, image, user_id")
      .in("user_id", userIds);
    if (vehicleError) return [];
    return vehicleData || [];
  };

  const handleCreateEvent = async (eventData: any) => {
    try {
      const { error } = await supabase.from("events").insert({
        created_by: currentUser.id,
        name: eventData.name,
        description: eventData.description,
        location: eventData.location,
        date: eventData.startDate,
        image: eventData.image,
      });
      if (error) throw error;
      Alert.alert("✅ Event Created!", "Your event has been published.");
      setEventImage(null);
      setScreen("home");
    } catch (e: any) {
      Alert.alert("❌ Error", e.message);
    }
  };

  const handleLeaveGroup = async (groupId: string) => {
    Alert.alert("Leave Group?", "Are you sure you want to leave this group?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Leave",
        style: "destructive",
        onPress: async () => {
          await supabase
            .from("group_members")
            .delete()
            .eq("user_id", currentUser.id)
            .eq("group_id", groupId);
          await fetchMyGroups();
          setScreen("groups");
          Alert.alert("✅ Left group");
        },
      },
    ]);
  };

  const handleDeletePost = async (postId: string) => {
    Alert.alert("Delete Post?", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await supabase.from("posts").delete().eq("id", postId);
          setUserPosts((prev) => prev.filter((p) => p.id !== postId));
          setAllPosts((prev) => prev.filter((p) => p.id !== postId));
          Alert.alert("✅ Post deleted");
        },
      },
    ]);
  };

  const handleDeleteEvent = async (eventId: string) => {
    Alert.alert("Delete Event?", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const { error } = await supabase
            .from("events")
            .delete()
            .eq("id", eventId);
          if (error) {
            Alert.alert("❌ Error", error.message);
            return;
          }
          setAllEvents((prev) => prev.filter((e) => e.id !== eventId));
          Alert.alert("✅ Event deleted");
        },
      },
    ]);
  };

  const handleAddVehicle = async (vehicleData: any) => {
    try {
      const { data, error } = await supabase
        .from("vehicles")
        .insert({
          user_id: currentUser.id,
          name: vehicleData.name,
          model: vehicleData.model,
          trim: vehicleData.trim,
          color: vehicleData.color,
          description: vehicleData.description,
          image: vehicleData.image,
        })
        .select()
        .single();
      if (error) throw error;
      setVehicles((prev) => [data, ...prev]);
      Alert.alert("✅ Vehicle added!");
    } catch (e: any) {
      Alert.alert("❌ Error", e.message);
    }
  };

  const handleDeleteVehicle = async (vehicleId: string) => {
    Alert.alert("Delete Vehicle?", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await supabase.from("vehicles").delete().eq("id", vehicleId);
          setVehicles((prev) => prev.filter((v) => v.id !== vehicleId));
          Alert.alert("✅ Vehicle deleted");
        },
      },
    ]);
  };

  // PENGAMBILAN GAMBAR (Expo Image Picker)
  const pickGroupCover = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Sorry, we need camera roll permissions to make this work!",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
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
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Sorry, we need camera roll permissions to make this work!",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setGroupPhotoUri(result.assets[0].uri);
    }
  };

  // AKSI MODIFIKASI KENDARAAN (Tambahkan Modifikasi)
  const fetchModifications = async (vehicleId: string) => {
    const { data, error } = await supabase
      .from("vehicle_modifications")
      .select("*")
      .eq("vehicle_id", vehicleId)
      .order("created_at", { ascending: true });
    if (!error) setModifications(data || []);
  };

  const handleSaveModification = async (modData: {
    name: string;
    description: string;
    link: string;
    classification: string;
  }) => {
    if (!selectedVehicle?.id) return;
    try {
      const { data, error } = await supabase
        .from("vehicle_modifications")
        .insert({
          vehicle_id: selectedVehicle.id,
          name: modData.name,
          description: modData.description,
          link: modData.link,
          classification: modData.classification,
        })
        .select()
        .single();
      if (error) throw error;
      setModifications((prev) => [...prev, data]);
      setScreen("vehicleDetail");
    } catch (e: any) {
      Alert.alert("❌ Error", e.message);
    }
  };

  const handleDeleteModification = async (modId: string) => {
    Alert.alert("Delete Modification?", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const { error } = await supabase
            .from("vehicle_modifications")
            .delete()
            .eq("id", modId);
          if (error) {
            Alert.alert("❌ Error", error.message);
            return;
          }
          setModifications((prev) => prev.filter((m) => m.id !== modId));
        },
      },
    ]);
  };

  const handleUpdateVehicle = async (vehicleData: any) => {
    if (!selectedVehicle?.id) return;
    try {
      const { data, error } = await supabase
        .from("vehicles")
        .update({
          name: vehicleData.name,
          model: vehicleData.model,
          trim: vehicleData.trim,
          color: vehicleData.color,
          description: vehicleData.description,
          image: vehicleData.image,
        })
        .eq("id", selectedVehicle.id)
        .select()
        .single();
      if (error) throw error;
      setVehicles((prev) => prev.map((v) => (v.id === data.id ? data : v)));
      setSelectedVehicle(data);
      Alert.alert("✅ Vehicle updated!");
      setScreen("vehicleDetail");
    } catch (e: any) {
      Alert.alert("❌ Error", e.message);
    }
  };

  useEffect(() => {
    if (selectedVehicle?.id && screen === "vehicleDetail") {
      fetchModifications(selectedVehicle.id);
    }
  }, [selectedVehicle, screen]);

  // Center peta ke lokasi GPS pengguna
  const goToMyLocation = () => {
    mapRef.current?.animateCamera({
      center: { latitude: -6.1754, longitude: 106.8272 },
      zoom: 17,
    });
  };

  // Interaksi Feed Postingan
  const toggleLike = (postId: any) =>
    setLikedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
  const toggleSave = (postId: any) =>
    setSavedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));

  const openComments = async (postId: string) => {
    setCommentSheetPostId(postId);
    const { data, error } = await supabase
      .from("post_comments")
      .select("*, users(username, profile_image)")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });
    if (!error) setComments(data || []);
  };

  const closeComments = () => {
    setCommentSheetPostId(null);
    setComments([]);
    setCommentText("");
  };

  const handleDeleteComment = async (commentId: string) => {
    Alert.alert("Delete Comment?", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const { error } = await supabase
            .from("post_comments")
            .delete()
            .eq("id", commentId);
          if (error) {
            Alert.alert("❌ Error", error.message);
            return;
          }
          setComments((prev) => prev.filter((c) => c.id !== commentId));
          if (commentSheetPostId) {
            setCommentCounts((prev) => ({
              ...prev,
              [commentSheetPostId]: Math.max(
                (prev[commentSheetPostId] || 1) - 1,
                0,
              ),
            }));
          }
        },
      },
    ]);
  };

  const handleAddComment = async () => {
    if (!commentText.trim() || !commentSheetPostId) return;
    try {
      const { data, error } = await supabase
        .from("post_comments")
        .insert({
          post_id: commentSheetPostId,
          user_id: currentUser.id,
          content: commentText.trim(),
        })
        .select("*, users(username, profile_image)")
        .single();
      if (error) throw error;
      setComments((prev) => [...prev, data]);
      setCommentCounts((prev) => ({
        ...prev,
        [commentSheetPostId]: (prev[commentSheetPostId] || 0) + 1,
      }));
      setCommentText("");
    } catch (e: any) {
      Alert.alert("❌ Error", e.message);
    }
  };

  const fetchCommentCounts = async (postIds: string[]) => {
    if (!postIds.length) return;
    const { data, error } = await supabase
      .from("post_comments")
      .select("post_id")
      .in("post_id", postIds);
    if (error) return;
    const counts: Record<string, number> = {};
    data.forEach((row: any) => {
      counts[row.post_id] = (counts[row.post_id] || 0) + 1;
    });
    setCommentCounts((prev) => ({ ...prev, ...counts }));
  };
  const handleScrollImage = (event: any, postId: any) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveSlides((prev) => ({ ...prev, [postId]: slideIndex }));
  };

  // Menyisipkan postingan visual ke grup jika data dari server kosong
  // Interaksi Feed Postingan dari Server
  const getGroupWithContent = (group: any) => {
    if (!group) return null;

    // Fallback to empty array if the group record has no posts yet
    return {
      ...group,
      posts: group.posts || [],
    };
  };

  // --- ROUTING DAN RENDER SCREEN ---

  const commentSheetModal = (
    <Modal
      visible={!!commentSheetPostId}
      transparent
      animationType="slide"
      onRequestClose={closeComments}
    >
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)" }}
        activeOpacity={1}
        onPress={closeComments}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{
          backgroundColor: "#FFF",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          maxHeight: "70%",
        }}
      >
        <View
          style={{
            width: 40,
            height: 4,
            backgroundColor: "#DDD",
            borderRadius: 2,
            alignSelf: "center",
            marginTop: 12,
            marginBottom: 8,
          }}
        />
        <Text
          style={{
            fontSize: 16,
            fontWeight: "700",
            textAlign: "center",
            marginBottom: 12,
          }}
        >
          Comments
        </Text>
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 12 }}
          showsVerticalScrollIndicator={false}
        >
          {comments.length === 0 ? (
            <Text
              style={{
                color: "#999",
                textAlign: "center",
                marginTop: 20,
                marginBottom: 20,
              }}
            >
              No comments yet. Be the first!
            </Text>
          ) : (
            comments.map((c: any) => (
              <View
                key={c.id}
                style={{
                  flexDirection: "row",
                  marginBottom: 14,
                  alignItems: "flex-start",
                }}
              >
                {c.users?.profile_image ? (
                  <Image
                    source={{ uri: c.users.profile_image }}
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 17,
                      marginRight: 10,
                    }}
                  />
                ) : (
                  <View
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 17,
                      backgroundColor: "#EEE",
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: 10,
                    }}
                  >
                    <Text style={{ fontSize: 14 }}>👤</Text>
                  </View>
                )}
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: "700", fontSize: 13 }}>
                    @{c.users?.username}
                  </Text>
                  <Text style={{ fontSize: 14, color: "#222", marginTop: 2 }}>
                    {c.content}
                  </Text>
                </View>
                {c.user_id === currentUser?.id && (
                  <TouchableOpacity
                    onPress={() => handleDeleteComment(c.id)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    style={{ paddingLeft: 8, paddingTop: 2 }}
                  >
                    <Text style={{ color: "#D32F2F", fontSize: 12 }}>
                      Delete
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ))
          )}
        </ScrollView>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 12,
            borderTopWidth: 1,
            borderTopColor: "#EEE",
          }}
        >
          <TextInput
            style={{
              flex: 1,
              backgroundColor: "#F5F5F5",
              borderRadius: 20,
              paddingHorizontal: 14,
              paddingVertical: 8,
              fontSize: 14,
              marginRight: 10,
            }}
            placeholder="Add a comment..."
            placeholderTextColor="#999"
            value={commentText}
            onChangeText={setCommentText}
            multiline
          />
          <TouchableOpacity
            onPress={handleAddComment}
            style={{
              backgroundColor: "#000",
              borderRadius: 20,
              paddingHorizontal: 16,
              paddingVertical: 8,
            }}
          >
            <Text style={{ color: "#FFF", fontWeight: "700" }}>Post</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );

  if (
    !currentUser &&
    (screen === "home" ||
      screen === "profile" ||
      screen === "groups" ||
      screen === "groupFeed" ||
      screen === "createGroup" ||
      screen === "createPost" ||
      screen === "createEvent" ||
      screen === "searchMain" ||
      screen === "addPost" ||
      screen === "inbox" ||
      screen === "notifications" ||
      screen === "vehicleDetail" ||
      screen === "addModification" ||
      screen === "vehicles")
  ) {
    return (
      <LoginScreen
        loginForm={loginForm}
        setLoginForm={setLoginForm}
        handleLogin={handleLogin}
        setScreen={setScreen}
      />
    );
  }
  if (screen === "createGroup") {
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
  if (screen === "createVehicle") {
    return (
      <CreateVehicleScreen
        setScreen={setScreen}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        handleAddVehicle={handleAddVehicle}
      />
    );
  }
  if (screen === "createPost") {
    return (
      <CreatePostScreen
        setScreen={setScreen}
        postCaption={postCaption}
        setPostCaption={setPostCaption}
        postImage={postImage}
        pickPostImage={pickPostImage}
        disableComments={disableComments}
        setDisableComments={setDisableComments}
        boostEvent={boostEvent}
        setBoostEvent={setBoostEvent}
        handleCreatePost={handleCreatePost}
      />
    );
  }
  if (screen === "createEvent") {
    return (
      <CreateEventScreen
        setScreen={setScreen}
        boostEvent={boostEvent}
        setBoostEvent={setBoostEvent}
        handleCreateEvent={handleCreateEvent}
        eventImage={eventImage}
        pickEventImage={pickEventImage}
      />
    );
  }
  if (screen === "vehicleDetail") {
    return (
      <VehicleDetailScreen
        setScreen={setScreen}
        currentUser={currentUser}
        vehicleBackScreen={vehicleBackScreen}
        modifications={modifications}
        setModifications={setModifications}
        showVehicleMenu={showVehicleMenu}
        setShowVehicleMenu={setShowVehicleMenu}
        selectedVehicle={selectedVehicle}
        handleDeleteVehicle={handleDeleteVehicle}
        handleDeleteModification={handleDeleteModification}
      />
    );
  }
  if (screen === "vehicles") {
    return (
      <VehiclesListScreen
        setScreen={setScreen}
        currentUser={currentUser}
        setVehicleBackScreen={setVehicleBackScreen}
        setSelectedVehicle={setSelectedVehicle}
        vehicles={vehicles}
        handleAddVehicle={handleAddVehicle}
        handleDeleteVehicle={handleDeleteVehicle}
      />
    );
  }
  if (screen === "addModification") {
    return (
      <AddModificationScreen
        setScreen={setScreen}
        onSaveModification={handleSaveModification}
      />
    );
  }
  if (screen === "editVehicle") {
    return (
      <EditVehicleScreen
        setScreen={setScreen}
        selectedVehicle={selectedVehicle}
        handleUpdateVehicle={handleUpdateVehicle}
      />
    );
  }

  const wrapWithModal = (screen: React.ReactNode) => (
    <>
      {commentSheetModal}
      {screen}
    </>
  );

  if (screen === "login")
    return wrapWithModal(
      <LoginScreen
        loginForm={loginForm}
        setLoginForm={setLoginForm}
        handleLogin={handleLogin}
        setScreen={setScreen}
      />,
    );
  if (screen === "signup")
    return wrapWithModal(
      <SignUpScreen
        signupForm={signupForm}
        setSignupForm={setSignupForm}
        handleSignup={handleSignup}
        setScreen={setScreen}
      />,
    );
  if (screen === "addPost")
    return wrapWithModal(
      <AddPostScreen setScreen={setScreen} currentUser={currentUser} />,
    );
  if (screen === "searchMain")
    return wrapWithModal(
      <SearchMainScreen
        setScreen={setScreen}
        currentUser={currentUser}
        myGroups={myGroups}
        allPosts={allPosts}
        allEvents={allEvents}
        handleDeletePost={handleDeletePost}
        handleDeleteEvent={handleDeleteEvent}
        likedPosts={likedPosts}
        savedPosts={savedPosts}
        toggleLike={toggleLike}
        toggleSave={toggleSave}
        commentCounts={commentCounts}
        openComments={openComments}
      />,
    );
  if (screen === "inbox")
    return wrapWithModal(<InboxScreen setScreen={setScreen} />);
  if (screen === "notifications")
    return wrapWithModal(<NotificationScreen setScreen={setScreen} />);
  if (screen === "profile")
    return wrapWithModal(
      <ProfileScreen
        setScreen={setScreen}
        currentUser={currentUser}
        handleLogout={handleLogout}
        setVehicleBackScreen={setVehicleBackScreen}
        handleUpdateProfile={handleUpdateProfile}
        userPosts={userPosts}
        pickProfilePhoto={pickProfilePhoto}
        pickCoverPhoto={pickCoverPhoto}
        handleDeletePost={handleDeletePost}
        setSelectedVehicle={setSelectedVehicle}
        vehicles={vehicles}
        likedPosts={likedPosts}
        savedPosts={savedPosts}
        toggleLike={toggleLike}
        toggleSave={toggleSave}
        commentCounts={commentCounts}
        openComments={openComments}
      />,
    );
  if (screen === "groups")
    return wrapWithModal(
      <GroupsScreen
        setScreen={setScreen}
        currentUser={currentUser}
        myGroups={myGroups}
        setSelectedGroup={setSelectedGroup}
        loadingGroups={loadingGroups}
      />,
    );
  if (screen === "groupFeed")
    return wrapWithModal(
      <GroupFeedScreen
        setScreen={setScreen}
        selectedGroup={selectedGroup}
        showGroupMenu={showGroupMenu}
        setShowGroupMenu={setShowGroupMenu}
        likedPosts={likedPosts}
        savedPosts={savedPosts}
        activeSlides={activeSlides}
        toggleLike={toggleLike}
        toggleSave={toggleSave}
        handleScrollImage={handleScrollImage}
        width={width}
        fetchGroupMembers={fetchGroupMembers}
        fetchMemberVehicles={fetchMemberVehicles}
        fetchGroupPosts={fetchGroupPosts}
        handleLeaveGroup={handleLeaveGroup}
        currentUser={currentUser}
        commentCounts={commentCounts}
        openComments={openComments}
        fetchCommentCounts={fetchCommentCounts}
      />,
    );

  return wrapWithModal(
    <HomeScreen
      mapRef={mapRef}
      setScreen={setScreen}
      goToMyLocation={goToMyLocation}
      currentUser={currentUser}
    />,
  );
}
