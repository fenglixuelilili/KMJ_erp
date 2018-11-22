// 用于判断登录状态
export function checkLogin(res, that) {
    if(res.status_code == 401){
        that.$notify.error({
            title: '错误',
            message: '登录信息过期，请重新登录'
        });
        sessionStorage.removeItem('access_token');
        setTimeout(() => {
            that.$router.replace('/login')
        },3000)
    }
}
