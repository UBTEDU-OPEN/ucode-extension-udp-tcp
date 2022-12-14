/*
 * @Description:
 * @Create by:  bright.lin@ubtrobot.com
 * @LastEditors: Bright Lin
 * @LastEditTime: 2022-04-14 10:38:34
 */
import { ExtensionUI } from '@ubtech/ucode-extension-common-sdk';
import { MyTCPClientConnection } from './devices/udp-tcp-devices';

const { Toast } = ExtensionUI;

/**
 * 硬件设备示例
 */
class Device {
  /**
   * 当前硬件角色id
   */
  targetId: string;

  /**
   * 连接的设备实例
   */
  device?: any;

  /**
   * 当前类单例
   */
  static mInstance: Device;

  private constructor(targetId: string) {
    this.targetId = targetId;
  }

  /**
   * 做成单例模式
   * @param {*} targetId
   * @returns
   */
  public static getInstance(targetId: string) {
    if (!this.mInstance) {
      this.mInstance = new Device(targetId);
    }
    return this.mInstance;
  }

  /**
   * 获取设备通信对象
   * @param {*} needToast
   * @returns
   */
  public getDevice(needToast = true) {
    // eslint-disable-next-line no-undef
    const device = self.UCode.extensions.getDevice(this.targetId);
    if (!device?.isConnected() && needToast) {
      Toast('您还没连接Device设备！');
      return undefined;
    }
    if (!this.device) {
      this.device = device;
      this.device.onData(this.onReceiveMsg.bind(this));
    }
    return device;
  }

  /**
   * 连接成功后，可以获取到device
   * @param {*} needToast
   * @returns
   */
  public isConnected(needToast = true) {
    return this.getDevice(needToast)?.isConnected();
  }

  /**
   * 一问一答型通信方式
   * @param {*} message
   * @param {*} timeout
   * @returns
   */
  public send(message: string, timeout = 3000) {
    return new Promise((resolve, reject) => {
      // 获取已连接设备
      const device = this.getDevice() as MyTCPClientConnection;
      if (device) {
        // 监听数据返回事件
        const { dispose } = device.onData((data: Buffer | string) => {
          const msg = Buffer.from(data).toString();
          console.log('received:', msg);
          if (timeoutDispose) {
            clearTimeout(timeoutDispose);
          }
          // 销毁监听器，避免重复设置
          dispose();
          resolve(msg);
        });
        // 设置通信超时
        const timeoutDispose = setTimeout(() => {
          dispose();
          reject(new Error('timeout'));
        }, timeout);
        // TCP发送数据
        device.write(message);
      } else {
        resolve('');
      }
    });
  }

  /**
   * 监听数据，可接收一问一答数据，也可接收自动上报的数据
   * @param {*} data
   */
  public onReceiveMsg(data: Buffer | string) {
    console.log('received:', Buffer.from(data).toString());
  }
}

export default Device;
