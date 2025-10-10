// Test script for currency conversion API
const axios = require('axios')

const BASE_URL = 'http://localhost:7777/checkout/api'

async function testCurrencyAPI() {
  console.log('🧪 Testing Currency Conversion API...\n')

  try {
    // Test 1: Fetch all currencies
    console.log('1. Fetching all currencies...')
    const currenciesResponse = await axios.get(`${BASE_URL}/currencies`)
    
    if (currenciesResponse.data.success) {
      console.log('✅ Currencies fetched successfully:')
      currenciesResponse.data.currencies.forEach(currency => {
        console.log(`   ${currency.code}: ${currency.prefix || ''}${currency.suffix || ''} (Rate: ${currency.rate})`)
      })
    } else {
      console.log('❌ Failed to fetch currencies:', currenciesResponse.data.message)
    }

    console.log('\n2. Testing currency conversion...')
    
    // Test 2: Convert EUR to USD
    const conversionResponse = await axios.get(`${BASE_URL}/convert`, {
      params: {
        amount: 10.99,
        from: 'EUR',
        to: 'USD'
      }
    })

    if (conversionResponse.data.success) {
      console.log('✅ Currency conversion successful:')
      console.log(`   ${conversionResponse.data.originalAmount} ${conversionResponse.data.fromCurrency}`)
      console.log(`   = ${conversionResponse.data.convertedAmount} ${conversionResponse.data.toCurrency}`)
      console.log(`   Exchange Rate: ${conversionResponse.data.exchangeRate}`)
    } else {
      console.log('❌ Currency conversion failed:', conversionResponse.data.message)
    }

    // Test 3: Convert USD to GBP
    console.log('\n3. Testing USD to GBP conversion...')
    const conversionResponse2 = await axios.get(`${BASE_URL}/convert`, {
      params: {
        amount: 15.99,
        from: 'USD',
        to: 'GBP'
      }
    })

    if (conversionResponse2.data.success) {
      console.log('✅ Currency conversion successful:')
      console.log(`   ${conversionResponse2.data.originalAmount} ${conversionResponse2.data.fromCurrency}`)
      console.log(`   = ${conversionResponse2.data.convertedAmount} ${conversionResponse2.data.toCurrency}`)
      console.log(`   Exchange Rate: ${conversionResponse2.data.exchangeRate}`)
    } else {
      console.log('❌ Currency conversion failed:', conversionResponse2.data.message)
    }

    // Test 4: Test error handling
    console.log('\n4. Testing error handling...')
    try {
      await axios.get(`${BASE_URL}/convert`, {
        params: {
          amount: 10,
          from: 'INVALID',
          to: 'USD'
        }
      })
    } catch (error) {
      if (error.response && error.response.status === 500) {
        console.log('✅ Error handling works correctly for invalid currency')
      } else {
        console.log('❌ Unexpected error:', error.message)
      }
    }

    console.log('\n🎉 Currency API tests completed!')

  } catch (error) {
    console.error('❌ Test failed:', error.message)
    if (error.response) {
      console.error('Response data:', error.response.data)
    }
  }
}

// Run the test
testCurrencyAPI()
