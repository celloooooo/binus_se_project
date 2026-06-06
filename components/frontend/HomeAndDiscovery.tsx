import {
  Bell,
  Bookmark,
  Calendar,
  ChevronRight,
  Filter,
  Heart,
  ImageIcon,
  MessageCircle,
  MessageSquare,
  PlusCircle,
  Send,
  Target,
  UserPlus,
  Users2
} from "lucide-react-native";
import React from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView from "../MapViewComponent";
import { BottomBar } from "./BottomBar";
import { styles } from "./styles";

interface HomeProps {
  mapRef: any;
  setScreen: (screen: string) => void;
  goToMyLocation: () => void;
  currentUser: any;
}

export const HomeScreen = ({
  mapRef,
  setScreen,
  goToMyLocation,
  currentUser,
}: HomeProps) => (
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
    <BottomBar active="home" setScreen={setScreen} currentUser={currentUser} />
  </View>
);

interface SearchMainProps {
  setScreen: (screen: string) => void;
  currentUser: any;
  myGroups: any[];
  allPosts: any[];
  allEvents: any[];
  handleDeletePost: (id: string) => void;
  handleDeleteEvent: (id: string) => void;
  likedPosts: Record<string, boolean>;
  savedPosts: Record<string, boolean>;
  toggleLike: (postId: any) => void;
  toggleSave: (postId: any) => void;
}

