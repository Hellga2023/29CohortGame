import HTTPTransport from '@/utils/HTTPTransport/HTTPTransport';
import BaseAPI, { API_URL } from '.';

const http = HTTPTransport;
const options = {};
const headersJSON = {
    'content-type': 'application/json', // Данные отправляем в формате JSON
};

class OAuthAPI extends BaseAPI {
    url = `${API_URL.HOST}/oauth`;

    oauth(data: object = {}) {
        const reqOptions = {
            ...options,
            headers: headersJSON,
            data: JSON.stringify(data),
        };

        return http.post(`${this.url}/yandex`, reqOptions);
    }

    getServiceId() {
        return http.get(`${this.url}/yandex/service-id`);
    }
}

export default new OAuthAPI();
