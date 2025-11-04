const BASE_URL = "http://" + process.env.REACT_APP_GATEWAY + ":" + process.env.REACT_APP_GATEWAY_PORT + "/api";

/**
 * @param {String} path 
 * Appends path to url:port/api
 * @returns {String}
 */
export function buildGatewayUrl(path) {
    return BASE_URL + path;
}

/**
 * @param {String} path 
 * Appends path to url:port/api/public
 * @returns {String}
 */
export function buildPublicUrl(path) {
    return BASE_URL + "/public" + path;
}

/**
 * @param {String} path 
 * Appends path to url:port/api/secure
 * @returns {String}
 */
export function buildSecureUrl(path) {
    return BASE_URL + "/secure" + path;
}

export function getPriceAsText(price) {
    return price.toFixed(2).replace(".", ",");
}