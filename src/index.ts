import { UCodeLinkAPI, CommonProtocols } from '@ubtech/ucode-extension-common-sdk';
import type { UCodeExternalHardwareDefinition } from '@ubtech/ucode-extension-common-sdk/types';
import { ExampleDeviceExtension } from './block';
import { tcpRegister, getTCPUDPDeviceType } from './devices/udp-tcp-devices';
import firmwareInfoIcon from './images/ic-firmware-info.svg';
import updateFirmwareIcon from './images/ic-update-firmware.svg';

const { injectRpcClient } = UCodeLinkAPI;
// const { SerialPortDeviceType } = CommonProtocols.SerialPort;
// const { WebBleDeviceType, UCodeBleDeviceType } = CommonProtocols.BLE;
// const { mDNSDeviceType } = CommonProtocols.MDNS;
// const { UDPDeviceType } = CommonProtocols.UDP;
// const { AutoTCPDeviceType } = CommonProtocols.TCP;

console.log('初始化硬件插件', 'udp-tcp');

injectRpcClient();

const register: UCodeExternalHardwareDefinition.ExtensionRegister = {
  DeviceRegister: [tcpRegister, tcpRegister],
  BlockRegister: ExampleDeviceExtension,
  SettingMenuRegister: {
    FIRMWARE_VERSION: {
      type: 'callback',
      name: '查看固件版本',
      icon: firmwareInfoIcon,
      availableDeviceTypes: [getTCPUDPDeviceType()],
      callback: (util: { targetId: string }) => {
        console.log('查看固件信息');
      },
    },
    UPDATE_FIRMWARE: {
      type: 'callback',
      name: '升级固件',
      icon: updateFirmwareIcon,
      availableWorkingModes: ['upload'],
      availableDeviceTypes: [getTCPUDPDeviceType()],
      callback: (util: { targetId: string }) => {
        console.log('升级固件');
      },
    },
  },
};

/**
 * 调用 Worker 全局变量 self.UCode 注册
 */
self.UCode.extensions.register(register);
