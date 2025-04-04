import axios from 'axios';

const getShippingDistance = async (sourcePin, destinationPin) => {
    const apiKey = '948e9cf0-dccc-11ef-bf14-e91bb9d0aabb';
    const url = 'https://app.zipcodebase.com/api/v1/distance';
    
    try {
        const response = await axios.get(url, {
            headers: {
                'apikey': apiKey
            },
            params: {
                code1: sourcePin,
                code2: destinationPin,
                country: 'IN'
            }
        });
        
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error response:', error.response.data);
        } else if (error.request) {
            console.error('Error request:', error.request);
        } else {
            console.error('Error message:', error.message);
        }
        throw error;
    }
};

export { getShippingDistance };