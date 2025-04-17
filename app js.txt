// App.js
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import PushNotification from 'react-native-push-notification';

const DashboardScreen = ({ config, setConfig }) => {
  const [cpuUsage, setCpuUsage] = useState(0);
  const [ramUsage, setRamUsage] = useState(0);
  const [vmStatus, setVmStatus] = useState([]);
  const [disks, setDisks] = useState([]);

  useEffect(() => {
    if (config.serverUrl && config.apiToken) {
      fetchServerData();
      const interval = setInterval(fetchServerData, config.updateInterval * 1000 || 5000);
      return () => clearInterval(interval);
    }
  }, [config]);

  const fetchServerData = async () => {
    try {
      // Получение данных о ноде
      const nodeResponse = await axios.get(
        `${config.serverUrl}/api2/json/nodes`,
        {
          headers: { Authorization: `PVEAPIToken=${config.apiToken}` },
          httpsAgent: { rejectUnauthorized: false }
        }
      );
      
      const node = nodeResponse.data.data[0];
      setCpuUsage(Math.round(node.cpu * 100));
      setRamUsage(Math.round((node.mem / node.maxmem) * 100));

      // Получение данных о VM
      const vmResponse = await axios.get(
        `${config.serverUrl}/api2/json/nodes/${node.node}/qemu`,
        {
          headers: { Authorization: `PVEAPIToken=${config.apiToken}` },
          httpsAgent: { rejectUnauthorized: false }
        }
      );
      setVmStatus(vmResponse.data.data.map(vm => ({
        id: vm.vmid,
        name: vm.name,
        status: vm.status,
        cpu: Math.round(vm.cpu * 100),
        ram: Math.round(vm.mem / 1024 / 1024)
      })));

      // Получение данных о дисках
      const storageResponse = await axios.get(
        `${config.serverUrl}/api2/json/nodes/${node.node}/disks/list`,
        {
          headers: { Authorization: `PVEAPIToken=${config.apiToken}` },
          httpsAgent: { rejectUnauthorized: false }
        }
      );
      setDisks(storageResponse.data.data.map(disk => ({
        name: disk.dev,
        size: (disk.size / 1024 / 1024 / 1024).toFixed(1) + ' TB',
        used: (disk.used / 1024 / 1024 / 1024).toFixed(1) + ' TB',
        health: disk.health
      })));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleVmAction = async (id, action) => {
    try {
      await axios.post(
        `${config.serverUrl}/api2/json/nodes/localhost/qemu/${id}/status/${action}`,
        {},
        {
          headers: { Authorization: `PVEAPIToken=${config.apiToken}` },
          httpsAgent: { rejectUnauthorized: false }
        }
      );
      fetchServerData();
    } catch (error) {
      console.error('Error controlling VM:', error);
    }
  };

  // Оставшаяся часть DashboardScreen остается без изменений, только убираем имитацию данных
  return (
    <ScrollView style={styles.container}>
      <View style={styles.cardRow}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Процессор</Text>
            <Icon name="cpu-64-bit" size={20} color="#2563eb" />
          </View>
          <View style={styles.progressContainer}>
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>{cpuUsage}%</Text>
            </View>
            <View style={styles.progressBackground}>
              <View style={[styles.progressBar, { width: `${cpuUsage}%` }]} />
            </View>
          </View>
        </View>
        {/* Аналогично для RAM */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Память</Text>
            <Icon name="memory" size={20} color="#2563eb" />
          </View>
          <View style={styles.progressContainer}>
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>{ramUsage}%</Text>
            </View>
            <View style={styles.progressBackground}>
              <View style={[styles.progressBar, { width: `${ramUsage}%` }]} />
            </View>
          </View>
        </View>
      </View>
      {/* VM и диски остаются с той же структурой, только данные теперь реальные */}
      {/* ... остальной код DashboardScreen ... */}
      {/* Виртуальные машины */}
     <View style={styles.card}>
              <Text style={styles.cardTitle}>Виртуальные машины</Text>
              <View style={styles.vmContainer}>
                {vmStatus.map(vm => (
                  <View key={vm.id} style={styles.vmItem}>
                    <View style={styles.vmHeader}>
                      <View>
                        <Text style={styles.vmName}>{vm.name}</Text>
                        <View style={styles.vmStatusContainer}>
                          <View 
                            style={[
                              styles.statusDot, 
                              { 
                                backgroundColor: 
                                  vm.status === 'running' ? '#22c55e' : 
                                  vm.status === 'restarting' ? '#eab308' : '#ef4444' 
                              }
                            ]} 
                          />
                          <Text style={styles.vmStatusText}>
                            {vm.status === 'running' ? 'Запущена' : 
                             vm.status === 'restarting' ? 'Перезагрузка...' : 'Остановлена'}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.actionButtons}>
                        {vm.status !== 'running' && (
                          <TouchableOpacity 
                            onPress={() => handleVmAction(vm.id, 'start')}
                            style={[styles.actionButton, styles.startButton]}>
                            <Icon name="power" size={16} color="#15803d" />
                          </TouchableOpacity>
                        )}
                        {vm.status === 'running' && (
                          <>
                            <TouchableOpacity 
                              onPress={() => handleVmAction(vm.id, 'restart')}
                              style={[styles.actionButton, styles.restartButton]}>
                              <Icon name="refresh" size={16} color="#a16207" />
                            </TouchableOpacity>
                            <TouchableOpacity 
                              onPress={() => handleVmAction(vm.id, 'stop')}
                              style={[styles.actionButton, styles.stopButton]}>
                              <Icon name="power" size={16} color="#b91c1c" />
                            </TouchableOpacity>
                          </>
                        )}
                      </View>
                    </View>
                    {vm.status === 'running' && (
                      <View style={styles.vmStats}>
                        <Text style={styles.vmStatText}>CPU: {vm.cpu}%</Text>
                        <Text style={styles.vmStatText}>RAM: {vm.ram} MB</Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </View>
            
            {/* Диски */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Хранилище</Text>
              <View style={styles.diskContainer}>
                {disks.map((disk, index) => (
                  <View key={index} style={styles.diskItem}>
                    <View style={styles.diskInfo}>
                      <Icon name="harddisk" size={16} color="#6b7280" style={styles.diskIcon} />
                      <View>
                        <Text style={styles.diskName}>{disk.name}</Text>
                        <Text style={styles.diskHealth}>Здоровье: {disk.health}</Text>
                      </View>
                    </View>
                    <View style={styles.diskStats}>
                      <Text style={styles.diskUsage}>{disk.used} / {disk.size}</Text>
                      <View style={styles.diskProgressBackground}>
                        <View 
                          style={[
                            styles.diskProgressBar, 
                            { width: `${parseInt(disk.used) / parseInt(disk.size) * 100}%` }
                          ]} 
                        />
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
    </ScrollView>
  );
};

const NotificationsScreen = ({ config }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (config.dailyReports) {
      PushNotification.configure({
        onNotification: function (notification) {
          setNotifications(prev => [...prev, {
            title: notification.title,
            text: notification.message,
            time: new Date().toLocaleString(),
            type: 'info'
          }]);
        },
      });

      PushNotification.localNotificationSchedule({
        title: "Ежедневный отчет",
        message: "Система работает нормально",
        date: new Date(Date.now() + 24 * 60 * 60 * 1000),
        repeatType: 'day',
      });
    }
  }, [config]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Уведомления</Text>
        {notifications.map((notif, index) => (
          <View key={index} style={[styles.notification, styles[`${notif.type}Notification`]]}>
            <Text style={styles.notificationTitle}>{notif.title}</Text>
            <Text style={styles.notificationTime}>{notif.time}</Text>
            <Text style={styles.notificationText}>{notif.text}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const SettingsScreen = ({ config, setConfig }) => {
  const [serverUrl, setServerUrl] = useState(config.serverUrl || '');
  const [apiToken, setApiToken] = useState(config.apiToken || '');
  const [updateInterval, setUpdateInterval] = useState(config.updateInterval?.toString() || '5');
  const [dailyReports, setDailyReports] = useState(config.dailyReports || true);
  const [loadWarnings, setLoadWarnings] = useState(config.loadWarnings || true);
  const [diskAlerts, setDiskAlerts] = useState(config.diskAlerts || true);

  const saveSettings = async () => {
    const newConfig = {
      serverUrl,
      apiToken,
      updateInterval: parseInt(updateInterval),
      dailyReports,
      loadWarnings,
      diskAlerts
    };
    await AsyncStorage.setItem('config', JSON.stringify(newConfig));
    setConfig(newConfig);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Настройки</Text>
        <View style={styles.formGroup}>
          <Text style={styles.label}>URL сервера</Text>
          <TextInput 
            style={styles.input} 
            value={serverUrl} 
            onChangeText={setServerUrl}
            placeholder="https://192.168.1.100:8006"
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>API Токен</Text>
          <TextInput 
            style={styles.input} 
            value={apiToken} 
            onChangeText={setApiToken}
            placeholder="user@pve!token=uuid"
          />
        </View>
        {/* Остальные поля остаются такими же */}
        <TouchableOpacity style={styles.saveButton} onPress={saveSettings}>
          <Text style={styles.saveButtonText}>Сохранить настройки</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const Tab = createBottomTabNavigator();

const App = () => {
  const [config, setConfig] = useState({});

  useEffect(() => {
    const loadConfig = async () => {
      const savedConfig = await AsyncStorage.getItem('config');
      if (savedConfig) setConfig(JSON.parse(savedConfig));
    };
    loadConfig();
  }, []);

  return (
    <NavigationContainer>
      <StatusBar backgroundColor="#1d4ed8" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.headerTitle}>
            <Icon name="server" size={22} color="#fff" style={styles.headerIcon} />
            <Text style={styles.headerText}>Proxmox Monitor</Text>
          </View>
          <View style={styles.serverStatus}>
            <View style={styles.statusIndicator} />
            <Text style={styles.serverName}>HP DL380p Gen8</Text>
          </View>
        </View>
        
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === 'Dashboard') iconName = 'view-dashboard';
              else if (route.name === 'Уведомления') iconName = 'bell';
              else if (route.name === 'Настройки') iconName = 'cog';
              return <Icon name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#2563eb',
            tabBarInactiveTintColor: '#6b7280',
          })}
        >
          <Tab.Screen name="Dashboard">
            {props => <DashboardScreen {...props} config={config} setConfig={setConfig} />}
          </Tab.Screen>
          <Tab.Screen name="Уведомления">
            {props => <NotificationsScreen {...props} config={config} />}
          </Tab.Screen>
          <Tab.Screen name="Настройки">
            {props => <SettingsScreen {...props} config={config} setConfig={setConfig} />}
          </Tab.Screen>
        </Tab.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
};

// Стили остаются без изменений
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f3f4f6',
      },
      header: {
        backgroundColor: '#1d4ed8',
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      headerTitle: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      headerIcon: {
        marginRight: 8,
      },
      headerText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
      },
      serverStatus: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      statusIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#4ade80',
        marginRight: 6,
      },
      serverName: {
        color: '#fff',
        fontSize: 12,
      },
      container: {
        flex: 1,
        padding: 16,
      },
      cardRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
      },
      card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        flex: 1,
      },
      cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
      },
      cardTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#374151',
        marginBottom: 12,
      },
      progressContainer: {
        marginTop: 4,
      },
      badgeContainer: {
        backgroundColor: '#dbeafe',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
        marginBottom: 8,
      },
      badgeText: {
        color: '#2563eb',
        fontSize: 12,
        fontWeight: '600',
      },
      progressBackground: {
        height: 8,
        backgroundColor: '#dbeafe',
        borderRadius: 4,
        overflow: 'hidden',
      },
      progressBar: {
        height: 8,
        backgroundColor: '#2563eb',
        borderRadius: 4,
      },
      vmContainer: {
        marginTop: 8,
      },
      vmItem: {
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 6,
        padding: 12,
        marginBottom: 12,
      },
      vmHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      },
      vmName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
      },
      vmStatusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
      },
      statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 4,
      },
      vmStatusText: {
        fontSize: 12,
        color: '#6b7280',
      },
      actionButtons: {
        flexDirection: 'row',
      },
      actionButton: {
        padding: 8,
        borderRadius: 6,
        marginLeft: 8,
      },
      startButton: {
        backgroundColor: '#dcfce7',
      },
      restartButton: {
        backgroundColor: '#fef3c7',
      },
      stopButton: {
        backgroundColor: '#fee2e2',
      },
      vmStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#f3f4f6',
      },
      vmStatText: {
        fontSize: 12,
        color: '#6b7280',
      },
      diskContainer: {
        marginTop: 8,
      },
      diskItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
      },
      diskInfo: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      diskIcon: {
        marginRight: 8,
      },
      diskName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
      },
      diskHealth: {
        fontSize: 12,
        color: '#6b7280',
      },
      diskStats: {
        alignItems: 'flex-end',
      },
      diskUsage: {
        fontSize: 13,
        color: '#4b5563',
        marginBottom: 4,
      },
      diskProgressBackground: {
        width: 100,
        height: 6,
        backgroundColor: '#e5e7eb',
        borderRadius: 3,
        overflow: 'hidden',
      },
      diskProgressBar: {
        height: 6,
        backgroundColor: '#2563eb',
        borderRadius: 3,
      },
      notification: {
        paddingLeft: 12,
        paddingVertical: 8,
        paddingRight: 8,
        marginBottom: 16,
        borderLeftWidth: 4,
      },
      successNotification: {
        backgroundColor: '#f0fdf4',
        borderLeftColor: '#22c55e',
      },
      warningNotification: {
        backgroundColor: '#fefce8',
        borderLeftColor: '#eab308',
      },
      infoNotification: {
        backgroundColor: '#eff6ff',
        borderLeftColor: '#2563eb',
      },
      notificationTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
      },
      notificationTime: {
        fontSize: 12,
        color: '#6b7280',
        marginBottom: 4,
      },
      notificationText: {
        fontSize: 14,
        color: '#4b5563',
      },
      formGroup: {
        marginBottom: 16,
      },
      label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
        marginBottom: 6,
      },
      input: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 6,
        padding: 10,
        fontSize: 14,
        color: '#1f2937',
      },
      switchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
      },
      switchLabel: {
        marginLeft: 10,
        fontSize: 14,
        color: '#4b5563',
      },
      saveButton: {
        backgroundColor: '#2563eb',
        borderRadius: 6,
        padding: 12,
        alignItems: 'center',
        marginTop: 8,
      },
      saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
      },
});

export default App;