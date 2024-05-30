export const OPTION_ZOOM = Array.from({ length: 23 }, (_, index) => ({
    label: index.toString(),
    key: index.toString(),
}));


export const LATITUDE_REGEX = /^-?([0-8]?[0-9]|90)(\.[0-9]{1,16})?$/;
export const LONGITUDE_REGEX = /^-?((1[0-7][0-9])|([0-9]{1,2}))(\.[0-9]{1,16})?$/;
