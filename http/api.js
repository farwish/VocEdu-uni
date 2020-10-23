const apiBaseUrl = 'http://127.0.0.1:8000' // 'http://127.0.0.1:8000'
const apiPrefix = apiBaseUrl + '/api'

export const apiList = {
    accountLogin: apiPrefix + '/auth/login',
    accountLogout: apiPrefix + '/auth/logout',
    accountInfo: apiPrefix + '/auth/me',

    practiseRecord: apiPrefix + '/practise/record',
    practiseSummary: apiPrefix + '/practise/summary',

    practiseCurrentSubjectInfo: apiPrefix + '/practise/current-subject',

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
                // console.log(res)
                if (res.statusCode == 200) {
                    if (res.data.code != 0) {
                        uni.showToast({
                            title: res.data.message,
                            icon: 'none'
                        })
                    }
                    // handle data wrapped by vue ( __ob__: Observer )
                    let retData = parseVueObj(res.data)
                    resolve(retData)
                } else if (res.statusCode == 401) {
                    // Deal with 401 (Unauthorized)
                    uni.showToast({
                        title: res.data.message,
                        icon: 'none'
                    })
                    // Close other pages and redirect
                    uni.redirectTo({
                        url: '/pages/account/signin'
                    })
                    resolve('')
                } else {
                    uni.showToast({
                        title: '内部错误',
                        icon: 'none'
                    })
                    resolve('')
                }
            },
            fail: (err) => {
                uni.showToast({
                    title: '连接异常',
                    icon: 'none'
                })
                reject(err)
            }
        })
    })
}
