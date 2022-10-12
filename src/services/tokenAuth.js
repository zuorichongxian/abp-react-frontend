import request from '@/utils/request';
import appConsts from '@/utils/appconst'

export async function fakeAccountLogin(params) {
    return request(appConsts.remoteServiceBaseUrl + 'api/TokenAuth/Authenticate2', {
        method: 'POST',
        body: params,
    });
}