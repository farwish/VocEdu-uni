const apiBaseUrl = 'http://127.0.0.1:8000' // 'http://127.0.0.1:8000'
const apiPrefix = apiBaseUrl + '/api'

export const apiList = {
    accountLogin: apiPrefix + '/auth/login',
    accountLogout: apiPrefix + '/auth/logout',
    accountInfo: apiPrefix + '/auth/me',

    practiseRecord: apiPrefix + '/practise/record',

    categoryIndex: apiPrefix + '/category/index'
}

const parseVueObj = (obj) => {
    return JSON.parse(JSON.stringify( obj ));
};

export const apiRequest = (options) => {
    return new Promise((resolve, reject) => {
        uni.request({
            url: options.url,
            method: options.method || 'GET',
            data: options.data || {},
            header: options.header ? Object.assign({ Accept: 'application/json' }, options.header) : {},
            success: (res) => {
                if (res.data.code != 0) {
                    uni.showToast({
                        title: res.data.message,
                        icon: 'none'
                    })
                }
                // handle data wrapped by vue ( __ob__: Observer )
                let retData = parseVueObj(res.data)
                resolve(retData)
            },
            fail: (err) => {
                uni.showToast({
                    title: '连接异常 ~',
                    icon: 'none'
                })
                reject(err)
            }
        })
    })
}