export const SearchMainScreen = ({
  setScreen,
  currentUser,
  myGroups,
  allPosts,
  allEvents,
  handleDeletePost,
  handleDeleteEvent,
  likedPosts,
  savedPosts,
  toggleLike,
  toggleSave,
}: SearchMainProps) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeFilter, setActiveFilter] = React.useState<string | null>(null);

  const filteredPosts = allPosts.filter(
    (p) =>
      !searchQuery ||
      p.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.users?.username?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredEvents = allEvents.filter(
    (e) =>
      !searchQuery ||
      e.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.location?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredGroups = myGroups.filter(
    (g) =>
      !searchQuery || g.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const discoverTags = [
    { label: "🔥 Trending Near Posts", filter: "posts" },
    { label: "📌 Trending Hashtags", filter: "posts" },
    { label: "🌍 Trending Worldwide Posts", filter: "posts" },
    { label: "🎉 Popular's Events", filter: "events" },
    { label: "🆕 New Events", filter: "events" },
    { label: "👥 Popular Groups", filter: "groups" },
  ];

  const SectionRow = ({
    label,
    action,
    filter,
  }: {
    label: string;
    action: string;
    filter: string;
  }) => (
    <View style={styles.searchSectionRow}>
      <Text style={styles.sectionTitleText}>{label}</Text>
      <TouchableOpacity
        style={styles.rowAlign}
        onPress={() => setActiveFilter(activeFilter === filter ? null : filter)}
      >
        <Text
          style={[
            styles.linkTextGray,
            activeFilter === filter && { color: "#2196F3" },
          ]}
        >
          {action}
        </Text>
        <ChevronRight
          size={18}
          color={activeFilter === filter ? "#2196F3" : "#999"}
        />
      </TouchableOpacity>
    </View>
  );

  const showPosts = !activeFilter || activeFilter === "posts";
  const showGroups = !activeFilter || activeFilter === "groups";
  const showEvents = !activeFilter || activeFilter === "events";

  return (
    <View style={styles.whiteContainer}>
      <View style={styles.searchHeaderTop}>
        <TextInput
          placeholder="Search posts, events, groups..."
          style={styles.searchField}
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
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
          {discoverTags.map((tag, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.tagBadge,
                activeFilter === tag.filter &&
                  tag.filter && { backgroundColor: "#222" },
              ]}
              onPress={() =>
                tag.filter &&
                setActiveFilter(activeFilter === tag.filter ? null : tag.filter)
              }
            >
              <Text
                style={[
                  styles.tagText,
                  activeFilter === tag.filter &&
                    tag.filter && { color: "#FFF" },
                ]}
              >
                {tag.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {showPosts && (
          <>
            <SectionRow
              label="Posts"
              action="Discover all Posts"
              filter="posts"
            />
            {filteredPosts.length === 0 ? (
              <View style={styles.noResultContainer}>
                <ImageIcon size={70} color="#777" strokeWidth={1.5} />
                <Text style={styles.noResultMainText}>No Results</Text>
                <Text style={styles.noResultSubText}>
                  No Posts could be found at this time
                </Text>
              </View>
            ) : (
              filteredPosts.map((post: any) => (
                <View
                  key={post.id}
                  style={[styles.postCard, { marginHorizontal: 15 }]}
                >
                  <View style={styles.postHeaderRow}>
                    <View style={styles.postHeaderLeft}>
                      {post.users?.profile_image ? (
                        <Image
                          source={{ uri: post.users.profile_image }}
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
                          @{post.users?.username}
                        </Text>
                        <Text style={styles.postLocationText}>
                          {new Date(post.created_at).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
                    {/* {post.user_id === currentUser?.id && (
                      <TouchableOpacity
                        onPress={() => handleDeletePost(post.id)}
                      >
                        <Trash2 size={18} color="#D32F2F" />
                      </TouchableOpacity>
                    )} */}
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
                      <TouchableOpacity style={styles.actionIcon}>
                        <MessageCircle size={26} color="black" />
                      </TouchableOpacity>
                      <Text style={styles.actionText}>0</Text>
                      <TouchableOpacity style={styles.actionIcon}>
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
          </>
        )}

        {showGroups && (
          <>
            <SectionRow
              label="Groups"
              action="Discover all Groups"
              filter="groups"
            />
            {filteredGroups.length === 0 ? (
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
              filteredGroups.map((group, index) => (
                <TouchableOpacity
                  key={group.id || index}
                  style={styles.groupCard}
                  onPress={() => setScreen("groups")}
                >
                  <Image
                    source={{
                      uri:
                        group.cover_image ||
                        "https://images.unsplash.com/photo-1617531653520-4893f7bbf978?w=1200",
                    }}
                    style={styles.groupImage}
                  />
                  <View style={styles.groupInfo}>
                    <View style={styles.groupRow}>
                      <Image
                        source={{
                          uri:
                            group.logo ||
                            "https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg",
                        }}
                        style={styles.groupLogo}
                      />
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
                </TouchableOpacity>
              ))
            )}
          </>
        )}

        {showEvents && (
          <>
            <SectionRow
              label="Events"
              action="Discover all Events"
              filter="events"
            />
            {filteredEvents.length === 0 ? (
              <View style={styles.noResultContainer}>
                <Calendar size={70} color="#777" strokeWidth={1.5} />
                <Text style={styles.noResultMainText}>No Results</Text>
                <Text style={styles.noResultSubText}>
                  No Events could be found at this time
                </Text>
              </View>
            ) : (
              filteredEvents.map((event: any) => (
                <View
                  key={event.id}
                  style={{
                    marginHorizontal: 15,
                    marginBottom: 15,
                    borderRadius: 14,
                    borderWidth: 1,
                    borderColor: "#EEE",
                    overflow: "hidden",
                  }}
                >
                  <View style={{ backgroundColor: "#F8F8F8", padding: 14 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 6,
                      }}
                    >
                      <View
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: 10,
                          backgroundColor: "#222",
                          justifyContent: "center",
                          alignItems: "center",
                          marginRight: 12,
                        }}
                      >
                        <Text style={{ fontSize: 20 }}>🎉</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            fontWeight: "700",
                            fontSize: 15,
                            color: "#111",
                          }}
                        >
                          {event.name}
                        </Text>
                        <Text style={{ color: "#888", fontSize: 12 }}>
                          by @{event.users?.username}
                        </Text>
                      </View>
                    </View>
                    {event.date && (
                      <Text style={{ color: "#555", fontSize: 13 }}>
                        📅{" "}
                        {new Date(event.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </Text>
                    )}
                    {event.location && (
                      <Text
                        style={{ color: "#555", fontSize: 13, marginTop: 4 }}
                      >
                        📍 {event.location}
                      </Text>
                    )}
                    {event.description && (
                      <Text
                        style={{ color: "#666", fontSize: 13, marginTop: 8 }}
                      >
                        {event.description}
                      </Text>
                    )}
                    {event.created_by === currentUser?.id && (
                      <TouchableOpacity
                        onPress={() => handleDeleteEvent(event.id)}
                        style={{ marginTop: 8 }}
                      >
                        <Text style={{ color: "#D32F2F", fontSize: 13 }}>
                          🚪 Leave Event
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))
            )}
          </>
        )}
      </ScrollView>
      <BottomBar
        active="search"
        setScreen={setScreen}
        currentUser={currentUser}
      />
    </View>
  );
};

interface AddPostProps {
  setScreen: (screen: string) => void;
  currentUser: any;
  handleCreateGroupQuickly?: () => void;
}

export const AddPostScreen = ({
  setScreen,
  currentUser,
  handleCreateGroupQuickly,
}: AddPostProps) => (
  <View style={styles.whiteContainer}>
    <View style={styles.addPostMain}>
      <Text style={styles.addPostTitle}>Create Content</Text>
      <Text style={styles.addPostSubtitle}>
        Share your thoughts, stories, or upcoming event...
      </Text>

      <TouchableOpacity
        style={styles.addCard}
        onPress={() => setScreen("createPost")}
      >
        <View style={[styles.iconBox, { backgroundColor: "#8E24AA" }]}>
          <PlusCircle size={30} color="white" />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardLabel}>Post</Text>
          <Text style={styles.cardSub}>Post what's on your mind...</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.addCard}
        onPress={() => setScreen("createEvent")}
      >
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
        onPress={() => setScreen("createGroup")}
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
    <BottomBar active="plus" setScreen={setScreen} currentUser={currentUser} />
  </View>
);
