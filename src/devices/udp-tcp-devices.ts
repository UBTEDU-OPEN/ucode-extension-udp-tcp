/*
 * @Description: 通信、连接类
 * @Create by:  bright.lin@ubtrobot.com
 * @LastEditors: bright.lin
 * @LastEditTime: 2022-04-29 12:36:22
 */
import { CommonProtocols } from '@ubtech/ucode-extension-common-sdk';
import type {
  HardwareDeviceConstructorArgumentType,
  DiscoverDeviceType,
  IDiscoverDevice,
} from '@ubtech/ucode-extension-common-sdk/types';

const { TCPClientConnection, getTCPDeviceRegister } = CommonProtocols.TCP;
const { UDPSocketType, UDPDiscover, getUDPDeviceType } = CommonProtocols.UDP;
const scanTimeTimeout = 20; // 扫描超时20秒

export class MyTCPClientConnection extends TCPClientConnection {
  constructor(args: HardwareDeviceConstructorArgumentType) {
    super(args);
  }

  /**
   * 实现抽象类获取设备信息的方法
   * @param { {buffer: Buffer, port: number, address: string} } device discover传过来的设备对象
   * @return Promise<SocketConnectOpts = {
   * port: number;
   * host?: string;
   * localAddress?: string;
   * localPort?: number;
   * hints?: number;
   * family?: number;
   * lookup?: LookupFunction;
   * onread?: OnReadOpts;
   * path?: string;
   * } TCP连接时用的设备信息
   */
  getDeviceInfo(device: IDiscoverDevice) {
    const { buffer } = device.data;
    const data = JSON.parse(Buffer.from(buffer).toString());
    console.log(data.port, data.address);
    return {
      port: data.port,
      host: data.address,
    };
  }
}

function isRunInMobile() {
  return (
    navigator.userAgent.indexOf('Android') !== -1 ||
    (typeof navigator !== 'undefined' &&
      navigator.platform === 'MacIntel' &&
      typeof navigator.maxTouchPoints === 'number' &&
      navigator.maxTouchPoints > 1 &&
      typeof (globalThis as any).MSStream === 'undefined')
  );
}

export function getTCPUDPDeviceType(): DiscoverDeviceType {
  return {
    connectType: 'discover',
    id: 'udp-tcp',
    name: 'Wi-Fi',
    scanTime: scanTimeTimeout,
    needUcodelink: !isRunInMobile(),
  };
}

type DeviceInfoType = {
  buffer: Buffer;
  port: number;
  address: string;
};

/**
 * UDP搜索+TCP通信
 */
export const tcpRegister = getTCPDeviceRegister({
  Discover: UDPDiscover, // 设置搜索器
  DeviceConnection: MyTCPClientConnection, // 设置通信器
  Options: {
    // 设置搜索器、连接器用到的配置参数
    discoverDeviceType: getTCPUDPDeviceType(), // 搜索器类型（搜索、输入ID/IP、自行处理）
    discoverOptions: {
      // 搜索器配置
      // udpConstructorOptions: UDPConstructorOptions | UDPSocketType; // https://nodejs.org/dist/latest-v16.x/docs/api/dgram.html#dgramcreatesocketoptions-callback
      // sendMsgForDiscover?: UDPMsg; // 发消息来触发设备回应？
      // sendMsgForResponse?: UDPMsg; // 收到消息后，发送一条固定的消息回应？
      // bindPort?: number; // 绑定端口
      // bindAddress?: string; // 绑定地址
      // sendPort?: number; // 往端口发数据
      // sendAddress?: string; // 往地址发数据
      // isBroadcast?: boolean; // 开启广播？
      // multicastLoopback?: boolean; // 广播自己也能收到？
      // multicastInterface?: string;
      // customDeviceName?: (deviceData: DiscoverDeviceData) => string; // 自定义设备名，可以从socket数据中加工出新名字
      // ttl?: number;
      // multicastTTL?: number;
      // recvBufferSize?: number;
      // sendBufferSize?: number;
      // multicastAddress?: string;
      // scanTime?: number; // 扫描超时
      // queueOptions?: QueueConstructorType; // 队列参数，可以设置 队列 发送的 间隔 或者 数量
      udpConstructorOptions: UDPSocketType.udp4,
      sendMsgForResponse: Buffer.from('A'),
      bindPort: 65432,
      scanTime: scanTimeTimeout, // 扫描时长
      customDeviceName: (deviceData: DeviceInfoType) => {
        try {
          const { buffer, port, address } = deviceData;
          const device = JSON.parse(Buffer.from(buffer).toString());
          console.log(`Robot_${device.name} info: ${address}:${port}`);
          return `Robot_${device.name}`;
        } catch (error) {
          console.log(error);
        }
        return 'Robot';
      },
    },
    connectionOptions: {
      // 通信器配置
      // tcpConstructorOptions?: SocketConstructorOpts; // 创建TCP socket时，传给构造函数的参数
      // queueOptions?: QueueConstructorType; // 队列参数，可以设置 队列 发送的 间隔 或者 数量
      // encoding?: BufferEncoding; // 设置数据编码，也可以在write中设置
      // keepAlive?: { // 是否开启KeepAlive功能
      //   enable: true;
      //   initialDelay?: number;
      // };
      // noDelay?: boolean; // 是否开启拥塞控制算法
      // timeout?: number; // 设置inactive超时时长
      queueOptions: {
        enable: true,
        interval: 70, // 毫秒
      },
      keepAlive: {
        enable: true,
      },
      timeout: 30000, // 毫秒
    },
  },
});
