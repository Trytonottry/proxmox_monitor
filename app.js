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

// Компоненты экранов
const DashboardScreen = () => {
  const [cpuUsage, setCpuUsage] = useState(42);
  const [ramUsage, setRamUsage] = useState(68);
  const [vmStatus, setVmStatus] = useState([
    { id: 101, name: 'Веб-сервер', status: 'running', cpu: 25, ram: 2048 },
    { id: 102, name: 'База данных', status: 'running', cpu: 17, ram: 4096 },
    { id: 103, name: 'Тестовый сервер', status: 'stopped', cpu: 0, ram: 0 }
  ]);
  const [disks, setDisks] = useState([
    { name: 'sda', size: '1.2 TB', used: '540 GB', health: 'хорошее' },
    { name: 'sdb', size: '1.2 TB', used: '890 GB', health: 'хорошее' },
    { name: 'sdc', size: '1.2 TB', used: '350 GB', health: 'хорошее' }
  ]);
  
  // Имитация получения данных с сервера
  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(Math.floor(Math.random() * 20) + 30);
      setRamUsage(Math.floor(Math.random() * 15) + 60);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  
  const handleVmAction = (id, action) => {
    setVmStatus(vmStatus.map(vm => {
      if (vm.id === id) {
        if (action === 'start') {
          return {...vm, status: 'running', cpu: Math.floor(Math.random() * 30) + 10};
        } else if (action === 'stop') {
          return {...vm, status: 'stopped', cpu: 0};
        } else if (action === 'restart') {
          return {...vm, status: 'restarting', cpu: 5};
        }
      }
      return vm;
    }));
    
    // Имитация задержки для перезагрузки
    if (action === 'restart') {
      setTimeout(() => {
        setVmStatus(vmStatus.map(vm => {
          if (vm.id === id) {
            return {...vm, status: 'running', cpu: Math.floor(Math.random() * 30) + 10};
          }
          return vm;
        }));
      }, 3000);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Карточки состояния */}
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

const NotificationsScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Уведомления</Text>
        
        <View style={[styles.notification, styles.successNotification]}>
          <Text style={styles.notificationTitle}>Проверка системы выполнена</Text>
          <Text style={styles.notificationTime}>Сегодня, 09:00</Text>
          <Text style={styles.notificationText}>Все системы работают нормально.</Text>
        </View>
        
        <View style={[styles.notification, styles.warningNotification]}>
          <Text style={styles.notificationTitle}>Высокая нагрузка CPU</Text>
          <Text style={styles.notificationTime}>Вчера, 15:42</Text>
          <Text style={styles.notificationText}>Процессор был нагружен более чем на 80% в течение 15 минут.</Text>
        </View>
        
        <View style={[styles.notification, styles.infoNotification]}>
          <Text style={styles.notificationTitle}>Обновление системы доступно</Text>
          <Text style={styles.notificationTime}>08/04/2025, 10:15</Text>
          <Text style={styles.notificationText}>Доступно обновление Proxmox VE 8.1-2.</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const SettingsScreen = () => {
  const [serverUrl, setServerUrl] = useState('https://192.168.1.100:8006');
  const [updateInterval, setUpdateInterval] = useState('5');
  const [dailyReports, setDailyReports] = useState(true);
  const [loadWarnings, setLoadWarnings] = useState(true);
  const [diskAlerts, setDiskAlerts] = useState(true);

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
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Интервал обновления (сек)</Text>
          <TextInput 
            style={styles.input} 
            value={updateInterval} 
            onChangeText={setUpdateInterval}
            keyboardType="numeric"
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Уведомления</Text>
          
          <View style={styles.switchRow}>
            <Switch
              value={dailyReports}
              onValueChange={setDailyReports}
              trackColor={{ false: "#d1d5db", true: "#bfdbfe" }}
              thumbColor={dailyReports ? "#2563eb" : "#f4f4f5"}
            />
            <Text style={styles.switchLabel}>Ежедневные отчеты</Text>
          </View>
          
          <View style={styles.switchRow}>
            <Switch
              value={loadWarnings}
              onValueChange={setLoadWarnings}
              trackColor={{ false: "#d1d5db", true: "#bfdbfe" }}
              thumbColor={loadWarnings ? "#2563eb" : "#f4f4f5"}
            />
            <Text style={styles.switchLabel}>Предупреждения о высокой нагрузке</Text>
          </View>
          
          <View style={styles.switchRow}>
            <Switch
              value={diskAlerts}
              onValueChange={setDiskAlerts}
              trackColor={{ false: "#d1d5db", true: "#bfdbfe" }}
              thumbColor={diskAlerts ? "#2563eb" : "#f4f4f5"}
            />
            <Text style={styles.switchLabel}>Уведомления о состоянии дисков</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Сохранить настройки</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Создание навигации
const Tab = createBottomTabNavigator();

const App = () => {
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
              
              if (route.name === 'Dashboard') {
                iconName = 'view-dashboard';
              } else if (route.name === 'Уведомления') {
                iconName = 'bell';
              } else if (route.name === 'Настройки') {
                iconName = 'cog';
              }
              
              return <Icon name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#2563eb',
            tabBarInactiveTintColor: '#6b7280',
          })}
        >
          <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Обзор' }} />
          <Tab.Screen name="Уведомления" component={NotificationsScreen} />
          <Tab.Screen name="Настройки" component={SettingsScreen} />
        </Tab.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
};

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