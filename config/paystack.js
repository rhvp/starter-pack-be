const axios = require('axios').default;
exports.verifyTransaction = async(ref) => {
    try {
        const response = await axios.request({
            method: 'GET',
            url: 'https://api.paystack.co/transaction/verify/' + ref,
            headers: {
                'Authorization': `Bearer ${process.env.PAYSTACK_SECRET}`
            }
        })
        return response;
    } catch (error) {
        console.log('error', error.response.status);
        return new AppError(error.response.data.message, error.response.status);
    }
}

exports.listBanks = async() => {
    try {
        const response = await axios.request({
            url: 'https://api.paystack.co/bank',
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${process.env.PAYSTACK_SECRET}`
            }
        })
        return response.data;
    } catch (error) {
        console.log('error', error.response.status);
        return new AppError(error.response.data.message, error.response.status);
    }
}

exports.verifyBank = async(nuban, code) => {
    try {
        const response = await axios.request({
            url: `https://api.paystack.co/bank/resolve?account_number=${nuban}&bank_code=${code}`,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${process.env.PAYSTACK_SECRET}`
            }
        })
        return response.data;
    } catch (error) {
        console.log('error', error.response.status);
        return new AppError(error.response.data.message, error.response.status);
    }
}