import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { Home as HomeIcon, Search, Plus, Users2, User as UserIcon } from 'lucide-react-native';
import { styles } from './styles';

interface BottomBarProps {
  active: string;
  setScreen: (screen: string) => void;
  currentUser: any;
}

export const BottomBar = ({ active, setScreen, currentUser }: BottomBarProps) => (
  <View style={styles.tabBar}>
    <TouchableOpacity onPress={() => setScreen('home')}>
      <HomeIcon size={26} color={active === 'home' ? '#2196F3' : 'black'} />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => setScreen('searchMain')}>
      <Search size={26} color={active === 'search' ? '#2196F3' : 'black'} />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => setScreen('addPost')}>
      <Plus size={26} color={active === 'plus' ? '#2196F3' : 'black'} />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => setScreen('groups')}>
      <Users2 size={26} color={active === 'groups' ? '#2196F3' : 'black'} />
    </TouchableOpacity>
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
