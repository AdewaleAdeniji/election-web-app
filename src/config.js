import requests from "./utils/request";

console.log(process.env)
const config = {
    BASE_URL: process.env.REACT_APP_BASE_URL,// "https://lauvote.herokuapp.com", // 
    USER_STORAGE_KEY: "dosdjo",
    VOTER_STORAGE_KEY: "djskdo",
    getVoterToken() {
        return this.getUser(false).token;
    },
    getToken() {
        return this.getUser().token;
    },
    getUser(isUser =  true) {
        const key = isUser ? config.USER_STORAGE_KEY : config.VOTER_STORAGE_KEY;
        const user = localStorage.getItem(key);
        if(!user){
            window.location.href ="/login";
            return;
        }
        // eslint-disable-next-line consistent-return
        return JSON.parse(user);
    },
    requests,
}
export default config;