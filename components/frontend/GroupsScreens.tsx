import {
  ArrowLeft,
  Bell,
  Bookmark,
  Ellipsis,
  Heart,
  Image as ImageIcon,
  Map,
  MessageCircle,
  Plus,
  Send,
  Share2,
  ShieldCheck,
  Upload,
  Users2,
} from "lucide-react-native";
import React from "react";
import {
  Image,
  Modal,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { BottomBar } from "./BottomBar";
import { styles } from "./styles";

interface GroupsScreenProps {
  setScreen: (screen: string) => void;
  currentUser: any;
  myGroups: any[];
  setSelectedGroup: (group: any) => void;
  loadingGroups?: boolean;
}

export const GroupsScreen = ({
  setScreen,
  currentUser,
  myGroups,
  setSelectedGroup,
  loadingGroups = false,
}: GroupsScreenProps) => {
  return (
    <View style={styles.whiteContainer}>
      <View style={styles.topPageHeader}>
        <View style={{ width: 28 }} />
        <Text style={styles.topPageTitle}>My Groups</Text>
        <TouchableOpacity onPress={() => setScreen("createGroup")}>
          <Plus size={28} color="black" />
        </TouchableOpacity>
      </View>
      <View style={{ paddingHorizontal: 15, marginTop: 15 }}>
        <TextInput
          placeholder="Search My Groups"
          style={styles.searchField}
          placeholderTextColor="#999"
        />
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120, paddingTop: 15 }}
      >
        {loadingGroups ? (
          <View style={styles.emptyGroupsContainer}>
            <Text style={styles.emptyGroupsText}>Loading groups...</Text>
          </View>
        ) : !myGroups || myGroups.length === 0 ? (
          <View style={styles.emptyGroupsContainer}>
            <Users2 size={70} color="#999" strokeWidth={1.5} />
            <Text style={styles.emptyGroupsTitle}>No Groups Yet</Text>
            <Text style={styles.emptyGroupsText}>
              Join groups to connect with other car enthusiasts{"\n"}near you or
              worldwide!
            </Text>
            <TouchableOpacity style={styles.joinGroupsBtn}>
              <Text style={styles.joinGroupsBtnText}>Find Groups</Text>
            </TouchableOpacity>
          </View>
        ) : (
          myGroups.map((group: any, index: number) => (
            <TouchableOpacity
              key={group.id || index}
              style={styles.groupCard}
              onPress={() => {
                setSelectedGroup(group);
                setScreen("groupFeed");
              }}
            >
              <Image
                source={{
                  uri:
                    group.coverPhoto ||
                    group.cover_image ||
                    "https://images.unsplash.com/photo-1603811478698-0b1d6256f79a?w=1200",
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
                        {group.isPrivate ||
                        group.visibility?.toLowerCase() === "private"
                          ? "🔒 Private"
                          : "🌐 Public"}
                      </Text>
                      <Text style={styles.groupMeta}>
                        👥 {group.members || 1}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
      <BottomBar
        active="groups"
        setScreen={setScreen}
        currentUser={currentUser}
      />
    </View>
  );
};

interface GroupFeedScreenProps {
  setScreen: (screen: string) => void;
  selectedGroup: any;
  showGroupMenu: boolean;
  setShowGroupMenu: (show: boolean) => void;
  likedPosts: Record<string, boolean>;
  savedPosts: Record<string, boolean>;
  activeSlides: Record<string, number>;
  toggleLike: (postId: any) => void;
  toggleSave: (postId: any) => void;
  handleScrollImage: (event: any, postId: any) => void;
  width: number;
  fetchGroupMembers: (groupId: string) => Promise<any[]>;
  handleLeaveGroup: (groupId: string) => void;
}

export const GroupFeedScreen = ({
  setScreen,
  selectedGroup,
  showGroupMenu,
  setShowGroupMenu,
  likedPosts,
  savedPosts,
  activeSlides,
  toggleLike,
  toggleSave,
  handleScrollImage,
  width,
  fetchGroupMembers,
  handleLeaveGroup,
}: GroupFeedScreenProps) => {
  if (!selectedGroup) return null;

  const [activeTab, setActiveTab] = React.useState("info");
  const [members, setMembers] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (selectedGroup?.id) {
      fetchGroupMembers(selectedGroup.id).then(setMembers);
    }
  }, [selectedGroup]);

  const dummyCover =
    selectedGroup.coverPhoto ||
    selectedGroup.cover_image ||
    "https://images.unsplash.com/photo-1603811478698-0b1d6256f79a?w=1200";
  const dummyLogo =
    selectedGroup.logo ||
    "https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg";

  return (
    <View style={styles.feedContainer}>
      <View style={styles.groupDetailTopBar}>
        <TouchableOpacity
          onPress={() => setScreen("groups")}
          style={styles.groupDetailTopBtn}
        >
          <ArrowLeft size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.groupDetailTopRight}>
          <TouchableOpacity>
            <Bell size={20} color="black" />
          </TouchableOpacity>
          <View style={styles.verticalDivider} />
          <TouchableOpacity onPress={() => setShowGroupMenu(true)}>
            <Ellipsis size={20} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <Image source={{ uri: dummyCover }} style={styles.groupCoverPhoto} />

        <View style={styles.groupInfoContainer}>
          <View style={styles.avatarTagRow}>
            <View style={styles.groupAvatarWrapper}>
              <Image
                source={{ uri: dummyLogo }}
                style={styles.groupAvatarImage}
              />
            </View>
            {(selectedGroup.tag || selectedGroup.tag_name) && (
              <View style={styles.groupTagBadgeDetailed}>
                <Text style={styles.groupTagTextDetailed}>
                  {selectedGroup.tag || selectedGroup.tag_name}
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.groupDetailTitle}>{selectedGroup.name}</Text>
          <View style={styles.groupDetailMetaRow}>
            <Text style={styles.groupDetailMetaText}>
              {selectedGroup.visibility?.toLowerCase() === "private"
                ? "🔒 Private"
                : "🌐 Public"}{" "}
              👥 {selectedGroup.member_count || members.length || 1}
            </Text>
          </View>

          {(selectedGroup.bio || selectedGroup.description) && (
            <Text style={styles.groupDetailBioText}>
              {selectedGroup.bio || selectedGroup.description}
            </Text>
          )}
          {selectedGroup.website && (
            <Text style={styles.groupDetailLinkText}>
              {selectedGroup.website}
            </Text>
          )}

          <TouchableOpacity style={styles.inviteButton}>
            <Text style={styles.inviteButtonText}>Invite Members</Text>
          </TouchableOpacity>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.groupTabsScroll}
          >
            <TouchableOpacity
              style={[
                styles.groupTabPill,
                activeTab === "info" && styles.groupTabActivePill,
              ]}
              onPress={() => setActiveTab("info")}
            >
              <Text
                style={
                  activeTab === "info"
                    ? styles.groupTabActiveText
                    : styles.groupTabTextDetailed
                }
              >
                Info
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.groupTabPill,
                activeTab === "garage" && styles.groupTabActivePill,
              ]}
              onPress={() => setActiveTab("garage")}
            >
              <Text
                style={
                  activeTab === "garage"
                    ? styles.groupTabActiveText
                    : styles.groupTabTextDetailed
                }
              >
                Group Garage
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.groupTabPill,
                activeTab === "members" && styles.groupTabActivePill,
              ]}
              onPress={() => setActiveTab("members")}
            >
              <Text
                style={
                  activeTab === "members"
                    ? styles.groupTabActiveText
                    : styles.groupTabTextDetailed
                }
              >
                Members
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {activeTab === "members" && (
          <View style={{ padding: 15 }}>
            {members.length === 0 ? (
              <Text
                style={{ color: "#999", textAlign: "center", marginTop: 20 }}
              >
                No members found
              </Text>
            ) : (
              members.map((member: any) => (
                <View
                  key={member.id}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: "#EEE",
                  }}
                >
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      backgroundColor: "#EEE",
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: 12,
                    }}
                  >
                    <Text style={{ fontSize: 18 }}>👤</Text>
                  </View>
                  <View>
                    <Text style={{ fontWeight: "600", fontSize: 15 }}>
                      {member.first_name} {member.last_name}
                    </Text>
                    <Text style={{ color: "#999", fontSize: 13 }}>
                      @{member.username}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {activeTab === "garage" && (
          <View style={{ padding: 15, alignItems: "center", marginTop: 20 }}>
            <Text style={{ color: "#999" }}>No vehicles added yet</Text>
          </View>
        )}

        {activeTab === "info" &&
          selectedGroup.posts?.map((post: any, index: number) => {
            const isLiked = likedPosts[post.id];
            const isSaved = savedPosts[post.id];
            const currentLikes = (post.likes || 0) + (isLiked ? 1 : 0);
            const slideIndex = activeSlides[post.id] || 0;

            return (
              <View key={post.id || index} style={styles.postCard}>
                <View style={styles.postHeaderRow}>
                  <View style={styles.postHeaderLeft}>
                    <Image
                      source={{
                        uri:
                          post.avatar ||
                          "https://images.unsplash.com/photo-1542362567-b07e54358753?w=500",
                      }}
                      style={styles.postAvatar}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.postUserText}>
                        {post.user || "User"}{" "}
                        <Text style={styles.postGroupText}>
                          {" "}
                          {">"} {selectedGroup.name}
                        </Text>
                      </Text>
                      <Text style={styles.postLocationText} numberOfLines={1}>
                        {post.location || "Location"}
                      </Text>
                    </View>
                  </View>
                </View>

                {post.images && post.images.length > 0 && (
                  <ScrollView
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={(e) => handleScrollImage(e, post.id)}
                  >
                    {post.images.map((imgUrl: any, imgIdx: number) => (
                      <Image
                        key={imgIdx}
                        source={{ uri: imgUrl }}
                        style={styles.postMainImage}
                      />
                    ))}
                  </ScrollView>
                )}

                {post.images && post.images.length > 1 && (
                  <View style={styles.carouselDots}>
                    {post.images.map((_: any, i: number) => (
                      <View
                        key={i}
                        style={[
                          styles.dot,
                          slideIndex === i && styles.activeDot,
                        ]}
                      />
                    ))}
                  </View>
                )}

                <View
                  style={[
                    styles.postActionRow,
                    {
                      marginTop:
                        post.images && post.images.length > 1 ? 12 : 16,
                    },
                  ]}
                >
                  <View style={styles.postActionLeft}>
                    <TouchableOpacity
                      style={styles.actionIcon}
                      onPress={() => toggleLike(post.id)}
                    >
                      <Heart
                        size={26}
                        color={isLiked ? "#E53935" : "black"}
                        fill={isLiked ? "#E53935" : "transparent"}
                      />
                    </TouchableOpacity>
                    <Text style={styles.actionText}>{currentLikes}</Text>
                    <TouchableOpacity style={styles.actionIcon}>
                      <MessageCircle size={26} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.actionText}>{post.comments || 0}</Text>
                    <TouchableOpacity
                      style={styles.actionIcon}
                      onPress={() => setShowGroupMenu(true)}
                    >
                      <Send size={26} color="black" />
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity onPress={() => toggleSave(post.id)}>
                    <Bookmark
                      size={26}
                      color={isSaved ? "#555" : "black"}
                      fill={isSaved ? "#555" : "transparent"}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.postTextContainer}>
                  <Text style={styles.postCaptionText}>{post.caption}</Text>
                  <Text style={styles.postTimeText}>{post.time || "now"}</Text>
                </View>
              </View>
            );
          })}
      </ScrollView>

      <TouchableOpacity
        style={styles.fabCreatePost}
        onPress={() => setScreen("createPost")}
      >
        <Plus size={32} color="white" />
      </TouchableOpacity>

      <Modal visible={showGroupMenu} transparent={true} animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowGroupMenu(false)}
        >
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
              <TouchableOpacity
                style={styles.sheetActionRow}
                onPress={() => handleLeaveGroup(selectedGroup.id)}
              >
                <ArrowLeft size={24} color="#D84315" />
                <Text style={[styles.sheetMainText, { color: "#D84315" }]}>
                  Leave Group
                </Text>
              </TouchableOpacity>
              <ShieldCheck size={24} color="#D84315" />
              <Text style={[styles.sheetMainText, { color: "#D84315" }]}>
                Report Group
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

