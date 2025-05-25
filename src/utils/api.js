const BASE_URL = "http://" + process.env.REACT_APP_GATEWAY + ":" + process.env.REACT_APP_GATEWAY_PORT + "/api";

export function buildGatewayUrl(path) {
    return BASE_URL + path;
}

export function buildPublicUrl(path) {
    return BASE_URL + "/public" + path;
}

export function buildSecureUrl(path) {
    return BASE_URL + "/secure" + path;
}