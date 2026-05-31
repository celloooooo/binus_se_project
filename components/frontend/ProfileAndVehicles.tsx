import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  PanResponder,
  Modal,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import {
  Camera,
  Ellipsis,
  ChevronDown,
  Wrench,
  Tag,
  User as UserIcon,
  Plus,
  Share2,
  Pencil,
  Trash2,
  Search,
  Check
} from 'lucide-react-native';
import { ScrewdriverWrenchIcon } from './ScrewdriverWrench';
import { BottomBar } from './BottomBar';
import { styles } from './styles';

interface ProfileScreenProps {
  setScreen: (screen: string) => void;
  currentUser: any;
  handleLogout: () => void;
  setVehicleBackScreen: (screen: string) => void;
}

export const ProfileScreen = ({
  setScreen,
  currentUser,
  handleLogout,
  setVehicleBackScreen
}: ProfileScreenProps) => {
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return Math.abs(gestureState.dx) > 40 && Math.abs(gestureState.dy) < 25;
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dx < -50 || gestureState.dx > 50) {
        setVehicleBackScreen('profile');
        setScreen('vehicles');
      }
    },
  });

  return (
    <View style={styles.whiteContainer} {...panResponder.panHandlers}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={styles.profileCoverWrapper}>
          <View style={[styles.profileCover, { backgroundColor: currentUser?.coverImage ? 'transparent' : '#F5F5F5' }]}>
            {!currentUser?.coverImage && (
              <View style={styles.emptyCoverOverlay}>
                <Camera size={40} color="#999" strokeWidth={2} />
                <Text style={styles.emptyCoverText}>Add Cover Photo</Text>
              </View>
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
          <View style={styles.ownedHeader}>
            <Text style={styles.ownedTitle}>Owned Vehicles</Text>
            <Text style={styles.ownedSub}>{currentUser?.cars?.length || 0} Vehicles</Text>
          </View>
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
                  <View style={styles.vehicleOverlay}>
                    <Text style={styles.vehicleName}>Akari</Text>
                    <Text style={styles.vehicleModel}>{car}</Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <TouchableOpacity style={[styles.showAllCard, styles.emptyVehicleCard]}>
                <Text style={styles.emptyVehicleText}>Add your first{'\n'}vehicle</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.showAllCard} onPress={() => setScreen('vehicles')}>
              <Text style={styles.showAllText}>Show All{'\n'}Vehicles</Text>
            </TouchableOpacity>
          </ScrollView>
          <TouchableOpacity style={styles.vehicleTab}><Text style={styles.vehicleTabText}>Vehicles</Text></TouchableOpacity>
          <Text style={styles.postTitle}>{currentUser?.firstName}'s Posts</Text>
        </View>
      </ScrollView>
      <BottomBar active="profile" setScreen={setScreen} currentUser={currentUser} />
    </View>
  );
};

interface VehiclesListScreenProps {
  setScreen: (screen: string) => void;
  currentUser: any;
  setVehicleBackScreen: (screen: string) => void;
}

