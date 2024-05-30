export interface IMapConfig {
    id?: number;
    latitude: string;
    longitude: string;
    zoom: string;
}

export interface IOverlay {
    id?: string;
    image: any;
    name: string
    description: string
    fileName: string
    dimensionWidth: string
    dimensionHeight: string
    topLeftLatitude: string
    topLeftLongitude: string
    topRightLatitude: string
    topRightLongitude: string
    bottomRightLatitude: string
    bottomRightLongitude: string
    bottomLeftLatitude: string
    bottomLeftLongitude: string
}

export interface IRobot {
    id?: string;
    name: string;
    marker: any;
    additionalData?: string;
    positionX: string;
    positionY: string;
    heading: string;
    order?: string;
    overlayId: string
}

export interface IRobotMarker {
    id: string
    additionalData?: string
    marker: string,
    name: string
    order?: number
    heading: number
    longitude: number
    latitude: number
}



export interface IMapData {
    id: string;
    url: string;
    coordinates: [[number, number], [number, number], [number, number], [number, number]];
    robots: IRobotMarker[]
}
