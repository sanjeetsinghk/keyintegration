export default function authHeader() {
    const user = JSON.parse(localStorage.getItem('user'));
  
    // if (user && user.accessToken) {
    //   return { 'x-access-token' : user.accessToken,'Content-Type': 'application/json' };
    // } else {
      return 'Content-Type:application/json';
    //}
  }