import axios from "axios";

function jwtInterceptor() {
    axios.interceptors.request.use((req) => {
        const token = window.localStorage.getItem("token");
        
        if (token) {
            req.headers.set('Authorization', `Bearer ${token}`);
        }
        return req;
    });

    axios.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            if (
                error.response?.status === 401 &&
                error.response?.statusText === "Unauthorized"
            ) {
                window.localStorage.removeItem("token");
                window.location.replace("/");
            }
            return Promise.reject(error);
        }
    );
}

export default jwtInterceptor;
