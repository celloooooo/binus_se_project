import * as ImagePicker from "expo-image-picker";
import {
  ArrowLeft,
  Bookmark,
  Camera,
  Check,
  ChevronDown,
  Ellipsis,
  Heart,
  MessageCircle,
  Pencil,
  Plus,
  Search,
  Send,
  Share2,
  Tag,
  Trash2,
  User as UserIcon,
  Wrench,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  PanResponder,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { BottomBar } from "./BottomBar";
import { ScrewdriverWrenchIcon } from "./ScrewdriverWrench";
import { styles } from "./styles";

interface ProfileScreenProps {
  setScreen: (screen: string) => void;
  currentUser: any;
  handleLogout: () => void;
  setVehicleBackScreen: (screen: string) => void;
  handleUpdateProfile: (bio: string) => void;
  userPosts: any[];
  pickProfilePhoto: () => void;
  pickCoverPhoto: () => void;
  handleDeletePost: (id: string) => void;
  setSelectedVehicle: (vehicle: any) => void;
  vehicles: any[];
  likedPosts: Record<string, boolean>;
  savedPosts: Record<string, boolean>;
  toggleLike: (postId: any) => void;
  toggleSave: (postId: any) => void;
  commentCounts: Record<string, number>;
  openComments: (postId: string) => void;
}

export const ProfileScreen = ({
  setScreen,
  currentUser,
  handleLogout,
  setVehicleBackScreen,
  handleUpdateProfile,
  userPosts,
  pickProfilePhoto,
  pickCoverPhoto,
  handleDeletePost,
  setSelectedVehicle,
  vehicles,
  likedPosts,
  savedPosts,
  toggleLike,
  toggleSave,
  commentCounts,
  openComments,
}: ProfileScreenProps) => {
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return Math.abs(gestureState.dx) > 40 && Math.abs(gestureState.dy) < 25;
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dx < -50 || gestureState.dx > 50) {
        setVehicleBackScreen("profile");
        setScreen("vehicles");
      }
    },
  });

  const [editVisible, setEditVisible] = useState(false);
  const [editBio, setEditBio] = useState(currentUser?.bio || "");
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);
  const [vehicleName, setVehicleName] = useState("");
  const [vehicleImage, setVehicleImage] = useState<string | null>(null);

  return (
    <View style={styles.whiteContainer} {...panResponder.panHandlers}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View style={styles.profileCoverWrapper}>
          <TouchableOpacity onPress={pickCoverPhoto} activeOpacity={0.85}>
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
          </TouchableOpacity>
          <View style={styles.profileTopOverlay}>
            <View />
            <View style={styles.profileTopActions}>
              <Text style={styles.profileFire}>🔥 0</Text>
              <TouchableOpacity
                onPress={() => setEditVisible(true)}
                style={{ marginRight: 10 }}
              >
                <Pencil size={20} color="black" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleLogout}>
                <Ellipsis size={20} color="black" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.profileAvatarWrapper}>
            <TouchableOpacity onPress={pickProfilePhoto} activeOpacity={0.85}>
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
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.profileStatsRow}>
          <View style={styles.profileStatItem}>
            <Text style={styles.profileStatNumber}>
              {currentUser?.stats?.badges || 0}
            </Text>
            <Text style={styles.profileStatLabel}>Badges</Text>
          </View>
          <View style={styles.profileStatItem}>
            <Text style={styles.profileStatNumber}>
              {currentUser?.stats?.posts || 0}
            </Text>
            <Text style={styles.profileStatLabel}>Posts</Text>
          </View>
          <View style={styles.profileStatItem}>
            <Text style={styles.profileStatNumber}>
              {currentUser?.stats?.followers || 0}
            </Text>
            <Text style={styles.profileStatLabel}>Followers</Text>
          </View>
          <View style={styles.profileStatItem}>
            <Text style={styles.profileStatNumber}>
              {currentUser?.stats?.following || 0}
            </Text>
            <Text style={styles.profileStatLabel}>Following</Text>
          </View>
        </View>

        <View style={styles.profileContent}>
          <Text style={styles.profileName}>
            {currentUser?.firstName} {currentUser?.lastName}
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
          {currentUser?.cars?.length > 0 && (
            <View style={{ marginTop: 15 }}>
              {currentUser.cars.map((carItem: any, i: number) => (
                <Text key={i} style={styles.profileCarItem}>
                  {typeof carItem === "object" ? carItem.model : carItem}
                </Text>
              ))}
            </View>
          )}
          <View style={styles.ownedHeader}>
            <Text style={styles.ownedTitle}>Owned Vehicles</Text>
            <Text style={styles.ownedSub}>
              {vehicles?.length || 0} Vehicles
            </Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.vehicleCardsRow}
          >
            {vehicles.length === 0 ? (
              <TouchableOpacity
                style={[styles.showAllCard, styles.emptyVehicleCard]}
                onPress={() => setScreen("createVehicle")}
              >
                <Text style={styles.emptyVehicleText}>
                  Add your first{"\n"}vehicle
                </Text>
              </TouchableOpacity>
            ) : (
              vehicles.map((vehicle, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.vehiclesGridCard}
                  onPress={() => {
                    setVehicleBackScreen("profile");
                    setSelectedVehicle(vehicle);
                    setScreen("vehicleDetail");
                  }}
                >
                  <Image
                    source={{
                      uri:
                        typeof vehicle === "object" && vehicle.image
                          ? vehicle.image
                          : "https://images.unsplash.com/photo-1617531653520-4893f7bbf978?w=500",
                    }}
                    style={styles.vehiclesGridImage}
                  />
                  <View style={styles.vehiclesGridOwnBadge}>
                    <Text style={styles.vehiclesGridOwnBadgeText}>Own</Text>
                  </View>
                  <View style={styles.vehiclesGridOverlay}>
                    <Text style={styles.vehiclesGridName}>
                      {typeof vehicle === "object" ? vehicle.name : "Vehicle"}
                    </Text>
                    <Text style={styles.vehiclesGridModel}>
                      {typeof vehicle === "object" ? vehicle.model : vehicle}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
            <TouchableOpacity
              style={styles.showAllCard}
              onPress={() => setScreen("vehicles")}
            >
              <Text style={styles.showAllText}>Show All{"\n"}Vehicles</Text>
            </TouchableOpacity>
          </ScrollView>
          {/* <TouchableOpacity style={styles.vehicleTab}>
            <Text style={styles.vehicleTabText}>Vehicles</Text>
          </TouchableOpacity> */}
          <Text style={styles.postTitle}>
            {currentUser?.first_name}'s Posts{"\n"}
          </Text>
          {userPosts.length === 0 ? (
            <Text
              style={{
                color: "#999",
                textAlign: "center",
                marginTop: 10,
                marginBottom: 20,
              }}
            >
              No posts yet
            </Text>
          ) : (
            userPosts.map((post: any) => (
              <View key={post.id} style={styles.postCard}>
                <View style={styles.postHeaderRow}>
                  <View style={styles.postHeaderLeft}>
                    {currentUser?.profileImage || currentUser?.profile_image ? (
                      <Image
                        source={{
                          uri:
                            currentUser.profileImage ||
                            currentUser.profile_image,
                        }}
                        style={styles.postAvatar}
                      />
                    ) : (
                      <View
                        style={[
                          styles.postAvatar,
                          {
                            backgroundColor: "#EEE",
                            justifyContent: "center",
                            alignItems: "center",
                          },
                        ]}
                      >
                        <Text style={{ fontSize: 18 }}>👤</Text>
                      </View>
                    )}
                    <View style={{ flex: 1 }}>
                      <Text style={styles.postUserText}>
                        @{currentUser?.username}
                      </Text>
                      <Text style={styles.postLocationText}>
                        {new Date(post.created_at).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                  {post.user_id === currentUser?.id && (
                    <TouchableOpacity onPress={() => handleDeletePost(post.id)}>
                      <Trash2 size={18} color="#D32F2F" />
                    </TouchableOpacity>
                  )}
                </View>
                {post.image && (
                  <Image
                    source={{ uri: post.image }}
                    style={{ width: "100%", height: 280, marginVertical: 10 }}
                    resizeMode="cover"
                  />
                )}
                <View style={styles.postActionRow}>
                  <View style={styles.postActionLeft}>
                    <TouchableOpacity
                      style={styles.actionIcon}
                      onPress={() => toggleLike(post.id)}
                    >
                      <Heart
                        size={26}
                        color={likedPosts[post.id] ? "#E53935" : "black"}
                        fill={likedPosts[post.id] ? "#E53935" : "transparent"}
                      />
                    </TouchableOpacity>
                    <Text style={styles.actionText}>
                      {likedPosts[post.id] ? 1 : 0}
                    </Text>
                    <TouchableOpacity
                      style={styles.actionIcon}
                      onPress={() => openComments(post.id)}
                    >
                      <MessageCircle size={26} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.actionText}>
                      {commentCounts[post.id] || 0}
                    </Text>
                    <TouchableOpacity
                      style={styles.actionIcon}
                      onPress={() => Alert.alert("Post link copied!")}
                    >
                      <Send size={26} color="black" />
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity onPress={() => toggleSave(post.id)}>
                    <Bookmark
                      size={26}
                      color={savedPosts[post.id] ? "#555" : "black"}
                      fill={savedPosts[post.id] ? "#555" : "transparent"}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.postTextContainer}>
                  <Text style={styles.postCaptionText}>{post.content}</Text>
                  <Text style={styles.postTimeText}>
                    {new Date(post.created_at).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
      <Modal visible={editVisible} transparent animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <TouchableOpacity
            style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)" }}
            activeOpacity={1}
            onPress={() => setEditVisible(false)}
          />
          <View
            style={{
              backgroundColor: "white",
              padding: 20,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 15 }}>
              Edit Profile
            </Text>
            <Text style={{ color: "#666", marginBottom: 6 }}>Bio</Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "#DDD",
                borderRadius: 10,
                padding: 12,
                fontSize: 15,
                minHeight: 80,
                textAlignVertical: "top",
              }}
              multiline
              value={editBio}
              onChangeText={setEditBio}
              placeholder="Tell your story..."
              placeholderTextColor="#999"
            />
            <TouchableOpacity
              style={{
                backgroundColor: "black",
                borderRadius: 10,
                padding: 14,
                alignItems: "center",
                marginTop: 15,
              }}
              onPress={() => {
                handleUpdateProfile(editBio);
                setEditVisible(false);
              }}
            >
              <Text style={{ color: "white", fontWeight: "700", fontSize: 16 }}>
                Save
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      <BottomBar
        active="profile"
        setScreen={setScreen}
        currentUser={currentUser}
      />
    </View>
  );
};

interface VehiclesListScreenProps {
  setScreen: (screen: string) => void;
  currentUser: any;
  setVehicleBackScreen: (screen: string) => void;
  setSelectedVehicle: (car: any) => void;
  vehicles: any[];
  handleAddVehicle: (name: string) => void;
  handleDeleteVehicle: (id: string) => void;
}

export const VehiclesListScreen = ({
  setScreen,
  currentUser,
  setVehicleBackScreen,
  setSelectedVehicle,
  vehicles,
  handleAddVehicle,
  handleDeleteVehicle,
}: VehiclesListScreenProps) => {
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return Math.abs(gestureState.dx) > 40 && Math.abs(gestureState.dy) < 25;
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dx < -50 || gestureState.dx > 50) {
        setScreen("profile");
      }
    },
  });

  return (
    <View style={styles.whiteContainer} {...panResponder.panHandlers}>
      <View style={styles.vehiclesHeader}>
        <TouchableOpacity
          onPress={() => setScreen("profile")}
          style={styles.vehiclesHeaderLeft}
        >
          <ArrowLeft size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.vehiclesHeaderTitle}>Vehicles</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.vehiclesGridContainer}
      >
        <View style={styles.vehiclesGrid}>
          {vehicles.map((car: any, index: number) => (
            <TouchableOpacity
              key={index}
              style={styles.vehiclesGridCard}
              onPress={() => {
                setVehicleBackScreen("vehicles");
                setSelectedVehicle(car);
                setScreen("vehicleDetail");
              }}
            >
              <Image
                source={{
                  uri:
                    typeof car === "object" && car.image
                      ? car.image
                      : "https://images.unsplash.com/photo-1617531653520-4893f7bbf978?w=500",
                }}
                style={styles.vehiclesGridImage}
              />
              <View style={styles.vehiclesGridOwnBadge}>
                <Text style={styles.vehiclesGridOwnBadgeText}>Own</Text>
              </View>
              <View style={styles.vehiclesGridOverlay}>
                <Text style={styles.vehiclesGridName}>
                  {typeof car === "object" ? car.name : "Vehicle"}
                </Text>
                <Text style={styles.vehiclesGridModel}>
                  {typeof car === "object" ? car.model : car}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[
              styles.vehiclesGridCard,
              {
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#F5F5F5",
              },
            ]}
            onPress={() => setScreen("createVehicle")}
          >
            <Plus size={32} color="#999" />
            <Text style={{ color: "#999", marginTop: 8, fontSize: 13 }}>
              Add Vehicle
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

interface VehicleDetailScreenProps {
  setScreen: (screen: string) => void;
  currentUser: any;
  vehicleBackScreen: string;
  modifications: any[];
  setModifications: React.Dispatch<React.SetStateAction<any[]>>;
  handleDeleteModification: (modId: string) => void;
  showVehicleMenu: boolean;
  setShowVehicleMenu: (val: boolean) => void;
  selectedVehicle: any;
  handleDeleteVehicle: (id: string) => void;
}

export const VehicleDetailScreen = ({
  setScreen,
  currentUser,
  vehicleBackScreen,
  modifications,
  setModifications,
  handleDeleteModification,
  showVehicleMenu,
  setShowVehicleMenu,
  selectedVehicle,
  handleDeleteVehicle,
}: VehicleDetailScreenProps) => {
  const vehicleQuote = selectedVehicle?.name || '"Akari "';
  const vehicleModel = selectedVehicle?.model || "2010 Mazda Rx8";
  const vehicleTrim = selectedVehicle?.trim || "GT";
  const vehicleColor = selectedVehicle?.color || "White";
  const vehicleDesc =
    selectedVehicle?.description ||
    "2010 Mazda Rx8 GT with Renesis Hybrid and a custom improved and reinforced Rx8 S2 Transmission with 10,5k rpm redline";

  return (
    <View style={styles.whiteContainer}>
      <View style={styles.detailHeader}>
        <TouchableOpacity
          onPress={() => setScreen(vehicleBackScreen)}
          style={styles.detailHeaderLeft}
        >
          <ArrowLeft size={24} color="black" />
          <Text style={styles.detailHeaderTitle}>Vehicle</Text>
          <View style={styles.detailOwnBadge}>
            <Text style={styles.detailOwnBadgeText}>Own</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.detailHeaderRight}>
          <TouchableOpacity
            onPress={() => setScreen("addModification")}
            style={{ padding: 6 }}
          >
            <Plus size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowVehicleMenu(true)}
            style={{ padding: 6, marginLeft: 10 }}
          >
            <Ellipsis size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        <Image
          source={{
            uri:
              selectedVehicle?.image ||
              "https://images.unsplash.com/photo-1617531653520-4893f7bbf978?w=500",
          }}
          style={styles.detailMainImage}
        />

        <View style={styles.detailContent}>
          <Text style={styles.detailVehicleNameQuote}>
            {selectedVehicle?.name || '"Akari "'}
          </Text>
          <Text style={styles.detailVehicleModelName}>
            {selectedVehicle?.model || "2010 Mazda Rx8"}
          </Text>

          <View style={styles.detailCardsList}>
            <View style={styles.detailItemCard}>
              <View style={styles.detailIconBox}>
                <Wrench size={20} color="#2196F3" />
              </View>
              <View style={styles.detailCardText}>
                <Text style={styles.detailCardLabel}>Trim</Text>
                <Text style={styles.detailCardValue}>
                  {selectedVehicle?.trim || "GT"}
                </Text>
              </View>
            </View>

            <View style={styles.detailItemCard}>
              <View style={styles.detailIconBox}>
                <Tag size={20} color="#2196F3" />
              </View>
              <View style={styles.detailCardText}>
                <Text style={styles.detailCardLabel}>Color</Text>
                <Text style={styles.detailCardValue}>
                  {selectedVehicle?.color || "White"}
                </Text>
              </View>
            </View>

            <View style={styles.detailItemCard}>
              <View style={styles.detailIconBox}>
                <Wrench size={20} color="#2196F3" />
              </View>
              <View style={styles.detailCardText}>
                <Text style={styles.detailCardLabel}>Modifications</Text>
                <Text style={styles.detailCardValue}>
                  {modifications.length} Modifications
                </Text>
              </View>
            </View>

            <View style={styles.detailItemCard}>
              <View style={styles.detailIconBox}>
                <UserIcon size={20} color="#2196F3" />
              </View>
              <View style={styles.detailCardText}>
                <Text style={styles.detailCardLabel}>Owner</Text>
                <Text style={styles.detailCardValue}>
                  @{currentUser?.username || "felixfuru"}
                </Text>
              </View>
            </View>
          </View>

          <Text style={styles.detailSectionTitle}>Description</Text>
          <Text style={styles.detailDescriptionText}>
            {selectedVehicle?.description ||
              "2010 Mazda Rx8 GT with Renesis Hybrid and a custom improved and reinforced Rx8 S2 Transmission with 10,5k rpm redline"}
          </Text>

          {modifications.length === 0 ? (
            <View style={styles.detailEmptyModifications}>
              <View style={styles.crossedWrenchesWrapper}>
                <ScrewdriverWrenchIcon size={45} color="#555" />
              </View>
              <Text style={styles.detailEmptyModTitle}>No Modifications</Text>
              <Text style={styles.detailEmptyModSub}>
                This vehicle does not have any modification
              </Text>
            </View>
          ) : (
            <View style={styles.detailModificationsList}>
              <Text style={styles.detailSectionTitle}>Modification List</Text>
              {modifications.map((mod) => (
                <View key={mod.id} style={styles.modificationItemCard}>
                  <View style={styles.modItemHeader}>
                    <Text style={styles.modItemName}>{mod.name}</Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <View style={styles.modClassificationBadge}>
                        <Text style={styles.modClassificationText}>
                          {mod.classification}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => handleDeleteModification(mod.id)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <Trash2 size={16} color="#D32F2F" />
                      </TouchableOpacity>
                    </View>
                  </View>
                  {mod.description ? (
                    <Text style={styles.modItemDesc}>{mod.description}</Text>
                  ) : null}
                  {mod.link ? (
                    <Text style={styles.modItemLink} numberOfLines={1}>
                      {mod.link}
                    </Text>
                  ) : null}
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <Modal visible={showVehicleMenu} transparent animationType="slide">
        <TouchableOpacity
          style={styles.vMenuOverlay}
          activeOpacity={1}
          onPress={() => setShowVehicleMenu(false)}
        >
          <View style={styles.vMenuBottomSheet}>
            <View style={styles.vMenuHandle} />

            <TouchableOpacity
              style={styles.vMenuActionRow}
              onPress={() => {
                setShowVehicleMenu(false);
                Alert.alert("Vehicle link copied!");
              }}
            >
              <Share2 size={24} color="#1E88E5" />
              <Text style={styles.vMenuText}>Share Vehicle</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.vMenuActionRow}
              onPress={() => {
                setShowVehicleMenu(false);
                setScreen("editVehicle");
              }}
            >
              <Pencil size={24} color="#1E88E5" />
              <Text style={styles.vMenuText}>Edit Vehicle</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.vMenuActionRow, { borderBottomWidth: 0 }]}
              onPress={() => {
                setShowVehicleMenu(false);
                Alert.alert(
                  "Delete Vehicle",
                  "Are you sure you want to delete this vehicle?",
                  [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Delete",
                      style: "destructive",
                      onPress: () => {
                        handleDeleteVehicle(selectedVehicle.id);
                      },
                    },
                  ],
                );
              }}
            >
              <Trash2 size={24} color="#D32F2F" />
              <Text style={[styles.vMenuText, { color: "#D32F2F" }]}>
                Delete Vehicle
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

interface AddModificationScreenProps {
  setScreen: (screen: string) => void;
  onSaveModification: (mod: {
    name: string;
    description: string;
    link: string;
    classification: string;
  }) => void;
}

export const AddModificationScreen = ({
  setScreen,
  onSaveModification,
}: AddModificationScreenProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [classification, setClassification] = useState("Classification");

  const [showClassificationModal, setShowClassificationModal] = useState(false);
  const [catSearchQuery, setCatSearchQuery] = useState("");
  const [tempClassification, setTempClassification] = useState("Performance");

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert("❌ Error", "Modification name is required");
      return;
    }
    onSaveModification({
      name,
      description,
      link,
      classification:
        classification === "Classification" ? "Other" : classification,
    });
    Alert.alert("✅ Saved", "Modification has been added to your vehicle!");
  };

  const openClassificationModal = () => {
    setTempClassification(
      classification === "Classification" ? "Performance" : classification,
    );
    setCatSearchQuery("");
    setShowClassificationModal(true);
  };

  const categoriesList = [
    "Audio",
    "Body",
    "Brakes",
    "Cooling",
    "Drivetrain",
    "Electronics",
    "Engine",
    "Exhaust",
    "Exterior",
    "Interior",
    "Lighting",
    "Performance",
    "Safety",
    "Suspension",
    "Tires",
    "Transmission",
    "Visual",
    "Wheels",
  ];

  const filteredCategories = categoriesList.filter((cat) =>
    cat.toLowerCase().includes(catSearchQuery.toLowerCase()),
  );

  return (
    <View style={styles.whiteContainer}>
      <View style={styles.addModHeader}>
        <TouchableOpacity
          onPress={() => setScreen("vehicleDetail")}
          style={styles.addModHeaderLeft}
        >
          <ChevronDown size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.addModHeaderTitle}>Add Modification</Text>
        <TouchableOpacity
          onPress={handleSave}
          disabled={!name.trim()}
          style={styles.addModHeaderRight}
        >
          <Text
            style={[
              styles.addModSaveText,
              { color: name.trim() ? "#2196F3" : "#AAA" },
            ]}
          >
            Save
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.modFormLabel}>name</Text>
        <TextInput
          style={styles.modFormInput}
          value={name}
          onChangeText={setName}
          placeholder=""
          placeholderTextColor="#AAA"
        />

        <Text style={[styles.modFormLabel, { marginTop: 20 }]}>
          description
        </Text>
        <View style={{ position: "relative" }}>
          <TextInput
            style={[
              styles.modFormInput,
              {
                height: 120,
                textAlignVertical: "top",
                paddingTop: 12,
                paddingRight: 45,
              },
            ]}
            multiline
            maxLength={255}
            value={description}
            onChangeText={setDescription}
            placeholder=""
            placeholderTextColor="#AAA"
          />
          <Text style={styles.modCharCounterInside}>
            {255 - description.length}
          </Text>
        </View>

        <Text style={[styles.modFormLabel, { marginTop: 20 }]}>Link</Text>
        <TextInput
          style={styles.modFormInput}
          value={link}
          onChangeText={setLink}
          placeholder=""
          placeholderTextColor="#AAA"
        />

        <Text style={[styles.modFormLabel, { marginTop: 20 }]}>
          Classification
        </Text>
        <TouchableOpacity
          style={[
            styles.modFormInput,
            {
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            },
          ]}
          onPress={openClassificationModal}
        >
          <Text
            style={{
              color: classification === "Classification" ? "#888" : "#333",
              fontSize: 16,
            }}
          >
            {classification}
          </Text>
          <ChevronDown size={20} color="#888" />
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={showClassificationModal} transparent animationType="fade">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <TouchableOpacity
            style={styles.catModalWrapper}
            activeOpacity={1}
            onPress={() => setShowClassificationModal(false)}
          >
            <TouchableOpacity style={styles.catModalContent} activeOpacity={1}>
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

              <ScrollView
                style={{ maxHeight: 280, minHeight: 150 }}
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
              >
                {catSearchQuery.trim() === "" && (
                  <View style={styles.catHeaderRow}>
                    <Text style={styles.catHeaderTitle}>Classification</Text>
                    <ChevronDown
                      size={20}
                      color="black"
                      style={{ transform: [{ rotate: "180deg" }] }}
                    />
                  </View>
                )}
                {filteredCategories.length === 0 ? (
                  <View style={{ paddingVertical: 30, alignItems: "center" }}>
                    <Text style={{ color: "#999", fontSize: 16 }}>
                      No categories match your search
                    </Text>
                  </View>
                ) : (
                  filteredCategories.map((item) => (
                    <TouchableOpacity
                      key={item}
                      style={styles.catItemRow}
                      onPress={() => setTempClassification(item)}
                    >
                      <Text
                        style={[
                          styles.catItemText,
                          tempClassification === item &&
                            styles.catItemTextSelected,
                        ]}
                      >
                        {item}
                      </Text>
                      {tempClassification === item && (
                        <Check size={18} color="#2E7D32" strokeWidth={3.5} />
                      )}
                    </TouchableOpacity>
                  ))
                )}
              </ScrollView>

              <TouchableOpacity
                style={styles.catConfirmButton}
                onPress={() => {
                  setClassification(tempClassification);
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

interface CreateVehicleScreenProps {
  setScreen: (screen: string) => void;
  currentUser: any;
  setCurrentUser: (user: any) => void;
  handleAddVehicle: (vehicleData: any) => void;
}

export const CreateVehicleScreen = ({
  setScreen,
  currentUser,
  setCurrentUser,
  handleAddVehicle,
}: CreateVehicleScreenProps) => {
  // 1. State trackers matching your vehicle detail specs
  const [vehicleQuote, setVehicleQuote] = React.useState(""); // e.g., "Akari"
  const [modelName, setModelName] = React.useState(""); // e.g., 2010 Mazda Rx8
  const [trim, setTrim] = React.useState(""); // e.g., GT
  const [color, setColor] = React.useState(""); // e.g., White
  const [description, setDescription] = React.useState("");
  const [vehicleImage, setVehicleImage] = useState<string | null>(null);

  const pickVehicleImage = async () => {
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
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setVehicleImage(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    if (!modelName.trim()) {
      Alert.alert("Error", "Please provide at least a Year, Make & Model");
      return;
    }
    const newVehicleObject = {
      name: vehicleQuote.trim()
        ? `"${vehicleQuote.trim()}"`
        : `"${modelName.trim()}"`,
      model: modelName.trim(),
      trim: trim.trim() || "N/A",
      color: color.trim() || "N/A",
      description:
        description.trim() || `${modelName.trim()} build description log.`,
      image:
        vehicleImage ||
        "https://images.unsplash.com/photo-1617531653520-4893f7bbf978?w=500",
    };
    handleAddVehicle(newVehicleObject);
    setScreen("vehicles");
  };

  return (
    <ScrollView
      style={[styles.whiteContainer, { paddingTop: 40 }]}
      contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 60 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header bar tracking */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 30,
        }}
      >
        <TouchableOpacity
          onPress={() => setScreen("profile")}
          style={{ padding: 6 }}
        >
          <Text style={{ fontSize: 16, color: "#333", fontWeight: "600" }}>
            Cancel
          </Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: "700", color: "#000" }}>
          Add Vehicle
        </Text>
        <View style={{ width: 50 }} />
      </View>

      {/* Styled Mock Image Box container */}
      <TouchableOpacity
        onPress={pickVehicleImage}
        activeOpacity={0.85}
        style={{
          width: "100%",
          height: 160,
          backgroundColor: "#F5F5F5",
          borderRadius: 12,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 20,
          borderStyle: "dashed",
          borderWidth: 1,
          borderColor: "#BBB",
          overflow: "hidden",
        }}
      >
        {vehicleImage ? (
          <Image
            source={{ uri: vehicleImage }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
        ) : (
          <View style={{ alignItems: "center" }}>
            <Camera size={32} color="#999" style={{ marginBottom: 6 }} />
            <Text style={{ color: "#888", fontSize: 14 }}>
              Tap to upload vehicle image
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* FIELD 1: Vehicle Quote Name */}
      <Text
        style={{
          color: "#333",
          fontSize: 14,
          fontWeight: "600",
          marginBottom: 6,
        }}
      >
        Vehicle Nickname / Quote
      </Text>
      <TextInput
        style={{
          backgroundColor: "#F9F9F9",
          borderWidth: 1,
          borderColor: "#E0E0E0",
          padding: 12,
          borderRadius: 10,
          fontSize: 15,
          color: "#000",
          marginBottom: 16,
        }}
        placeholder='e.g. "Akari"'
        placeholderTextColor="#999"
        value={vehicleQuote}
        onChangeText={setVehicleQuote}
      />

      {/* FIELD 2: Year, Make & Model */}
      <Text
        style={{
          color: "#333",
          fontSize: 14,
          fontWeight: "600",
          marginBottom: 6,
        }}
      >
        Vehicle Year, Make & Model *
      </Text>
      <TextInput
        style={{
          backgroundColor: "#F9F9F9",
          borderWidth: 1,
          borderColor: "#E0E0E0",
          padding: 12,
          borderRadius: 10,
          fontSize: 15,
          color: "#000",
          marginBottom: 16,
        }}
        placeholder="e.g. 2010 Mazda Rx8"
        placeholderTextColor="#999"
        value={modelName}
        onChangeText={setModelName}
      />

      {/* FIELD 3: Trim Package */}
      <Text
        style={{
          color: "#333",
          fontSize: 14,
          fontWeight: "600",
          marginBottom: 6,
        }}
      >
        Trim
      </Text>
      <TextInput
        style={{
          backgroundColor: "#F9F9F9",
          borderWidth: 1,
          borderColor: "#E0E0E0",
          padding: 12,
          borderRadius: 10,
          fontSize: 15,
          color: "#000",
          marginBottom: 16,
        }}
        placeholder="e.g. GT"
        placeholderTextColor="#999"
        value={trim}
        onChangeText={setTrim}
      />

      {/* FIELD 4: Color */}
      <Text
        style={{
          color: "#333",
          fontSize: 14,
          fontWeight: "600",
          marginBottom: 6,
        }}
      >
        Color
      </Text>
      <TextInput
        style={{
          backgroundColor: "#F9F9F9",
          borderWidth: 1,
          borderColor: "#E0E0E0",
          padding: 12,
          borderRadius: 10,
          fontSize: 15,
          color: "#000",
          marginBottom: 16, // Changed from 24 to 16 to space out nicely
        }}
        placeholder="e.g. White"
        placeholderTextColor="#999"
        value={color}
        onChangeText={setColor}
      />

      {/* FIELD 5: Description */}
      <Text
        style={{
          color: "#333",
          fontSize: 14,
          fontWeight: "600",
          marginBottom: 6,
        }}
      >
        Description
      </Text>
      <TextInput
        style={{
          backgroundColor: "#F9F9F9",
          borderWidth: 1,
          borderColor: "#E0E0E0",
          padding: 12,
          borderRadius: 10,
          fontSize: 15,
          color: "#000",
          marginBottom: 24,
          minHeight: 80,
          textAlignVertical: "top", // Ensures text aligns to the top on Android when using multiline
        }}
        placeholder="Tell us about your vehicle setup, history, modifications..."
        placeholderTextColor="#999"
        multiline={true}
        numberOfLines={3}
        value={description}
        onChangeText={setDescription}
      />

      <TouchableOpacity
        style={{
          backgroundColor: "#000",
          padding: 16,
          borderRadius: 10,
          alignItems: "center",
        }}
        onPress={handleSave}
      >
        <Text style={{ color: "#FFF", fontWeight: "700", fontSize: 16 }}>
          Save Vehicle
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

interface EditVehicleScreenProps {
  setScreen: (screen: string) => void;
  selectedVehicle: any;
  handleUpdateVehicle: (vehicleData: any) => void;
}

export const EditVehicleScreen = ({
  setScreen,
  selectedVehicle,
  handleUpdateVehicle,
}: EditVehicleScreenProps) => {
  const [vehicleQuote, setVehicleQuote] = React.useState(
    selectedVehicle?.name?.replace(/"/g, "") || "",
  );
  const [modelName, setModelName] = React.useState(
    selectedVehicle?.model || "",
  );
  const [trim, setTrim] = React.useState(selectedVehicle?.trim || "");
  const [color, setColor] = React.useState(selectedVehicle?.color || "");
  const [description, setDescription] = React.useState(
    selectedVehicle?.description || "",
  );
  const [vehicleImage, setVehicleImage] = useState<string | null>(
    selectedVehicle?.image || null,
  );

  const pickVehicleImage = async () => {
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
      setVehicleImage(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    if (!modelName.trim()) {
      Alert.alert("Error", "Please provide at least a Year, Make & Model");
      return;
    }
    handleUpdateVehicle({
      name: vehicleQuote.trim()
        ? `"${vehicleQuote.trim()}"`
        : `"${modelName.trim()}"`,
      model: modelName.trim(),
      trim: trim.trim() || "N/A",
      color: color.trim() || "N/A",
      description:
        description.trim() || `${modelName.trim()} build description log.`,
      image:
        vehicleImage ||
        "https://images.unsplash.com/photo-1617531653520-4893f7bbf978?w=500",
    });
  };

  const fieldStyle = {
    backgroundColor: "#F9F9F9",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    padding: 12,
    borderRadius: 10,
    fontSize: 15,
    color: "#000",
    marginBottom: 16,
  };
  const labelStyle = {
    color: "#333",
    fontSize: 14,
    fontWeight: "600" as const,
    marginBottom: 6,
  };

  return (
    <ScrollView
      style={[styles.whiteContainer, { paddingTop: 40 }]}
      contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 60 }}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 30,
        }}
      >
        <TouchableOpacity
          onPress={() => setScreen("vehicleDetail")}
          style={{ padding: 6 }}
        >
          <Text style={{ fontSize: 16, color: "#333", fontWeight: "600" }}>
            Cancel
          </Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: "700", color: "#000" }}>
          Edit Vehicle
        </Text>
        <TouchableOpacity onPress={handleSave} style={{ padding: 6 }}>
          <Text style={{ fontSize: 16, color: "#2196F3", fontWeight: "600" }}>
            Save
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={pickVehicleImage}
        activeOpacity={0.85}
        style={{
          width: "100%",
          height: 160,
          backgroundColor: "#F5F5F5",
          borderRadius: 12,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 20,
          borderStyle: "dashed",
          borderWidth: 1,
          borderColor: "#BBB",
          overflow: "hidden",
        }}
      >
        {vehicleImage ? (
          <Image
            source={{ uri: vehicleImage }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
        ) : (
          <View style={{ alignItems: "center" }}>
            <Camera size={32} color="#999" style={{ marginBottom: 6 }} />
            <Text style={{ color: "#888", fontSize: 14 }}>
              Tap to change vehicle image
            </Text>
          </View>
        )}
      </TouchableOpacity>

      <Text style={labelStyle}>Vehicle Nickname / Quote</Text>
      <TextInput
        style={fieldStyle}
        placeholder='e.g. "Akari"'
        placeholderTextColor="#999"
        value={vehicleQuote}
        onChangeText={setVehicleQuote}
      />

      <Text style={labelStyle}>Year, Make & Model</Text>
      <TextInput
        style={fieldStyle}
        placeholder="e.g. 2010 Mazda RX-8"
        placeholderTextColor="#999"
        value={modelName}
        onChangeText={setModelName}
      />

      <Text style={labelStyle}>Trim</Text>
      <TextInput
        style={fieldStyle}
        placeholder="e.g. GT"
        placeholderTextColor="#999"
        value={trim}
        onChangeText={setTrim}
      />

      <Text style={labelStyle}>Color</Text>
      <TextInput
        style={fieldStyle}
        placeholder="e.g. White"
        placeholderTextColor="#999"
        value={color}
        onChangeText={setColor}
      />

      <Text style={labelStyle}>Description</Text>
      <TextInput
        style={[
          fieldStyle,
          { height: 120, textAlignVertical: "top", paddingTop: 12 },
        ]}
        multiline
        maxLength={500}
        placeholder="Describe your build..."
        placeholderTextColor="#999"
        value={description}
        onChangeText={setDescription}
      />
    </ScrollView>
  );
};
