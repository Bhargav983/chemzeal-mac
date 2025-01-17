import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import RIcons from 'react-native-remix-icon';
import styles from './TopNavBarStyles';
import { useNavigation } from '@react-navigation/native';
import { useDeviceContext } from '../../context/DeviceContext';
import { useEllipsisOptions } from '../../context/EllipsisContext';
import { useOptionsContext } from '../../context/OptionsContext';
import EllipsisOptionsMenu from './EllipsisOptionsMenu';
import DeviceOptionsModal from './DeviceOptionsModal';

const TopNavBar = ({ email, phone }) => {
  const navigation = useNavigation();
  const { selectedDevice, updateSelectedDevice } = useDeviceContext();
  const { showEllipsisOptions, toggleEllipsisOptions, hideEllipsisOptions } = useEllipsisOptions();
  const { showOptions, toggleOptions, hideOptions } = useOptionsContext();
  const [deviceDetails, setDeviceDetails] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [isFirstDevice, setIsFirstDevice] = useState(false);
  const [isProfileTypematching,setIsProfileTypeMatching] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://nimblevision.io/public/api/getUserDeviceIds?key=chinnu&token=257bbec888a81696529ee979804cca59&user_phone=${phone}&user_email=${email}`);
        let data = await response.json();
       
        console.log("data nav ", data.length);
        if (data && data.msg) {
          console.log("No data found:", data.msg);
          setIsProfileTypeMatching(true);
        return ;
        }
        else{
          data = data.filter(device => device.profile_type === 3);
        }
        if (data && data.length > 0 && data.msg!== "No data user phone and user email.") {
          const firstDevice = data[0];
          data = data.filter(device => device.profile_type === 3);
          setDeviceDetails(data);
          
          if (!isFirstDevice) {
            setSelectedOption(firstDevice.device_name); 
            updateSelectedDevice(firstDevice);
            setIsFirstDevice(true);
          }
        }
        else{
          console.log("here ")
          setIsProfileTypeMatching(true);
        }



      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [email, phone, updateSelectedDevice]);

  const handleOptionSelect = (option) => {
    updateSelectedDevice(option);
    setSelectedOption(option.device_name);
    hideOptions();
  };

  const navigateAndCloseDropdown = (screenName) => {
    navigation.navigate(screenName, { email, phone });
    hideEllipsisOptions();
  };

  // if (isProfileTypematching) {
  //   return (
  //     <View style={{ flex: 1,
  //       justifyContent: 'center',
  //       alignItems: 'center'}}>
  //       <Text>No Profile Matching</Text>
  //     </View>
  //   );
  // }
  
  return (
    <TouchableWithoutFeedback onPress={hideEllipsisOptions}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}> {'        '}Chemzeal</Text>
          <TouchableOpacity onPress={toggleOptions}>
            <RIcons name="ri-arrow-drop-down-fill" size={44} color="white" style={styles.dropdownIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleEllipsisOptions} style={styles.ellipsisIconContainer}>
            <RIcons name="ri-more-2-fill" size={30} color="white" />
          </TouchableOpacity>

        </View>

        <DeviceOptionsModal
          isVisible={showOptions}
          onHide={hideOptions}
          deviceDetails={deviceDetails}
          onSelectDevice={handleOptionSelect}
          selectedOption={selectedOption}
        />

        {showEllipsisOptions && (
          <EllipsisOptionsMenu navigateAndCloseDropdown={navigateAndCloseDropdown} />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default TopNavBar;
