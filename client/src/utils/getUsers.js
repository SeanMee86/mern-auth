import axios from 'axios';

export const getUsers = () => {
    axios.get('/api/users/getUsers')
        .then(res => console.log(res));
};