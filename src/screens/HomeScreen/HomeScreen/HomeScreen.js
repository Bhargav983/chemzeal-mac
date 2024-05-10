import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import RIcon from 'react-native-remix-icon';
import styles from './HomeStyles';
import TopNavBar from '../../Navbar/TopNavBar';
import Live from '../LiveStatus/Live';
import Analysis from '../Analysis/Analysis';
import { useOptionsContext } from '../../../context/OptionsContext';
import { useEllipsisOptions } from '../../../context/EllipsisContext';
import { useUser } from '../../../context/userContext';

const BottomNavbar = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Live');
  const { hideOptions } = useOptionsContext();
  const { hideEllipsisOptions } = useEllipsisOptions();
  const { user } = useUser();

  const navigateToScreen = (screenName) => {
    setActiveTab(screenName);
    hideOptions();
    hideEllipsisOptions();
  };

  return (
    <>
      <TopNavBar email={user.email} phone={user.phone} />
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigateToScreen('Live')}
        >
          <RIcon
            name="ri-global-line"
            size={28}
            color={activeTab === 'Live' ? 'white' : 'black'}
          />
          <Text
            style={[
              styles.label,
              activeTab === 'Live' && { color: 'white' },
            ]}
          >
            LIVE 
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigateToScreen('Analysis')}
        >
          <RIcon
            name="ri-bar-chart-line"
            size={28}
            color={activeTab === 'Analysis' ? 'white' : 'black'}
          />
          <Text
            style={[
              styles.label,
              activeTab === 'Analysis' && { color: 'white' },
            ]}
          >
            Analysis
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'Live' && <Live />}
      {activeTab === 'Analysis' && <Analysis />}
    </>
  );
};

export default BottomNavbar;
