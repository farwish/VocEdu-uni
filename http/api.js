const apiBaseUrl = 'http://127.0.0.1:8000' // 'http://127.0.0.1:8000'

const apiPrefix = apiBaseUrl + '/api'

export const apiList = {
	defaultChosenSubject: apiPrefix + '/category/index'
}

export const apiRequest = (options) => {
	return new Promise((resolve, reject) => {
		uni.request({
			url: options.url,
			method: options.method || 'GET',
			data: options.data || {},
			success: (res) => {
				if (res.data.code != 0) {
					return uni.showToast({
						title: res.data.message,
						icon: 'none'
					})
				}
				resolve(res.data)
			},
			fail: (err) => {
				return uni.showToast({
					title: '服务异常 ~',
					icon: 'none'
				})
				reject(err)
			}
		})
	})
}