interface CreateGroupScreenProps {
  setScreen: (screen: string) => void;
  groupCoverUri: string | null;
  pickGroupCover: () => Promise<void>;
  groupPhotoUri: string | null;
  pickGroupPhoto: () => Promise<void>;
  groupName: string;
  setGroupName: (text: string) => void;
  groupBio: string;
  setGroupBio: (text: string) => void;
  groupTag: string;
  setGroupTag: (text: string) => void;
  groupLocation: string;
  setGroupLocation: (text: string) => void;
  groupWebsite: string;
  setGroupWebsite: (text: string) => void;
  isPrivate: boolean;
  setIsPrivate: (val: boolean) => void;
  isLocked: boolean;
  setIsLocked: (val: boolean) => void;
  handleCreateGroup: () => void;
}

export const CreateGroupScreen = ({
  setScreen,
  groupCoverUri,
  pickGroupCover,
  groupPhotoUri,
  pickGroupPhoto,
  groupName,
  setGroupName,
  groupBio,
  setGroupBio,
  groupTag,
  setGroupTag,
  groupLocation,
  setGroupLocation,
  groupWebsite,
  setGroupWebsite,
  isPrivate,
  setIsPrivate,
  isLocked,
  setIsLocked,
  handleCreateGroup,
}: CreateGroupScreenProps) => {
  return (
    <View style={styles.whiteContainer}>
      <View
        style={[
          styles.topPageHeader,
          {
            paddingBottom: 15,
            borderBottomWidth: 1,
            borderBottomColor: "#EEE",
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => setScreen("groups")}
          style={{ width: 80 }}
        >
          <ArrowLeft size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.topPageTitle}>New Group</Text>
        <TouchableOpacity
          onPress={handleCreateGroup}
          style={{ width: 80, alignItems: "flex-end" }}
          disabled={!groupName.trim()}
        >
          <Text
            style={{
              color: groupName.trim() ? "#2196F3" : "#999",
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            Create
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.formLabel}>Group Cover Photo</Text>
        <TouchableOpacity
          onPress={pickGroupCover}
          style={styles.coverPhotoPlaceholder}
        >
          {groupCoverUri ? (
            <Image
              source={{ uri: groupCoverUri }}
              style={{ width: "100%", height: "100%", borderRadius: 8 }}
            />
          ) : (
            <ImageIcon size={40} color="#999" />
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={pickGroupCover}>
          <Text style={styles.addPictureText}>Add Picture</Text>
        </TouchableOpacity>

        <Text style={[styles.formLabel, { marginTop: 25 }]}>Group Photo</Text>
        <TouchableOpacity
          onPress={pickGroupPhoto}
          style={styles.avatarPlaceholder}
        >
          {groupPhotoUri ? (
            <Image
              source={{ uri: groupPhotoUri }}
              style={{ width: "100%", height: "100%", borderRadius: 50 }}
            />
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
          style={[
            styles.formInput,
            { height: 100, textAlignVertical: "top", paddingTop: 15 },
          ]}
          multiline
          value={groupBio}
          onChangeText={setGroupBio}
          placeholder="Describe what your group is about..."
          placeholderTextColor="#999"
        />

        <View style={{ marginTop: 20 }}>
          <Text style={styles.formLabel}>Group Tag</Text>
          <Text style={styles.formSubLabel}>
            Users can pin this tag to their profile
          </Text>
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
          <Text style={styles.formSubLabel}>
            Add a location to your group to help find local users
          </Text>
          <View
            style={[
              styles.formInput,
              {
                marginTop: 8,
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 15,
              },
            ]}
          >
            <Map size={20} color="#888" style={{ marginRight: 10 }} />
            <TextInput
              style={{ flex: 1, fontSize: 16, color: "#333", padding: 0 }}
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
            <Text style={styles.formSubLabel}>
              Private groups are only visible to members
            </Text>
          </View>
          <Switch
            value={isPrivate}
            onValueChange={setIsPrivate}
            trackColor={{ false: "#CCC", true: "#444" }}
            thumbColor="#FFF"
          />
        </View>

        <View style={[styles.toggleRow, { marginTop: 15 }]}>
          <View style={{ flex: 1, paddingRight: 10 }}>
            <Text style={styles.formLabel}>Locked Group</Text>
            <Text style={styles.formSubLabel}>
              Lock groups do not allow new members to join
            </Text>
          </View>
          <Switch
            value={isLocked}
            onValueChange={setIsLocked}
            trackColor={{ false: "#CCC", true: "#444" }}
            thumbColor="#FFF"
          />
        </View>
      </ScrollView>
    </View>
  );
};
