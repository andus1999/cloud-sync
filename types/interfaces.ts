export interface DeviceInfo {
  hardware_id: string,
  name?: string,
  mac: string,
  networkId: string,
}


export interface Device {
  cloudState: any,
  localState: any,
  info: DeviceInfo,
}
