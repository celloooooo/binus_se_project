import {
  ArrowLeft,
  BellOff,
  Camera,
  ChevronDown,
  ChevronRight,
  FileText,
  Flame,
  Image as ImageIcon,
  MapPin,
  MessageCircleOff,
  Plus
} from "lucide-react-native";
import React from "react";
import {
  Alert,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "./styles";

interface MiscProps {
  setScreen: (screen: string) => void;

  // Post states
  postCaption: string;
  setPostCaption: (text: string) => void;
  disableComments: boolean;
  setDisableComments: (val: boolean) => void;

  // Event states
  boostEvent: boolean;
  setBoostEvent: (val: boolean) => void;

  handleCreatePost?: () => void;
}

export const InboxScreen = ({
  setScreen,
}: {
  setScreen: (s: string) => void;
}) => (
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

export const NotificationScreen = ({
  setScreen,
}: {
  setScreen: (s: string) => void;
}) => (
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

export const CreatePostScreen = ({
  setScreen,
  postCaption,
  setPostCaption,
  disableComments,
  setDisableComments,
  handleCreatePost,
}: MiscProps) => {
  return (
    <View style={styles.whiteContainer}>
      <View style={[styles.topPageHeader, { paddingBottom: 15 }]}>
        <TouchableOpacity
          onPress={() => setScreen("addPost")}
          style={{ width: 60 }}
        >
          <ArrowLeft size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.topPageTitle}>New Post</Text>
        <TouchableOpacity
          style={{
            width: 60,
            alignItems: "flex-end",
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
          onPress={handleCreatePost}
        >
          <Text style={{ color: "#2196F3", fontSize: 16, fontWeight: "600" }}>
            Create{" "}
          </Text>
          <ChevronRight size={18} color="#2196F3" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.captionHeaderRow}>
          <Text
            style={[styles.formLabel, { color: "#888", fontWeight: "500" }]}
          >
            Caption
          </Text>
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
            <Text style={styles.formSubLabel}>
              Disable comments on this post
            </Text>
          </View>
          <Switch
            value={disableComments}
            onValueChange={setDisableComments}
            trackColor={{ false: "#CCC", true: "#444" }}
            thumbColor="#FFF"
          />
        </View>
      </ScrollView>

      <View style={styles.postBottomToolbar}>
        <View style={styles.toolbarHandle} />
        <View style={styles.toolbarIconRow}>
          <TouchableOpacity>
            <Camera size={28} color="#2E7D32" />
          </TouchableOpacity>
          <TouchableOpacity>
            <ImageIcon size={28} color="#D32F2F" />
          </TouchableOpacity>
          <TouchableOpacity>
            <FileText size={28} color="#F57C00" />
          </TouchableOpacity>
          <TouchableOpacity>
            <MapPin size={28} color="#1565C0" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export const CreateEventScreen = ({
  setScreen,
  boostEvent,
  setBoostEvent,
  handleCreateEvent,
}: Partial<MiscProps> & {
  setScreen: (s: string) => void;
  handleCreateEvent?: (data: any) => void;
}) => {
  const [eventName, setEventName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [eventUrl, setEventUrl] = React.useState("");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [eventType, setEventType] = React.useState("");
  const [categories, setCategories] = React.useState("");
  const [showStartPicker, setShowStartPicker] = React.useState(false);
  const [showEndPicker, setShowEndPicker] = React.useState(false);
  const [showTypePicker, setShowTypePicker] = React.useState(false);
  const [showCatPicker, setShowCatPicker] = React.useState(false);

  const eventTypes = [
    "Cars & Coffee",
    "Track Day",
    "Car Show",
    "Cruise",
    "Rally",
    "Other",
  ];
  const categoryOptions = [
    "JDM",
    "American Muscle",
    "European",
    "Off-Road",
    "Classic",
    "Electric",
    "Drift",
    "Racing",
  ];

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
          onPress={() => setScreen("addPost")}
          style={{ width: 50 }}
        >
          <ArrowLeft size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.topPageTitle}>Create Event</Text>
        <TouchableOpacity
          style={{
            width: 50,
            alignItems: "flex-end",
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
          onPress={() => {
            if (!eventName.trim()) {
              Alert.alert("❌ Error", "Event name is required");
              return;
            }
            handleCreateEvent?.({
              name: eventName,
              description,
              location,
              startDate,
              endDate,
              eventType,
              categories,
              eventUrl,
            });
          }}
        >
          <Text style={{ color: "#2196F3", fontSize: 16, fontWeight: "600" }}>
            Save{" "}
          </Text>
          <ChevronRight size={18} color="#2196F3" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.coverPhotoPlaceholder}>
          <ImageIcon size={40} color="#999" />
        </View>
        <TouchableOpacity>
          <Text style={styles.addPictureText}>Add Picture</Text>
        </TouchableOpacity>

        <Text style={[styles.formLabel, { marginTop: 25 }]}>Event Name</Text>
        <TextInput
          style={styles.formInput}
          placeholder="Cars & Coffee"
          placeholderTextColor="#999"
          value={eventName}
          onChangeText={setEventName}
        />

        <Text style={[styles.formLabel, { marginTop: 20 }]}>Start Date</Text>
        <TextInput
          style={styles.formInput}
          placeholder="YYYY-MM-DD"
          placeholderTextColor="#999"
          value={startDate}
          onChangeText={setStartDate}
        />

        <Text style={[styles.formLabel, { marginTop: 20 }]}>End Date</Text>
        <TextInput
          style={styles.formInput}
          placeholder="YYYY-MM-DD"
          placeholderTextColor="#999"
          value={endDate}
          onChangeText={setEndDate}
        />

        <Text style={[styles.formLabel, { marginTop: 20 }]}>Event Type</Text>
        <TouchableOpacity
          style={[
            styles.formInput,
            {
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            },
          ]}
          onPress={() => setShowTypePicker(!showTypePicker)}
        >
          <Text style={{ color: eventType ? "black" : "#888", fontSize: 16 }}>
            {eventType || "Select"}
          </Text>
          <ChevronDown size={20} color="#888" />
        </TouchableOpacity>
        {showTypePicker && (
          <View
            style={{
              borderWidth: 1,
              borderColor: "#EEE",
              borderRadius: 10,
              marginTop: 5,
            }}
          >
            {eventTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={{
                  padding: 14,
                  borderBottomWidth: 1,
                  borderBottomColor: "#EEE",
                }}
                onPress={() => {
                  setEventType(type);
                  setShowTypePicker(false);
                }}
              >
                <Text style={{ fontSize: 15 }}>{type}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={[styles.formLabel, { marginTop: 20 }]}>
          Event Location
        </Text>
        <TextInput
          style={styles.formInput}
          placeholder="Enter location"
          placeholderTextColor="#999"
          value={location}
          onChangeText={setLocation}
        />

        <Text style={[styles.formLabel, { marginTop: 20 }]}>Categories</Text>
        <TouchableOpacity
          style={[
            styles.formInput,
            {
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            },
          ]}
          onPress={() => setShowCatPicker(!showCatPicker)}
        >
          <Text
            style={{ color: categories ? "black" : "#888", fontSize: 16 }}
            numberOfLines={1}
          >
            {categories || "Select some event categories"}
          </Text>
          <ChevronDown size={20} color="#888" />
        </TouchableOpacity>
        {showCatPicker && (
          <View
            style={{
              borderWidth: 1,
              borderColor: "#EEE",
              borderRadius: 10,
              marginTop: 5,
            }}
          >
            {categoryOptions.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={{
                  padding: 14,
                  borderBottomWidth: 1,
                  borderBottomColor: "#EEE",
                }}
                onPress={() => {
                  setCategories(cat);
                  setShowCatPicker(false);
                }}
              >
                <Text style={{ fontSize: 15 }}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={[styles.formLabel, { marginTop: 20 }]}>Description</Text>
        <TextInput
          style={[
            styles.formInput,
            { height: 120, textAlignVertical: "top", paddingTop: 15 },
          ]}
          multiline
          maxLength={1000}
          value={description}
          onChangeText={setDescription}
        />

        <Text style={[styles.formLabel, { marginTop: 20 }]}>Event URL</Text>
        <TextInput
          style={styles.formInput}
          placeholder="https://www.drivnbye.com"
          placeholderTextColor="#999"
          value={eventUrl}
          onChangeText={setEventUrl}
        />

        <View style={styles.boostEventContainer}>
          <View style={{ flex: 1, paddingRight: 10 }}>
            <Text style={styles.boostEventTitle}>Boost Event</Text>
            <Text style={styles.boostEventSub}>
              Boosting your event will increase its visibility
            </Text>
          </View>
          <Switch
            value={boostEvent ?? false}
            onValueChange={setBoostEvent}
            trackColor={{ false: "#CCC", true: "#444" }}
            thumbColor="#FFF"
          />
        </View>
      </ScrollView>
    </View>
  );
};
