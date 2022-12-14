import Device from './device';

export class ExampleDeviceExtension {
  getInfo() {
    return {
      name: 'UDP_TCP',
      blocks: [
        {
          opcode: 'sendMsg',
          func: 'sendMsg',
          blockType: self.UCode.BlockType.REPORTER,
          text: '基于TCP发送消息 [TEXT]，并等待接收',
          arguments: {
            TEXT: {
              type: self.UCode.ArgumentType.STRING,
              defaultValue: '',
            },
          },
        },
      ],
    };
  }

  sendMsg(args: { TEXT: string }, util: { targetId: string }) {
    const text = args.TEXT;
    const device = Device.getInstance(util.targetId);
    return device.send(text);
  }
}