export const VehiclesListScreen = ({
  setScreen,
  currentUser,
  setVehicleBackScreen
}: VehiclesListScreenProps) => {
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return Math.abs(gestureState.dx) > 40 && Math.abs(gestureState.dy) < 25;
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dx < -50 || gestureState.dx > 50) {
        setScreen('profile');
      }
    },
  });

  return (
    <View style={styles.whiteContainer} {...panResponder.panHandlers}>
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

interface VehicleDetailScreenProps {
  setScreen: (screen: string) => void;
  currentUser: any;
  vehicleBackScreen: string;
  modifications: any[];
  setModifications: React.Dispatch<React.SetStateAction<any[]>>;
  showVehicleMenu: boolean;
  setShowVehicleMenu: (val: boolean) => void;
}

export const VehicleDetailScreen = ({
  setScreen,
  currentUser,
  vehicleBackScreen,
  modifications,
  setModifications,
  showVehicleMenu,
  setShowVehicleMenu
}: VehicleDetailScreenProps) => {
  return (
    <View style={styles.whiteContainer}>
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
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1617531653520-4893f7bbf978?w=1200' }} 
          style={styles.detailMainImage} 
        />

        <View style={styles.detailContent}>
          <Text style={styles.detailVehicleNameQuote}>"Akari "</Text>
          <Text style={styles.detailVehicleModelName}>2010 Mazda Rx8</Text>

          <View style={styles.detailCardsList}>
            <View style={styles.detailItemCard}>
              <View style={styles.detailIconBox}>
                <Wrench size={20} color="#2196F3" />
              </View>
              <View style={styles.detailCardText}>
                <Text style={styles.detailCardLabel}>Trim</Text>
                <Text style={styles.detailCardValue}>GT</Text>
              </View>
            </View>

            <View style={styles.detailItemCard}>
              <View style={styles.detailIconBox}>
                <Tag size={20} color="#2196F3" />
              </View>
              <View style={styles.detailCardText}>
                <Text style={styles.detailCardLabel}>Color</Text>
                <Text style={styles.detailCardValue}>White</Text>
              </View>
            </View>

            <View style={styles.detailItemCard}>
              <View style={styles.detailIconBox}>
                <Wrench size={20} color="#2196F3" />
              </View>
              <View style={styles.detailCardText}>
                <Text style={styles.detailCardLabel}>Modifications</Text>
                <Text style={styles.detailCardValue}>{modifications.length} Modifications</Text>
              </View>
            </View>

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

          <Text style={styles.detailSectionTitle}>Description</Text>
          <Text style={styles.detailDescriptionText}>
            2010 Mazda Rx8 GT with Renesis Hybrid and a custom improved and reinforced Rx8 S2 Transmission with 10,5k rpm redline
          </Text>

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
                Alert.alert('Share Vehicle', 'Sharing option is coming soon!');
              }}
            >
              <Share2 size={24} color="#1E88E5" />
              <Text style={styles.vMenuText}>Share Vehicle</Text>
            </TouchableOpacity>

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
                        setModifications([]);
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

interface AddModificationScreenProps {
  setScreen: (screen: string) => void;
  onSaveModification: (mod: { name: string; description: string; link: string; classification: string }) => void;
}

export const AddModificationScreen = ({
  setScreen,
  onSaveModification
}: AddModificationScreenProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [classification, setClassification] = useState('Classification');
  
  const [showClassificationModal, setShowClassificationModal] = useState(false);
  const [catSearchQuery, setCatSearchQuery] = useState('');
  const [tempClassification, setTempClassification] = useState('Performance');

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('❌ Error', 'Nama modifikasi tidak boleh kosong!');
      return;
    }
    onSaveModification({
      name,
      description,
      link,
      classification: classification === 'Classification' ? 'Other' : classification
    });
    Alert.alert('✅ Berhasil', 'Modifikasi berhasil ditambahkan!');
  };

  const openClassificationModal = () => {
    setTempClassification(classification === 'Classification' ? 'Performance' : classification);
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
      <View style={styles.addModHeader}>
        <TouchableOpacity onPress={() => setScreen('vehicleDetail')} style={styles.addModHeaderLeft}>
          <ChevronDown size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.addModHeaderTitle}>Add Modification</Text>
        <TouchableOpacity 
          onPress={handleSave} 
          disabled={!name.trim()}
          style={styles.addModHeaderRight}
        >
          <Text style={[styles.addModSaveText, { color: name.trim() ? '#2196F3' : '#AAA' }]}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 50 }} showsVerticalScrollIndicator={false}>
        <Text style={styles.modFormLabel}>name</Text>
        <TextInput 
          style={styles.modFormInput} 
          value={name} 
          onChangeText={setName} 
          placeholder=""
          placeholderTextColor="#AAA"
        />

        <Text style={[styles.modFormLabel, { marginTop: 20 }]}>description</Text>
        <View style={{ position: 'relative' }}>
          <TextInput 
            style={[styles.modFormInput, { height: 120, textAlignVertical: 'top', paddingTop: 12, paddingRight: 45 }]} 
            multiline 
            maxLength={255} 
            value={description} 
            onChangeText={setDescription} 
            placeholder=""
            placeholderTextColor="#AAA"
          />
          <Text style={styles.modCharCounterInside}>{255 - description.length}</Text>
        </View>

        <Text style={[styles.modFormLabel, { marginTop: 20 }]}>Link</Text>
        <TextInput 
          style={styles.modFormInput} 
          value={link} 
          onChangeText={setLink} 
          placeholder=""
          placeholderTextColor="#AAA"
        />

        <Text style={[styles.modFormLabel, { marginTop: 20 }]}>Classification</Text>
        <TouchableOpacity 
          style={[styles.modFormInput, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]} 
          onPress={openClassificationModal}
        >
          <Text style={{ color: classification === 'Classification' ? '#888' : '#333', fontSize: 16 }}>{classification}</Text>
          <ChevronDown size={20} color="#888" />
        </TouchableOpacity>
      </ScrollView>

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
